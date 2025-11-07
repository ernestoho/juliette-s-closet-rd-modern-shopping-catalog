import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { UploadCloud, FileText } from 'lucide-react';
import { api } from '@/lib/api-client';
interface BulkUploadCardProps {
  onUploadComplete: () => void;
}
export function BulkUploadCard({ onUploadComplete }: BulkUploadCardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type !== 'text/csv') {
        toast.error('Invalid file type. Please upload a CSV file.');
        return;
      }
      setSelectedFile(file);
    }
  };
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload.');
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append('products-csv', selectedFile);
    try {
      const response = await fetch('/api/products/bulk-upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Bulk upload failed.');
      }
      const { created, failed, errors } = result.data;
      toast.success(`Bulk upload complete! ${created} products added.`);
      if (failed > 0) {
        toast.warning(`${failed} rows failed to import.`, {
          description: (
            <ul className="list-disc list-inside">
              {errors.slice(0, 5).map((e: string, i: number) => <li key={i}>{e}</li>)}
            </ul>
          ),
        });
      }
      onUploadComplete();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Upload Products</CardTitle>
        <CardDescription>Upload a CSV file to add multiple products at once.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="csv-upload">CSV File</Label>
          <Input id="csv-upload" type="file" accept=".csv" onChange={handleFileChange} ref={fileInputRef} />
        </div>
        {selectedFile && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 border rounded-md">
            <FileText className="h-4 w-4" />
            <span>{selectedFile.name}</span>
          </div>
        )}
        <Button onClick={handleUpload} disabled={!selectedFile || isUploading} className="w-full">
          <UploadCloud className="mr-2 h-4 w-4" />
          {isUploading ? 'Uploading...' : 'Upload Products'}
        </Button>
        <div className="text-xs text-muted-foreground space-y-1 pt-2">
          <p className="font-semibold">CSV Format Instructions:</p>
          <p>• The file must have a header row.</p>
          <p>• Required columns in order: <code className="bg-muted px-1 py-0.5 rounded">name,price,description,imageUrl,category</code></p>
          <p>• Do not include commas within field values.</p>
        </div>
      </CardContent>
    </Card>
  );
}