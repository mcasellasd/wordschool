'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from 'lucide-react';

export default function SettingsPage() {
  const settingsSections = [
    {
      title: 'Perfil',
      icon: User,
      items: [
        { label: 'Nom', value: 'Usuari', editable: true },
        { label: 'Email', value: 'usuari@example.com', editable: true },
        { label: 'Rol', value: 'Professor', editable: false },
      ],
    },
    {
      title: 'Notificacions',
      icon: Bell,
      items: [
        { label: 'Notificacions per email', value: 'Activat', editable: true },
        { label: 'Notificacions push', value: 'Desactivat', editable: true },
        { label: 'Recordatoris de correcció', value: 'Activat', editable: true },
      ],
    },
    {
      title: 'Seguretat',
      icon: Shield,
      items: [
        { label: 'Canviar contrasenya', value: '••••••••', editable: true },
        { label: 'Autenticació de dos factors', value: 'Desactivat', editable: true },
      ],
    },
    {
      title: 'Aparença',
      icon: Palette,
      items: [
        { label: 'Tema', value: 'Clar', editable: true },
        { label: 'Idioma', value: 'Català', editable: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { label: 'Configuració', href: undefined },
          ]}
        />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configuració</h1>
          <p className="text-gray-600 mt-2">
            Gestiona la teva configuració personal i preferències
          </p>
        </div>

        <div className="space-y-6">
          {settingsSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.label}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{item.value}</p>
                      </div>
                      {item.editable && (
                        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                          Editar
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


