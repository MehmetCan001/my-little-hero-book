import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";
import fontkit from "https://esm.sh/@pdf-lib/fontkit@1.1.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Türkçe karakter desteği için Nunito latin-ext (woff, fontkit destekler)
const FONT_URL =
  "https://cdn.jsdelivr.net/npm/@fontsource/nunito@5/files/nunito-latin-ext-400-normal.woff";
const FONT_BOLD_URL =
  "https://cdn.jsdelivr.net/npm/@fontsource/nunito@5/files/nunito-latin-ext-700-normal.woff";

// A4 portrait (points)
const PAGE_W = 595;
const PAGE_H = 842;
const MARGIN = 44;
const CONTENT_W = PAGE_W - MARGIN * 2;

// ── helpers ───────────────────────────────────────────────────────────────────

function wrapText(text: string, font: Awaited<ReturnType<PDFDocument["embedFont"]>>, size: number, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const word of words) {
    const candidate = cur ? `${cur} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth) {
      if (cur) lines.push(cur);
      cur = word;
    } else {
      cur = candidate;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

async function fetchImageBytes(url: string): Promise<Uint8Array> {
  const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error(`Image fetch failed: ${res.status}`);
  return new Uint8Array(await res.arrayBuffer());
}

function isJpeg(url: string): boolean {
  return !url.toLowerCase().includes(".png");
}

// ── main ──────────────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const body = await req.json();
    const story_id: string = body.story_id;
    if (!story_id) {
      return new Response(JSON.stringify({ success: false, error: "story_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`generate-pdf: story_id=${story_id}`);

    // 1. Hikaye ve çocuk bilgisini çek
    const { data: story, error: storyErr } = await supabase
      .from("stories")
      .select("*, children(name, age)")
      .eq("id", story_id)
      .single();
    if (storyErr || !story) throw new Error("Hikaye bulunamadı: " + storyErr?.message);

    // 2. Sayfaları çek
    const { data: pages, error: pagesErr } = await supabase
      .from("pages")
      .select("page_no, text, image_url")
      .eq("story_id", story_id)
      .order("page_no", { ascending: true });
    if (pagesErr || !pages?.length) throw new Error("Sayfalar bulunamadı: " + pagesErr?.message);

    // 3. PDF oluştur
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    // Font yükle (Türkçe destekli), hata olursa Helvetica'ya dön
    let font: Awaited<ReturnType<typeof pdfDoc.embedFont>>;
    let boldFont: Awaited<ReturnType<typeof pdfDoc.embedFont>>;
    try {
      const [fontBytes, boldBytes] = await Promise.all([
        fetch(FONT_URL).then((r) => r.arrayBuffer()),
        fetch(FONT_BOLD_URL).then((r) => r.arrayBuffer()),
      ]);
      font = await pdfDoc.embedFont(fontBytes);
      boldFont = await pdfDoc.embedFont(boldBytes);
      console.log("Nunito font yüklendi");
    } catch (_e) {
      console.warn("Nunito yüklenemedi, Helvetica kullanılıyor");
      font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    }

    const childName: string = story.children?.name ?? "Kahraman";
    const storyTitle: string = story.title ?? `${childName}'in Macerası`;
    const hasWatermark: boolean = story.watermark ?? true;

    // ── KAPAK SAYFASI ──────────────────────────────────────────────────────────
    const coverPage = pdfDoc.addPage([PAGE_W, PAGE_H]);
    // Arka plan degradesi efekti (düz renk)
    coverPage.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: rgb(0.98, 0.95, 0.88) });
    // Üst dekoratif şerit
    coverPage.drawRectangle({ x: 0, y: PAGE_H - 80, width: PAGE_W, height: 80, color: rgb(0.55, 0.35, 0.80) });
    // Alt dekoratif şerit
    coverPage.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: 60, color: rgb(0.55, 0.35, 0.80) });

    // Başlık
    const titleSize = 30;
    const titleLines = wrapText(storyTitle, boldFont, titleSize, CONTENT_W);
    let titleY = PAGE_H / 2 + (titleLines.length * titleSize * 1.3) / 2 + 20;
    for (const line of titleLines) {
      const lineW = boldFont.widthOfTextAtSize(line, titleSize);
      coverPage.drawText(line, {
        x: Math.max(MARGIN, (PAGE_W - lineW) / 2),
        y: titleY,
        size: titleSize,
        font: boldFont,
        color: rgb(0.25, 0.1, 0.45),
      });
      titleY -= titleSize * 1.4;
    }

    // Alt yazı
    const sub = `${childName} için kişisel bir masal`;
    const subSize = 16;
    const subW = font.widthOfTextAtSize(sub, subSize);
    coverPage.drawText(sub, {
      x: (PAGE_W - subW) / 2,
      y: PAGE_H / 2 - 60,
      size: subSize,
      font,
      color: rgb(0.45, 0.3, 0.65),
    });

    // Üst şeritte site adı
    const siteText = "My Little Hero Book";
    const siteW = boldFont.widthOfTextAtSize(siteText, 18);
    coverPage.drawText(siteText, {
      x: (PAGE_W - siteW) / 2,
      y: PAGE_H - 52,
      size: 18,
      font: boldFont,
      color: rgb(1, 1, 1),
    });

    // ── HİKAYE SAYFALARI ───────────────────────────────────────────────────────
    for (let i = 0; i < pages.length; i++) {
      const pageData = pages[i];
      const pdfPage = pdfDoc.addPage([PAGE_W, PAGE_H]);

      // Arka plan
      pdfPage.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: rgb(0.99, 0.97, 0.93) });

      const imageAreaH = Math.floor(PAGE_H * 0.55);
      const imageY = PAGE_H - MARGIN - imageAreaH;
      const textAreaMaxH = imageY - MARGIN * 2;

      // İllüstrasyon
      if (pageData.image_url) {
        try {
          const imgBytes = await fetchImageBytes(pageData.image_url);
          const img = isJpeg(pageData.image_url)
            ? await pdfDoc.embedJpg(imgBytes)
            : await pdfDoc.embedPng(imgBytes);
          const dims = img.scaleToFit(CONTENT_W, imageAreaH);
          pdfPage.drawImage(img, {
            x: MARGIN + (CONTENT_W - dims.width) / 2,
            y: imageY + (imageAreaH - dims.height) / 2,
            width: dims.width,
            height: dims.height,
          });
        } catch (_imgErr) {
          // Görsel yüklenemedi — placeholder çiz
          pdfPage.drawRectangle({
            x: MARGIN, y: imageY, width: CONTENT_W, height: imageAreaH,
            color: rgb(0.92, 0.92, 0.96),
            borderColor: rgb(0.75, 0.75, 0.85),
            borderWidth: 1,
          });
          const ph = "[ İllüstrasyon ]";
          const phW = font.widthOfTextAtSize(ph, 13);
          pdfPage.drawText(ph, {
            x: (PAGE_W - phW) / 2,
            y: imageY + imageAreaH / 2 - 6,
            size: 13, font,
            color: rgb(0.6, 0.6, 0.7),
          });
        }
      }

      // Metin
      const textSize = 13;
      const lineH = textSize * 1.6;
      const lines = wrapText(pageData.text ?? "", font, textSize, CONTENT_W);
      let textY = imageY - MARGIN - lineH;
      for (const line of lines) {
        if (textY < MARGIN + 20) break;
        pdfPage.drawText(line, { x: MARGIN, y: textY, size: textSize, font, color: rgb(0.12, 0.1, 0.18) });
        textY -= lineH;
      }

      // Sayfa numarası
      const pageNum = String(i + 1);
      const numW = font.widthOfTextAtSize(pageNum, 10);
      pdfPage.drawText(pageNum, {
        x: (PAGE_W - numW) / 2,
        y: MARGIN / 2,
        size: 10, font, color: rgb(0.55, 0.5, 0.6),
      });

      // Filigran
      if (hasWatermark) {
        pdfPage.drawText("mylittleherobook.com", {
          x: MARGIN, y: MARGIN / 2,
          size: 8, font, color: rgb(0.75, 0.72, 0.78),
        });
      }
    }

    // 4. PDF'i byte dizisine çevir
    const pdfBytes = await pdfDoc.save();
    console.log(`PDF oluşturuldu: ${pdfBytes.length} bytes, ${pages.length} sayfa`);

    // 5. Supabase Storage'a yükle
    const pdfPath = `pdfs/${story_id}.pdf`;
    const { error: uploadErr } = await supabase.storage
      .from("story-images")
      .upload(pdfPath, pdfBytes, { upsert: true, contentType: "application/pdf" });
    if (uploadErr) throw new Error("PDF yüklenemedi: " + uploadErr.message);

    const { data: urlData } = supabase.storage.from("story-images").getPublicUrl(pdfPath);
    const pdfUrl = urlData.publicUrl;
    console.log("PDF URL:", pdfUrl);

    // 6. stories tablosunu güncelle
    await supabase
      .from("stories")
      .update({ pdf_url: pdfUrl, status: "completed", updated_at: new Date().toISOString() })
      .eq("id", story_id);

    // 7. pdf_exports tablosuna kaydet
    await supabase
      .from("pdf_exports")
      .insert({ story_id, pdf_url: pdfUrl, status: "completed" });

    return new Response(JSON.stringify({ success: true, pdf_url: pdfUrl }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("generate-pdf hatası:", err);

    // Hata durumunda story status'ü güncelle
    try {
      const body = await req.clone().json().catch(() => ({}));
      if (body.story_id) {
        await supabase
          .from("stories")
          .update({ status: "failed", updated_at: new Date().toISOString() })
          .eq("id", body.story_id);
      }
    } catch (_) { /* ignore */ }

    return new Response(JSON.stringify({ success: false, error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
