import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, ExternalLink, Filter } from "lucide-react";

const researchPapers = [
  {
    id: 1,
    title: "Advances in Early Cancer Detection Through AI and Machine Learning",
    journal: "Nature Medicine",
    year: 2024,
    category: "Prevention Research",
    summary: "Comprehensive study on AI-powered diagnostic tools improving early cancer detection rates by 30%.",
    link: "#",
  },
  {
    id: 2,
    title: "Immunotherapy Breakthroughs in Melanoma Treatment",
    journal: "Journal of Clinical Oncology",
    year: 2024,
    category: "Clinical Trials",
    summary: "Recent clinical trials show promising results with combination immunotherapy approaches.",
    link: "#",
  },
  {
    id: 3,
    title: "Genetic Markers for Breast Cancer Risk Assessment",
    journal: "Cancer Research",
    year: 2023,
    category: "Recent Studies",
    summary: "Identification of new genetic markers improving risk assessment accuracy for breast cancer.",
    link: "#",
  },
  {
    id: 4,
    title: "Dietary Factors in Colorectal Cancer Prevention",
    journal: "American Journal of Clinical Nutrition",
    year: 2024,
    category: "Prevention Research",
    summary: "Large-scale study examining the role of fiber, antioxidants, and plant-based diets.",
    link: "#",
  },
  {
    id: 5,
    title: "Targeted Therapy for Lung Cancer: Latest Developments",
    journal: "The Lancet Oncology",
    year: 2024,
    category: "Clinical Trials",
    summary: "New targeted therapies showing improved survival rates with fewer side effects.",
    link: "#",
  },
  {
    id: 6,
    title: "HPV Vaccination Impact on Cervical Cancer Rates",
    journal: "New England Journal of Medicine",
    year: 2023,
    category: "Prevention Research",
    summary: "20-year study demonstrates significant reduction in cervical cancer incidence.",
    link: "#",
  },
];

const categories = ["All", "Recent Studies", "Clinical Trials", "Prevention Research"];

const Research = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPapers = researchPapers.filter((paper) => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || paper.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-primary mb-4">Medical Research & Documents</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access verified research papers, clinical studies, and medical reports from trusted sources
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="Search research papers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Filter className="text-muted-foreground" size={20} />
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Research Papers Grid */}
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
            {filteredPapers.map((paper) => (
              <Card key={paper.id} className="p-6 hover:shadow-xl transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                      {paper.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{paper.year}</span>
                  </div>

                  <h3 className="text-xl font-bold text-primary leading-tight">
                    {paper.title}
                  </h3>

                  <p className="text-sm text-muted-foreground italic">{paper.journal}</p>

                  <p className="text-muted-foreground">{paper.summary}</p>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download size={16} className="mr-2" />
                      Download PDF
                    </Button>
                    <Button size="sm" variant="secondary" className="flex-1">
                      <ExternalLink size={16} className="mr-2" />
                      Read Full Study
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredPapers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No research papers found matching your criteria.</p>
            </div>
          )}

          {/* Trusted Sources */}
          <div className="max-w-4xl mx-auto mt-16 p-8 bg-card rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-primary mb-4 text-center">Our Trusted Sources</h2>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4">
                <h3 className="font-semibold mb-2">Government Agencies</h3>
                <p className="text-sm text-muted-foreground">NIH, CDC, FDA</p>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Medical Journals</h3>
                <p className="text-sm text-muted-foreground">Nature, The Lancet, NEJM</p>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Organizations</h3>
                <p className="text-sm text-muted-foreground">WHO, American Cancer Society</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Research;
