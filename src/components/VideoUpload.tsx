import React, { useState, useRef } from "react";
import { supabase } from '../lib/supabaseClient';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { 
  Upload, 
  Video, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Play
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface VideoUploadProps {
  onVideoUploadComplete?: (url: string, fileName: string, fileType: string) => console.log;
  onThumbnailUploadComplete?: (url: string, fileName: string, fileType: string) => console.log;
  userId?: number;
  type: 'video' | 'thumbnail';
  existingUrl?: string;
}

export default function VideoUpload({ 
  onVideoUploadComplete,
  onThumbnailUploadComplete,
  userId,
  type,
  existingUrl
}: VideoUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(existingUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // File type validation
    const isVideo = type === 'video';
    const allowedTypes = isVideo 
      ? ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm', 'video/mkv']
      : ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError(`Please select a valid ${isVideo ? 'video' : 'image'} file.`);
      return;
    }

    // File size validation (50MB for videos, 5MB for images)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError(`File size must be less than ${isVideo ? '50MB' : '5MB'}.`);
      return;
    }

    setFile(selectedFile);
    setError(null);
    setSuccess(false);
    setUploadProgress(0);
  };

  const uploadFile = async () => {
    if (!file) {
      setError("Please choose a file first.");
      return;
    }

    if (!userId) {
      setError("User authentication required for upload.");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      setError(null);

      // Create user-specific folder structure
      const userFolder = `user_${userId}`;
      const typeFolder = type === 'video' ? 'videos' : 'thumbnails';
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `${userFolder}/${typeFolder}/${fileName}`;

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 300);

      // Upload to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from('T2T')
        .upload(filePath, file, {
          upsert: false,
          contentType: file.type
        });

      clearInterval(progressInterval);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', data);

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('T2T')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      setFileUrl(publicUrl);
      setUploadProgress(100);
      setSuccess(true);
      
      // Call the appropriate completion handler
      if (type === 'video' && onVideoUploadComplete) {
        onVideoUploadComplete(publicUrl, file.name, file.type);
      } else if (type === 'thumbnail' && onThumbnailUploadComplete) {
        onThumbnailUploadComplete(publicUrl, file.name, file.type);
      }

    } catch (err: any) {
      console.error('Upload error:', err);
      let errorMessage = "Error uploading file";
      
      if (err.message?.includes('Bucket not found')) {
        errorMessage = 'Storage bucket "T2T" not found. Please check your Supabase configuration.';
      } else if (err.message?.includes('permissions')) {
        errorMessage = 'Permission denied. Please check your storage policies.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    setUploadProgress(0);
    setFileUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = () => {
    if (type === 'video') {
      return <Video className="h-12 w-12 text-blue-500" />;
    }
    return <ImageIcon className="h-12 w-12 text-green-500" />;
  };

  const getAcceptedTypes = () => {
    if (type === 'video') {
      return '.mp4,.avi,.mov,.wmv,.webm,.mkv';
    }
    return '.jpg,.jpeg,.png,.gif,.webp';
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        {!userId ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please log in to upload files.</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">
                {type === 'video' ? 'Upload Video' : 'Upload Thumbnail'}
              </h3>
              {success && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
            </div>

          {/* File Input */}
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              id={`${type}-upload`}
              accept={getAcceptedTypes()}
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />

            {!file && !fileUrl && (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {getFileIcon()}
                <p className="mt-2 text-sm text-gray-600">
                  Click to select {type === 'video' ? 'video' : 'image'} file
                </p>
                <p className="text-xs text-gray-400">
                  {type === 'video' 
                    ? 'MP4, AVI, MOV, WMV, WEBM, MKV (max 50MB)' 
                    : 'JPG, PNG, GIF, WEBP (max 5MB)'
                  }
                </p>
              </div>
            )}

            {/* Selected File Display */}
            {file && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getFileIcon()}
                    <div>
                      <p className="text-sm font-medium truncate max-w-[200px]">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!success && !uploading && (
                      <Button size="sm" onClick={uploadFile}>
                        <Upload className="h-4 w-4 mr-1" />
                        Upload
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={removeFile}
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                {uploading && (
                  <div className="mt-3 space-y-2">
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-xs text-gray-500 text-center">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Existing File Display */}
            {fileUrl && success && (
              <div className="border rounded-lg p-4 bg-green-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {success ? (
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                    ) : (
                      getFileIcon()
                    )}
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        {type === 'video' ? 'Video' : 'Thumbnail'} uploaded successfully!
                      </p>
                      <p className="text-xs text-green-600">
                        File ready for use
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {type === 'video' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(fileUrl, '_blank')}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    )}
                    {type === 'thumbnail' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(fileUrl, '_blank')}
                      >
                        <ImageIcon className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Helper Text */}
          <div className="text-xs text-gray-500">
            {type === 'video' ? (
              <p>Supported formats: MP4 (recommended), AVI, MOV, WMV, WEBM, MKV. Maximum size: 50MB.</p>
            ) : (
              <p>Supported formats: JPG, PNG (recommended), GIF, WEBP. Maximum size: 5MB.</p>
            )}
          </div>
        </div>
        )}
      </CardContent>
    </Card>
  );
}