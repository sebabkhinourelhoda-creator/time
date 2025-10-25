import { useState, useEffect, useContext } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, ExternalLink, Filter, Upload, Loader2 } from "lucide-react";
import { fetchCategories, fetchDocuments, createDocument, type Document, type DocumentCategory } from "@/lib/documents";
import { AuthContext } from "@/contexts/AuthContext";
import FileUpload from "@/components/FileUpload";
import type { FC } from 'react';

const Research: FC = () => {
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    loadCategories();
    loadDocuments();
  }, [selectedCategory, searchTerm]);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await fetchDocuments({
        category_id: selectedCategory || undefined,
        search: searchTerm || undefined,
        status: 'verified' // Only show verified documents to regular users
      });
      setDocuments(data);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

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

            <div className="flex flex-wrap items-center gap-2">
              <Filter className="text-muted-foreground" size={20} />
              <Button
                key="all"
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
              {user && (
                <Button
                  className="ml-auto"
                  onClick={() => setShowUpload(!showUpload)}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Research
                </Button>
              )}
            </div>
          </div>

          {showUpload && (
            <div className="max-w-4xl mx-auto mt-8">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Upload Research Document</h3>
                <FileUpload
                  onUploadComplete={async (url, fileName) => {
                    try {
                      await createDocument({
                        title: fileName,
                        description: "",
                        file_url: url,
                        category_id: selectedCategory || categories[0]?.id,
                        status: "pending",
                        year: new Date().getFullYear(),
                        journal: "",
                        user_id: user?.id || 0
                      });
                      setShowUpload(false);
                      loadDocuments();
                    } catch (error) {
                      console.error('Error creating document:', error);
                    }
                  }}
                />
              </Card>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
              {documents.map((doc) => (
              <Card key={doc.id} className="p-6 hover:shadow-xl transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                      {doc.category?.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{doc.year}</span>
                  </div>

                  <h3 className="text-xl font-bold text-primary leading-tight">
                    {doc.title}
                  </h3>

                  <p className="text-sm text-muted-foreground italic">{doc.journal}</p>

                  <p className="text-muted-foreground">{doc.description}</p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Uploaded by: {doc.user?.full_name || doc.user?.username}</span>
                    <span className="capitalize px-2 py-1 rounded bg-primary/10 text-primary">
                      {doc.status}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => window.open(doc.file_url, '_blank')}
                    >
                      <Download size={16} className="mr-2" />
                      Download
                    </Button>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="flex-1"
                      onClick={() => window.open(doc.file_url, '_blank')}
                    >
                      <ExternalLink size={16} className="mr-2" />
                      View Document
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          )}

          {!loading && documents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No documents found matching your criteria.</p>
            </div>
          )}

          {user && (
            <div className="max-w-4xl mx-auto mt-16 p-8 bg-card rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-primary mb-4 text-center">Document Upload Guidelines</h2>
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Document Requirements</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>PDF format only</li>
                    <li>Maximum file size: 10MB</li>
                    <li>Must be research-related content</li>
                    <li>Include proper citations and references</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Review Process</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Documents are reviewed by our team</li>
                    <li>Review process takes 1-3 business days</li>
                    <li>Status updates will be visible on your dashboard</li>
                    <li>Verified documents will be publicly available</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
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