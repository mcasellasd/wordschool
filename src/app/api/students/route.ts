import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Llista tots els alumnes
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const search = searchParams.get('search');

    const where: any = {};

    if (level && level !== 'all') {
      where.currentLevel = level;
    }

    if (search) {
      const searchLower = search.toLowerCase();
      where.OR = [
        { name: { contains: search } },
        { surname: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        examSubmissions: {
          select: {
            id: true,
            status: true,
            totalScore: true,
            exam: {
              select: {
                title: true,
                level: true,
              },
            },
          },
          orderBy: {
            submittedAt: 'desc',
          },
          take: 5, // Últims 5 exàmens
        },
        courses: {
          include: {
            course: {
              select: {
                name: true,
                level: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Error al obtenir els alumnes' },
      { status: 500 }
    );
  }
}

// POST - Crear un nou alumne
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, surname, currentLevel, academyId, avatar } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email i nom són obligatoris' },
        { status: 400 }
      );
    }

    const student = await prisma.student.create({
      data: {
        email,
        name,
        surname,
        currentLevel,
        academyId,
        avatar,
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    console.error('Error creating student:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Aquest email ja està registrat' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Error al crear l\'alumne' },
      { status: 500 }
    );
  }
}

