import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Users, Target, Award, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-primary mb-4">About Time2Thrive</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A network of oncologists, researchers, and AI-driven educators dedicated to cancer awareness and prevention
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Mission */}
            <Card className="p-8 bg-gradient-to-br from-secondary/5 to-primary/5">
              <div className="flex items-start space-x-4">
                <Target className="text-secondary mt-1 flex-shrink-0" size={48} />
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-secondary">Our Mission</h2>
                  <p className="text-lg text-muted-foreground mb-4">
                    Time2Thrive exists to bridge the gap between complex medical research and accessible public health education. 
                    We believe that <strong>knowledge heals and awareness saves lives</strong>.
                  </p>
                  <p className="text-muted-foreground">
                    Our mission is to empower individuals with accurate, science-backed information about cancer prevention, 
                    early detection, and treatment options. Through innovative technology and trusted medical expertise, 
                    we make cancer education accessible to everyone.
                  </p>
                </div>
              </div>
            </Card>

            {/* Team */}
            <Card className="p-8">
              <div className="flex items-start space-x-4">
                <Users className="text-primary mt-1 flex-shrink-0" size={48} />
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-primary">Our Team</h2>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-secondary/10 to-primary/10 p-6 rounded-lg">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2 text-secondary">Sebabkhi Faress Eddine</h3>
                          <p className="text-muted-foreground mb-3">
                                      First-Year Master's Student in Software Engineering | Full-Stack Web Developer                          </p>
                          <p className="text-sm text-muted-foreground mb-3">
                            Passionate about leveraging technology to make healthcare information accessible and user-friendly. 
                            Specializes in modern web development, creating intuitive interfaces for complex medical data.
                          </p>
                          <a 
                            href="https://www.linkedin.com/in/sebabkhi-faress-eddine/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-secondary hover:text-secondary/80 font-medium text-sm transition-colors"
                          >
                            Connect on LinkedIn →
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">A</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2 text-primary">Segueni Ali</h3>
                          <p className="text-muted-foreground mb-3">
                            Idea Owner, CEO & Founder of New Era Club
                          </p>
                          <p className="text-sm text-muted-foreground mb-3">
                            Visionary leader dedicated to revolutionizing cancer awareness and prevention through innovative 
                            approaches. Focuses on building communities and networks that empower individuals with 
                            life-saving knowledge and resources.
                          </p>
                          <a 
                            href="https://www.linkedin.com/in/ali-segueni-b441a2378" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                          >
                            Connect on LinkedIn →
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-center text-muted-foreground text-sm">
                        <strong>Our Mission:</strong> Combining technical expertise with visionary leadership to create 
                        accessible, reliable, and life-changing cancer education resources for everyone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Values */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-start space-x-3">
                  <Award className="text-secondary flex-shrink-0" size={32} />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Evidence-Based</h3>
                    <p className="text-muted-foreground">
                      Every piece of information is backed by peer-reviewed research and verified by medical professionals.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start space-x-3">
                  <Heart className="text-primary flex-shrink-0" size={32} />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Compassionate</h3>
                    <p className="text-muted-foreground">
                      We understand the emotional impact of cancer and present information with empathy and sensitivity.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Approach */}
            <Card className="p-8 bg-primary/5">
              <h2 className="text-3xl font-bold mb-6 text-primary text-center">Our Approach</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-secondary font-bold text-xl flex-shrink-0">01</span>
                  <div>
                    <h3 className="font-semibold mb-1">Accessibility First</h3>
                    <p className="text-muted-foreground text-sm">
                      Complex medical concepts translated into clear, understandable language for all education levels.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-secondary font-bold text-xl flex-shrink-0">02</span>
                  <div>
                    <h3 className="font-semibold mb-1">Interactive Learning</h3>
                    <p className="text-muted-foreground text-sm">
                      Visual tools like our body map and DNA animation make learning engaging and memorable.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-secondary font-bold text-xl flex-shrink-0">03</span>
                  <div>
                    <h3 className="font-semibold mb-1">Continuous Updates</h3>
                    <p className="text-muted-foreground text-sm">
                      Our content evolves with the latest research to ensure you always have current information.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-secondary font-bold text-xl flex-shrink-0">04</span>
                  <div>
                    <h3 className="font-semibold mb-1">Actionable Insights</h3>
                    <p className="text-muted-foreground text-sm">
                      Beyond facts, we provide practical steps you can take to reduce risk and improve outcomes.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Partnerships */}
            <Card className="p-8">
              <h2 className="text-3xl font-bold mb-6 text-primary text-center">Trusted Partnerships</h2>
              <p className="text-muted-foreground text-center mb-6">
                We collaborate with leading institutions and organizations:
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="p-4">
                  <p className="font-semibold">National Cancer Institute</p>
                </div>
                <div className="p-4">
                  <p className="font-semibold">American Cancer Society</p>
                </div>
                <div className="p-4">
                  <p className="font-semibold">World Health Organization</p>
                </div>
                <div className="p-4">
                  <p className="font-semibold">Mayo Clinic</p>
                </div>
                <div className="p-4">
                  <p className="font-semibold">Johns Hopkins Medicine</p>
                </div>
                <div className="p-4">
                  <p className="font-semibold">MD Anderson Cancer Center</p>
                </div>
              </div>
            </Card>

            {/* Contact CTA */}
            <Card className="p-8 bg-gradient-to-r from-primary to-secondary text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Join Us in the Fight Against Cancer</h2>
              <p className="text-lg mb-6 opacity-90">
                Whether you're a patient, caregiver, researcher, or healthcare professional, 
                there are many ways to get involved with Time2Thrive.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/contact" className="px-6 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-colors">
                  Contact Us
                </a>
                <a href="/research" className="px-6 py-3 bg-white/10 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/20 transition-colors">
                  View Research
                </a>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
