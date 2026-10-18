import { useEffect } from 'react';
import { getTillCash } from 'shared/api/api.services';
import { useActiveTillStore } from './till.store';

// ----------------------------------------------------------------------

/**
 * Polls GET /api/tills/:id/cash every `intervalMs` (default: 1000ms = 1 sec)
 * and updates only the `cash_in_till` field in the Zustand store (`useActiveTillStore`).
 * Does not manipulate the DOM directly.
 */
export function useTillCashPolling(intervalMs: number = 1000) {
  const { activeTill, updateCashInTill } = useActiveTillStore();
  const tillId = activeTill?.id;
  const isOpen = activeTill?.status === 'open';

  useEffect(() => {
    if (!tillId || !isOpen) return;

    let isSubscribed = true;
    let isFetching = false;

    const fetchCash = async () => {
      if (isFetching || !isSubscribed) return;
      isFetching = true;

      try {
        const res = await getTillCash(tillId);
        if (!isSubscribed) return;

        const raw = res?.data;
        let cashNum: number | null = null;

        if (typeof raw === 'number') {
          cashNum = raw;
        } else if (typeof raw?.data === 'number') {
          cashNum = raw.data;
        } else if (typeof raw?.cash === 'number') {
          cashNum = raw.cash;
        } else if (typeof raw?.cash_in_till === 'number') {
          cashNum = raw.cash_in_till;
        } else if (typeof raw?.data?.cash === 'number') {
          cashNum = raw.data.cash;
        } else if (typeof raw?.data?.cash_in_till === 'number') {
          cashNum = raw.data.cash_in_till;
        } else if (typeof raw === 'string' && !Number.isNaN(Number(raw))) {
          cashNum = Number(raw);
        } else if (raw?.data && !Number.isNaN(Number(raw.data))) {
          cashNum = Number(raw.data);
        }

        if (cashNum !== null && !Number.isNaN(cashNum)) {
          updateCashInTill(cashNum);
        }
      } catch (err) {
        // Silently catch background polling errors (e.g. transient network latency)
      } finally {
        isFetching = false;
      }
    };

    fetchCash();
    const intervalId = setInterval(fetchCash, intervalMs);

    return () => {
      isSubscribed = false;
      clearInterval(intervalId);
    };
  }, [tillId, isOpen, intervalMs, updateCashInTill]);
}
