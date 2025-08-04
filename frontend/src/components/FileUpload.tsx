import React, { useCallback, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  selectedFile, 
  isProcessing 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      onFileSelect(pdfFile);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const clearFile = useCallback(() => {
    onFileSelect(null as any);
  }, [onFileSelect]);

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
            ${isDragOver 
              ? 'border-amber-600 bg-amber-50 shadow-lg' 
              : 'border-amber-800/30 bg-amber-50/20 hover:bg-amber-50/40 hover:border-amber-600/50'
            }
            ${isProcessing ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".pdf"
            onChange={handleFileInput}
            className="hidden"
            disabled={isProcessing}
          />
          
          <Upload className="mx-auto h-12 w-12 text-amber-800 mb-4" />
          <h3 className="text-lg font-semibold text-amber-900 mb-2">
            Drop your PDF here
          </h3>
          <p className="text-amber-700 mb-4">
            or click to browse files
          </p>
          <p className="text-sm text-amber-600">
            Supports PDF files up to 50MB
          </p>
        </div>
      ) : (
        <div className="bg-cream rounded-lg p-6 border border-amber-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-amber-800" />
              <div>
                <h4 className="font-semibold text-amber-900">{selectedFile.name}</h4>
                <p className="text-sm text-amber-700">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!isProcessing && (
              <button
                onClick={clearFile}
                className="p-2 hover:bg-amber-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-amber-600" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};