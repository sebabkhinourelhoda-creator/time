import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Time2Thrive</h3>
            <p className="text-sm opacity-90 mb-4">
              Empowering you to understand, detect, and fight cancer through science and awareness.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span>info@time2thrive.health</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>1-800-THRIVE-NOW</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>Medical Research Center</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Informed</h3>
            <p className="text-sm opacity-90 mb-4">
              Subscribe to our newsletter for the latest research and health tips.
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button variant="secondary">Subscribe</Button>
            </div>
          </div>

          {/* Verified Sources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Verified Sources</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• World Health Organization (WHO)</li>
              <li>• National Cancer Institute (NCI)</li>
              <li>• American Cancer Society</li>
              <li>• PubMed Medical Research</li>
              <li>• CDC Cancer Prevention</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center">
          <p className="text-lg font-medium italic mb-2">
            "Knowledge heals — awareness saves lives."
          </p>
          <p className="text-sm opacity-75">
            © 2024 Time2Thrive. All rights reserved. | Medical information for educational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
