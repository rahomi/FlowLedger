export interface SyncStatus {
  isOnline: boolean;
  pendingCount: number;
  lastSync: Date | null;
  status: 'idle' | 'syncing' | 'error';
}

export const initialSyncStatus: SyncStatus = {
  isOnline: navigator.onLine,
  pendingCount: 0,
  lastSync: null,
  status: 'idle'
};