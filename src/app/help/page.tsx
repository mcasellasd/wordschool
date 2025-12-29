'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { HelpCircle, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default function HelpPage() {
  const sections = [
    {
      title: 'Com Pujar un Examen',
      icon: Upload,
      content: [
        'Navega a la pàgina "Pujar Examen" des del menú',
        'Selecciona o arrossega la imatge del teu examen',
        'Opcional: Selecciona el nivell d\'examen (A2, B1, B2)',
        'Clic a "Pujar Examen" i espera el processament',
        'L\'OCR processarà automàticament la imatge',
      ],
    },
    {
      title: 'Format de Fitxers',
      icon: FileText,
      content: [
        'Formats acceptats: JPG, JPEG, PNG',
        'Mida màxima: 10MB per fitxer',
        'Assegura\'t que la imatge està ben il·luminada',
        'El text ha de ser clar i llegible',
        'Evita ombres o reflexos sobre el paper',
      ],
    },
    {
      title: 'Correcció d\'Exàmens',
      icon: CheckCircle,
      content: [
        'Els examens apareixen a la llista de "Pendents"',
        'Clic a "Corregir" per obrir l\'examen',
        'Revisa el text extret per OCR si cal',
        'Assigna puntuacions i feedback',
        'El sistema aprèn del teu estil de correcció',
      ],
    },
    {
      title: 'Problemes Comuns',
      icon: AlertCircle,
      content: [
        'Si l\'OCR no detecta bé el text, revisa la qualitat de la imatge',
        'Assegura\'t que el fitxer no supera els 10MB',
        'Verifica que el format sigui JPG, JPEG o PNG',
        'Si tens problemes, contacta amb el suport',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { label: 'Ajuda', href: undefined },
          ]}
        />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Centre d'Ajuda</h1>
          <p className="text-gray-600 mt-2">
            Troba respostes a les teves preguntes i aprèn a utilitzar WordSchool
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-2">
                  {section.content.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start gap-2 text-gray-700"
                    >
                      <span className="text-primary-600 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}



