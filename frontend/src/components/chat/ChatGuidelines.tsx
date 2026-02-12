import { useState } from 'react';
import { Shield, X } from 'lucide-react';

interface ChatGuidelinesProps {
  onAccept: () => void;
  onClose: () => void;
}

function ChatGuidelines({ onAccept, onClose }: ChatGuidelinesProps) {
  const [agreed, setAgreed] = useState(false);

  const guidelines = [
    {
      title: 'Keep it respectful',
      description: 'Treat everyone with kindness and respect',
    },
    {
      title: "Don't share personal info too soon",
      description: 'Avoid sharing phone number, address, financial details until you're comfortable',
    },
    {
      title: 'Meet in public first',
      description: 'When ready to meet, choose public places',
    },
    {
      title: 'Report concerns',
      description: 'Flag inappropriate behavior immediately',
    },
    {
      title: 'Trust your instincts',
      description: 'If something feels off, it probably is',
    },
    {
      title: 'No solicitation',
      description: "Don't ask for money or promote businesses",
    },
    {
      title: 'Stay on platform initially',
      description: 'Keep conversations here until you build trust',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Shield size={24} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-[#1D3557]">Stay Safe While Chatting</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
            aria-label="Close"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {guidelines.map((guideline, index) => (
              <div key={index} className="flex gap-3">
                <div className="w-6 h-6 bg-[#E63946] text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold">{index + 1}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[#1D3557] mb-1">{guideline.title}</h3>
                  <p className="text-sm text-gray-600">{guideline.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkbox */}
          <div className="mt-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 mt-0.5 text-[#E63946] rounded border-gray-300 focus:ring-[#E63946]"
              />
              <span className="text-sm text-gray-600">
                I understand and agree to follow these guidelines
              </span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 space-y-3">
          <button
            onClick={onAccept}
            disabled={!agreed}
            className="w-full bg-[#E63946] hover:bg-[#D62839] text-white py-3 px-6 rounded-xl
                       font-semibold active:scale-95 transition-all disabled:opacity-50
                       disabled:cursor-not-allowed disabled:hover:bg-[#E63946]"
          >
            Start Chatting
          </button>
          <button
            onClick={onClose}
            className="w-full text-[#6C757D] hover:text-[#1D3557] py-2 font-medium"
          >
            Read full Safety Guidelines
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatGuidelines;
