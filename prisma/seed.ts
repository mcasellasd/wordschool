import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrant base de dades...');

  // Crear professors
  const teacher1 = await prisma.teacher.upsert({
    where: { email: 'professor@wordschool.com' },
    update: {},
    create: {
      email: 'professor@wordschool.com',
      name: 'Maria',
      surname: 'García',
    },
  });

  const teacher2 = await prisma.teacher.upsert({
    where: { email: 'anna.lopez@wordschool.com' },
    update: {},
    create: {
      email: 'anna.lopez@wordschool.com',
      name: 'Anna',
      surname: 'López',
    },
  });

  console.log('✅ Professors creats');

  // Crear alumnes
  const students = [
    {
      email: 'laura.fernandez@example.com',
      name: 'Laura',
      surname: 'Fernández',
      currentLevel: 'A2',
    },
    {
      email: 'marc.rodriguez@example.com',
      name: 'Marc',
      surname: 'Rodríguez',
      currentLevel: 'B1',
    },
    {
      email: 'sara.martinez@example.com',
      name: 'Sara',
      surname: 'Martínez',
      currentLevel: 'B2',
    },
    {
      email: 'pau.garcia@example.com',
      name: 'Pau',
      surname: 'García',
      currentLevel: 'A2',
    },
    {
      email: 'carla.sanchez@example.com',
      name: 'Carla',
      surname: 'Sánchez',
      currentLevel: 'B1',
    },
    {
      email: 'david.torres@example.com',
      name: 'David',
      surname: 'Torres',
      currentLevel: 'B2',
    },
  ];

  for (const studentData of students) {
    await prisma.student.upsert({
      where: { email: studentData.email },
      update: {},
      create: studentData,
    });
  }

  console.log('✅ Alumnes creats');

  // Crear cursos
  const course1 = await prisma.course.create({
    data: {
      name: 'Anglès A2 - Grup Matí',
      level: 'A2',
      teacherId: teacher1.id,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-06-30'),
    },
  });

  const course2 = await prisma.course.create({
    data: {
      name: 'Anglès B1 - Grup Tarda',
      level: 'B1',
      teacherId: teacher1.id,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-06-30'),
    },
  });

  const course3 = await prisma.course.create({
    data: {
      name: 'Anglès B2 - Grup Avançat',
      level: 'B2',
      teacherId: teacher2.id,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-06-30'),
    },
  });

  console.log('✅ Cursos creats');

  // Inscriure alumnes a cursos
  const allStudents = await prisma.student.findMany();

  // Alumnes A2 al curs A2
  const a2Students = allStudents.filter((s) => s.currentLevel === 'A2');
  for (const student of a2Students) {
    await prisma.courseStudent.upsert({
      where: {
        courseId_studentId: {
          courseId: course1.id,
          studentId: student.id,
        },
      },
      update: {},
      create: {
        courseId: course1.id,
        studentId: student.id,
      },
    });
  }

  // Alumnes B1 al curs B1
  const b1Students = allStudents.filter((s) => s.currentLevel === 'B1');
  for (const student of b1Students) {
    await prisma.courseStudent.upsert({
      where: {
        courseId_studentId: {
          courseId: course2.id,
          studentId: student.id,
        },
      },
      update: {},
      create: {
        courseId: course2.id,
        studentId: student.id,
      },
    });
  }

  // Alumnes B2 al curs B2
  const b2Students = allStudents.filter((s) => s.currentLevel === 'B2');
  for (const student of b2Students) {
    await prisma.courseStudent.upsert({
      where: {
        courseId_studentId: {
          courseId: course3.id,
          studentId: student.id,
        },
      },
      update: {},
      create: {
        courseId: course3.id,
        studentId: student.id,
      },
    });
  }

  console.log('✅ Alumnes inscrits a cursos');

  // Crear alguns exàmens
  const exam1 = await prisma.exam.create({
    data: {
      title: 'Examen A2 - Unit 3',
      courseId: course1.id,
      level: 'A2',
      teacherId: teacher1.id,
      totalPoints: 100,
      status: 'published',
      dueDate: new Date('2024-12-31'),
    },
  });

  const exam2 = await prisma.exam.create({
    data: {
      title: 'Examen B1 - Unit 5',
      courseId: course2.id,
      level: 'B1',
      teacherId: teacher1.id,
      totalPoints: 100,
      status: 'published',
      dueDate: new Date('2024-12-31'),
    },
  });

  const exam3 = await prisma.exam.create({
    data: {
      title: 'Examen B2 - Unit 7',
      courseId: course3.id,
      level: 'B2',
      teacherId: teacher2.id,
      totalPoints: 100,
      status: 'published',
      dueDate: new Date('2024-12-31'),
    },
  });

  console.log('✅ Exàmens creats');

  // Crear algunes pujades d'exàmens
  const laura = allStudents.find((s) => s.email === 'laura.fernandez@example.com');
  const marc = allStudents.find((s) => s.email === 'marc.rodriguez@example.com');
  const sara = allStudents.find((s) => s.email === 'sara.martinez@example.com');

  if (laura && exam1) {
    await prisma.examSubmission.create({
      data: {
        examId: exam1.id,
        studentId: laura.id,
        imageUrl: '/uploads/exams/exam1.jpg',
        status: 'ready_to_grade',
        ocrProcessed: true,
        ocrText: 'Resposta de l\'examen...',
        ocrConfidence: 0.92,
      },
    });
  }

  if (marc && exam2) {
    await prisma.examSubmission.create({
      data: {
        examId: exam2.id,
        studentId: marc.id,
        imageUrl: '/uploads/exams/exam2.jpg',
        status: 'graded',
        ocrProcessed: true,
        ocrText: 'Resposta de l\'examen...',
        ocrConfidence: 0.88,
        totalScore: 8.5,
        gradedAt: new Date(),
      },
    });
  }

  if (sara && exam3) {
    await prisma.examSubmission.create({
      data: {
        examId: exam3.id,
        studentId: sara.id,
        imageUrl: '/uploads/exams/exam3.jpg',
        status: 'graded',
        ocrProcessed: true,
        ocrText: 'Resposta de l\'examen...',
        ocrConfidence: 0.95,
        totalScore: 9.2,
        gradedAt: new Date(),
      },
    });
  }

  console.log('✅ Pujades d\'exàmens creades');
  console.log('🎉 Base de dades sembrada correctament!');
}

main()
  .catch((e) => {
    console.error('❌ Error sembrant base de dades:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

