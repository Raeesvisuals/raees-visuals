/**
 * Auto-Fill Product Metadata API
 * 
 * Automatically populates product metadata from R2 file:
 * - fileSize (from R2)
 * - fileFormat (derived from filePath/fileName)
 * - mimeType (derived from extension)
 * - isNew (calculated from createdAt)
 * 
 * Usage: POST /api/products/auto-fill-metadata
 * Body: { productId: "product-id-or-slug" }
 */

import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";
import { getFileMetadataSafe } from "@/lib/r2";
import { deriveFileFormat, deriveMimeType, calculateIsNew } from "@/lib/fileMetadata";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId } = body;

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
        slug,
        downloadFile{
          filePath,
          fileName,
          fileSize,
          fileFormat,
          mimeType
        },
        isNew,
        createdAt
      }`,
      { productId }
    );

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (!product.downloadFile?.filePath) {
      return NextResponse.json(
        { error: "Product does not have a download file path configured" },
        { status: 400 }
      );
    }

    const filePath = product.downloadFile.filePath;
    const updates: any = {};

    // 1. Fetch file size from R2
    console.log("Fetching file metadata from R2:", filePath);
    const fileMetadata = await getFileMetadataSafe(filePath);

    if (fileMetadata) {
      // Update fileSize if missing or different
      if (!product.downloadFile.fileSize || product.downloadFile.fileSize !== fileMetadata.size) {
        updates["downloadFile.fileSize"] = fileMetadata.size;
        console.log("File size:", fileMetadata.size, "bytes");
      }

      // Use R2's contentType if available
      if (fileMetadata.contentType && !product.downloadFile.mimeType) {
        updates["downloadFile.mimeType"] = fileMetadata.contentType;
      }
    } else {
      console.warn("File not found in R2, skipping fileSize update");
    }

    // 2. Auto-derive fileFormat
    const derivedFormat = deriveFileFormat(filePath, product.downloadFile.fileName);
    if (derivedFormat && !product.downloadFile.fileFormat) {
      updates["downloadFile.fileFormat"] = derivedFormat;
      console.log("Derived file format:", derivedFormat);
    }

    // 3. Auto-derive mimeType (if not set and not from R2)
    if (!product.downloadFile.mimeType) {
      const derivedMime = deriveMimeType(
        product.downloadFile.fileFormat || derivedFormat
      );
      if (derivedMime) {
        updates["downloadFile.mimeType"] = derivedMime;
        console.log("Derived MIME type:", derivedMime);
      }
    }

    // 4. Auto-calculate isNew (if not manually set)
    if (product.createdAt && product.isNew === undefined) {
      const shouldBeNew = calculateIsNew(product.createdAt);
      if (shouldBeNew) {
        updates.isNew = true;
        console.log("Auto-set isNew: true (product is within 14 days)");
      }
    }

    // Apply updates if any
    if (Object.keys(updates).length > 0) {
      await sanityClient
        .patch(product._id)
        .set(updates)
        .commit();

      return NextResponse.json({
        success: true,
        message: "Product metadata auto-filled successfully",
        updates,
        product: {
          _id: product._id,
          title: product.title,
        },
      });
    } else {
      return NextResponse.json({
        success: true,
        message: "Product metadata is already complete",
        updates: {},
      });
    }
  } catch (error: any) {
    console.error("Auto-fill metadata error:", error);
    return NextResponse.json(
      {
        error: "Failed to auto-fill metadata",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

