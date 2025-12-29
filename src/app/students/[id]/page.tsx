'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Mail,
  BookOpen,
  Calendar,
  Edit,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import Header from '@/components/layout/Header';

interface Student {
  id: string;
  email: string;
  name: string;
  surname: string | null;
  currentLevel: string | null;
  avatar: string | null;
  createdAt: string;
  examSubmissions: ExamSubmission[];
  courses: CourseStudent[];
}

interface ExamSubmission {
  id: string;
  status: string;
  totalScore: number | null;
  submittedAt: string;
  gradedAt: string | null;
  exam: {
    id: string;
    title: string;
    level: string;
    totalPoints: number;
    teacher: {
      name: string;
      email: string;
    };
  };
}

interface CourseStudent {
  course: {
    id: string;
    name: string;
    level: string;
    teacher: {
      name: string;
      email: string;
    };
  };
  enrolledAt: string;
}

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchStudent(params.id as string);
    }
  }, [params.id]);

  const fetchStudent = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/students/${id}`);
      if (response.ok) {
        const data = await response.json();
        setStudent(data);
      } else {
        setError('Alumne no trobat');
      }
    } catch (err) {
      setError('Error al carregar l\'alumne');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getLevelBadgeColor = (level: string | null) => {
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

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
      uploaded: { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Pujat' },
      ocr_processing: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Processant OCR' },
      ocr_completed: { color: 'bg-blue-100 text-blue-800', icon: FileText, label: 'OCR Completat' },
      needs_review: { color: 'bg-orange-100 text-orange-800', icon: AlertCircle, label: 'Necessita Revisió' },
      ready_to_grade: { color: 'bg-indigo-100 text-indigo-800', icon: Clock, label: 'Preparat per Corregir' },
      graded: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Corregit' },
    };

    const config = statusConfig[status] || statusConfig.uploaded;
    const Icon = config.icon;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Carregant alumne...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">{error || 'Alumne no trobat'}</p>
            <Link
              href="/students"
              className="inline-block mt-4 text-indigo-600 hover:text-indigo-700"
            >
              Tornar a la llista d'alumnes
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const completedExams = student.examSubmissions.filter((s) => s.status === 'graded');
  const averageScore =
    completedExams.length > 0
      ? completedExams.reduce((sum, s) => sum + (s.totalScore || 0), 0) / completedExams.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/students"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Tornar a alumnes
          </Link>
        </div>

        {/* Informació Principal */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {student.name} {student.surname || ''}
                </h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    <span>{student.email}</span>
                  </div>
                  {student.currentLevel && (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelBadgeColor(
                        student.currentLevel
                      )}`}
                    >
                      Nivell {student.currentLevel}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Link
              href={`/students/${student.id}/edit`}
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
              <FileText className="w-6 h-6 text-indigo-600" />
              <h3 className="font-semibold text-gray-900">Total Exàmens</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{student.examSubmissions.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-gray-900">Exàmens Corregits</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{completedExams.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Mitjana</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {averageScore > 0 ? averageScore.toFixed(1) : '-'}
            </p>
          </div>
        </div>

        {/* Exàmens */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Exàmens</h2>
          {student.examSubmissions.length === 0 ? (
            <p className="text-gray-600 text-center py-8">Encara no hi ha exàmens pujats</p>
          ) : (
            <div className="space-y-4">
              {student.examSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {submission.exam.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span>Nivell: {submission.exam.level}</span>
                        <span>Professor: {submission.exam.teacher.name}</span>
                        <span>
                          Pujat: {new Date(submission.submittedAt).toLocaleDateString('ca-ES')}
                        </span>
                      </div>
                      {submission.totalScore !== null && (
                        <p className="text-lg font-bold text-indigo-600">
                          Nota: {submission.totalScore} / {submission.exam.totalPoints}
                        </p>
                      )}
                    </div>
                    <div>{getStatusBadge(submission.status)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cursos */}
        {student.courses.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cursos</h2>
            <div className="space-y-4">
              {student.courses.map((cs, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{cs.course.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Nivell: {cs.course.level}</span>
                    <span>Professor: {cs.course.teacher.name}</span>
                    <span>
                      Inscrit: {new Date(cs.enrolledAt).toLocaleDateString('ca-ES')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

