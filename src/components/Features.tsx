import { Camera, Wand2, BookText, Download, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleTryNow = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth/sign-in');
    }
  };

  const steps = [
    {
      icon: Camera,
      title: "Upload Photo",
      description: "Upload your child's most beautiful photo",
      color: "text-accent"
    },
    {
      icon: Wand2,
      title: "Write Prompt",
      description: "What adventure should they go on? Write it!",
      color: "text-primary"
    },
    {
      icon: BookText,
      title: "Story Created",
      description: "AI transforms your child into a hero",
      color: "text-success"
    },
    {
      icon: Download,
      title: "Download PDF",
      description: "Download and print your special book",
      color: "text-accent"
    }
  ];

  const features = [
    {
      icon: Heart,
      title: "Personalized",
      description: "Every story is written and illustrated specifically for your child"
    },
    {
      icon: Star,
      title: "High Quality",
      description: "Professional illustrations and creative stories"
    },
    {
      icon: BookText,
      title: "PDF Format",
      description: "Printable, shareable format"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            How Does It <span className="text-primary">Work?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create your child's personal story book in just 4 simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-card rounded-full flex items-center justify-center shadow-card group-hover:scale-110 transition-transform duration-300">
                  <step.icon className={`w-10 h-10 ${step.color}`} />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Why <span className="text-primary">Hero Tales?</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-card rounded-2xl p-8 shadow-card hover:shadow-magical transition-all duration-300 text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-accent rounded-full flex items-center justify-center mb-6">
                <feature.icon className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="magical" size="lg" onClick={handleTryNow}>
            <Heart className="w-5 h-5" />
            Try Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;