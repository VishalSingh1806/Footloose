import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This component just redirects to SubscriptionPlans
// Kept for routing flexibility
export function SubscriptionUpgrade() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/subscription', { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E63946] border-t-transparent" />
    </div>
  );
}
