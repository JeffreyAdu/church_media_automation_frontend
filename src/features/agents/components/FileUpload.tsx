import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";

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
    const acceptedTypes = accept.split(",").map((t) => t.trim());
    const isValidType = acceptedTypes.some((type) => {
      if (type.endsWith("/*")) {
        return file.type.startsWith(type.replace("/*", ""));
      }
      return file.type === type;
    });

    if (!isValidType) {
      setError("Invalid file type");
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(file);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
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
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>

      {currentUrl ? (
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 border border-white/5 rounded-xl bg-white/[0.03]">
            {accept.includes("image") ? (
              <img
                src={currentUrl}
                alt="Preview"
                className="w-20 h-20 rounded-lg object-cover"
              />
            ) : (
              <audio src={currentUrl} controls className="flex-1" />
            )}
            {onDelete && (
              <button
                onClick={handleDeleteClick}
                disabled={isUploading}
                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
              >
                {isUploading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <X className="h-5 w-5" />
                )}
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
              className="w-full px-4 py-2.5 border border-orange-500/30 text-orange-500 rounded-xl hover:bg-orange-500/5 transition-colors disabled:opacity-50 text-sm font-medium"
            >
              {isUploading ? "Uploading..." : "Replace File"}
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
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isDragging
              ? "border-orange-500 bg-orange-500/5"
              : "border-white/10 hover:border-white/20"
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
            <Loader2 className="h-12 w-12 text-gray-600 mx-auto mb-4 animate-spin" />
          ) : (
            <Upload className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          )}
          <p className="text-sm text-gray-400 mb-1">
            {isUploading ? "Uploading..." : "Drop file here or click to browse"}
          </p>
          <p className="text-xs text-gray-600">Max size: {maxSize}MB</p>
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
