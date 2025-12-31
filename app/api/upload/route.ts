import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { validateFile } from '@/lib/security';
import { uploadRateLimit } from '@/lib/rate-limit';
import { logSecurityEvent } from '@/lib/security';
import { validateInput, fileUploadSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = uploadRateLimit(request);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many upload attempts. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      logSecurityEvent('NO_FILE_UPLOADED', {}, request);
      return NextResponse.json({ success: false, error: 'No file uploaded' });
    }

    // Validate file
    const validation = validateInput(fileUploadSchema, { file });
    if (!validation.success) {
      logSecurityEvent('INVALID_FILE_UPLOAD', { errors: validation.errors }, request);
      return NextResponse.json({ 
        success: false,
        error: 'Invalid file',
        details: validation.errors 
      }, { status: 400 });
    }

    // Additional security checks
    const fileValidation = validateFile(file);
    if (!fileValidation.valid) {
      logSecurityEvent('FILE_VALIDATION_FAILED', { error: fileValidation.error }, request);
      return NextResponse.json({ success: false, error: fileValidation.error }, { status: 400 });
    }

    // Check file extension
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'webm', 'mov'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      logSecurityEvent('INVALID_FILE_EXTENSION', { extension: fileExtension }, request);
      return NextResponse.json({ success: false, error: 'File type not allowed.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate secure filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const originalName = file.name;
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}-${randomString}-${sanitizedName}`;
    
    // Ensure filename is not too long
    if (fileName.length > 255) {
      return NextResponse.json({ success: false, error: 'Filename too long.' }, { status: 400 });
    }
    
    const filePath = join(uploadsDir, fileName);

    // Write file to uploads directory
    await writeFile(filePath, buffer);

    // Return file info
    const fileUrl = `/uploads/${fileName}`;
    
    logSecurityEvent('FILE_UPLOADED', { 
      fileName, 
      size: file.size, 
      type: file.type 
    }, request);
    
    return NextResponse.json({
      success: true,
      file: {
        name: originalName,
        url: fileUrl,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    logSecurityEvent('UPLOAD_ERROR', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, request);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
