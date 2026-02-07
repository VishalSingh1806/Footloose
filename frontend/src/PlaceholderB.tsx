import { ChevronLeft } from 'lucide-react';

interface PlaceholderBProps {
  onContinue: () => void;
  onBack: () => void;
}

function PlaceholderB({ onContinue, onBack }: PlaceholderBProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4A261] to-[#E76F51] flex flex-col relative overflow-hidden">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
        aria-label="Go back"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
            Your life today
          </h1>
          <p className="text-lg text-white/90 mb-12 leading-relaxed">
            How you live and work matters day to day.
          </p>

          <button
            onClick={onContinue}
            className="w-full h-[52px] bg-white text-[#E76F51] font-semibold text-base rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlaceholderB;
