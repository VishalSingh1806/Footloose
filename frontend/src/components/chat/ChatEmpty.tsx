import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ChatEmpty() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      {/* Icon */}
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <MessageCircle size={48} className="text-gray-400" />
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-bold text-[#1D3557] mb-3">
        No messages yet
      </h2>

      {/* Body */}
      <p className="text-[#6C757D] mb-8 max-w-sm">
        Start a conversation after a successful speed date or when both of you show interest.
      </p>

      {/* CTA Button */}
      <button
        onClick={() => navigate('/matches')}
        className="bg-[#E63946] hover:bg-[#D62839] text-white px-8 py-3 rounded-xl font-semibold
                   active:scale-95 transition-all"
      >
        Explore Matches
      </button>
    </div>
  );
}

export default ChatEmpty;
