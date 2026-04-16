import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, ExternalLink, Filter } from "lucide-react";
import { fetchDocuments, type Document } from "@/lib/documents";

const ResearchPapers = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadVerifiedDocuments();
  }, []);

  const loadVerifiedDocuments = async () => {
    try {
      setLoading(true);
      const data = await fetchDocuments({
        status: undefined, // We'll filter on client side to get verified documents
        showAll: true
      });
      
      // Filter for only verified documents
      const verifiedDocs = data.filter(doc => 
        doc.status === 'verified'
      );
      
      setDocuments(verifiedDocs);
      
      // Extract unique categories
      const uniqueCategories = ["All", ...Array.from(new Set(
        verifiedDocs
          .map(doc => doc.category?.name)
          .filter(Boolean)
      ))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading research papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.journal?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || doc.category?.name === selectedCategory;
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
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="p-6 hover:shadow-xl transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                        Verified
                      </span>
                      <span className="text-xs text-muted-foreground">{doc.year}</span>
                    </div>

                    <h3 className="text-xl font-bold text-primary leading-tight">
                      {doc.title}
                    </h3>

                    <p className="text-sm text-muted-foreground italic">{doc.journal || "Medical Journal"}</p>

                    <p className="text-muted-foreground">{doc.description || "Research paper summary and findings."}</p>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => window.open(doc.file_url, '_blank')}
                      >
                        <Download size={16} className="mr-2" />
                        Download PDF
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="flex-1"
                        onClick={() => window.open(doc.file_url, '_blank')}
                      >
                        <ExternalLink size={16} className="mr-2" />
                        Read Full Study
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {filteredDocuments.length === 0 && !loading && (
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

export default ResearchPapers;