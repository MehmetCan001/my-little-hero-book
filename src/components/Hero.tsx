import { Button } from "@/components/ui/button";
import { Sparkles, Heart, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import heroSpaceImage from "@/assets/hero-space-adventure.jpg";
import heroForestImage from "@/assets/hero-forest-adventure.jpg";
import heroOceanImage from "@/assets/hero-ocean-adventure.jpg";

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartNow = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth/sign-in');
    }
  };

  return (
    <section className="min-h-screen pt-20 bg-gradient-hero relative overflow-hidden">
      {/* Arka plan dekoratif öğeler */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-accent animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 rounded-full bg-primary-glow animate-bounce-gentle"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 rounded-full bg-accent-light animate-sparkle"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-primary animate-float"></div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Sol taraf - Metin içeriği */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-accent animate-sparkle" />
              <span className="text-accent font-semibold">Your Child is the Hero!</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Your Child's <br />
              <span className="text-accent">Personal Story</span>
            </h1>

            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Upload your child's photo, write a prompt for their dream adventure. 
              AI creates a personalized book where your child becomes the story's hero!
            </p>

            <div className="flex justify-center lg:justify-start">
              <Button variant="hero" size="lg" onClick={handleStartNow}>
                <Heart className="w-5 h-5" />
                Start Now
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-white/80">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">1000+</div>
                <div className="text-sm">Happy Kids</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">500+</div>
                <div className="text-sm">Stories Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">99%</div>
                <div className="text-sm">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Sağ taraf - Görsel gallery */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-4 hover:scale-105 transition-transform duration-300">
                  <img 
                    src={heroForestImage} 
                    alt="Orman macerası hikayesi" 
                    className="w-full h-40 object-cover rounded-2xl"
                  />
                  <p className="text-white text-sm mt-2 text-center">Forest Explorer</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-4 hover:scale-105 transition-transform duration-300">
                  <img 
                    src={heroOceanImage} 
                    alt="Ocean adventure story" 
                    className="w-full h-40 object-cover rounded-2xl"
                  />
                  <p className="text-white text-sm mt-2 text-center">Ocean Pirate</p>
                </div>
              </div>
              <div className="pt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-4 hover:scale-105 transition-transform duration-300">
                  <img 
                    src={heroSpaceImage} 
                    alt="Space adventure story" 
                    className="w-full h-48 object-cover rounded-2xl"
                  />
                  <p className="text-white text-sm mt-2 text-center">Space Hero</p>
                </div>
              </div>
            </div>
            
            {/* Dekoratif yıldızlar */}
            <div className="absolute -top-4 -right-4">
              <Sparkles className="w-8 h-8 text-accent animate-sparkle" />
            </div>
            <div className="absolute -bottom-4 -left-4">
              <Sparkles className="w-6 h-6 text-primary-glow animate-bounce-gentle" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;