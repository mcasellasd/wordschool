'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  Users,
  Calendar,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
} from 'lucide-react';
import Header from '@/components/layout/Header';

interface Exam {
  id: string;
  title: string;
  level: string;
  status: string;
  totalPoints: number;
  dueDate: string | null;
  createdAt: string;
  teacher: {
    name: string;
    surname: string | null;
    email: string;
  };
  course: {
    name: string;
    level: string;
  } | null;
  submissions: Array<{
    id: string;
    status: string;
    totalScore: number | null;
    submittedAt: string;
    gradedAt: string | null;
    student: {
      id: string;
      name: string;
      surname: string | null;
      email: string;
      currentLevel: string | null;
    };
  }>;
  _count: {
    submissions: number;
  };
}

export default function ExamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchExam(params.id as string);
    }
  }, [params.id]);

  const fetchExam = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/exams/${id}`);
      if (response.ok) {
        const data = await response.json();
        setExam(data);
      } else {
        setError('Examen no trobat');
      }
    } catch (err) {
      setError('Error al carregar l\'examen');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
      uploaded: { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Pujat' },
      ocr_processing: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
        label: 'Processant OCR',
      },
      ocr_completed: {
        color: 'bg-blue-100 text-blue-800',
        icon: FileText,
        label: 'OCR Completat',
      },
      needs_review: {
        color: 'bg-orange-100 text-orange-800',
        icon: AlertCircle,
        label: 'Necessita Revisió',
      },
      ready_to_grade: {
        color: 'bg-indigo-100 text-indigo-800',
        icon: Clock,
        label: 'Preparat per Corregir',
      },
      graded: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Corregit' },
    };

    const config = statusConfig[status] || statusConfig.uploaded;
    const Icon = config.icon;

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'A2':
        return 'bg-blue-100 text-blue-800';
      case 'B1':
        return 'bg-green-100 text-green-800';
      case 'B2':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Carregant examen...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">{error || 'Examen no trobat'}</p>
            <Link
              href="/exams"
              className="inline-block mt-4 text-indigo-600 hover:text-indigo-700"
            >
              Tornar a la llista d'exàmens
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const gradedSubmissions = exam.submissions.filter((s) => s.status === 'graded');
  const averageScore =
    gradedSubmissions.length > 0
      ? gradedSubmissions.reduce((sum, s) => sum + (s.totalScore || 0), 0) /
        gradedSubmissions.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/exams"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Tornar a exàmens
          </Link>
        </div>

        {/* Informació Principal */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{exam.title}</h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelBadgeColor(
                    exam.level
                  )}`}
                >
                  Nivell {exam.level}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Professor:</span> {exam.teacher.name}{' '}
                  {exam.teacher.surname || ''}
                </div>
                {exam.course && (
                  <div>
                    <span className="font-medium">Curs:</span> {exam.course.name}
                  </div>
                )}
                {exam.dueDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Data límit:{' '}
                      {new Date(exam.dueDate).toLocaleDateString('ca-ES')}
                    </span>
                  </div>
                )}
                <div>
                  <span className="font-medium">Punts totals:</span> {exam.totalPoints}
                </div>
              </div>
            </div>
            <Link
              href={`/exams/${exam.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <Edit className="w-5 h-5" />
              Editar
            </Link>
          </div>
        </div>

        {/* Estadístiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-indigo-600" />
              <h3 className="font-semibold text-gray-900">Alumnes Participants</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{exam._count.submissions}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-gray-900">Corregits</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{gradedSubmissions.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Mitjana</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {averageScore > 0 ? averageScore.toFixed(1) : '-'}
            </p>
          </div>
        </div>

        {/* Llista d'Alumnes */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Alumnes que han pujat l'examen</h2>
          {exam.submissions.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              Encara cap alumne ha pujat aquest examen
            </p>
          ) : (
            <div className="space-y-4">
              {exam.submissions.map((submission) => (
                <Link
                  key={submission.id}
                  href={`/students/${submission.student.id}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {submission.student.name} {submission.student.surname || ''}
                        </h3>
                        <p className="text-sm text-gray-600">{submission.student.email}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>
                            Pujat:{' '}
                            {new Date(submission.submittedAt).toLocaleDateString('ca-ES')}
                          </span>
                          {submission.totalScore !== null && (
                            <span className="font-semibold text-indigo-600">
                              Nota: {submission.totalScore} / {exam.totalPoints}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>{getStatusBadge(submission.status)}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

