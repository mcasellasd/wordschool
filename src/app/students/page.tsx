'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, User, Mail, BookOpen, Filter } from 'lucide-react';
import Header from '@/components/layout/Header';
import LevelFilter from '@/components/dashboard/LevelFilter';
import { EnglishLevel } from '@/types';

interface Student {
  id: string;
  email: string;
  name: string;
  surname: string | null;
  currentLevel: string | null;
  examSubmissions: any[];
  courses: any[];
}

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<EnglishLevel | 'all'>('all');

  useEffect(() => {
    fetchStudents();
  }, [selectedLevel, search]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedLevel !== 'all') {
        params.append('level', selectedLevel);
      }
      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/students?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Alumnes</h1>
              <p className="text-gray-600 mt-1">
                Gestiona els alumnes i els seus nivells
              </p>
            </div>
            <Link
              href="/students/new"
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus className="w-5 h-5" />
              Nou Alumne
            </Link>
          </div>

          {/* Filtres i Cerca */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cercar per nom, cognom o email..."
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
            </div>
          </div>
        </div>

        {/* Llista d'Alumnes */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Carregant alumnes...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No s'han trobat alumnes</p>
            <Link
              href="/students/new"
              className="inline-block mt-4 text-indigo-600 hover:text-indigo-700"
            >
              Afegir el primer alumne
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <Link
                key={student.id}
                href={`/students/${student.id}`}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {student.name} {student.surname || ''}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {student.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  {student.currentLevel && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelBadgeColor(
                        student.currentLevel
                      )}`}
                    >
                      {student.currentLevel}
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span>{student.examSubmissions.length} exàmens</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

