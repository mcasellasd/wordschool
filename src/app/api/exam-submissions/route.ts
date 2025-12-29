import { NextResponse } from 'next/server';
import { ExamSubmission, EnglishLevel } from '@/types';
import { prisma } from '@/lib/prisma';

// POST - Crear una nova submission
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { examId, studentId, imageUrl, status, ocrProcessed } = body;

    if (!examId || !studentId || !imageUrl) {
      return NextResponse.json(
        { error: 'examId, studentId i imageUrl són obligatoris' },
        { status: 400 }
      );
    }

    // Verificar que l'examen i l'alumne existeixen
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
    });

    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!exam) {
      return NextResponse.json(
        { error: 'Examen no trobat' },
        { status: 404 }
      );
    }

    if (!student) {
      return NextResponse.json(
        { error: 'Alumne no trobat' },
        { status: 404 }
      );
    }

    // Crear registre a la base de dades
    const submission = await prisma.examSubmission.create({
      data: {
        examId,
        studentId,
        imageUrl,
        status: status || 'uploaded',
        ocrProcessed: ocrProcessed || false,
      },
      include: {
        exam: {
          select: {
            title: true,
            level: true,
          },
        },
        student: {
          select: {
            name: true,
            surname: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error: any) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { error: 'Error al crear la submission' },
      { status: 500 }
    );
  }
}

// GET - Llista de submissions (mock data per ara)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const level = searchParams.get('level');

  const mockSubmissions: ExamSubmission[] = [
    {
      id: '1',
      examId: 'exam1',
      examTitle: 'Examen A2 - Unit 3',
      studentId: 'student1',
      studentName: 'Laura Fernández',
      imageUrl: '/uploads/exam1.jpg',
      ocrText: 'Resposta 1: The cat is on the table...',
      ocrConfidence: 0.92,
      ocrProcessed: true,
      needsReview: false,
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'ready_to_grade',
    },
    {
      id: '2',
      examId: 'exam2',
      examTitle: 'Examen B1 - Unit 5',
      studentId: 'student2',
      studentName: 'Marc Rodríguez',
      imageUrl: '/uploads/exam2.jpg',
      ocrText: 'Resposta amb errors d\'OCR...',
      ocrConfidence: 0.65,
      ocrProcessed: true,
      needsReview: true,
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
      status: 'needs_review',
    },
    {
      id: '3',
      examId: 'exam3',
      examTitle: 'Examen B2 - Unit 7',
      studentId: 'student3',
      studentName: 'Sara Martínez',
      imageUrl: '/uploads/exam3.jpg',
      ocrText: 'Resposta completa...',
      ocrConfidence: 0.88,
      ocrProcessed: true,
      needsReview: false,
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
      status: 'graded',
      gradedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      totalScore: 8.5,
    },
    {
      id: '4',
      examId: 'exam4',
      examTitle: 'Examen A2 - Unit 2',
      studentId: 'student4',
      studentName: 'Pau García',
      imageUrl: '/uploads/exam4.jpg',
      ocrText: undefined,
      ocrConfidence: undefined,
      ocrProcessed: false,
      needsReview: false,
      submittedAt: new Date(Date.now() - 1000 * 60 * 30),
      status: 'ocr_processing',
    },
  ];

  let filtered = mockSubmissions;

  if (status) {
    filtered = filtered.filter((s) => s.status === status);
  }

  // Filtrar per nivell (simulat)
  if (level) {
    filtered = filtered.filter((s) => {
      if (s.examTitle?.includes('A2')) return level === EnglishLevel.A2;
      if (s.examTitle?.includes('B1')) return level === EnglishLevel.B1;
      if (s.examTitle?.includes('B2')) return level === EnglishLevel.B2;
      return false;
    });
  }

  return NextResponse.json(filtered);
}

