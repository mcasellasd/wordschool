import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Configuració
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'exams');

// Crear directori d'uploads si no existeix
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Crear directori si no existeix
    await ensureUploadDir();

    const formData = await request.formData();
    const file = formData.get('examImage') as File;

    // Validar que hi ha un fitxer
    if (!file) {
      return NextResponse.json(
        { error: 'No s\'ha pujat cap fitxer' },
        { status: 400 }
      );
    }

    // Validar tipus de fitxer
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipus de fitxer no permès. Només JPG, JPEG o PNG' },
        { status: 400 }
      );
    }

    // Validar mida
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'El fitxer és massa gran. Màxim 10MB' },
        { status: 400 }
      );
    }

    // Generar nom únic per al fitxer
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `exam-${timestamp}-${randomString}.${fileExtension}`;
    const filePath = join(UPLOAD_DIR, fileName);

    // Convertir File a Buffer i guardar
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // URL pública del fitxer
    const fileUrl = `/uploads/exams/${fileName}`;

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: file.name,
      fileSize: file.size,
      message: 'Fitxer pujat correctament',
    });
  } catch (error: any) {
    console.error('Error pujant fitxer:', error);
    return NextResponse.json(
      {
        error: error.message || 'Error al pujar el fitxer',
      },
      { status: 500 }
    );
  }
}

