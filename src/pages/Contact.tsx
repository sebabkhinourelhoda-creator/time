import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-primary mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions or need support? We're here to help you on your health journey.
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input placeholder="Your full name" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input type="email" placeholder="your.email@example.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone (Optional)</label>
                  <Input type="tel" placeholder="(555) 123-4567" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <Input placeholder="How can we help you?" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                  />
                </div>

                <Button className="w-full" size="lg">
                  Send Message
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  We typically respond within 24-48 hours
                </p>
              </form>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <Mail className="text-secondary mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">info@time2thrive.health</p>
                    <p className="text-sm text-muted-foreground mt-1">support@time2thrive.health</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <Phone className="text-secondary mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-muted-foreground">1-800-THRIVE-NOW</p>
                    <p className="text-sm text-muted-foreground mt-1">(1-800-847-4836)</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="text-secondary mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-muted-foreground">
                      Time2Thrive Medical Research Center<br />
                      1234 Health Sciences Parkway<br />
                      Medical District, CA 90210<br />
                      United States
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <Clock className="text-secondary mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold mb-1">Office Hours</h3>
                    <div className="text-muted-foreground space-y-1">
                      <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p>Saturday: 9:00 AM - 2:00 PM</p>
                      <p>Sunday: Closed</p>
                      <p className="text-sm mt-2 text-secondary">
                        Emergency support available 24/7
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-primary/5">
                <h3 className="font-semibold mb-3">Schedule a Consultation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Speak with one of our oncology specialists or genetic counselors
                </p>
                <Button variant="secondary" className="w-full">
                  Book Appointment
                </Button>
              </Card>
            </div>
          </div>

          {/* Emergency Notice */}
          <Card className="max-w-4xl mx-auto mt-8 p-6 bg-destructive/10 border-destructive/20">
            <div className="text-center">
              <h3 className="font-bold text-destructive mb-2">Medical Emergency?</h3>
              <p className="text-sm text-muted-foreground">
                If you are experiencing a medical emergency, please call 911 or visit your nearest emergency room immediately. 
                Time2Thrive provides educational information and is not a substitute for emergency medical care.
              </p>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
