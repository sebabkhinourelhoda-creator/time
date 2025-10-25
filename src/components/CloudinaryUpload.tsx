import { useState } from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { useCloudinaryUpload } from '../hooks/use-cloudinary-upload';
import cloudinaryConfig from '../lib/cloudinary';
import { Button } from './ui/button';

interface CloudinaryUploadProps {
  onUploadComplete?: (url: string) => console.log;
  folder?: string;
}

export const CloudinaryUpload = ({ onUploadComplete, folder }: CloudinaryUploadProps) => {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const { uploadToCloudinary, isUploading, error } = useCloudinaryUpload({
    folder: folder,
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await uploadToCloudinary(file);
    if (result) {
      setUploadedUrl(result.secure_url);
      onUploadComplete?.(result.secure_url);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Button
          disabled={isUploading}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </Button>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      {uploadedUrl && (
        <div className="mt-4">
          <AdvancedImage
            cldImg={cloudinaryConfig.image(uploadedUrl)}
            className="max-w-md rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
};