/**
 * Storage adapter interface.
 *
 * Defines the contract for S3-compatible object storage operations.
 * The implementation will target MinIO for local development and
 * any S3-compatible provider for production (Phase 3).
 */

export interface StorageAdapter {
  /** Generate a pre-signed URL for uploading a file. */
  createUploadUrl(key: string, contentType: string, expiresIn?: number): Promise<string>;

  /** Generate a pre-signed URL for downloading a file. */
  createDownloadUrl(key: string, expiresIn?: number): Promise<string>;

  /** Delete an object from storage. */
  deleteObject(key: string): Promise<void>;

  /** Check if an object exists. */
  objectExists(key: string): Promise<boolean>;
}
