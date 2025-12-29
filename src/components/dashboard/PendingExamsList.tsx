'use client';

import React, { useState, useEffect } from 'react';
import { ExamSubmission, EnglishLevel } from '@/types';
import axios from 'axios';
import { Clock, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';
// import Link from 'next/link'; // Comentat temporalment - implementar navegació després

interface PendingExamsListProps {
  level?: EnglishLevel;
}

const PendingExamsList: React.FC<PendingExamsListProps> = ({ level }) => {
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'needs_review' | 'graded'>('all');

  useEffect(() => {
    fetchSubmissions();
  }, [level, filter]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (level) params.level = level;
      if (filter !== 'all') {
        if (filter === 'pending') {
          params.status = 'ready_to_grade';
        } else if (filter === 'needs_review') {
          params.status = 'needs_review';
        } else if (filter === 'graded') {
          params.status = 'graded';
        }
      }
      
      const response = await axios.get('/api/exam-submissions', { params });
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error carregant submissió:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, needsReview: boolean) => {
    if (needsReview) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Revisió OCR
        </span>
      );
    }

    switch (status) {
      case 'ready_to_grade':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pendent
          </span>
        );
      case 'graded':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Corregit
          </span>
        );
      case 'ocr_processing':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            Processant OCR...
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getLevelColor = (level: EnglishLevel) => {
    const colors = {
      [EnglishLevel.A2]: '#2ecc71',
      [EnglishLevel.B1]: '#f39c12',
      [EnglishLevel.B2]: '#e74c3c',
    };
    return colors[level];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Exàmens Pujats
          </h3>
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'Tots' },
              { id: 'pending', label: 'Pendents' },
              { id: 'needs_review', label: 'Revisar OCR' },
              { id: 'graded', label: 'Corregits' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  filter === f.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {submissions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">No hi ha examens per mostrar</p>
          </div>
        ) : (
          submissions.map((submission) => (
            <div
              key={submission.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: getLevelColor(
                          submission.examTitle?.includes('A2')
                            ? EnglishLevel.A2
                            : submission.examTitle?.includes('B1')
                            ? EnglishLevel.B1
                            : EnglishLevel.B2
                        ),
                      }}
                    />
                    <h4 className="font-semibold text-gray-900">
                      {submission.examTitle || 'Examen sense títol'}
                    </h4>
                    {getStatusBadge(submission.status, submission.needsReview)}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Alumne:</span>
                      <span>{submission.studentName || 'Desconegut'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Pujat:</span>
                      <span>
                        {new Date(submission.submittedAt).toLocaleDateString(
                          'ca-ES'
                        )}
                      </span>
                    </div>
                    {submission.ocrConfidence && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Confiança OCR:</span>
                        <span
                          className={
                            submission.ocrConfidence > 0.8
                              ? 'text-green-600'
                              : submission.ocrConfidence > 0.6
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }
                        >
                          {(submission.ocrConfidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                    {submission.totalScore !== undefined && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Puntuació:</span>
                        <span className="font-semibold text-gray-900">
                          {submission.totalScore}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-4">
                  {submission.imageUrl && (
                    <a
                      href={submission.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Veure imatge"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </a>
                  )}
                  <button
                    onClick={() => {
                      // TODO: Implementar navegació a pàgina de correcció
                      console.log('Navegar a correcció:', submission.id);
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                  >
                    {submission.status === 'graded'
                      ? 'Veure Correcció'
                      : 'Corregir'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PendingExamsList;

