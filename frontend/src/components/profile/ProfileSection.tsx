import { ReactNode } from 'react';

interface ProfileSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

function ProfileSection({ title, children, className = '' }: ProfileSectionProps) {
  return (
    <div className={`bg-white rounded-2xl p-5 mx-4 mb-4 ${className}`}>
      <h2 className="text-lg font-semibold text-[#1D3557] mb-4">{title}</h2>
      {children}
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string | ReactNode;
  noBorder?: boolean;
}

export function InfoRow({ label, value, noBorder = false }: InfoRowProps) {
  return (
    <div
      className={`flex justify-between items-start py-3 ${
        noBorder ? '' : 'border-b border-gray-100 last:border-0'
      }`}
    >
      <span className="text-sm font-semibold text-[#6C757D] flex-shrink-0 w-40">{label}</span>
      <span className="text-[15px] text-[#1D3557] text-right flex-1">{value}</span>
    </div>
  );
}

export default ProfileSection;
