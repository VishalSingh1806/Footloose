import { AlertTriangle } from 'lucide-react';

interface BlockUserModalProps {
  matchName: string;
  onBlock: () => void;
  onCancel: () => void;
}

function BlockUserModal({ matchName, onBlock, onCancel }: BlockUserModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle size={32} className="text-red-600" />
          </div>
        </div>

        {/* Content */}
        <h2 className="text-xl font-bold text-[#1D3557] text-center mb-2">
          Block {matchName}?
        </h2>
        <p className="text-gray-600 text-center mb-6">
          They won't be able to send you messages or see your profile. You can unblock them later from settings.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onBlock}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl
                       font-semibold active:scale-95 transition-all"
          >
            Block User
          </button>
          <button
            onClick={onCancel}
            className="w-full text-gray-600 hover:text-gray-800 py-2 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlockUserModal;
