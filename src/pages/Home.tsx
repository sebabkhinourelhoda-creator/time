import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Microscope, Heart } from "lucide-react";
import DNAAnimation from "@/components/DNAAnimation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-secondary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-primary leading-tight">
                Time2Thrive
              </h1>
              <h2 className="text-3xl md:text-4xl font-semibold text-secondary">
                Understanding Cancer, One Cell at a Time
              </h2>
              <p className="text-xl text-muted-foreground">
                Empowering you to detect, prevent, and fight cancer through science and awareness.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/body-map">
                  <Button size="lg" className="group">
                    Start Exploring
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <DNAAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary">
            Our Mission
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="text-secondary" size={32} />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Early Detection</h3>
              <p className="text-muted-foreground">
                Learn to recognize early warning signs and symptoms of various cancers to improve treatment outcomes.
              </p>
            </div>

            <Link to="/research-papers" className="block">
              <div className="bg-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Microscope className="text-primary" size={32} />
                </div>
                <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">Research-Backed</h3>
                <p className="text-muted-foreground">
                  Access the latest medical research and clinical studies from trusted sources worldwide.
                </p>
                <div className="mt-4 text-primary font-medium group-hover:underline">
                  Browse Research Papers →
                </div>
              </div>
            </Link>

            <div className="bg-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Heart className="text-accent" size={32} />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Prevention First</h3>
              <p className="text-muted-foreground">
                Discover evidence-based prevention strategies and lifestyle choices that reduce cancer risk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Explore our interactive body map to learn about different types of cancer and how to protect yourself.
          </p>
          <Link to="/body-map">
            <Button size="lg" variant="secondary" className="group">
              Explore Body Map
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
