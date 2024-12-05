import { ref, uploadString, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  data?: any;
  error?: Error;
}

class Logger {
  private static logs: LogEntry[] = [];

  static info(message: string, data?: any) {
    this.log('info', message, data);
  }

  static warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  static error(message: string, error?: Error, data?: any) {
    this.log('error', message, data, error);
    console.error('[Error]', message, error, data);
  }

  private static log(level: LogLevel, message: string, data?: any, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      data,
      error
    };

    this.logs.push(entry);
    
    if (level === 'error') {
      this.reportError(entry);
    }
  }

  private static reportError(entry: LogEntry) {
    console.error('Error Report:', entry);
  }

  static getLogs() {
    return [...this.logs];
  }

  static clear() {
    this.logs = [];
  }

  static async testStorageConnection(): Promise<boolean> {
    try {
      const testRef = ref(storage, 'test/connection-test.txt');
      await uploadString(testRef, 'test');
      await deleteObject(testRef);
      Logger.info('Storage connection test successful');
      return true;
    } catch (error) {
      Logger.error('Storage connection test failed', error as Error);
      return false;
    }
  }
}

export default Logger;