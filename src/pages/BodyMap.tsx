import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

type BodyPart = {
  id: string;
  name: string;
  cancers: string[];
  position: string;
};

const bodyParts: BodyPart[] = [
  { id: "head", name: "Head", cancers: ["Brain Cancer", "Oral Cancer"], position: "top-[5%] left-1/2 -translate-x-1/2" },
  { id: "neck", name: "Neck", cancers: ["Thyroid Cancer", "Laryngeal Cancer"], position: "top-[15%] left-1/2 -translate-x-1/2" },
  { id: "chest-women", name: "Chest (Women)", cancers: ["Breast Cancer"], position: "top-[25%] left-[45%]" },
  { id: "chest-men", name: "Chest (Men)", cancers: ["Lung Cancer"], position: "top-[25%] left-[55%]" },
  { id: "abdomen", name: "Abdomen", cancers: ["Colon Cancer", "Liver Cancer", "Pancreatic Cancer", "Stomach Cancer"], position: "top-[40%] left-1/2 -translate-x-1/2" },
  { id: "pelvis", name: "Pelvis", cancers: ["Prostate Cancer", "Ovarian Cancer", "Bladder Cancer", "Cervical Cancer"], position: "top-[55%] left-1/2 -translate-x-1/2" },
  { id: "legs", name: "Legs", cancers: ["Bone Cancer", "Skin Cancer (Melanoma)"], position: "top-[70%] left-1/2 -translate-x-1/2" },
];

const BodyMap = () => {
  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null);

  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-primary mb-4">Interactive Body Map</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Click on any body part to learn about common cancers affecting that region
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Body Diagram */}
            <div className="relative bg-card rounded-2xl shadow-xl p-8 min-h-[600px]">
              <div className="relative w-full h-[700px] mx-auto max-w-md">
                {/* Simple body outline */}
                <svg viewBox="0 0 200 400" className="w-full h-full">
                  {/* Head */}
                  <circle cx="100" cy="30" r="25" fill="hsl(var(--secondary))" opacity="0.2" className="cursor-pointer hover:opacity-40 transition-opacity" onClick={() => setSelectedPart(bodyParts[0])} />
                  
                  {/* Neck */}
                  <rect x="85" y="55" width="30" height="20" fill="hsl(var(--secondary))" opacity="0.2" className="cursor-pointer hover:opacity-40 transition-opacity" onClick={() => setSelectedPart(bodyParts[1])} />
                  
                  {/* Chest */}
                  <ellipse cx="100" cy="110" rx="50" ry="40" fill="hsl(var(--primary))" opacity="0.2" className="cursor-pointer hover:opacity-40 transition-opacity" onClick={() => setSelectedPart(bodyParts[2])} />
                  
                  {/* Abdomen */}
                  <rect x="60" y="150" width="80" height="70" rx="10" fill="hsl(var(--accent))" opacity="0.2" className="cursor-pointer hover:opacity-40 transition-opacity" onClick={() => setSelectedPart(bodyParts[4])} />
                  
                  {/* Pelvis */}
                  <ellipse cx="100" cy="250" rx="40" ry="30" fill="hsl(var(--secondary))" opacity="0.2" className="cursor-pointer hover:opacity-40 transition-opacity" onClick={() => setSelectedPart(bodyParts[5])} />
                  
                  {/* Legs */}
                  <rect x="70" y="280" width="25" height="110" rx="5" fill="hsl(var(--primary))" opacity="0.2" className="cursor-pointer hover:opacity-40 transition-opacity" onClick={() => setSelectedPart(bodyParts[6])} />
                  <rect x="105" y="280" width="25" height="110" rx="5" fill="hsl(var(--primary))" opacity="0.2" className="cursor-pointer hover:opacity-40 transition-opacity" onClick={() => setSelectedPart(bodyParts[6])} />
                  
                  {/* Arms */}
                  <rect x="30" y="90" width="20" height="90" rx="5" fill="hsl(var(--muted))" opacity="0.15" />
                  <rect x="150" y="90" width="20" height="90" rx="5" fill="hsl(var(--muted))" opacity="0.15" />
                </svg>

                {/* Clickable buttons */}
                {bodyParts.map((part) => (
                  <button
                    key={part.id}
                    onClick={() => setSelectedPart(part)}
                    className={`absolute ${part.position} px-4 py-2 rounded-full text-xs font-semibold transition-all transform hover:scale-110 ${
                      selectedPart?.id === part.id
                        ? "bg-secondary text-secondary-foreground shadow-lg"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {part.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Information Panel */}
            <div className="bg-card rounded-2xl shadow-xl p-8">
              {selectedPart ? (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-primary">{selectedPart.name}</h2>
                  <p className="text-muted-foreground">
                    Common cancers affecting this region:
                  </p>
                  <div className="space-y-4">
                    {selectedPart.cancers.map((cancer) => (
                      <Link
                        key={cancer}
                        to={`/cancer/${cancer.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <Card className="p-4 hover:shadow-lg transition-all cursor-pointer hover:border-secondary">
                          <h3 className="text-lg font-semibold text-secondary">{cancer}</h3>
                          <p className="text-sm text-muted-foreground mt-2">
                            Click to learn about symptoms, prevention, and treatment options
                          </p>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">👆</span>
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">Select a Body Part</h3>
                    <p className="text-muted-foreground">
                      Click on any area of the body to learn about related cancers
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BodyMap;
