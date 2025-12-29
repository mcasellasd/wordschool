import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtenir un alumne específic amb tota la seva informació
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const student = await prisma.student.findUnique({
      where: { id: params.id },
      include: {
        examSubmissions: {
          include: {
            exam: {
              select: {
                id: true,
                title: true,
                level: true,
                totalPoints: true,
                teacher: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
          orderBy: {
            submittedAt: 'desc',
          },
        },
        courses: {
          include: {
            course: {
              include: {
                teacher: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Alumne no trobat' },
        { status: 404 }
      );
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json(
      { error: 'Error al obtenir l\'alumne' },
      { status: 500 }
    );
  }
}

// PUT - Actualitzar un alumne
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, surname, currentLevel, email, avatar } = body;

    const student = await prisma.student.update({
      where: { id: params.id },
      data: {
        name,
        surname,
        currentLevel,
        email,
        avatar,
      },
    });

    return NextResponse.json(student);
  } catch (error: any) {
    console.error('Error updating student:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Alumne no trobat' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Error al actualitzar l\'alumne' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un alumne
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.student.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Alumne eliminat correctament' });
  } catch (error: any) {
    console.error('Error deleting student:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Alumne no trobat' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Error al eliminar l\'alumne' },
      { status: 500 }
    );
  }
}

