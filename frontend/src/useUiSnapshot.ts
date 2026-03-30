import { useEffect, useState } from 'react';
import { mockUiSnapshot } from './mockData';
import type { DataSource, UiSnapshot } from './types';

const STORAGE_KEY = 'kakeibo-ui-snapshot';
const BACKEND_ENDPOINT = '/api/ui-snapshot';
const BACKEND_EVENT = 'kakeibo:ui-snapshot';

type UseUiSnapshotResult = {
  snapshot: UiSnapshot;
  source: DataSource;
  lastUpdatedLabel: string;
  backendStatus: string;
  refreshFromBackend: () => Promise<void>;
};

function isUiSnapshot(value: unknown): value is UiSnapshot {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const snapshot = value as Partial<UiSnapshot>;

  return Boolean(
    snapshot.login &&
      snapshot.ledger &&
      snapshot.ledgerCreate &&
      Array.isArray(snapshot.ledger.summaryCards) &&
      Array.isArray(snapshot.ledger.transactions) &&
      Array.isArray(snapshot.ledger.monthlyBudgets),
  );
}

function extractSnapshot(payload: unknown): UiSnapshot | null {
  if (isUiSnapshot(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    const nested = (payload as { data?: unknown }).data;
    if (isUiSnapshot(nested)) {
      return nested;
    }
  }

  return null;
}

function createTimestampLabel() {
  return new Intl.DateTimeFormat('ja-JP', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date());
}

export function useUiSnapshot(): UseUiSnapshotResult {
  const [snapshot, setSnapshot] = useState<UiSnapshot>(mockUiSnapshot);
  const [source, setSource] = useState<DataSource>('mock');
  const [lastUpdatedLabel, setLastUpdatedLabel] = useState<string>(() => createTimestampLabel());
  const [backendStatus, setBackendStatus] = useState('モックデータを表示中');

  useEffect(() => {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (storedValue) {
      try {
        const parsed = JSON.parse(storedValue) as unknown;
        const storedSnapshot = extractSnapshot(parsed);
        if (storedSnapshot) {
          setSnapshot(storedSnapshot);
          setSource('local');
          setLastUpdatedLabel(createTimestampLabel());
          setBackendStatus('localStorage から復元しました');
        }
      } catch {
        setBackendStatus('保存データの復元に失敗したため、モックを継続表示中です');
      }
    }

    const handleBackendPush = (event: Event) => {
      const customEvent = event as CustomEvent<unknown>;
      const nextSnapshot = extractSnapshot(customEvent.detail);

      if (!nextSnapshot) {
        return;
      }

      setSnapshot(nextSnapshot);
      setSource('backend');
      setLastUpdatedLabel(createTimestampLabel());
      setBackendStatus('バックエンドからのイベントで上書きしました');
    };

    window.addEventListener(BACKEND_EVENT, handleBackendPush as EventListener);

    return () => {
      window.removeEventListener(BACKEND_EVENT, handleBackendPush as EventListener);
    };
  }, []);

  const refreshFromBackend = async () => {
    try {
      const response = await fetch(BACKEND_ENDPOINT, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        setBackendStatus('バックエンド API は未接続です');
        return;
      }

      const payload = (await response.json()) as unknown;
      const nextSnapshot = extractSnapshot(payload);

      if (!nextSnapshot) {
        setBackendStatus('バックエンド応答の形式が未対応です');
        return;
      }

      setSnapshot(nextSnapshot);
      setSource('backend');
      setLastUpdatedLabel(createTimestampLabel());
      setBackendStatus('バックエンド API から取得して上書きしました');
    } catch {
      setBackendStatus('バックエンド API の取得に失敗したため、モック表示を継続しています');
    }
  };

  return {
    snapshot,
    source,
    lastUpdatedLabel,
    backendStatus,
    refreshFromBackend,
  };
}
