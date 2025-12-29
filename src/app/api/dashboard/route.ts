import { NextResponse } from 'next/server';
import { DashboardStats, EnglishLevel, Activity } from '@/types';

// Mock data - En producció, això vindria de la base de dades
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level');

  const stats: DashboardStats = {
    totalExams: 45,
    pendingGrading: 12,
    completedGrading: 33,
    totalStudents: 128,
    totalTeachers: 8,
    examsByLevel: [
      {
        level: EnglishLevel.A2,
        count: 15,
        pending: 4,
      },
      {
        level: EnglishLevel.B1,
        count: 18,
        pending: 5,
      },
      {
        level: EnglishLevel.B2,
        count: 12,
        pending: 3,
      },
    ],
    recentActivity: [
      {
        id: '1',
        type: 'exam_graded',
        description: 'Examen de B1 corregit per Maria García',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        userId: 'user1',
        userName: 'Maria García',
      },
      {
        id: '2',
        type: 'submission_uploaded',
        description: 'Nou examen pujat per Joan Martínez',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        userId: 'user2',
        userName: 'Joan Martínez',
      },
      {
        id: '3',
        type: 'ocr_completed',
        description: 'OCR completat per examen A2',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        userId: 'system',
        userName: 'Sistema',
      },
      {
        id: '4',
        type: 'exam_created',
        description: 'Nou examen creat: "Test B2 - Unit 5"',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        userId: 'user3',
        userName: 'Anna López',
      },
      {
        id: '5',
        type: 'exam_graded',
        description: 'Examen de A2 corregit per Pere Sánchez',
        timestamp: new Date(Date.now() - 1000 * 60 * 90),
        userId: 'user4',
        userName: 'Pere Sánchez',
      },
    ],
  };

  // Filtrar per nivell si s'especifica
  if (level && level !== 'all') {
    const filteredLevel = level as EnglishLevel;
    stats.examsByLevel = stats.examsByLevel.filter(
      (e) => e.level === filteredLevel
    );
  }

  return NextResponse.json(stats);
}

