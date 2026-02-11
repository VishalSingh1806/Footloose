import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';

type QualityLevel = 'excellent' | 'fair' | 'poor';

interface ConnectionQualityProps {
  quality: QualityLevel;
  onQualityChange?: (quality: QualityLevel) => void;
}

function ConnectionQuality({ quality }: ConnectionQualityProps) {
  const getConfig = () => {
    switch (quality) {
      case 'excellent':
        return {
          icon: <Wifi size={16} />,
          text: 'Excellent',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        };
      case 'fair':
        return {
          icon: <AlertTriangle size={16} />,
          text: 'Fair',
          color: 'text-[#F77F00]',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
        };
      case 'poor':
        return {
          icon: <WifiOff size={16} />,
          text: 'Poor',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        };
    }
  };

  const config = getConfig();

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border
        ${config.bgColor} ${config.borderColor}`}
    >
      <span className={config.color}>{config.icon}</span>
      <span className={`text-xs font-semibold ${config.color}`}>{config.text}</span>
    </div>
  );
}

export default ConnectionQuality;
