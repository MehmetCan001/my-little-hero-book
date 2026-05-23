import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Rocket, 
  Trees, 
  Ship, 
  Crown, 
  Fish, 
  Star 
} from 'lucide-react';
import { useStoryCreation } from '@/contexts/StoryCreationContext';

// Import background images
import spaceImage from '@/assets/hero-space-adventure.jpg';
import forestImage from '@/assets/hero-forest-adventure.jpg';
import piratesImage from '@/assets/hero-pirates-adventure.jpg';
import fairytaleImage from '@/assets/hero-fairytale-adventure.jpg';
import oceanImage from '@/assets/hero-ocean-adventure.jpg';
import princessImage from '@/assets/hero-princess-adventure.jpg';

interface ThemeSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const themes = [
  {
    id: 'space',
    title: 'Space',
    description: 'A brave child embarks on an adventure among stars, planets, and mysterious galaxies.',
    icon: Rocket,
    backgroundImage: spaceImage,
  },
  {
    id: 'jungle',
    title: 'Jungle',
    description: 'Explore a wild forest filled with talking animals, hidden paths, and ancient secrets.',
    icon: Trees,
    backgroundImage: forestImage,
  },
  {
    id: 'pirates',
    title: 'Pirates',
    description: 'Sail the seas in search of treasure maps, secret islands, and pirate legends.',
    icon: Ship,
    backgroundImage: piratesImage,
  },
  {
    id: 'fairytale',
    title: 'Fairytale',
    description: 'Enter a magical kingdom with fairies, dragons, castles, and enchanting spells.',
    icon: Crown,
    backgroundImage: fairytaleImage,
  },
  {
    id: 'ocean',
    title: 'Ocean',
    description: 'Dive into the underwater world and make friends with sea creatures and mermaids.',
    icon: Fish,
    backgroundImage: oceanImage,
  },
  {
    id: 'princess',
    title: 'Princess',
    description: 'Join a brave princess on royal adventures filled with courage, friendship, and magic.',
    icon: Star,
    backgroundImage: princessImage,
  },
];

export const ThemeSelectionModal = ({ open, onOpenChange }: ThemeSelectionModalProps) => {
  const { state, updateTheme, updatePrompt, nextStep } = useStoryCreation();
  const [prompts, setPrompts] = useState<Record<string, string>>({});

  const handlePromptChange = (themeId: string, value: string) => {
    if (value.length <= 200) {
      setPrompts(prev => ({ ...prev, [themeId]: value }));
    }
  };

  const handleThemeSelect = (themeId: string) => {
    updateTheme(themeId);
    updatePrompt(prompts[themeId] || '');
    nextStep();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Choose Your Adventure Theme
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {themes.map((theme) => {
            const IconComponent = theme.icon;
            const isSelected = state.theme === theme.id;
            
            return (
              <Card
                key={theme.id}
                className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  isSelected 
                    ? 'ring-2 ring-primary shadow-lg' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => handleThemeSelect(theme.id)}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 hover:scale-110"
                  style={{ backgroundImage: `url(${theme.backgroundImage})` }}
                />
                
                {/* Dark overlay */}
                <div className={`absolute inset-0 transition-all duration-300 ${
                  isSelected 
                    ? 'bg-primary/20 backdrop-blur-[1px]' 
                    : 'bg-black/60 hover:bg-black/50'
                }`} />
                
                {/* Content */}
                <CardContent className="relative z-10 p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg backdrop-blur-sm transition-all duration-300 ${
                      isSelected 
                        ? 'bg-primary/90 text-primary-foreground shadow-lg' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}>
                      <IconComponent size={24} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className={`text-lg mb-2 font-bold transition-colors duration-300 ${
                        isSelected ? 'text-primary-foreground' : 'text-white'
                      }`}>
                        {theme.title}
                      </CardTitle>
                      <CardDescription className={`text-sm leading-relaxed mb-3 transition-colors duration-300 ${
                        isSelected ? 'text-primary-foreground/90' : 'text-white/90'
                      }`}>
                        {theme.description}
                      </CardDescription>
                      <div className="space-y-2">
                        <label className={`text-xs font-medium transition-colors duration-300 ${
                          isSelected ? 'text-primary-foreground/80' : 'text-white/80'
                        }`}>
                          İsteğe Bağlı Prompt (max 200 karakter)
                        </label>
                        <Textarea
                          placeholder="Hikayenizi özelleştirmek için ek detaylar ekleyin..."
                          value={prompts[theme.id] || ''}
                          onChange={(e) => handlePromptChange(theme.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className={`min-h-[60px] text-xs backdrop-blur-sm transition-all duration-300 ${
                            isSelected 
                              ? 'bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60' 
                              : 'bg-white/20 border-white/30 text-white placeholder:text-white/60 hover:bg-white/30'
                          }`}
                          maxLength={200}
                        />
                        <div className={`text-xs text-right transition-colors duration-300 ${
                          isSelected ? 'text-primary-foreground/70' : 'text-white/70'
                        }`}>
                          {(prompts[theme.id] || '').length}/200
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};