import { useState } from "react";
import { ArrowLeft, Sparkles, Camera, BookOpen, Check, Lock, PlayCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { StoryCreationProvider, useStoryCreation } from "@/contexts/StoryCreationContext";
import { ChildInfoModal } from "@/components/story/ChildInfoModal";
import { PlanSelectionModal } from "@/components/story/PlanSelectionModal";
import { ThemeSelectionModal } from "@/components/story/ThemeSelectionModal";
import { PhotoUploadModal } from "@/components/story/PhotoUploadModal";
import { ReviewStoryModal } from "@/components/story/ReviewStoryModal";

const CreateStoryContent = () => {
  const navigate = useNavigate();
  const { state, getStepStatus } = useStoryCreation();
  const [childInfoModalOpen, setChildInfoModalOpen] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [photoUploadModalOpen, setPhotoUploadModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const features = [
    {
      icon: BookOpen,
      title: "Çocuk Bilgileri",
      description: "Hikayeyi kişiselleştirmek için çocuğunuzun adını ve yaşını girin",
      step: 1,
      onClick: () => setChildInfoModalOpen(true),
      completedInfo: state.childInfo && state.language
        ? `✓ ${state.childInfo.name}, ${state.childInfo.age} yaşında • ${state.language.name}`
        : null,
    },
    {
      icon: CreditCard,
      title: "Paket Seçin",
      description: "Hikaye uzunluğunu ve kalite seviyesini belirleyin",
      step: 2,
      onClick: () => setPlanModalOpen(true),
      completedInfo: state.selectedPlan
        ? `✓ ${state.selectedPlan.name} — ${state.selectedPlan.pageCount} sayfa${state.selectedPlan.price > 0 ? ` • ₺${state.selectedPlan.price}` : ' • Ücretsiz'}`
        : null,
    },
    {
      icon: Sparkles,
      title: "Tema Seçin",
      description: "Korsan, uzay macerası, peri masalı ve daha fazlası arasından seçin",
      step: 3,
      onClick: () => setThemeModalOpen(true),
      completedInfo: state.theme
        ? `✓ ${state.theme.charAt(0).toUpperCase() + state.theme.slice(1)} Macerası`
        : null,
    },
    {
      icon: Camera,
      title: "Fotoğraf Yükle",
      description: "Çocuğunuzun fotoğrafını yükleyin, hikayenin kahramanı olsun",
      step: 4,
      onClick: () => setPhotoUploadModalOpen(true),
      completedInfo: state.photoUrl && state.imageStyle
        ? `✓ Fotoğraf yüklendi • Stil: ${state.imageStyle.label}`
        : null,
    },
    {
      icon: PlayCircle,
      title: "İncele ve Oluştur",
      description: "Hikaye detaylarını inceleyin ve kişisel maceranzı başlatın",
      step: 5,
      onClick: () => setReviewModalOpen(true),
      completedInfo: state.isComplete ? '✓ Hikaye oluşturma başladı!' : null,
    },
  ];

  return (
    <div className="min-h-screen bg-dashboard-bg">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 -left-8 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-20 h-20 bg-accent/15 rounded-full blur-xl"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="mb-6 gap-2 hover:shadow-magical transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>

          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent animate-fade-in">
              Create a New Story
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Let's embark on a magical journey together! Here's how we'll create your child's personalized storybook adventure.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {features.map((feature, index) => {
            const stepStatus = getStepStatus(feature.step);
            const isClickable = stepStatus === 'current' || stepStatus === 'completed';

            return (
              <Card
                key={feature.title}
                className={`relative overflow-hidden shadow-card transition-all duration-300 animate-fade-in group ${
                  isClickable
                    ? 'hover:shadow-magical hover:-translate-y-1 cursor-pointer'
                    : 'opacity-60 cursor-not-allowed'
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={isClickable ? feature.onClick : undefined}
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full shadow-button transition-all duration-300 ${
                      stepStatus === 'completed'
                        ? 'bg-success text-white'
                        : stepStatus === 'current'
                        ? 'bg-gradient-button text-white group-hover:scale-110'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {stepStatus === 'completed' ? (
                        <Check className="w-6 h-6" />
                      ) : stepStatus === 'locked' ? (
                        <Lock className="w-6 h-6" />
                      ) : (
                        <feature.icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                        <span className="text-xs font-normal text-muted-foreground mr-1">
                          {feature.step}.
                        </span>
                        {feature.title}
                        {stepStatus === 'completed' && (
                          <div className="w-2 h-2 bg-success rounded-full" />
                        )}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  {stepStatus === 'completed' && feature.completedInfo && (
                    <div className="mt-3 p-3 bg-success/10 rounded-lg border border-success/20">
                      <p className="text-sm font-medium text-success">{feature.completedInfo}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <ChildInfoModal
          open={childInfoModalOpen}
          onOpenChange={setChildInfoModalOpen}
        />

        <PlanSelectionModal
          open={planModalOpen}
          onOpenChange={setPlanModalOpen}
        />

        <ThemeSelectionModal
          open={themeModalOpen}
          onOpenChange={setThemeModalOpen}
        />

        <PhotoUploadModal
          open={photoUploadModalOpen}
          onOpenChange={setPhotoUploadModalOpen}
        />

        <ReviewStoryModal
          open={reviewModalOpen}
          onOpenChange={setReviewModalOpen}
        />

        {/* Coming Soon Section */}
        <Card className="text-center shadow-card hover:shadow-magical transition-all duration-300 bg-gradient-card border-accent/20">
          <CardHeader className="space-y-4 pb-8">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-gradient-accent text-white shadow-button animate-bounce-gentle">
                <Sparkles className="w-8 h-8" />
              </div>
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
              Coming Soon!
            </CardTitle>
            <CardDescription className="text-lg max-w-lg mx-auto leading-relaxed">
              We're putting the finishing touches on our magical story creation tools. 
              Soon you'll be able to create amazing personalized adventures for your little ones!
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-button hover:shadow-button text-white font-medium px-8 py-3 rounded-full transition-all duration-300 hover:-translate-y-1"
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const CreateStory = () => {
  return (
    <StoryCreationProvider>
      <CreateStoryContent />
    </StoryCreationProvider>
  );
};

export default CreateStory;