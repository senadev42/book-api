import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { STORAGE_CONFIG, StorageConfig } from '../config/storage.config';

@Injectable()
export class StorageService implements OnModuleInit {
  private storageClient: Client;
  private config: StorageConfig;

  constructor(private configService: ConfigService) {
    this.config = this.configService.get<StorageConfig>(STORAGE_CONFIG);
  }

  async onModuleInit() {
    await this.initializeStorage();
  }

  private async initializeStorage() {
    this.storageClient = new Client({
      endPoint: this.config.endpoint,
      port: this.config.port,
      useSSL: this.config.useSSL,
      accessKey: this.config.accessKey,
      secretKey: this.config.secretKey,
    });

    // Ensure bucket exists for MinIO
    const bucketExists = await (this.storageClient as Client).bucketExists(
      this.config.bucket,
    );

    if (!bucketExists) {
      await (this.storageClient as Client).makeBucket(this.config.bucket);
    }
  }

  /**
   * Uploads a file to the storage implementation, minio for this case.
   * @param file
   * @returns
   */
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const objectName = `${Date.now()}-${file.originalname}`;

    await (this.storageClient as Client).putObject(
      this.config.bucket,
      objectName,
      file.buffer,
      file.size,
    );

    return `${this.config.publicUrl}/${objectName}`;
  }

  async deleteFile(fileName: string): Promise<void> {
    await this.storageClient.removeObject(this.config.bucket, fileName);
  }
}
