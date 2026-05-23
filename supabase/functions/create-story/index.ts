import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateStoryRequest {
  childInfo: { name: string; age: number; gender?: "male" | "female" | "prefer-not-to-say" };
  theme: string;
  prompt?: string;
  language_id: string;
  image_style_id: string;
  photo_data: string; // base64
  photo_filename?: string;
  page_count?: number;
  fal_model?: string;
  resolution?: string;
  tier?: string;
  watermark?: boolean;
  llm_model?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    console.log("=== CREATE STORY EDGE FUNCTION ===");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase    = createClient(supabaseUrl, supabaseKey);

    // ── Auth ───────────────────────────────────────────────────────────────
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ success: false, error: "Authorization required" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) {
      return new Response(JSON.stringify({ success: false, error: "Invalid authentication" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    console.log(`Auth OK: ${user.id}`);

    // ── Parse & validate ───────────────────────────────────────────────────
    const body: CreateStoryRequest = await req.json();
    const missing: string[] = [];
    if (!body.childInfo?.name) missing.push("childInfo.name");
    if (!body.theme)           missing.push("theme");
    if (!body.language_id)     missing.push("language_id");
    if (!body.image_style_id)  missing.push("image_style_id");
    if (!body.photo_data)      missing.push("photo_data");
    if (missing.length > 0) {
      return new Response(JSON.stringify({ success: false, error: `Missing: ${missing.join(", ")}` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!body.childInfo.age || body.childInfo.age < 1 || body.childInfo.age > 18) {
      return new Response(JSON.stringify({ success: false, error: "Child age must be 1–18" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Language & image style lookup ──────────────────────────────────────
    const { data: language } = await supabase
      .from("languages").select("id, name, code").eq("id", body.language_id).single();
    if (!language) {
      return new Response(JSON.stringify({ success: false, error: "Invalid language ID" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: imageStyle } = await supabase
      .from("image_styles").select("id").eq("id", body.image_style_id).single();
    if (!imageStyle) {
      return new Response(JSON.stringify({ success: false, error: "Invalid image style ID" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Create child ───────────────────────────────────────────────────────
    const { data: child, error: childErr } = await supabase.from("children").insert({
      user_id: user.id,
      name:    body.childInfo.name,
      age:     body.childInfo.age,
      gender:  body.childInfo.gender ?? null,
    }).select("id").single();
    if (childErr || !child) {
      return new Response(JSON.stringify({ success: false, error: "Failed to save child information" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Create story record ────────────────────────────────────────────────
    const falModel   = body.fal_model   ?? "fal-ai/flux-pro/kontext";
    const pageCount  = body.page_count  ?? 8;
    const resolution = body.resolution  ?? "768";

    const { data: story, error: storyErr } = await supabase.from("stories").insert({
      user_id:               user.id,
      child_id:              child.id,
      title:                 `${body.childInfo.name}'s ${body.theme} Adventure`,
      theme:                 body.theme,
      user_prompt:           body.prompt ?? null,
      language_id:           body.language_id,
      image_style_id:        body.image_style_id,
      character_description: `A brave ${body.childInfo.age}-year-old named ${body.childInfo.name}`,
      status:                "generating",
      tier:                  body.tier ?? "free",
      page_count:            pageCount,
      fal_model:             falModel,
      llm_model:             body.llm_model ?? "gpt-4o",
      resolution:            String(resolution),
      watermark:             body.watermark ?? true,
    }).select("id").single();
    if (storyErr || !story) {
      return new Response(JSON.stringify({ success: false, error: "Failed to create story" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const story_id = story.id;
    console.log(`Story record created: ${story_id}`);

    // ── Upload reference photo ─────────────────────────────────────────────
    let originalPhotoUrl: string | null = null;
    try {
      const raw = body.photo_data.includes(",") ? body.photo_data.split(",")[1] : body.photo_data;
      const bin = atob(raw);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);

      if (bytes.length > 10 * 1024 * 1024) throw new Error("Photo too large (max 10MB)");

      const fileName = `originals/${story_id}/${story_id}.jpg`;
      const { error: upErr } = await supabase.storage
        .from("story-images")
        .upload(fileName, bytes, { upsert: true, contentType: "image/jpeg" });

      if (!upErr) {
        const { data: urlData } = supabase.storage.from("story-images").getPublicUrl(fileName);
        originalPhotoUrl = urlData?.publicUrl ?? null;
        await supabase.from("story_original_images").insert({
          story_id,
          image_url:    originalPhotoUrl,
          storage_path: fileName,
          file_size:    bytes.length,
          content_type: "image/jpeg",
        });
        console.log(`Photo uploaded: ${originalPhotoUrl}`);
      }
    } catch (photoErr) {
      console.error("Photo upload error (non-fatal):", (photoErr as Error).message);
    }

    // ── Trigger n8n webhook ────────────────────────────────────────────────
    const webhookUrl = Deno.env.get("N8N_WEBHOOK_URL");
    if (webhookUrl) {
      try {
        const webhookRes = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ story_id }),
        });
        if (!webhookRes.ok) {
          console.error(`n8n webhook failed: ${webhookRes.status}`);
        } else {
          console.log("n8n webhook triggered successfully");
        }
      } catch (whErr) {
        console.error("n8n webhook error (non-fatal):", (whErr as Error).message);
      }
    } else {
      console.warn("N8N_WEBHOOK_URL not set — generation will not start");
    }

    return new Response(
      JSON.stringify({ success: true, story_id, message: "Story creation started" }),
      { status: 202, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ success: false, error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
