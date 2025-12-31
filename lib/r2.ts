/**
 * Cloudflare R2 Client Setup
 * 
 * This module handles all interactions with Cloudflare R2 object storage.
 * Files are stored privately and accessed via temporary signed URLs.
 * 
 * Architecture:
 * - Files are stored in R2 with private access
 * - Signed URLs are generated server-side via API routes
 * - URLs expire after a configurable time (default: 10 minutes)
 * - Future-proof: Ready for authentication and payment checks
 */

import { S3Client, GetObjectCommand, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// R2 is S3-compatible, so we use AWS SDK
// Build endpoint from account ID if R2_ENDPOINT is not set
const getR2Endpoint = (): string => {
  if (process.env.R2_ENDPOINT) {
    return process.env.R2_ENDPOINT;
  }
  if (process.env.R2_ACCOUNT_ID) {
    return `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  }
  throw new Error("R2_ENDPOINT or R2_ACCOUNT_ID must be set");
};

// Lazy initialization of R2 client to avoid errors at module load
let r2Client: S3Client | null = null;
let r2BucketName: string | null = null;

function getR2Client(): S3Client {
  if (!r2Client) {
    // Validate environment variables before creating client
    const missingVars: string[] = [];
    
    if (!process.env.R2_ACCESS_KEY_ID) {
      missingVars.push("R2_ACCESS_KEY_ID");
    }
    if (!process.env.R2_SECRET_ACCESS_KEY) {
      missingVars.push("R2_SECRET_ACCESS_KEY");
    }
    if (!process.env.R2_BUCKET_NAME) {
      missingVars.push("R2_BUCKET_NAME");
    }
    
    // Check for endpoint or account ID
    if (!process.env.R2_ENDPOINT && !process.env.R2_ACCOUNT_ID) {
      missingVars.push("R2_ENDPOINT or R2_ACCOUNT_ID");
    }

    if (missingVars.length > 0) {
      throw new Error(`Missing required R2 environment variables: ${missingVars.join(", ")}`);
    }

    try {
      const endpoint = getR2Endpoint();
      console.log("Initializing R2 client with endpoint:", endpoint.replace(/https?:\/\/[^@]+@/, "https://***@"));
      
      r2Client = new S3Client({
        region: "auto", // R2 uses "auto" as the region
        endpoint: endpoint,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID!,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        },
      });
      r2BucketName = process.env.R2_BUCKET_NAME!;
      
      console.log("R2 client initialized successfully with bucket:", r2BucketName);
    } catch (error: any) {
      console.error("Failed to initialize R2 client:", error);
      throw new Error(`Failed to initialize R2 client: ${error.message}`);
    }
  }
  return r2Client;
}

function getR2BucketName(): string {
  if (!r2BucketName) {
    if (!process.env.R2_BUCKET_NAME) {
      throw new Error("R2_BUCKET_NAME environment variable is not set");
    }
    r2BucketName = process.env.R2_BUCKET_NAME;
  }
  return r2BucketName;
}

/**
 * Generate a temporary signed URL for downloading a file
 * 
 * @param filePath - The path to the file in R2 (e.g., "products/wedding-template.zip")
 * @param expiresIn - URL expiration time in seconds (default: 600 = 10 minutes)
 * @returns Promise<string> - The signed URL
 * 
 * Future: Add authentication check here before generating URL
 */
export async function generateDownloadUrl(
  filePath: string,
  expiresIn: number = 600 // 10 minutes default
): Promise<string> {
  try {
    const client = getR2Client();
    const bucketName = getR2BucketName();

    // Verify file exists before generating URL
    await client.send(
      new HeadObjectCommand({
        Bucket: bucketName,
        Key: filePath,
      })
    );

    // Generate signed URL
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: filePath,
    });

    const signedUrl = await getSignedUrl(client, command, { expiresIn });

    return signedUrl;
  } catch (error: any) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      throw new Error(`File not found: ${filePath}`);
    }
    // Check for configuration errors
    if (error.message?.includes("environment variable") || error.message?.includes("R2_")) {
      throw new Error(`R2 configuration error: ${error.message}`);
    }
    throw new Error(`Failed to generate download URL: ${error.message}`);
  }
}

/**
 * Upload a file to R2
 * 
 * @param filePath - The path where the file should be stored
 * @param fileBuffer - The file content as a Buffer
 * @param contentType - MIME type of the file
 * @returns Promise<void>
 * 
 * Future: Add access control and metadata here
 */
export async function uploadToR2(
  filePath: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<void> {
  try {
    const client = getR2Client();
    const bucketName = getR2BucketName();

    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: filePath,
        Body: fileBuffer,
        ContentType: contentType,
        // Future: Add ACL, metadata, etc. here
      })
    );
  } catch (error: any) {
    throw new Error(`Failed to upload file to R2: ${error.message}`);
  }
}

/**
 * Check if a file exists in R2
 * 
 * @param filePath - The path to check
 * @returns Promise<{ exists: boolean; size?: number }>
 */
export async function checkFileExists(filePath: string): Promise<{ exists: boolean; size?: number }> {
  try {
    const client = getR2Client();
    const bucketName = getR2BucketName();

    const response = await client.send(
      new HeadObjectCommand({
        Bucket: bucketName,
        Key: filePath,
      })
    );

    return {
      exists: true,
      size: response.ContentLength,
    };
  } catch (error: any) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      return { exists: false };
    }
    throw error;
  }
}

/**
 * Get file metadata from R2
 * 
 * @param filePath - The path to the file
 * @returns Promise<{ size: number; contentType: string; lastModified: Date }>
 */
export async function getFileMetadata(filePath: string): Promise<{
  size: number;
  contentType: string;
  lastModified: Date;
}> {
  try {
    const client = getR2Client();
    const bucketName = getR2BucketName();

    const response = await client.send(
      new HeadObjectCommand({
        Bucket: bucketName,
        Key: filePath,
      })
    );

    return {
      size: response.ContentLength || 0,
      contentType: response.ContentType || "application/octet-stream",
      lastModified: response.LastModified || new Date(),
    };
  } catch (error: any) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      throw new Error(`File not found: ${filePath}`);
    }
    throw new Error(`Failed to get file metadata: ${error.message}`);
  }
}

/**
 * Get file metadata from R2 (non-throwing version)
 * Returns null if file doesn't exist instead of throwing
 * 
 * @param filePath - The path to the file
 * @returns Promise with metadata or null if not found
 */
export async function getFileMetadataSafe(filePath: string): Promise<{
  size: number;
  contentType: string;
  lastModified: Date;
} | null> {
  try {
    return await getFileMetadata(filePath);
  } catch (error: any) {
    if (error.message?.includes("not found") || error.message?.includes("File not found")) {
      return null;
    }
    // For other errors, log but don't throw (don't block downloads)
    console.warn("Failed to get file metadata (non-blocking):", error.message);
    return null;
  }
}

// Validate R2 configuration on module load
if (typeof window === "undefined") {
  // Server-side only
  const requiredEnvVars = [
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_BUCKET_NAME",
  ];

  // Either R2_ENDPOINT or R2_ACCOUNT_ID must be set
  const hasEndpoint = !!(process.env.R2_ENDPOINT || process.env.R2_ACCOUNT_ID);

  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0 || !hasEndpoint) {
    const missing = [...missingVars];
    if (!hasEndpoint) {
      missing.push("R2_ENDPOINT or R2_ACCOUNT_ID");
    }
    console.warn(
      `⚠️  Missing R2 environment variables: ${missing.join(", ")}. R2 functionality will not work.`
    );
  }
}

