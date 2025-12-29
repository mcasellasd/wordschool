'use client';

import React from 'react';
import { DashboardStats } from '@/types';
import { FileText, Clock, CheckCircle, Users, GraduationCap } from 'lucide-react';

interface StatsCardsProps {
  stats: DashboardStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Exàmens Totals',
      value: stats.totalExams,
      icon: FileText,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Pendents de Corregir',
      value: stats.pendingGrading,
      icon: Clock,
      color: 'bg-yellow-500',
      change: stats.pendingGrading > 0 ? `${stats.pendingGrading} urgents` : 'Tot al dia',
      changeType: stats.pendingGrading > 0 ? 'negative' as const : 'positive' as const,
    },
    {
      title: 'Correccions Completades',
      value: stats.completedGrading,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'Alumnes',
      value: stats.totalStudents,
      icon: Users,
      color: 'bg-purple-500',
      change: '+5 nous',
      changeType: 'positive' as const,
    },
    {
      title: 'Professors',
      value: stats.totalTeachers,
      icon: GraduationCap,
      color: 'bg-indigo-500',
      change: 'Actius',
      changeType: 'neutral' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                <p
                  className={`text-xs mt-2 ${
                    card.changeType === 'positive'
                      ? 'text-green-600'
                      : card.changeType === 'negative'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}
                >
                  {card.change}
                </p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;

