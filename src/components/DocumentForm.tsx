import { useState, useContext } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FileUpload from "@/components/FileUpload";
import type { DocumentCategory } from "@/lib/documents";
import { AuthContext } from "@/contexts/AuthContext";

interface DocumentFormProps {
  categories: DocumentCategory[];
  onSubmit: (formData: {
    title: string;
    description: string;
    journal: string;
    year: number;
    category_id: number;
    file_url: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export const DocumentForm = ({ categories, onSubmit, onCancel }: DocumentFormProps) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    journal: "",
    year: new Date().getFullYear(),
    category_id: categories[0]?.id || 0,
    file_url: ""
  });

  const handleFileUpload = async (url: string, fileName: string, fileType: string) => {
    setFormData(prev => ({
      ...prev,
      file_url: url,
      title: prev.title || fileName // Use fileName as title if title is empty
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file_url) {
      alert("Please upload a file first");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting document:", error);
      alert("Failed to submit document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          Please log in to upload documents.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="title">
            Document Title
          </label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter document title"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="description">
            Description
          </label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter document description"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="journal">
              Journal/Publication
            </label>
            <Input
              id="journal"
              value={formData.journal}
              onChange={(e) => setFormData(prev => ({ ...prev, journal: e.target.value }))}
              placeholder="Enter journal name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="year">
              Publication Year
            </label>
            <Input
              id="year"
              type="number"
              min={1900}
              max={new Date().getFullYear()}
              value={formData.year}
              onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Category
          </label>
          <Select
            value={formData.category_id.toString()}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: parseInt(value) }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Document File (PDF)
          </label>
          <FileUpload
            onUploadComplete={handleFileUpload}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || !formData.file_url}
          >
            {loading ? "Submitting..." : "Submit Document"}
          </Button>
        </div>
      </form>
    </Card>
  );
};