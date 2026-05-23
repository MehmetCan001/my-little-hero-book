import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ChildInfo {
  name: string;
  age: number;
  gender?: 'male' | 'female' | 'prefer-not-to-say';
}

export type TierType = 'free' | 'starter' | 'premium' | 'pro';

export interface TierPlan {
  id: TierType;
  name: string;
  price: number; // TRY, 0 = free
  pageCount: number;
  llmModel: 'gpt-4o-mini' | 'gpt-4o';
  falModel: 'fal-ai/flux/schnell' | 'fal-ai/flux/dev' | 'fal-ai/flux-pulid' | 'fal-ai/flux-pro/kontext';
  resolution: '512' | '768' | '1024';
  watermark: boolean;
  badge?: string;
  features: string[];
}

export const TIER_PLANS: TierPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    pageCount: 6,
    llmModel: 'gpt-4o-mini',
    falModel: 'fal-ai/flux/schnell',
    resolution: '512',
    watermark: true,
    features: ['6 sayfa', 'Temel art style', 'Filigran içerir', 'Ayda 1 kitap'],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    pageCount: 8,
    llmModel: 'gpt-4o-mini',
    falModel: 'fal-ai/flux/dev',
    resolution: '768',
    watermark: false,
    features: ['8 sayfa', 'Tüm art style seçenekleri', 'Filigransız PDF', 'Orta kalite görsel'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 89,
    pageCount: 10,
    llmModel: 'gpt-4o',
    falModel: 'fal-ai/flux-pro/kontext',
    resolution: '1024',
    watermark: false,
    badge: 'Popüler',
    features: ['10 sayfa', 'Karakter tutarlılığı (flux-kontext)', 'GPT-4o hikaye', 'Yüksek çözünürlük'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 129,
    pageCount: 12,
    llmModel: 'gpt-4o',
    falModel: 'fal-ai/flux-pro/kontext',
    resolution: '1024',
    watermark: false,
    badge: 'En İyi Kalite',
    features: ['12 sayfa', 'En yüksek kalite', 'Baskıya hazır PDF', 'Öncelikli üretim'],
  },
];

export interface StoryCreationState {
  currentStep: number;
  childInfo?: ChildInfo;
  selectedPlan?: TierPlan;
  theme?: string;
  prompt?: string;
  language?: { id: string; name: string; code: string };
  photoUrl?: string;
  imageStyle?: { id: string; name: string; label: string };
  isComplete: boolean;
  loading: boolean;
  error: string | null;
}

interface StoryCreationContextType {
  state: StoryCreationState;
  updateChildInfo: (childInfo: ChildInfo) => void;
  updateSelectedPlan: (plan: TierPlan) => void;
  updateTheme: (theme: string) => void;
  updatePrompt: (prompt: string) => void;
  updateLanguage: (language: { id: string; name: string; code: string }) => void;
  updatePhotoUrl: (photoUrl: string) => void;
  updateImageStyle: (imageStyle: { id: string; name: string; label: string }) => void;
  nextStep: () => void;
  resetStory: () => void;
  createStory: () => Promise<void>;
  getStepStatus: (step: number) => 'completed' | 'current' | 'locked';
}

const StoryCreationContext = createContext<StoryCreationContextType | undefined>(undefined);

const initialState: StoryCreationState = {
  currentStep: 1,
  childInfo: undefined,
  selectedPlan: undefined,
  theme: undefined,
  prompt: undefined,
  language: undefined,
  photoUrl: undefined,
  imageStyle: undefined,
  isComplete: false,
  loading: false,
  error: null,
};

