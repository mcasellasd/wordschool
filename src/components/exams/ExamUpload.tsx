'use client';

import React, { useState, useCallback } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { EnglishLevel } from '@/types';
import axios from 'axios';

interface ExamUploadProps {
  examId?: string;
  studentId?: string;
  level?: EnglishLevel;
  onUploadSuccess?: (submissionId: string) => void;
}

const ExamUpload: React.FC<ExamUploadProps> = ({
  examId,
  studentId,
  level,
  onUploadSuccess,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    // Validar tipus de fitxer
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return 'Només es permeten fitxers JPG, JPEG o PNG';
    }

    // Validar mida (màxim 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return 'El fitxer és massa gran. Màxim 10MB';
    }

    return null;
  };

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }

    setError(null);
    setSelectedFile(file);
    setSuccess(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError(null);
    setSuccess(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);
    setSuccess(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('examImage', selectedFile);
      
      if (examId) {
        formData.append('examId', examId);
      }
      if (studentId) {
        formData.append('studentId', studentId);
      }
      if (level) {
        formData.append('level', level);
      }

      const response = await axios.post('/api/exam-submissions/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        },
      });

      setSuccess('Examen pujat correctament! Processant OCR...');
      setSelectedFile(null);
      setUploadProgress(100);

      if (onUploadSuccess && response.data.submissionId) {
        onUploadSuccess(response.data.submissionId);
      }

      // Reset després de 3 segons
      setTimeout(() => {
        setSuccess(null);
        setUploadProgress(0);
      }, 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        err.message ||
        'Error al pujar l\'examen. Torna a intentar-ho.'
      );
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Pujar Examen
        </h3>

        {/* Zona de Drag & Drop */}
        {!selectedFile && !success && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Upload
              className={`w-12 h-12 mx-auto mb-4 ${
                isDragging ? 'text-primary-500' : 'text-gray-400'
              }`}
            />
            <p className="text-gray-600 mb-2">
              Arrossega l'examen aquí o fes clic per seleccionar
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Formats acceptats: JPG, JPEG, PNG (màx. 10MB)
            </p>
            <label className="inline-block">
              <span className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer transition-colors">
                Seleccionar Fitxer
              </span>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Fitxer Seleccionat */}
        {selectedFile && !uploading && !success && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-gray-100 rounded">
                  <Upload className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Eliminar fitxer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleUpload}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Pujar Examen
              </button>
              <button
                onClick={handleRemoveFile}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel·lar
              </button>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {uploading && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Pujant...</span>
              <span className="text-sm text-gray-600">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Missatge d'Èxit */}
        {success && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {/* Missatge d'Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Informació addicional */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            📋 Instruccions
          </h4>
          <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
            <li>Assegura't que la imatge està ben il·luminada i nítida</li>
            <li>El text ha de ser clar i llegible</li>
            <li>Evita ombres o reflexos sobre el paper</li>
            <li>Després de pujar, l'OCR processarà automàticament la imatge</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExamUpload;

