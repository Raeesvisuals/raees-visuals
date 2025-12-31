import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    
    // Check if uploads directory exists
    try {
      const files = await readdir(uploadsDir);
      const fileList = await Promise.all(
        files.map(async (file) => {
          const filePath = join(uploadsDir, file);
          const stats = await stat(filePath);
          return {
            name: file,
            url: `/uploads/${file}`,
            size: stats.size,
            uploadedAt: stats.birthtime.toISOString(),
            isDirectory: stats.isDirectory()
          };
        })
      );

      // Filter out directories and sort by upload date (newest first)
      const mediaFiles = fileList
        .filter(file => !file.isDirectory)
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

      return NextResponse.json({
        success: true,
        files: mediaFiles
      });

    } catch (error) {
      // If uploads directory doesn't exist, return empty array
      return NextResponse.json({
        success: true,
        files: []
      });
    }

  } catch (error) {
    console.error('Media library error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch media files' },
      { status: 500 }
    );
  }
}
