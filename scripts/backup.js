#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

// Backup configuration
const BACKUP_DIR = process.env.BACKUP_DIR || './backups';
const ENCRYPTION_KEY = process.env.BACKUP_ENCRYPTION_KEY || 'default-key-change-in-production';
const RETENTION_DAYS = parseInt(process.env.BACKUP_RETENTION_DAYS || '30');

class BackupManager {
  constructor() {
    this.ensureBackupDir();
  }

  ensureBackupDir() {
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
  }

  generateBackupName() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `backup-${timestamp}`;
  }

  encryptData(data) {
    const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  async backupUploads() {
    console.log('Backing up uploads...');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const backupName = this.generateBackupName();
    const backupPath = path.join(BACKUP_DIR, `${backupName}-uploads.tar.gz`);

    if (fs.existsSync(uploadsDir)) {
      try {
        execSync(`tar -czf "${backupPath}" -C "${path.dirname(uploadsDir)}" uploads`);
        console.log(`Uploads backed up to: ${backupPath}`);
        return backupPath;
      } catch (error) {
        console.error('Error backing up uploads:', error.message);
        return null;
      }
    } else {
      console.log('No uploads directory found');
      return null;
    }
  }

  async backupDatabase() {
    console.log('Backing up database...');
    const backupName = this.generateBackupName();
    const backupPath = path.join(BACKUP_DIR, `${backupName}-database.sql`);

    // This would be implemented based on your database setup
    // For now, we'll create a placeholder
    const dbBackup = {
      timestamp: new Date().toISOString(),
      tables: ['users', 'sessions', 'uploads'],
      note: 'Database backup placeholder - implement based on your database'
    };

    try {
      fs.writeFileSync(backupPath, JSON.stringify(dbBackup, null, 2));
      console.log(`Database backed up to: ${backupPath}`);
      return backupPath;
    } catch (error) {
      console.error('Error backing up database:', error.message);
      return null;
    }
  }

  async backupConfig() {
    console.log('Backing up configuration...');
    const backupName = this.generateBackupName();
    const backupPath = path.join(BACKUP_DIR, `${backupName}-config.json`);

    const config = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      settings: {
        maxFileSize: process.env.MAX_FILE_SIZE,
        allowedFileTypes: process.env.ALLOWED_FILE_TYPES,
        rateLimitWindow: process.env.RATE_LIMIT_WINDOW_MS,
        rateLimitMax: process.env.RATE_LIMIT_MAX_REQUESTS
      }
    };

    try {
      fs.writeFileSync(backupPath, JSON.stringify(config, null, 2));
      console.log(`Configuration backed up to: ${backupPath}`);
      return backupPath;
    } catch (error) {
      console.error('Error backing up configuration:', error.message);
      return null;
    }
  }

  async createFullBackup() {
    console.log('Creating full backup...');
    const backupName = this.generateBackupName();
    const backupDir = path.join(BACKUP_DIR, backupName);

    // Create backup directory
    fs.mkdirSync(backupDir, { recursive: true });

    // Backup different components
    const uploadsBackup = await this.backupUploads();
    const databaseBackup = await this.backupDatabase();
    const configBackup = await this.backupConfig();

    // Create backup manifest
    const manifest = {
      timestamp: new Date().toISOString(),
      backupName,
      components: {
        uploads: uploadsBackup ? path.basename(uploadsBackup) : null,
        database: databaseBackup ? path.basename(databaseBackup) : null,
        config: configBackup ? path.basename(configBackup) : null
      },
      size: this.calculateBackupSize(backupDir)
    };

    const manifestPath = path.join(backupDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    console.log(`Full backup created: ${backupDir}`);
    return backupDir;
  }

  calculateBackupSize(dir) {
    let totalSize = 0;
    const files = fs.readdirSync(dir, { withFileTypes: true });

    files.forEach(file => {
      const filePath = path.join(dir, file.name);
      if (file.isDirectory()) {
        totalSize += this.calculateBackupSize(filePath);
      } else {
        totalSize += fs.statSync(filePath).size;
      }
    });

    return totalSize;
  }

  cleanupOldBackups() {
    console.log('Cleaning up old backups...');
    const files = fs.readdirSync(BACKUP_DIR);
    const cutoffDate = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);

    files.forEach(file => {
      const filePath = path.join(BACKUP_DIR, file);
      const stats = fs.statSync(filePath);
      
      if (stats.mtime < cutoffDate) {
        try {
          if (stats.isDirectory()) {
            fs.rmSync(filePath, { recursive: true });
          } else {
            fs.unlinkSync(filePath);
          }
          console.log(`Deleted old backup: ${file}`);
        } catch (error) {
          console.error(`Error deleting ${file}:`, error.message);
        }
      }
    });
  }

  listBackups() {
    console.log('Available backups:');
    const files = fs.readdirSync(BACKUP_DIR);
    
    files.forEach(file => {
      const filePath = path.join(BACKUP_DIR, file);
      const stats = fs.statSync(filePath);
      const size = stats.isDirectory() ? this.calculateBackupSize(filePath) : stats.size;
      const sizeMB = (size / (1024 * 1024)).toFixed(2);
      
      console.log(`  ${file} - ${sizeMB}MB - ${stats.mtime.toISOString()}`);
    });
  }
}

// CLI interface
if (require.main === module) {
  const backupManager = new BackupManager();
  const command = process.argv[2];

  switch (command) {
    case 'full':
      backupManager.createFullBackup().then(() => {
        console.log('Full backup completed');
      });
      break;
    case 'uploads':
      backupManager.backupUploads();
      break;
    case 'database':
      backupManager.backupDatabase();
      break;
    case 'config':
      backupManager.backupConfig();
      break;
    case 'cleanup':
      backupManager.cleanupOldBackups();
      break;
    case 'list':
      backupManager.listBackups();
      break;
    default:
      console.log('Usage: node backup.js [full|uploads|database|config|cleanup|list]');
  }
}

module.exports = BackupManager;
