/**
 * Download API Route
 *
 * Generates temporary signed URLs for product downloads.
 *
 * SECURITY:
 * - Client sends ONLY productId
 * - File path is fetched from Sanity (server-side)
 * - Prevents path traversal and direct bucket access
 */

import { NextRequest, NextResponse } from "next/server";
import { generateDownloadUrl, getFileMetadataSafe } from "@/lib/r2";
import { sanityClient } from "@/lib/sanity";
import { deriveFileFormat, deriveMimeType } from "@/lib/fileMetadata";

/* =========================
   POST /api/download
========================= */
export async function POST(request: NextRequest) {
  let productId: string | null = null;

  try {
    // Parse JSON body safely
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    productId = body?.productId ?? null;

    if (!productId) {
      return NextResponse.json(
        { error: "Missing required field: productId" },
        { status: 400 }
      );
    }

    // Fetch product from Sanity
    const product = await sanityClient.fetch(
      `*[_type == "product" && (slug.current == $productId || _id == $productId)][0]{
        _id,
        title,
        price,
        downloads,
        downloadFile {
          filePath,
          fileName,
          fileSize,
          fileFormat,
          mimeType
        }
      }`,
      { productId }
    );

    if (!product) {
      return NextResponse.json(
        { error: `Product not found: ${productId}` },
        { status: 404 }
      );
    }

    if (!product.downloadFile?.filePath) {
      return NextResponse.json(
        {
          error: "Product does not have a download file configured",
        },
        { status: 400 }
      );
    }

    const filePath = product.downloadFile.filePath;

    /* ===== OPTIONAL METADATA FETCH (NON-BLOCKING) ===== */
    let fileMetadata: any = null;
    try {
      fileMetadata = await getFileMetadataSafe(filePath);
    } catch {
      // Non-blocking
    }

    const derivedFormat = deriveFileFormat(
      filePath,
      product.downloadFile?.fileName
    );

    const derivedMimeType = deriveMimeType(
      product.downloadFile?.fileFormat || derivedFormat
    );

    // Update missing metadata asynchronously
    if (
      fileMetadata &&
      (!product.downloadFile.fileSize ||
        !product.downloadFile.fileFormat ||
        !product.downloadFile.mimeType)
    ) {
      Promise.resolve().then(async () => {
        try {
          const updateData: any = {
            "downloadFile.fileSize": fileMetadata.size,
          };

          if (!product.downloadFile.fileFormat && derivedFormat) {
            updateData["downloadFile.fileFormat"] = derivedFormat;
          }

          if (!product.downloadFile.mimeType) {
            updateData["downloadFile.mimeType"] =
              fileMetadata.contentType ||
              derivedMimeType ||
              "application/octet-stream";
          }

          await sanityClient.patch(product._id).set(updateData).commit();
        } catch {
          // Silent fail (non-blocking)
        }
      });
    }

    // Generate signed URL
    const expiresIn = 600; // 10 minutes
    let downloadUrl: string;
    
    try {
      downloadUrl = await generateDownloadUrl(filePath, expiresIn);
    } catch (error: any) {
      console.error("Failed to generate download URL:", error);
      
      // If R2 is not configured, provide helpful error message
      if (error.message?.includes("R2") || error.message?.includes("environment variable")) {
        return NextResponse.json(
          { 
            error: "Download service is not configured. Please configure R2 storage.",
            details: "R2 environment variables are missing. Contact administrator."
          },
          { status: 503 }
        );
      }
      
      // If file not found, provide specific error
      if (error.message?.includes("not found") || error.message?.includes("File not found")) {
        return NextResponse.json(
          { 
            error: "Download file not found",
            details: `The file "${filePath}" does not exist in storage.`
          },
          { status: 404 }
        );
      }
      
      // Generic error
      return NextResponse.json(
        { 
          error: "Failed to generate download URL",
          details: error.message || "Unknown error occurred"
        },
        { status: 500 }
      );
    }

    // Increment download count asynchronously
    Promise.resolve().then(async () => {
      try {
        await sanityClient
          .patch(product._id)
          .set({ downloads: (product.downloads || 0) + 1 })
          .commit();
      } catch {
        // Silent fail
      }
    });

    return NextResponse.json({
      downloadUrl,
      expiresIn,
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
      fileName:
        product.downloadFile.fileName || filePath.split("/").pop(),
    });
  } catch (error: any) {
    console.error("POST /api/download error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    return NextResponse.json(
      { error: "Failed to generate download URL" },
      { status: 500 }
    );
  }
}

/* =========================
   GET /api/download
========================= */
export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Missing required query parameter: productId" },
        { status: 400 }
      );
    }

    const product = await sanityClient.fetch(
      `*[_type == "product" && (slug.current == $productId || _id == $productId)][0]{
        _id,
        title,
        downloads,
        downloadFile {
          filePath,
          fileName
        }
      }`,
      { productId }
    );

    if (!product || !product.downloadFile?.filePath) {
      return NextResponse.json(
        { error: "Product or download file not found" },
        { status: 404 }
      );
    }

    const filePath = product.downloadFile.filePath;
    const expiresIn = 600;

    const downloadUrl = await generateDownloadUrl(filePath, expiresIn);

    return NextResponse.json({
      downloadUrl,
      expiresIn,
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
      fileName:
        product.downloadFile.fileName || filePath.split("/").pop(),
    });
  } catch (error: any) {
    console.error("GET /api/download error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    return NextResponse.json(
      { error: "Failed to generate download URL" },
      { status: 500 }
    );
  }
}
