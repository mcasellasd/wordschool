'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, FileText } from 'lucide-react';
import Header from '@/components/layout/Header';
import { EnglishLevel } from '@/types';

export default function EditExamPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    level: '' as EnglishLevel | '',
    totalPoints: 100,
    oxfordReference: '',
    status: 'draft' as 'draft' | 'published' | 'closed',
    dueDate: '',
  });

  useEffect(() => {
    if (params.id) {
      fetchExam(params.id as string);
    }
  }, [params.id]);

  const fetchExam = async (id: string) => {
    try {
      const response = await fetch(`/api/exams/${id}`);
      if (response.ok) {
        const exam = await response.json();
        setFormData({
          title: exam.title || '',
          courseId: exam.courseId || '',
          level: (exam.level as EnglishLevel) || '',
          totalPoints: exam.totalPoints || 100,
          oxfordReference: exam.oxfordReference || '',
          status: exam.status || 'draft',
          dueDate: exam.dueDate
            ? new Date(exam.dueDate).toISOString().split('T')[0]
            : '',
        });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const response = await fetch(`/api/exams/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          courseId: formData.courseId || null,
          oxfordReference: formData.oxfordReference || null,
          dueDate: formData.dueDate || null,
        }),
      });

      if (response.ok) {
        router.push(`/exams/${params.id}`);
      } else {
        const data = await response.json();
        setError(data.error || 'Error al actualitzar l\'examen');
      }
    } catch (err) {
      setError('Error de connexió. Torna a intentar-ho.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Carregant examen...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href={`/exams/${params.id}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Tornar a l'examen
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Examen</h1>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Títol de l'Examen *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="level"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nivell *
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="">Selecciona un nivell</option>
                  <option value={EnglishLevel.A2}>A2</option>
                  <option value={EnglishLevel.B1}>B1</option>
                  <option value={EnglishLevel.B2}>B2</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="totalPoints"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Punts Totals
                </label>
                <input
                  type="number"
                  id="totalPoints"
                  name="totalPoints"
                  value={formData.totalPoints}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Estat
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="draft">Esborrany</option>
                  <option value="published">Publicat</option>
                  <option value="closed">Tancat</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Data Límit (opcional)
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="oxfordReference"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Referència Oxford (opcional)
              </label>
              <input
                type="text"
                id="oxfordReference"
                name="oxfordReference"
                value={formData.oxfordReference}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
              <Link
                href={`/exams/${params.id}`}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition"
              >
                Cancel·lar
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Desant...' : 'Desar Canvis'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

