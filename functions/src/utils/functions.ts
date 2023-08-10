import * as f from 'firebase-functions';

process.env.TZ = 'Asia/Tokyo';

export const functions8GB = f.runWith({ memory: '8GB' }).region('asia-northeast1');
export const functions4GB = f.runWith({ memory: '4GB' }).region('asia-northeast1');
export const functions2GB = f.runWith({ memory: '2GB' }).region('asia-northeast1');
export const functions1GB = f.runWith({ memory: '1GB' }).region('asia-northeast1');
export const functions512MB = f.runWith({ memory: '512MB' }).region('asia-northeast1');
export const functions256MB = f.runWith({ memory: '256MB' }).region('asia-northeast1');
export const functions128MB = f.runWith({ memory: '128MB' }).region('asia-northeast1');
