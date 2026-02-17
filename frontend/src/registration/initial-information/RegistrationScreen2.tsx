import { useState, useEffect, useRef, KeyboardEvent, ClipboardEvent } from 'react';
import { ChevronLeft, Loader2, CheckCircle } from 'lucide-react';

interface RegistrationScreen2Props {
  phoneNumber: string;
  onNext: () => void;
  onBack: () => void;
  onChangeNumber: () => void;
}

function RegistrationScreen2({ phoneNumber, onNext, onBack, onChangeNumber }: RegistrationScreen2Props) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [shake, setShake] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto-submit when all 4 digits are filled
    if (newOtp.every((digit) => digit !== '')) {
      setTimeout(() => {
        handleVerifyWithOtp(newOtp.join(''));
      }, 100);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);

    if (pastedData.length === 4) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      setError('');
      inputRefs[3].current?.focus();

      // Auto-submit pasted OTP
      setTimeout(() => {
        handleVerifyWithOtp(pastedData);
      }, 100);
    }
  };

  const handleVerifyWithOtp = async (otpCode: string) => {
    if (otpCode.length !== 4 || isVerifying) return;

    setIsVerifying(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 1500));

    const isValid = otpCode === '1234';

    if (isValid) {
      setIsSuccess(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      onNext();
    } else {
      setIsVerifying(false);
      setError('Invalid code. Please try again.');
      setShake(true);
      setOtp(['', '', '', '']);
      setTimeout(() => setShake(false), 500);
      inputRefs[0].current?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    handleVerifyWithOtp(otpCode);
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setTimer(60);
    setOtp(['', '', '', '']);
    setError('');
    inputRefs[0].current?.focus();

    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isComplete = otp.every((digit) => digit !== '');

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace('+91', '');
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="px-5 pt-4 pb-2">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-white rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 text-[#1D3557]" />
          </button>
        </div>

        <div className="flex-1 flex flex-col px-5 py-8 max-w-[600px] w-full mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-[#1D3557] mb-2">
              Quick check
            </h1>
            <p className="text-base text-[#6C757D]">We verify everyone</p>
          </div>

          <div className="flex-1">
            <div className="text-center mb-8">
              <p className="text-[15px] font-semibold text-[#1D3557] mb-1">
                Code sent to {formatPhoneNumber(phoneNumber)}
              </p>
              <button
                onClick={onChangeNumber}
                className="text-sm text-[#E63946] underline hover:no-underline"
              >
                Change number
              </button>
            </div>

            <div className="mb-6">
              <div className={`flex justify-center gap-3 mb-2 ${shake ? 'animate-shake' : ''}`}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className={`w-14 h-14 text-center text-2xl font-semibold border-2 rounded-xl focus:outline-none transition-all ${
                      error
                        ? 'border-[#DC2626] focus:border-[#DC2626]'
                        : digit
                        ? 'border-[#E63946] bg-[#FFE5E5]/30'
                        : 'border-[#E5E7EB] focus:border-[#E63946]'
                    }`}
                    aria-label={`Digit ${index + 1}`}
                  />
                ))}
              </div>

              {error && (
                <p className="text-sm text-[#DC2626] text-center mt-3" role="alert">
                  {error}
                </p>
              )}
            </div>

            <div className="text-center mb-6">
              {canResend ? (
                <p className="text-sm text-[#6C757D]">
                  Didn't receive code?{' '}
                  <button
                    onClick={handleResend}
                    className="text-[#E63946] underline hover:no-underline font-semibold"
                  >
                    Resend
                  </button>
                </p>
              ) : (
                <p className="text-sm text-[#6C757D]">
                  Resend code in {formatTime(timer)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-[#FAFAFA] px-5 py-5 border-t border-[#E5E7EB]">
        <button
          onClick={handleVerify}
          disabled={!isComplete || isVerifying}
          className={`w-full h-[52px] rounded-xl font-semibold text-base transition-all flex items-center justify-center ${
            isComplete && !isVerifying
              ? 'bg-[#E63946] hover:bg-[#D62828] text-white active:scale-[0.98] shadow-[0_2px_8px_rgba(230,57,70,0.2)]'
              : 'bg-[#E63946] text-white opacity-50 cursor-not-allowed'
          }`}
          aria-label="Verify OTP"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Verifying...
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Verified
            </>
          ) : (
            'Verify'
          )}
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default RegistrationScreen2;
