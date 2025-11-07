import { useState, useCallback, useEffect } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';
interface ImageUploaderProps {
  onFileChange: (file: File | null) => void;
  previewUrl?: string | null;
}
export function ImageUploader({ onFileChange, previewUrl }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(previewUrl || null);
  useEffect(() => {
    setPreview(previewUrl || null);
  }, [previewUrl]);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      onFileChange(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setPreview(null);
    onFileChange(null);
    // Reset file input
    const fileInput = document.getElementById('image-upload-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };
  return (
    <div
      className={cn(
        'relative border-2 border-dashed border-muted-foreground/50 rounded-lg p-4 text-center cursor-pointer transition-colors hover:border-primary',
        preview && 'p-0 border-solid'
      )}
      onClick={() => document.getElementById('image-upload-input')?.click()}
    >
      <input
        id="image-upload-input"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      {preview ? (
        <>
          <img src={preview} alt="Product preview" className="w-full h-auto object-cover rounded-lg aspect-square" />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-background/70 rounded-full p-1 text-foreground hover:bg-destructive hover:text-destructive-foreground transition-all"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2 py-8">
          <UploadCloud className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Click to select an image
          </p>
        </div>
      )}
    </div>
  );
}