import { CheckCircle, AlertTriangle, XCircle, WifiOff } from 'lucide-react';

export type NoShowScenario =
  | 'attending'       // You showed up; other person didn't
  | 'no_show'         // You didn't show up
  | 'mutual_noshow'   // Both didn't show up
  | 'system_failure'; // Infrastructure failure — both refunded

interface NoShowResolutionProps {
  scenario: NoShowScenario;
  matchName: string;
  eventDate: string;           // Human-readable event date
  creditsRefunded: number;     // 200 if attending, 0 if no-show, 0 if mutual
  creditBalance: number;       // User's balance AFTER resolution
  noShowCount?: number;        // User's running no-show total (only relevant for no_show/mutual)
  onClose: () => void;
}

function NoShowResolution({
  scenario,
  matchName,
  eventDate,
  creditsRefunded,
  creditBalance,
  noShowCount = 0,
  onClose,
}: NoShowResolutionProps) {
  const renderContent = () => {
    switch (scenario) {
      // ── You attended; other person didn't ────────────────────────────────────
      case 'attending':
        return {
          icon: <CheckCircle size={40} className="text-green-600" />,
          iconBg: 'bg-green-100',
          heading: `${matchName} didn't show up`,
          body: (
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                {matchName} did not join your speed date on {eventDate}.
                Your 200 credits have been refunded automatically.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Refunded to your account</p>
                <p className="text-2xl font-bold text-green-700">+200 credits</p>
              </div>
              <p className="text-gray-500 text-xs">
                Thank you for showing up on time.
              </p>
            </div>
          ),
        };

      // ── You didn't show up ────────────────────────────────────────────────────
      case 'no_show':
        return {
          icon: <XCircle size={40} className="text-red-600" />,
          iconBg: 'bg-red-100',
          heading: 'You missed the speed date',
          body: (
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                You did not join your speed date with {matchName} on {eventDate}.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Not refunded</p>
                <p className="text-2xl font-bold text-red-700">0 credits</p>
                <p className="text-xs text-gray-500 mt-1">200 credits retained</p>
              </div>
              <p className="text-gray-600">
                {matchName}'s 200 credits were refunded to them.
              </p>

              {/* No-show count warning */}
              {noShowCount === 1 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-sm text-amber-800 font-medium">
                    No-show count: 1
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    Please only book speed dates you can attend. Repeated no-shows may result in suspension.
                  </p>
                </div>
              )}
              {noShowCount === 2 && (
                <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-3">
                  <p className="text-sm text-amber-900 font-semibold">
                    ⚠ No-show count: 2
                  </p>
                  <p className="text-xs text-amber-800 mt-1">
                    One more no-show will put your account under review. Please attend dates you book.
                  </p>
                </div>
              )}
              {noShowCount === 3 && (
                <div className="bg-red-50 border-2 border-red-400 rounded-xl p-3">
                  <p className="text-sm text-red-900 font-semibold">
                    No-show count: 3 — Account under review
                  </p>
                  <p className="text-xs text-red-800 mt-1">
                    Your account has been flagged for review. Booking is temporarily limited.
                    One more no-show will result in automatic suspension.
                  </p>
                </div>
              )}
              {noShowCount >= 4 && (
                <div className="bg-red-100 border-2 border-red-600 rounded-xl p-4">
                  <p className="text-sm text-red-900 font-bold">
                    Account suspended — {noShowCount} no-shows
                  </p>
                  <p className="text-xs text-red-800 mt-1">
                    Your account has been automatically suspended due to repeated no-shows.
                    Contact support to request a review.
                  </p>
                </div>
              )}
            </div>
          ),
        };

      // ── Both no-shows ─────────────────────────────────────────────────────────
      case 'mutual_noshow':
        return {
          icon: <AlertTriangle size={40} className="text-amber-600" />,
          iconBg: 'bg-amber-100',
          heading: 'Neither of you showed up',
          body: (
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                Neither you nor {matchName} joined the speed date on {eventDate}.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Not refunded (both absent)</p>
                <p className="text-2xl font-bold text-red-700">0 credits</p>
              </div>
              {noShowCount >= 1 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-sm text-amber-800 font-semibold">
                    No-show count: {noShowCount}
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    Please only book speed dates you can attend.
                  </p>
                </div>
              )}
            </div>
          ),
        };

      // ── System failure ────────────────────────────────────────────────────────
      case 'system_failure':
        return {
          icon: <WifiOff size={40} className="text-blue-600" />,
          iconBg: 'bg-blue-100',
          heading: 'Technical issue — full refund issued',
          body: (
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                A technical issue prevented the speed date with {matchName} from taking place.
                Your 200 credits have been refunded automatically.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Refunded to your account</p>
                <p className="text-2xl font-bold text-green-700">+200 credits</p>
              </div>
              <p className="text-xs text-gray-500">
                No attendance penalty applied. The incident has been logged for our technical team.
              </p>
            </div>
          ),
        };
    }
  };

  const content = renderContent();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full overflow-hidden">
        <div className="p-6">
          {/* Icon */}
          <div className={`w-16 h-16 ${content.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {content.icon}
          </div>

          {/* Heading */}
          <h2 className="text-xl font-bold text-[#1D3557] text-center mb-4">
            {content.heading}
          </h2>

          {/* Body */}
          {content.body}

          {/* Balance */}
          <div className="bg-[#8E44AD]/10 border border-[#8E44AD]/30 rounded-xl p-3 text-center mt-4">
            <p className="text-xs text-gray-500 mb-1">Current balance</p>
            <p className="text-xl font-bold text-[#8E44AD]">{creditBalance} credits</p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-[#9B59B6] text-white py-3 px-6 rounded-xl font-semibold
                       hover:bg-[#D62839] active:scale-95 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoShowResolution;
