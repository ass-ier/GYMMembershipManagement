import fs from 'fs';
import path from 'path';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

class Logger {
  private logLevel: LogLevel;
  private logDir: string;

  constructor() {
    this.logLevel = this.getLogLevel();
    this.logDir = path.join(__dirname, '../../logs');
    this.ensureLogDirectory();
  }

  private getLogLevel(): LogLevel {
    const level = process.env.LOG_LEVEL?.toUpperCase() || 'INFO';
    return LogLevel[level as keyof typeof LogLevel] ?? LogLevel.INFO;
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${message}${metaStr}`;
  }

  private writeToFile(level: string, message: string): void {
    const filename = `${new Date().toISOString().split('T')[0]}.log`;
    const filepath = path.join(this.logDir, filename);
    const logEntry = this.formatMessage(level, message) + '\n';
    
    fs.appendFileSync(filepath, logEntry);
  }

  private log(level: LogLevel, levelName: string, message: string, meta?: any): void {
    if (level <= this.logLevel) {
      const formattedMessage = this.formatMessage(levelName, message, meta);
      
      // Console output with colors
      if (process.env.NODE_ENV !== 'production') {
        const colors = {
          ERROR: '\x1b[31m',
          WARN: '\x1b[33m',
          INFO: '\x1b[36m',
          DEBUG: '\x1b[37m'
        };
        console.log(`${colors[levelName as keyof typeof colors]}${formattedMessage}\x1b[0m`);
      }
      
      // File output
      this.writeToFile(levelName, message);
    }
  }

  error(message: string, meta?: any): void {
    this.log(LogLevel.ERROR, 'ERROR', message, meta);
  }

  warn(message: string, meta?: any): void {
    this.log(LogLevel.WARN, 'WARN', message, meta);
  }

  info(message: string, meta?: any): void {
    this.log(LogLevel.INFO, 'INFO', message, meta);
  }

  debug(message: string, meta?: any): void {
    this.log(LogLevel.DEBUG, 'DEBUG', message, meta);
  }
}

export const logger = new Logger();