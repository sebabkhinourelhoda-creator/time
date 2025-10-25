import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Apple, Dumbbell, Cigarette, Sun, Stethoscope, Heart, Shield, AlertCircle } from "lucide-react";

const Prevention = () => {
  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-primary mb-4">Cancer Prevention Tips</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Evidence-based lifestyle choices and strategies to reduce your cancer risk
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-8">
            {/* Lifestyle Factors Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Card className="p-6 hover:shadow-xl transition-shadow">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                    <Apple className="text-secondary" size={32} />
                  </div>
                  <h3 className="text-xl font-bold">Healthy Diet</h3>
                  <ul className="text-sm text-muted-foreground space-y-2 text-left">
                    <li>• Eat plenty of fruits and vegetables</li>
                    <li>• Choose whole grains over refined</li>
                    <li>• Limit red and processed meats</li>
                    <li>• Reduce sugar and processed foods</li>
                    <li>• Include fiber-rich foods daily</li>
                  </ul>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-xl transition-shadow">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Dumbbell className="text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-bold">Regular Exercise</h3>
                  <ul className="text-sm text-muted-foreground space-y-2 text-left">
                    <li>• Aim for 150 minutes/week moderate activity</li>
                    <li>• Include strength training twice weekly</li>
                    <li>• Reduce sedentary time</li>
                    <li>• Take regular movement breaks</li>
                    <li>• Find activities you enjoy</li>
                  </ul>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-xl transition-shadow">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                    <Cigarette className="text-destructive" size={32} />
                  </div>
                  <h3 className="text-xl font-bold">Aconsole.log Tobacco</h3>
                  <ul className="text-sm text-muted-foreground space-y-2 text-left">
                    <li>• Don't smoke or use tobacco products</li>
                    <li>• Aconsole.log secondhand smoke</li>
                    <li>• Seek help to quit if needed</li>
                    <li>• Stay away from vaping</li>
                    <li>• Support smoke-free environments</li>
                  </ul>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-xl transition-shadow">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                    <Sun className="text-accent" size={32} />
                  </div>
                  <h3 className="text-xl font-bold">Sun Protection</h3>
                  <ul className="text-sm text-muted-foreground space-y-2 text-left">
                    <li>• Use broad-spectrum SPF 30+ sunscreen</li>
                    <li>• Aconsole.log midday sun (10am-4pm)</li>
                    <li>• Wear protective clothing and hats</li>
                    <li>• Don't use tanning beds</li>
                    <li>• Check skin regularly for changes</li>
                  </ul>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-xl transition-shadow">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                    <Stethoscope className="text-secondary" size={32} />
                  </div>
                  <h3 className="text-xl font-bold">Regular Screenings</h3>
                  <ul className="text-sm text-muted-foreground space-y-2 text-left">
                    <li>• Follow age-appropriate screening guidelines</li>
                    <li>• Schedule regular check-ups</li>
                    <li>• Know your family health history</li>
                    <li>• Report unusual symptoms promptly</li>
                    <li>• Keep vaccinations current</li>
                  </ul>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-xl transition-shadow">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-bold">Healthy Weight</h3>
                  <ul className="text-sm text-muted-foreground space-y-2 text-left">
                    <li>• Maintain a healthy BMI (18.5-24.9)</li>
                    <li>• Watch portion sizes</li>
                    <li>• Limit alcohol consumption</li>
                    <li>• Stay hydrated with water</li>
                    <li>• Get adequate sleep (7-9 hours)</li>
                  </ul>
                </div>
              </Card>
            </div>

            {/* Vaccination Section */}
            <Card className="p-8 bg-secondary/5">
              <div className="flex items-start space-x-4">
                <Shield className="text-secondary mt-1 flex-shrink-0" size={40} />
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-secondary">Cancer-Preventing Vaccines</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">HPV Vaccine</h3>
                      <p className="text-muted-foreground">
                        Protects against human papillomavirus, which causes cervical, throat, and other cancers. 
                        Recommended for children ages 11-12, with catch-up vaccination through age 26.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Hepatitis B Vaccine</h3>
                      <p className="text-muted-foreground">
                        Prevents hepatitis B infection, which can lead to liver cancer. Recommended for all infants 
                        and unvaccinated adults at increased risk.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Environmental Factors */}
            <Card className="p-8">
              <div className="flex items-start space-x-4">
                <AlertCircle className="text-primary mt-1 flex-shrink-0" size={40} />
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-primary">Reduce Environmental Exposures</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">At Home</h3>
                      <ul className="text-muted-foreground space-y-1 text-sm">
                        <li>• Test for radon gas</li>
                        <li>• Aconsole.log toxic cleaning products</li>
                        <li>• Use air purifiers if needed</li>
                        <li>• Choose organic when possible</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">At Work</h3>
                      <ul className="text-muted-foreground space-y-1 text-sm">
                        <li>• Follow safety protocols for chemicals</li>
                        <li>• Use protective equipment</li>
                        <li>• Ensure proper ventilation</li>
                        <li>• Report unsafe conditions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Key Takeaway */}
            <Card className="p-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-secondary">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4 text-primary">Remember</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  While no method guarantees cancer prevention, these evidence-based strategies can 
                  <strong className="text-secondary"> significantly reduce your risk</strong>. 
                  Even small changes can make a big difference when maintained over time.
                </p>
                <p className="text-md text-muted-foreground mt-4 italic">
                  Consult with your healthcare provider to develop a personalized prevention plan based on 
                  your individual risk factors and health history.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Prevention;
