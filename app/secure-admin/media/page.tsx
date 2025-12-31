"use client";

import React from 'react';
import Layout from '@/components/Layout';
import MediaLibrary from '@/components/MediaLibrary';

export default function MediaPage() {
  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Media <span className="text-primary">Library</span>
          </h1>
          <p className="text-text-primary/70">
            Upload and manage your media files.             Files uploaded here are stored on the server 
            and won&apos;t disappear if you delete them from your computer.
          </p>
        </div>

        <MediaLibrary 
          showUpload={true}
          title="All Media Files"
        />

        <div className="mt-8 bg-dark-lighter/20 backdrop-blur-md border border-text-primary/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            How It Works
          </h3>
          <div className="space-y-3 text-text-primary/70">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <p>Upload files using the &quot;Upload File&quot; button above</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <p>Files are stored on the server in the <code className="bg-dark px-2 py-1 rounded text-xs">/uploads/</code> folder</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <p>Copy the file URL and use it anywhere in your website</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-bold">4</div>
              <p>Files persist even if you delete them from your computer!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
