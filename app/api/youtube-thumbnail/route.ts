import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ success: false, error: 'No URL provided' });
    }

    // Extract video ID from YouTube URL
    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json({ success: false, error: 'Invalid YouTube URL' });
    }

    // Generate thumbnail URLs (YouTube provides multiple quality options)
    const thumbnails = {
      default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
      medium: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      high: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      standard: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    };

    return NextResponse.json({
      success: true,
      videoId,
      thumbnails,
      videoUrl: url
    });

  } catch (error) {
    console.error('YouTube thumbnail error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to extract YouTube thumbnail' },
      { status: 500 }
    );
  }
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/user\/[^\/]+\/?#[^\/]*\/([^\/\?]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}
