'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ExamUpload from '@/components/exams/ExamUpload';
import Header from '@/components/layout/Header';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { FileText, HelpCircle, ArrowLeft, User, CheckCircle } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  surname: string | null;
  email: string;
}

interface Exam {
  id: string;
  title: string;
  level: string;
}

export default function UploadPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [examTitle, setExamTitle] = useState<string>('');
  const [examLevel, setExamLevel] = useState<string>('');
  const [creatingExam, setCreatingExam] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingExams, setLoadingExams] = useState(true);

  useEffect(() => {
    fetchStudents();
    fetchExams();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchExams = async () => {
    try {
      const response = await fetch('/api/exams');
      if (response.ok) {
        const data = await response.json();
        setExams(data);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoadingExams(false);
    }
  };

  const handleFileUploaded = (fileUrl: string, fileName: string) => {
    setUploadedFileUrl(fileUrl);
    setUploadedFileName(fileName);
  };

  const handleCreateExam = async () => {
    if (!examTitle || !examLevel) {
      setError('El títol i el nivell són obligatoris');
      return;
    }

    setCreatingExam(true);
    setError('');

    try {
      const response = await fetch('/api/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: examTitle,
          level: examLevel,
          status: 'published',
          totalPoints: 100,
        }),
      });

      if (response.ok) {
        const newExam = await response.json();
        setExams([...exams, newExam]);
        setSelectedExamId(newExam.id);
        setCreatingExam(false);
        setExamTitle('');
        setExamLevel('');
      } else {
        const data = await response.json();
        setError(data.error || 'Error al crear l\'examen');
      }
    } catch (err) {
      setError('Error de connexió. Torna a intentar-ho.');
    } finally {
      setCreatingExam(false);
    }
  };

  const handleSaveSubmission = async () => {
    if (!uploadedFileUrl || !selectedStudentId || !selectedExamId) {
      setError('Has de seleccionar un alumne i un examen');
      return;
    }

    setSaving(true);
    setError('');

    try {
      // Crear la submission a la base de dades
      const response = await fetch('/api/exam-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          examId: selectedExamId,
          studentId: selectedStudentId,
          imageUrl: uploadedFileUrl,
          status: 'uploaded',
          ocrProcessed: false,
        }),
      });

      if (response.ok) {
        // Redirigir al dashboard
        router.push('/?uploaded=true');
      } else {
        const data = await response.json();
        setError(data.error || 'Error al guardar l\'examen');
      }
    } catch (err) {
      setError('Error de connexió. Torna a intentar-ho.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setUploadedFileUrl(null);
    setUploadedFileName(null);
    setSelectedStudentId('');
    setSelectedExamId('');
    setExamTitle('');
    setExamLevel('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { label: 'Pujar Examen', href: undefined },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Principal */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <Link
                  href="/"
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Tornar al dashboard"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Pujar Examen d'Alumne
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Puja la imatge JPEG de l'examen i després assigna'l a un alumne
                  </p>
                </div>
              </div>
            </div>

            {/* Pas 1: Pujar Fitxer */}
            {!uploadedFileUrl && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Pas 1: Puja la imatge de l'examen (JPEG)
                </h2>
                <ExamUpload
                  onFileUploaded={handleFileUploaded}
                />
              </div>
            )}

            {/* Pas 2: Assignar a Alumne i Examen */}
            {uploadedFileUrl && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Pas 2: Assigna l'examen a un alumne
                  </h2>
                  <button
                    onClick={handleReset}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Pujar altre fitxer
                  </button>
                </div>

                {uploadedFileName && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-900">
                        Fitxer pujat correctament
                      </p>
                      <p className="text-xs text-green-700">{uploadedFileName}</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Selecció d'Alumne */}
                  <div>
                    <label
                      htmlFor="student"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      <User className="w-4 h-4 inline mr-2" />
                      Alumne *
                    </label>
                    {loadingStudents ? (
                      <div className="text-sm text-gray-500">Carregant alumnes...</div>
                    ) : (
                      <select
                        id="student"
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      >
                        <option value="">Selecciona un alumne</option>
                        {students.map((student) => (
                          <option key={student.id} value={student.id}>
                            {student.name} {student.surname || ''} ({student.email})
                          </option>
                        ))}
                      </select>
                    )}
                    {students.length === 0 && !loadingStudents && (
                      <p className="text-sm text-gray-500 mt-2">
                        No hi ha alumnes registrats.{' '}
                        <Link href="/students/new" className="text-indigo-600 hover:underline">
                          Afegir un alumne
                        </Link>
                      </p>
                    )}
                  </div>

                  {/* Crear o Seleccionar Examen */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="w-4 h-4 inline mr-2" />
                      Examen *
                    </label>
                    
                    <div className="space-y-4">
                      {/* Opció: Crear nou examen */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">
                          Crear nou examen
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">
                              Títol *
                            </label>
                            <input
                              type="text"
                              value={examTitle}
                              onChange={(e) => setExamTitle(e.target.value)}
                              placeholder="Ex: Examen A2 - Unit 3"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">
                              Nivell *
                            </label>
                            <select
                              value={examLevel}
                              onChange={(e) => setExamLevel(e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            >
                              <option value="">Selecciona nivell</option>
                              <option value="A2">A2</option>
                              <option value="B1">B1</option>
                              <option value="B2">B2</option>
                            </select>
                          </div>
                        </div>
                        <button
                          onClick={handleCreateExam}
                          disabled={creatingExam || !examTitle || !examLevel}
                          className="mt-3 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {creatingExam ? 'Creant...' : 'Crear Examen'}
                        </button>
                      </div>

                      {/* Opció: Seleccionar examen existent */}
                      {exams.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-2">
                            O selecciona un examen existent
                          </h3>
                          {loadingExams ? (
                            <div className="text-sm text-gray-500">Carregant exàmens...</div>
                          ) : (
                            <select
                              value={selectedExamId}
                              onChange={(e) => setSelectedExamId(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            >
                              <option value="">Selecciona un examen</option>
                              {exams.map((exam) => (
                                <option key={exam.id} value={exam.id}>
                                  {exam.title} ({exam.level})
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botó de Guardar */}
                  <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 text-gray-700 hover:text-gray-900 transition"
                    >
                      Cancel·lar
                    </button>
                    <button
                      onClick={handleSaveSubmission}
                      disabled={saving || !selectedStudentId || !selectedExamId}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Guardant...' : 'Guardar Examen'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ℹ️ Informació
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="font-medium">Format:</span>
                  <span>JPEG, JPG, PNG</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">Mida màxima:</span>
                  <span>10 MB</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">Processament:</span>
                  <span>OCR automàtic després de guardar</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Enllaços Ràpids
              </h3>
              <div className="space-y-3">
                <Link
                  href="/exams"
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
                >
                  <div className="bg-blue-500 p-2 rounded-lg text-white flex-shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-indigo-700">
                      Veure Exàmens
                    </h4>
                  </div>
                </Link>
                <Link
                  href="/students"
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
                >
                  <div className="bg-green-500 p-2 rounded-lg text-white flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-indigo-700">
                      Veure Alumnes
                    </h4>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