export const StoryCreationProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<StoryCreationState>(initialState);
  const { toast } = useToast();

  const updateChildInfo = (childInfo: ChildInfo) => {
    setState(prev => ({ ...prev, childInfo }));
  };

  const updateSelectedPlan = (plan: TierPlan) => {
    setState(prev => ({ ...prev, selectedPlan: plan }));
  };

  const updateTheme = (theme: string) => {
    setState(prev => ({ ...prev, theme }));
  };

  const updatePrompt = (prompt: string) => {
    setState(prev => ({ ...prev, prompt }));
  };

  const updateLanguage = (language: { id: string; name: string; code: string }) => {
    setState(prev => ({ ...prev, language }));
  };

  const updatePhotoUrl = (photoUrl: string) => {
    setState(prev => ({ ...prev, photoUrl }));
  };

  const updateImageStyle = (imageStyle: { id: string; name: string; label: string }) => {
    setState(prev => ({ ...prev, imageStyle }));
  };

  const nextStep = () => {
    setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };

  const resetStory = () => {
    setState(initialState);
  };

  const createStory = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('=== CLIENT: Creating story ===');
      console.log('State.childInfo:', state.childInfo);
      console.log('State.theme:', state.theme);
      console.log('State.prompt:', state.prompt);
      console.log('State.language:', state.language);
      console.log('State.imageStyle:', state.imageStyle);
      console.log('State.photoUrl length:', state.photoUrl?.length);
      console.log('State.photoUrl preview:', state.photoUrl?.substring(0, 100));

      const requestBody = {
        childInfo: state.childInfo,
        theme: state.theme,
        prompt: state.prompt,
        language_id: state.language?.id,
        image_style_id: state.imageStyle?.id,
        photo_data: state.photoUrl,
        photo_filename: 'uploaded_photo.jpg',
        tier: state.selectedPlan?.id ?? 'free',
        page_count: state.selectedPlan?.pageCount ?? 6,
        fal_model: state.selectedPlan?.falModel ?? 'fal-ai/flux/schnell',
        llm_model: state.selectedPlan?.llmModel ?? 'gpt-4o-mini',
        resolution: state.selectedPlan?.resolution ?? '512',
        watermark: state.selectedPlan?.watermark ?? true,
      };

      console.log('Request body:', {
        ...requestBody,
        photo_data: requestBody.photo_data ? `[${requestBody.photo_data.length} chars]` : null
      });

      const { data, error } = await supabase.functions.invoke('create-story', {
        body: requestBody
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to create story');
      }

      if (!data?.success) {
        console.error('Edge function returned failure:', data);
        throw new Error(data?.error || 'Failed to create story');
      }

      setState(prev => ({ ...prev, isComplete: true, loading: false }));
      
      toast({
        title: "Story Creation Started!",
        description: "Your personalized story is now being generated. You'll be notified when it's ready.",
      });

    } catch (error: any) {
      console.error('Story creation error:', error);
      console.error('Error stack:', error.stack);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'An unexpected error occurred'
      }));
      
      toast({
        title: "Story Creation Failed",
        description: error.message || 'An unexpected error occurred. Please try again.',
        variant: "destructive",
      });
    }
  };

  const getStepStatus = (step: number): 'completed' | 'current' | 'locked' => {
    switch (step) {
      case 1:
        if (state.childInfo && state.language) return 'completed';
        return 'current';
      case 2: // Plan seçimi
        if (state.selectedPlan) return 'completed';
        if (state.childInfo && state.language) return 'current';
        return 'locked';
      case 3: // Tema
        if (state.theme) return 'completed';
        if (state.childInfo && state.language && state.selectedPlan) return 'current';
        return 'locked';
      case 4: // Fotoğraf
        if (state.photoUrl && state.imageStyle) return 'completed';
        if (state.childInfo && state.language && state.selectedPlan && state.theme) return 'current';
        return 'locked';
      case 5: // Review
        if (state.isComplete) return 'completed';
        if (state.childInfo && state.language && state.selectedPlan && state.theme && state.photoUrl && state.imageStyle) return 'current';
        return 'locked';
      default:
        return 'locked';
    }
  };

  return (
    <StoryCreationContext.Provider
      value={{
        state,
        updateChildInfo,
        updateSelectedPlan,
        updateTheme,
        updatePrompt,
        updateLanguage,
        updatePhotoUrl,
        updateImageStyle,
        nextStep,
        resetStory,
        createStory,
        getStepStatus,
      }}
    >
      {children}
    </StoryCreationContext.Provider>
  );
};

export const useStoryCreation = () => {
  const context = useContext(StoryCreationContext);
  if (context === undefined) {
    throw new Error('useStoryCreation must be used within a StoryCreationProvider');
  }
  return context;
};