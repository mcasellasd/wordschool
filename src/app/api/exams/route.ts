import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET - Llista tots els exàmens
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const status = searchParams.get('status');
    const courseId = searchParams.get('courseId');

    const where: any = {};

    if (level && level !== 'all') {
      where.level = level;
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    if (courseId) {
      where.courseId = courseId;
    }

    const exams = await prisma.exam.findMany({
      where,
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
        submissions: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                surname: true,
                email: true,
                currentLevel: true,
              },
            },
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(exams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json(
      { error: 'Error al obtenir els exàmens' },
      { status: 500 }
    );
  }
}

// POST - Crear un nou examen
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autoritzat' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      courseId,
      level,
      totalPoints,
      oxfordReference,
      status,
      dueDate,
    } = body;

    if (!title || !level) {
      return NextResponse.json(
        { error: 'Títol i nivell són obligatoris' },
        { status: 400 }
      );
    }

    // Buscar el professor per email de la sessió
    const teacher = await prisma.teacher.findUnique({
      where: { email: session.user.email },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: 'Professor no trobat' },
        { status: 404 }
      );
    }

    const exam = await prisma.exam.create({
      data: {
        title,
        courseId: courseId || null,
        level,
        teacherId: teacher.id,
        totalPoints: totalPoints || 100,
        oxfordReference: oxfordReference || null,
        status: status || 'draft',
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: {
        teacher: {
          select: {
            name: true,
            surname: true,
            email: true,
          },
        },
        course: {
          select: {
            name: true,
            level: true,
          },
        },
      },
    });

    return NextResponse.json(exam, { status: 201 });
  } catch (error: any) {
    console.error('Error creating exam:', error);
    return NextResponse.json(
      { error: 'Error al crear l\'examen' },
      { status: 500 }
    );
  }
}

