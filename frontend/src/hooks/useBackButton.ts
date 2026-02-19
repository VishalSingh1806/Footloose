import { useEffect, useCallback } from 'react';

/**
 * Hook to handle Android back gesture and browser back button
 *
 * Works by intercepting browser back navigation and calling custom handler
 */
export function useBackButton(onBack: () => void) {
  const handleBack = useCallback(() => {
    onBack();
  }, [onBack]);

  useEffect(() => {
    // Delay the initial pushState to avoid interfering with navigation
    const timer = setTimeout(() => {
      // Add a dummy history entry to intercept back navigation
      window.history.pushState({ preventBack: true }, '');
    }, 100);

    const handlePopState = () => {
      // When user goes back, call our handler and push state again
      handleBack();
      // Push state again to stay in the app
      window.history.pushState({ preventBack: true }, '');
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('popstate', handlePopState);
      // Clean up the dummy state if component unmounts
      if (window.history.state?.preventBack) {
        window.history.back();
      }
    };
  }, [handleBack]);
}

/**
 * Hook to disable back gesture on specific screens
 * Use this on screens where back gesture should be disabled (like during video calls)
 */
export function useDisableBackGesture() {
  useEffect(() => {
    // Prevent back navigation during critical flows
    const preventBack = (event: PopStateEvent) => {
      event.preventDefault();
      window.history.pushState(null, '', window.location.href);
    };

    // Push initial state
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', preventBack);

    return () => {
      window.removeEventListener('popstate', preventBack);
    };
  }, []);
}

export default useBackButton;
