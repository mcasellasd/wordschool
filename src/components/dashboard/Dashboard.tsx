'use client';

import React, { useState, useEffect } from 'react';
import { DashboardStats, EnglishLevel } from '@/types';
import Header from '@/components/layout/Header';
import StatsCards from './StatsCards';
import ExamsByLevel from './ExamsByLevel';
import PendingExamsList from './PendingExamsList';
import RecentActivity from './RecentActivity';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<EnglishLevel | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'exams' | 'students' | 'learning'>('overview');

  useEffect(() => {
    fetchDashboardData();
  }, [selectedLevel]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const params = selectedLevel !== 'all' ? { level: selectedLevel } : {};
      const response = await axios.get('/api/dashboard', { params });
      setStats(response.data);
    } catch (error) {
      console.error('Error carregant dades del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header amb Navegació */}
      <Header
        showLevelFilter={true}
        selectedLevel={selectedLevel}
        onLevelChange={setSelectedLevel}
      />

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Vista General', icon: '📊' },
              { id: 'exams', label: 'Exàmens', icon: '📝' },
              { id: 'students', label: 'Alumnes', icon: '👥' },
              { id: 'learning', label: 'Aprenentatge', icon: '🤖' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <StatsCards stats={stats} />

            {/* Charts and Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Exams by Level */}
              <div className="lg:col-span-2">
                <ExamsByLevel examsByLevel={stats.examsByLevel} />
              </div>

              {/* Recent Activity */}
              <div className="lg:col-span-1">
                <RecentActivity activities={stats.recentActivity} />
              </div>
            </div>

            {/* Pending Exams */}
            <div className="mt-6">
              <PendingExamsList level={selectedLevel !== 'all' ? selectedLevel : undefined} />
            </div>
          </div>
        )}

        {activeTab === 'exams' && (
          <div>
            <PendingExamsList level={selectedLevel !== 'all' ? selectedLevel : undefined} />
          </div>
        )}

        {activeTab === 'students' && (
          <div>
            <p className="text-gray-500">Gestió d'alumnes - En desenvolupament</p>
          </div>
        )}

        {activeTab === 'learning' && (
          <div>
            <p className="text-gray-500">Dashboard d'aprenentatge - En desenvolupament</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

