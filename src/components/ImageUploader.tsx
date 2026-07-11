import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, Camera } from 'lucide-react';
import { mathSolverAPI } from '../services/api';
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from '../utils/constants';

interface ImageUploaderProps {
  onOCRComplete: (latex: string) => void;
}

export function ImageUploader({ onOCRComplete }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError('صيغة الملف غير مدعومة. استخدم JPG, PNG, أو WebP');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت');
      return;
    }

    setError(null);
    setPreview(URL.createObjectURL(file));
    setIsProcessing(true);

    try {
      const result = await mathSolverAPI.processImage(file);
      if (result.success && result.latex) {
        setOcrResult(result.latex);
        onOCRComplete(result.latex);
      } else {
        setError(result.error || 'فشل في التعرف على المعادلة');
      }
    } catch (err) {
      setError('حدث خطأ أثناء معالجة الصورة');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    // ✅ مهم: نفضي الـ input عشان نقدر نختار نفس الملف تاني
    e.target.value = '';
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const clearImage = () => {
    setPreview(null);
    setOcrResult(null);
    setError(null);
    setIsDragOver(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {/* ✅ Input مخفي جوه الكومبوننت - مفيش createPortal */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />

      {!preview ? (
        <div
          onClick={openFilePicker}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
        >
          <Upload className="mx-auto mb-3 text-gray-400" size={48} />
          <p className="text-lg font-medium text-gray-700 mb-1">
            {isDragOver ? 'أفلت الصورة هنا' : 'انقر لاختيار صورة المسألة'}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            JPG, PNG, WebP (الحد الأقصى 10 ميجابايت)
          </p>
          
          {/* ✅ زرار واضح للموبايل */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openFilePicker();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            <Camera size={18} />
            <span>اختر من المعرض</span>
          </button>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-gray-200">
          <img
            src={preview}
            alt="Uploaded math problem"
            className="w-full max-h-[400px] object-contain bg-white"
          />

          {isProcessing && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-white mb-3" size={40} />
              <p className="text-white font-medium">جاري التعرف على المعادلة...</p>
            </div>
          )}

          <button
            type="button"
            onClick={clearImage}
            className="absolute top-3 left-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
          >
            <X size={20} className="text-gray-700" />
          </button>

          {ocrResult && (
            <div className="absolute bottom-0 left-0 right-0 bg-white/95 p-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">المعادلة المستخرجة:</p>
              <code className="block bg-gray-100 p-3 rounded-lg text-sm font-mono text-primary-700">
                {ocrResult}
              </code>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
