'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Upload, FileText, Users, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import LevelFilter from '../dashboard/LevelFilter';
import { EnglishLevel } from '@/types';

interface HeaderProps {
  showLevelFilter?: boolean;
  selectedLevel?: EnglishLevel | 'all';
  onLevelChange?: (level: EnglishLevel | 'all') => void;
}

const Header: React.FC<HeaderProps> = ({
  showLevelFilter = false,
  selectedLevel,
  onLevelChange,
}) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Pujar Examen', href: '/upload', icon: Upload },
    { name: 'Exàmens', href: '/exams', icon: FileText },
    { name: 'Alumnes', href: '/students', icon: Users },
    { name: 'Configuració', href: '/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo i Títol */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="font-bold text-xl text-gray-900 hidden sm:inline">
                WordSchool
              </span>
            </Link>
          </div>

          {/* Navegació Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Filtre de Nivell (si s'especifica) */}
          {showLevelFilter && selectedLevel !== undefined && onLevelChange && (
            <div className="hidden md:flex items-center gap-4">
              <LevelFilter
                selectedLevel={selectedLevel}
                onLevelChange={onLevelChange}
                showAll={true}
              />
            </div>
          )}

          {/* Botó Menú Mòbil */}
          <div className="md:hidden flex items-center gap-2">
            {showLevelFilter && selectedLevel !== undefined && onLevelChange && (
              <div className="mr-2">
                <LevelFilter
                  selectedLevel={selectedLevel}
                  onLevelChange={onLevelChange}
                  showAll={true}
                />
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menú Mòbil */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${
                      isActive(item.href)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;


