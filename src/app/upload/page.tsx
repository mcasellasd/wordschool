'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ExamUpload from '@/components/exams/ExamUpload';
import LevelFilter from '@/components/dashboard/LevelFilter';
import Header from '@/components/layout/Header';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { EnglishLevel } from '@/types';
import {
  FileText,
  HelpCircle,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';

export default function UploadPage() {
  const [selectedLevel, setSelectedLevel] = useState<EnglishLevel | 'all'>('all');
  const router = useRouter();

  const handleUploadSuccess = (submissionId: string) => {
    // Redirigir al dashboard després de 2 segons
    setTimeout(() => {
      router.push('/?uploaded=true');
    }, 2000);
  };

  const quickLinks = [
    {
      title: 'Veure Exàmens',
      description: 'Consulta tots els teus examens pujats',
      href: '/exams',
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Ajuda',
      description: 'Guia i instruccions d\'ús',
      href: '/help',
      icon: HelpCircle,
      color: 'bg-green-500',
    },
  ];

  const tips = [
    {
      icon: ImageIcon,
      text: 'Assegura\'t que la imatge està ben il·luminada i nítida',
    },
    {
      icon: CheckCircle,
      text: 'El text ha de ser clar i llegible per obtenir millors resultats d\'OCR',
    },
    {
      icon: AlertCircle,
      text: 'Evita ombres o reflexos sobre el paper',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header amb Navegació */}
      <Header
        showLevelFilter={true}
        selectedLevel={selectedLevel}
        onLevelChange={setSelectedLevel}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Pujar Examen', href: undefined },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Principal - Pujada */}
          <div className="lg:col-span-2">
            {/* Header de la Pàgina */}
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
                    Pujar Examen
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Puja una imatge del teu examen en format JPG, JPEG o PNG
                  </p>
                </div>
              </div>

              {/* Filtre de Nivell */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivell d'Examen (opcional)
                </label>
                <LevelFilter
                  selectedLevel={selectedLevel}
                  onLevelChange={setSelectedLevel}
                  showAll={true}
                />
              </div>
            </div>

            {/* Component de Pujada */}
            <ExamUpload
              level={selectedLevel !== 'all' ? selectedLevel : undefined}
              onUploadSuccess={handleUploadSuccess}
            />
          </div>

          {/* Sidebar - Informació i Enllaços */}
          <div className="lg:col-span-1 space-y-6">
            {/* Enllaços Ràpids */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Enllaços Ràpids
              </h3>
              <div className="space-y-3">
                {quickLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={index}
                      href={link.href}
                      className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                    >
                      <div
                        className={`${link.color} p-2 rounded-lg text-white flex-shrink-0`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-700">
                          {link.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {link.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Consells */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                💡 Consells
              </h3>
              <ul className="space-y-3">
                {tips.map((tip, index) => {
                  const Icon = tip.icon;
                  return (
                    <li key={index} className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">{tip.text}</p>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Informació Adicional */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                ℹ️ Informació
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="font-medium">Format:</span>
                  <span>JPG, JPEG, PNG</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">Mida màxima:</span>
                  <span>10 MB</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">Processament:</span>
                  <span>OCR automàtic després de pujar</span>
                </li>
              </ul>
            </div>

            {/* Enllaç al Dashboard */}
            <Link
              href="/"
              className="block w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center text-sm font-medium"
            >
              Tornar al Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

