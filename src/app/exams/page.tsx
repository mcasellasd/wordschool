'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import PendingExamsList from '@/components/dashboard/PendingExamsList';

export default function ExamsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { label: 'Exàmens', href: undefined },
          ]}
        />
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Exàmens</h1>
          <p className="text-gray-600 mt-1">
            Gestiona i corregeix tots els examens pujats
          </p>
        </div>
        <PendingExamsList />
      </div>
    </div>
  );
}



