'use client';

import React from 'react';
import { EnglishLevel } from '@/types';

interface LevelFilterProps {
  selectedLevel: EnglishLevel | 'all';
  onLevelChange: (level: EnglishLevel | 'all') => void;
  showAll?: boolean;
}

const LEVEL_INFO = {
  A2: {
    name: 'Nivell A2',
    subtitle: 'Usuari Bàsic',
    color: '#2ecc71',
    description: 'Expressions quotidianes',
  },
  B1: {
    name: 'Nivell B1',
    subtitle: 'Usuari Independent',
    color: '#f39c12',
    description: 'Textos familiars',
  },
  B2: {
    name: 'Nivell B2',
    subtitle: 'Usuari Avançat',
    color: '#e74c3c',
    description: 'Textos complexos',
  },
};

const LevelFilter: React.FC<LevelFilterProps> = ({
  selectedLevel,
  onLevelChange,
  showAll = false,
}) => {
  return (
    <div className="flex items-center gap-2">
      {showAll && (
        <button
          onClick={() => onLevelChange('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedLevel === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tots
        </button>
      )}
      {Object.values(EnglishLevel).map((level) => {
        const info = LEVEL_INFO[level];
        return (
          <button
            key={level}
            onClick={() => onLevelChange(level)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              selectedLevel === level
                ? 'bg-white text-gray-900 shadow-sm border-2'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent'
            }`}
            style={
              selectedLevel === level
                ? { borderColor: info.color }
                : undefined
            }
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: info.color }}
            />
            <span>{level}</span>
          </button>
        );
      })}
    </div>
  );
};

export default LevelFilter;

