import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2 } from 'lucide-react';
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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
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
  }, [onOCRComplete]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    disabled: isProcessing,
  });

  const clearImage = () => {
    setPreview(null);
    setOcrResult(null);
    setError(null);
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto mb-3 text-gray-400" size={48} />
          <p className="text-lg font-medium text-gray-700 mb-1">
            {isDragActive ? 'أفلت الصورة هنا' : 'اسحب صورة المسألة هنا'}
          </p>
          <p className="text-sm text-gray-500">
            أو انقر لاختيار ملف (JPG, PNG, WebP)
          </p>
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

      {fileRejections.length > 0 && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {fileRejections.map(({ file, errors }) => (
            <div key={file.name}>
              <p className="font-medium">{file.name}: مرفوض</p>
              {errors.map(e => <p key={e.code} className="text-xs">{e.message}</p>)}
            </div>
          ))}
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
