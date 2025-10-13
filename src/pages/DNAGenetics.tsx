import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DNAAnimation from "@/components/DNAAnimation";
import { Card } from "@/components/ui/card";
import { Dna, Users, AlertTriangle, CheckCircle } from "lucide-react";

const DNAGenetics = () => {
  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-primary mb-4">DNA & Genetics</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Understanding how genetics influence cancer development and what it means for prevention
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <Card className="p-8">
              <DNAAnimation />
            </Card>

            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <Dna className="text-secondary mt-1" size={32} />
                  <div>
                    <h3 className="text-xl font-bold mb-2">What is DNA?</h3>
                    <p className="text-muted-foreground">
                      DNA (deoxyribonucleic acid) is the hereditary material in humans. It contains the instructions 
                      needed for cells to function and reproduce. Changes in DNA can lead to cancer.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <Users className="text-primary mt-1" size={32} />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Inherited vs Acquired Mutations</h3>
                    <p className="text-muted-foreground">
                      Some genetic mutations are inherited from parents (5-10% of cancers), while most are acquired 
                      during a person's lifetime due to environmental factors or random errors in cell division.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <AlertTriangle className="text-destructive mt-1" size={32} />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Cancer-Related Genes</h3>
                    <p className="text-muted-foreground">
                      Oncogenes promote cell growth, while tumor suppressor genes slow down cell division. 
                      Mutations in these genes can lead to uncontrolled cell growth—cancer.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Key Cancer Genes */}
          <div className="max-w-6xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-primary">Important Cancer-Related Genes</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-3 text-secondary">BRCA1 & BRCA2</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Associated with:</strong> Breast, ovarian cancer
                </p>
                <p className="text-muted-foreground">
                  These tumor suppressor genes help repair DNA damage. Mutations significantly increase cancer risk.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-3 text-secondary">TP53</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Associated with:</strong> Many cancer types
                </p>
                <p className="text-muted-foreground">
                  Known as the "guardian of the genome," this gene prevents cells with damaged DNA from dividing.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-3 text-secondary">EGFR</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Associated with:</strong> Lung, colorectal cancer
                </p>
                <p className="text-muted-foreground">
                  This gene helps regulate cell growth. Mutations can cause cells to grow uncontrollably.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-3 text-secondary">MLH1 & MSH2</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Associated with:</strong> Colorectal cancer
                </p>
                <p className="text-muted-foreground">
                  These DNA mismatch repair genes fix errors during DNA replication.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-3 text-secondary">RET</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Associated with:</strong> Thyroid, lung cancer
                </p>
                <p className="text-muted-foreground">
                  Mutations in this gene can trigger abnormal cell signaling and growth.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-3 text-secondary">KRAS</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Associated with:</strong> Pancreatic, lung cancer
                </p>
                <p className="text-muted-foreground">
                  One of the most commonly mutated genes in cancer, affecting cell growth pathways.
                </p>
              </Card>
            </div>
          </div>

          {/* Genetic Testing */}
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 bg-primary/5">
              <h2 className="text-3xl font-bold mb-6 text-primary text-center">Genetic Testing & Counseling</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="text-secondary mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold mb-2">Who Should Consider Testing?</h3>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Family history of cancer at young ages</li>
                      <li>• Multiple family members with the same type of cancer</li>
                      <li>• Personal history of multiple cancers</li>
                      <li>• Known genetic mutation in the family</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="text-secondary mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold mb-2">Benefits of Genetic Testing</h3>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Identify increased cancer risk</li>
                      <li>• Guide prevention strategies</li>
                      <li>• Inform treatment decisions</li>
                      <li>• Help family members assess their risk</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-accent/10 border-l-4 border-accent p-6 rounded">
                  <p className="font-semibold text-accent">Genetic Counseling</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Before and after genetic testing, counseling with a genetics specialist is recommended 
                    to understand results and make informed decisions about your health care.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DNAGenetics;
