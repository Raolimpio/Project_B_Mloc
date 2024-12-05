import { 
  signInAnonymously,
  signOut,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import {
  ref,
  uploadString,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import {
  getToken
} from 'firebase/messaging';
import { auth, db, storage, messaging } from './firebase';

interface DiagnosticResult {
  service: string;
  status: 'success' | 'error';
  message: string;
  timestamp: number;
}

export async function runFirebaseDiagnostics(): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = [];
  const testId = `test-${Date.now()}`;

  console.log('Starting Firebase diagnostics...');

  // Test Authentication
  try {
    console.log('Testing Authentication...');
    const userCred = await signInAnonymously(auth);
    results.push({
      service: 'Authentication',
      status: 'success',
      message: `Anonymous auth successful. UID: ${userCred.user.uid}`,
      timestamp: Date.now()
    });
    await signOut(auth);
  } catch (error) {
    results.push({
      service: 'Authentication',
      status: 'error',
      message: `Auth error: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: Date.now()
    });
  }

  // Test Firestore
  try {
    console.log('Testing Firestore...');
    const testDoc = doc(db, 'diagnostics', testId);
    await setDoc(testDoc, {
      test: true,
      timestamp: serverTimestamp()
    });
    
    const docSnap = await getDoc(testDoc);
    if (docSnap.exists()) {
      results.push({
        service: 'Firestore',
        status: 'success',
        message: 'Document write and read successful',
        timestamp: Date.now()
      });
    }
    
    await deleteDoc(testDoc);
  } catch (error) {
    results.push({
      service: 'Firestore',
      status: 'error',
      message: `Firestore error: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: Date.now()
    });
  }

  // Test Storage
  try {
    console.log('Testing Storage...');
    const testRef = ref(storage, `test/${testId}.txt`);
    await uploadString(testRef, 'Test content');
    const downloadUrl = await getDownloadURL(testRef);
    
    results.push({
      service: 'Storage',
      status: 'success',
      message: `File upload and download successful. URL: ${downloadUrl}`,
      timestamp: Date.now()
    });
    
    await deleteObject(testRef);
  } catch (error) {
    results.push({
      service: 'Storage',
      status: 'error',
      message: `Storage error: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: Date.now()
    });
  }

  // Test Cloud Messaging
  if (messaging) {
    try {
      console.log('Testing Cloud Messaging...');
      const token = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY'
      });
      
      results.push({
        service: 'Cloud Messaging',
        status: 'success',
        message: `FCM token obtained: ${token.slice(0, 10)}...`,
        timestamp: Date.now()
      });
    } catch (error) {
      results.push({
        service: 'Cloud Messaging',
        status: 'error',
        message: `FCM error: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: Date.now()
      });
    }
  } else {
    results.push({
      service: 'Cloud Messaging',
      status: 'error',
      message: 'FCM not available in this environment',
      timestamp: Date.now()
    });
  }

  console.log('Firebase diagnostics completed:', results);
  return results;
}