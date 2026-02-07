import { Heart } from 'lucide-react';

interface CompatibilityBadgeProps {
  score: number;
}

function CompatibilityBadge({ score }: CompatibilityBadgeProps) {
  const getColor = () => {
    if (score >= 85) return { bg: '#D1FAE5', text: '#06D6A0', label: 'Excellent Match' };
    if (score >= 75) return { bg: '#FEF3C7', text: '#F59E0B', label: 'Good Match' };
    return { bg: '#FEE2E2', text: '#EF4444', label: 'Fair Match' };
  };

  const { bg, text, label } = getColor();

  return (
    <div className="space-y-2">
      <div
        className="w-full px-4 py-3 rounded-lg flex items-center justify-between"
        style={{ backgroundColor: bg }}
      >
        <div className="flex items-center gap-2">
          <Heart size={18} style={{ color: text }} fill={text} />
          <span className="font-semibold text-sm" style={{ color: text }}>
            {score}% Match
          </span>
          <span className="text-xs opacity-75" style={{ color: text }}>
            • {label}
          </span>
        </div>
      </div>
      <p className="text-xs text-[#6C757D] text-center">
        Based on lifestyle, values, and family background
      </p>
    </div>
  );
}

export default CompatibilityBadge;
