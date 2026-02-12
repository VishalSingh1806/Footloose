import { useEffect, useRef } from 'react';

/**
 * useWakeLock - Prevents device from sleeping during video calls
 *
 * Uses the Screen Wake Lock API to keep the screen on during active calls.
 * Automatically releases when component unmounts or call ends.
 */
export function useWakeLock(isActive: boolean = false) {
  const wakeLock = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator && isActive) {
          wakeLock.current = await navigator.wakeLock.request('screen');
          console.log('Wake lock acquired');

          wakeLock.current.addEventListener('release', () => {
            console.log('Wake lock released');
          });
        }
      } catch (err) {
        console.error('Failed to acquire wake lock:', err);
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLock.current) {
        try {
          await wakeLock.current.release();
          wakeLock.current = null;
        } catch (err) {
          console.error('Failed to release wake lock:', err);
        }
      }
    };

    if (isActive) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    return () => {
      releaseWakeLock();
    };
  }, [isActive]);

  return wakeLock;
}
