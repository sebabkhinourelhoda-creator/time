import { useState } from 'react';
import { useCloudinaryUpload } from '../hooks/use-cloudinary-upload';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Card } from './ui/card';
import { X } from 'lucide-react';

interface DocumentUploadProps {
  onUploadComplete?: (url: string, fileName: string, fileType: string) => console.log;
  folder?: string;
  acceptedFileTypes?: string; // e.g., ".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
}

export const DocumentUpload = ({
  onUploadComplete,
  folder = 'documents',
  acceptedFileTypes = '.pdf,.doc,.docx,.txt,.xls,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf'
}: DocumentUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; url: string; type: string }>>([]);
  const { uploadToCloudinary, isUploading, error } = useCloudinaryUpload({
    folder: folder,
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const file = files[0];
    const result = await uploadToCloudinary(file);
    
    if (result) {
      const newFile = {
        name: file.name,
        url: result.secure_url,
        type: file.type
      };
      
      setUploadedFiles(prev => [...prev, newFile]);
      onUploadComplete?.(result.secure_url, file.name, file.type);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('sheet') || fileType.includes('excel')) return '📊';
    return '📎';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          disabled={isUploading}
          onClick={() => document.getElementById('document-upload')?.click()}
        >
          {isUploading ? 'Uploading...' : 'Upload Document'}
        </Button>
        <input
          id="document-upload"
          type="file"
          accept={acceptedFileTypes}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {isUploading && (
        <div className="w-full space-y-2">
          <Progress value={33} className="w-full" />
          <p className="text-sm text-gray-500">Uploading document...</p>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {uploadedFiles.map((file, index) => (
          <Card key={index} className="p-4 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => removeFile(index)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getFileIcon(file.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{file.type.split('/')[1].toUpperCase()}</p>
              </div>
            </div>
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-xs text-blue-500 hover:underline"
            >
              View Document
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
};