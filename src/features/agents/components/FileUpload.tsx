import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

interface FileUploadProps {
  label: string;
  accept: string;
  currentUrl?: string;
  onUpload: (file: File) => Promise<void>;
  onDelete?: () => Promise<void>;
  maxSize?: number; // in MB
}

export default function FileUpload({
  label,
  accept,
  currentUrl,
  onUpload,
  onDelete,
  maxSize = 10,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    const acceptedTypes = accept.split(',').map((t) => t.trim());
    const isValidType = acceptedTypes.some((type) => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', ''));
      }
      return file.type === type;
    });

    if (!isValidType) {
      setError('Invalid file type');
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(file);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDeleteClick = async () => {
    if (!onDelete) return;
    setIsUploading(true);
    try {
      await onDelete();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {currentUrl ? (
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            {accept.includes('image') ? (
              <img src={currentUrl} alt="Preview" className="w-20 h-20 rounded object-cover" />
            ) : (
              <audio src={currentUrl} controls className="flex-1" />
            )}
            {onDelete && (
              <button
                onClick={handleDeleteClick}
                disabled={isUploading}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <X className="h-5 w-5" />}
              </button>
            )}
          </div>
          <div className="relative">
            <input
              type="file"
              accept={accept}
              onChange={handleChange}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            />
            <button
              disabled={isUploading}
              className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 text-sm font-medium"
            >
              {isUploading ? 'Uploading...' : 'Replace File'}
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleChange}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          {isUploading ? (
            <Loader2 className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
          ) : (
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          )}
          <p className="text-sm text-gray-600 mb-1">
            {isUploading ? 'Uploading...' : 'Drop file here or click to browse'}
          </p>
          <p className="text-xs text-gray-500">Max size: {maxSize}MB</p>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
