import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface Testimonial {
  id: number;
  name: string;
  childAge: number;
  rating: number;
  comment: string;
  avatar?: string;
}

const Testimonials = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      childAge: 5,
      rating: 5,
      comment: "My son loves his personalized book so much that he wants to read it every night! Seeing himself as the hero made him incredibly happy. I highly recommend this service to everyone."
    },
    {
      id: 2,
      name: "Mehmet Özkan",
      childAge: 7,
      rating: 5,
      comment: "Kızım için yaptırdığımız kitap muhteşem oldu! Yapay zeka gerçekten çocuğumuzu hikayenin kahramanı yaptı. Kalitesi de çok yüksek."
    },
    {
      id: 3,
      name: "Emily Davis",
      childAge: 4,
      rating: 5,
      comment: "The book we created with Hero Tales became my daughter's favorite gift. She was so excited to see herself in a space adventure!"
    },
    {
      id: 4,
      name: "Michael Thompson",
      childAge: 6,
      rating: 5,
      comment: "We created separate books for our twin children. Each has their own adventure! Both the kids and we are very satisfied with the results."
    },
    {
      id: 5,
      name: "Ayşe Demir",
      childAge: 8,
      rating: 5,
      comment: "Oğlum artık okumayı daha çok seviyor. Kendi kitabını okurken gözlerindeki gururu görebiliyorum. Harika bir deneyimdi!"
    },
    {
      id: 6,
      name: "James Wilson",
      childAge: 3,
      rating: 5,
      comment: "We created a forest adventure book for our little one. The PDF quality is perfect - we even printed and framed some pages!"
    }
  ];

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "fill-accent text-accent" : "text-muted-foreground"
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Happy <span className="text-primary">Families</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real experiences from families who created personalized story books for their children
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full bg-card hover:bg-card/80 transition-colors duration-300 shadow-card hover:shadow-magical">
                    <CardContent className="p-8 flex flex-col h-full">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mr-4">
                          <span className="text-accent-foreground font-bold text-lg">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-card-foreground">
                            {testimonial.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Parent of {testimonial.childAge} year old
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center mb-4">
                        {renderStars(testimonial.rating)}
                      </div>
                      
                      <blockquote className="text-muted-foreground italic flex-1 leading-relaxed">
                        "{testimonial.comment}"
                      </blockquote>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 bg-card hover:bg-card/80 border-2 shadow-card hover:shadow-magical transition-all duration-300" />
            <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 bg-card hover:bg-card/80 border-2 shadow-card hover:shadow-magical transition-all duration-300" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;