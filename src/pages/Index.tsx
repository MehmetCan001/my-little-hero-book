import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Only redirect from auth pages when authenticated, allow viewing homepage
  useEffect(() => {
    if (!loading && user) {
      if (window.location.pathname === '/auth/sign-in' || window.location.pathname === '/auth/sign-up') {
        navigate('/');
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Testimonials />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
