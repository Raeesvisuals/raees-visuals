import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' });
    }

    // Check if it's a video file
    const videoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov', 'video/quicktime'];
    if (!videoTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'File must be a video' });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads/videos directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'videos');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const fileExtension = originalName.split('.').pop();
    const fileName = `${timestamp}-${originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = join(uploadsDir, fileName);

    // Write file to uploads directory
    await writeFile(filePath, buffer);

    // Return file info
    const fileUrl = `/uploads/videos/${fileName}`;
    
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
    console.error('Video upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload video' },
      { status: 500 }
    );
  }
}
