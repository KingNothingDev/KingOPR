import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  User,
} from 'firebase/auth';
import {
  doc,
  getDocFromServer,
  getFirestore,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const firestoreDatabaseId =
  (firebaseConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId ||
  'ai-studio-oprstudio-88689b67-d05e-4d28-a0c2-efd83eca5143';
export const db = getFirestore(app, firestoreDatabaseId);
export const auth = getAuth(app);

export const SCOPES = ['https://www.googleapis.com/auth/drive'];

const googleProvider = new GoogleAuthProvider();
SCOPES.forEach((scope) => googleProvider.addScope(scope));

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export function initAuth(
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: (user: User | null) => void
) {
  return onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        onAuthSuccess?.(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        onAuthFailure?.(user);
      }
    } else {
      cachedAccessToken = null;
      onAuthFailure?.(null);
    }
  });
}

export async function googleSignIn(): Promise<{
  user: User;
  accessToken: string;
}> {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google Drive access token.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } finally {
    isSigningIn = false;
  }
}

export async function getAccessToken(): Promise<string | null> {
  return cachedAccessToken;
}

export function clearAccessToken(): void {
  cachedAccessToken = null;
}

export async function logout(): Promise<void> {
  await auth.signOut();
  cachedAccessToken = null;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

testConnection();

const COUNTER_PATH = 'counters/global';

export function subscribeToGlobalOprCount(
  initialFallbackCount: number,
  onCountChange: (count: number) => void
): () => void {
  const counterRef = doc(db, 'counters', 'global');
  let seeded = false;

  return onSnapshot(
    counterRef,
    async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const total =
          typeof data?.totalGenerated === 'number' && data.totalGenerated >= 1
            ? Math.floor(data.totalGenerated)
            : 1;
        onCountChange(total);
      } else if (!seeded) {
        seeded = true;
        const safeInitial = Math.max(
          1,
          Math.min(100000, Math.floor(initialFallbackCount || 1))
        );
        try {
          await runTransaction(db, async (tx) => {
            const currentSnap = await tx.get(counterRef);
            if (!currentSnap.exists()) {
              tx.set(counterRef, {
                totalGenerated: safeInitial,
                updatedAt: serverTimestamp(),
              });
            }
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, COUNTER_PATH);
        }
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, COUNTER_PATH);
    }
  );
}

export async function incrementGlobalOprCount(
  currentKnownCount: number
): Promise<void> {
  const counterRef = doc(db, 'counters', 'global');
  try {
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(counterRef);
      if (!snap.exists()) {
        const nextVal = Math.max(
          1,
          Math.min(100000, Math.floor((currentKnownCount || 1) + 1))
        );
        tx.set(counterRef, {
          totalGenerated: nextVal,
          updatedAt: serverTimestamp(),
        });
      } else {
        const current = snap.data()?.totalGenerated;
        const safeCurrent =
          typeof current === 'number' && Number.isInteger(current) && current >= 1
            ? current
            : 1;
        tx.update(counterRef, {
          totalGenerated: safeCurrent + 1,
          updatedAt: serverTimestamp(),
        });
      }
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, COUNTER_PATH);
  }
}
