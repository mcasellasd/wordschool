'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, FileText, Users, Calendar, Search, Filter } from 'lucide-react';
import Header from '@/components/layout/Header';
import LevelFilter from '@/components/dashboard/LevelFilter';
import { EnglishLevel } from '@/types';

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
  };
  course: {
    name: string;
    level: string;
  } | null;
  _count: {
    submissions: number;
  };
  submissions: Array<{
    student: {
      id: string;
      name: string;
      surname: string | null;
    };
  }>;
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<EnglishLevel | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    fetchExams();
  }, [selectedLevel, selectedStatus]);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedLevel !== 'all') {
        params.append('level', selectedLevel);
      }
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus);
      }

      const response = await fetch(`/api/exams?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setExams(data);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  const filteredExams = exams.filter((exam) => {
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        exam.title.toLowerCase().includes(searchLower) ||
        exam.teacher.name.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Exàmens</h1>
              <p className="text-gray-600 mt-1">
                Gestiona els exàmens i visualitza els alumnes relacionats
              </p>
            </div>
            <Link
              href="/exams/new"
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus className="w-5 h-5" />
              Nou Examen
            </Link>
          </div>

          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cercar per títol o professor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <LevelFilter
                selectedLevel={selectedLevel}
                onLevelChange={setSelectedLevel}
                showAll={true}
              />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="all">Tots els estats</option>
                <option value="draft">Esborrany</option>
                <option value="published">Publicat</option>
                <option value="closed">Tancat</option>
              </select>
            </div>
          </div>
        </div>

        {/* Llista d'Exàmens */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Carregant exàmens...</p>
          </div>
        ) : filteredExams.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No s'han trobat exàmens</p>
            <Link
              href="/exams/new"
              className="inline-block mt-4 text-indigo-600 hover:text-indigo-700"
            >
              Crear el primer examen
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => (
              <Link
                key={exam.id}
                href={`/exams/${exam.id}`}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{exam.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelBadgeColor(
                          exam.level
                        )}`}
                      >
                        {exam.level}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                          exam.status
                        )}`}
                      >
                        {exam.status === 'published'
                          ? 'Publicat'
                          : exam.status === 'draft'
                          ? 'Esborrany'
                          : 'Tancat'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>
                      {exam._count.submissions} alumne{exam._count.submissions !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {exam.course && (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>{exam.course.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span>Professor: {exam.teacher.name}</span>
                  </div>
                  {exam.dueDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Data límit:{' '}
                        {new Date(exam.dueDate).toLocaleDateString('ca-ES')}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
