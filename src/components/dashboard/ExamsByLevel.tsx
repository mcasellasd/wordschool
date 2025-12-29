'use client';

import React from 'react';
import { EnglishLevel } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ExamsByLevelProps {
  examsByLevel: {
    level: EnglishLevel;
    count: number;
    pending: number;
  }[];
}

const ExamsByLevel: React.FC<ExamsByLevelProps> = ({ examsByLevel }) => {
  const LEVEL_COLORS = {
    [EnglishLevel.A2]: '#2ecc71',
    [EnglishLevel.B1]: '#f39c12',
    [EnglishLevel.B2]: '#e74c3c',
  };

  const chartData = examsByLevel.map((item) => ({
    level: item.level,
    totals: item.count,
    pendents: item.pending,
    corregits: item.count - item.pending,
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Exàmens per Nivell
        </h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span className="text-gray-600">Corregits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-500"></div>
            <span className="text-gray-600">Pendents</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="level"
            tick={{ fill: '#6b7280' }}
            tickLine={{ stroke: '#6b7280' }}
          />
          <YAxis tick={{ fill: '#6b7280' }} tickLine={{ stroke: '#6b7280' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar dataKey="corregits" fill="#10b981" name="Corregits" radius={[4, 4, 0, 0]} />
          <Bar dataKey="pendents" fill="#f59e0b" name="Pendents" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {examsByLevel.map((item) => (
          <div
            key={item.level}
            className="p-4 rounded-lg border"
            style={{ borderColor: LEVEL_COLORS[item.level] + '40' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: LEVEL_COLORS[item.level] }}
              />
              <span className="font-semibold text-gray-900">{item.level}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{item.count}</p>
            <p className="text-sm text-gray-500">
              {item.pending} pendents
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamsByLevel;

