import { httpsCallable as _httpsCallable, getFunctions } from 'firebase/functions';
import { firebaseApp } from './firebase-helper';

const functions = getFunctions(firebaseApp, 'asia-northeast1');

const httpsCallable = <Req, Res>(name: string) => _httpsCallable<Req, Res>(functions, name);

export const callFirebaseFunction = async <T>(functionName: FunctionName, callableArgs: T) => {
  const callable = httpsCallable<T, any>(functionName);
  const res = await callable(callableArgs);
  return res;
};

type FunctionName = 'fetch_html';
