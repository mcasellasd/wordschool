import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET - Obtenir un examen específic amb tots els alumnes que l'han pujat
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: params.id },
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
            students: {
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
          orderBy: {
            submittedAt: 'desc',
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    });

    if (!exam) {
      return NextResponse.json(
        { error: 'Examen no trobat' },
        { status: 404 }
      );
    }

    return NextResponse.json(exam);
  } catch (error) {
    console.error('Error fetching exam:', error);
    return NextResponse.json(
      { error: 'Error al obtenir l\'examen' },
      { status: 500 }
    );
  }
}

// PUT - Actualitzar un examen
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const exam = await prisma.exam.update({
      where: { id: params.id },
      data: {
        title,
        courseId: courseId || null,
        level,
        totalPoints,
        oxfordReference: oxfordReference || null,
        status,
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

    return NextResponse.json(exam);
  } catch (error: any) {
    console.error('Error updating exam:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Examen no trobat' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Error al actualitzar l\'examen' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un examen
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autoritzat' },
        { status: 401 }
      );
    }

    await prisma.exam.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Examen eliminat correctament' });
  } catch (error: any) {
    console.error('Error deleting exam:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Examen no trobat' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Error al eliminar l\'examen' },
      { status: 500 }
    );
  }
}

