import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { BodyComponent } from 'reactjs-human-body';
import { Button } from "@/components/ui/button";

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
  const [bodyModel, setBodyModel] = useState<'male' | 'female'>('male');
  const [highlightedParts, setHighlightedParts] = useState<any>(null);

  const handleBodyPartClick = (id: string) => {
    const part = bodyParts.find(p => p.id.toLowerCase() === id.toLowerCase());
    if (part) {
      setSelectedPart(part);
      setHighlightedParts({ [id]: { selected: true } });
    }
  };

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
              <div className="flex flex-col items-center gap-4 mb-4">
                <div className="flex gap-2">
                  <Button
                    variant={bodyModel === 'male' ? 'secondary' : 'outline'}
                    onClick={() => setBodyModel('male')}
                    className={bodyModel === 'male' ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                  >
                    Male Model
                  </Button>
                  <Button
                    variant={bodyModel === 'female' ? 'secondary' : 'outline'}
                    onClick={() => setBodyModel('female')}
                    className={bodyModel === 'female' ? 'bg-pink-500 text-white hover:bg-pink-600' : ''}
                  >
                    Female Model
                  </Button>
                </div>
              </div>
              <div className="relative w-full mx-auto max-w-md" style={{ height: '600px' }}>
                <BodyComponent
                  partsInput={highlightedParts}
                  bodyModel={bodyModel}
                  onClick={handleBodyPartClick}
                  style={{
                    width: '100%',
                    height: '100%',
                    '--selected-color': bodyModel === 'male' ? '#3b82f6' : '#ec4899', // Blue for male, Pink for female
                    '--hover-color': bodyModel === 'male' ? '#60a5fa' : '#f472b6', // Lighter blue for male hover, lighter pink for female hover
                    '--base-color': bodyModel === 'male' ? '#bfdbfe' : '#fbcfe8', // Very light blue/pink for base color
                  } as any}
                />
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
