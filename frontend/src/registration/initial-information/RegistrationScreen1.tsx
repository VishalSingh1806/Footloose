import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';

interface RegistrationScreen1Props {
  onNext: (data: {
    fullName: string;
    phoneNumber: string;
    email: string;
  }) => void;
  onBack: () => void;
}

function RegistrationScreen1({ onNext, onBack }: RegistrationScreen1Props) {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({ fullName: '', phone: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const validateName = (name: string): boolean => {
    if (!name || name.trim().length < 2) {
      setErrors(prev => ({ ...prev, fullName: 'Name must be at least 2 characters' }));
      return false;
    }
    setErrors(prev => ({ ...prev, fullName: '' }));
    return true;
  };

  const validatePhoneNumber = (number: string): boolean => {
    const cleaned = number.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setErrors(prev => ({ ...prev, phone: 'Please enter a valid 10-digit mobile number' }));
      return false;
    }
    setErrors(prev => ({ ...prev, phone: '' }));
    return true;
  };

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      return false;
    }
    setErrors(prev => ({ ...prev, email: '' }));
    return true;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFullName(value);
    setErrors(prev => ({ ...prev, fullName: '' }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setErrors(prev => ({ ...prev, email: '' }));
  };

  const handleNext = async () => {
    const nameValid = validateName(fullName);
    const phoneValid = validatePhoneNumber(phoneNumber);
    const emailValid = validateEmail(email);

    if (!nameValid || !phoneValid || !emailValid) {
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onNext({
      fullName: fullName.trim(),
      phoneNumber: '+91' + phoneNumber,
      email: email.trim()
    });
  };

  const isNameValid = fullName.trim().length >= 2;
  const isPhoneValid = phoneNumber.replace(/\D/g, '').length === 10;
  const isEmailFormatValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValid = isNameValid && isPhoneValid && isEmailFormatValid;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <div className="flex-1 flex flex-col">
        {/* Back Button */}
        <div className="px-5 pt-4 pb-2">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-white rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 text-[#1D3557]" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col px-5 py-6 max-w-[600px] w-full mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#1D3557] mb-2">
              Let's get started
            </h1>
            <p className="text-[15px] text-[#6C757D]">
              We'll ask a few direct questions to understand you better.
            </p>
          </div>

          {/* Form Fields */}
          <div className="flex-1">
            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-[#1D3557] mb-2">
                  Name
                </label>
                <input
                  ref={nameInputRef}
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={handleNameChange}
                  onBlur={() => fullName && validateName(fullName)}
                  placeholder="Your full name"
                  className={`w-full h-[52px] px-4 bg-white border rounded-[10px] text-base text-[#1D3557] placeholder:text-[#9CA3AF] focus:outline-none transition-all ${
                    errors.fullName
                      ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20'
                      : 'border-[#E5E7EB] focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20'
                  }`}
                  aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                />
                {errors.fullName && (
                  <p id="fullName-error" className="mt-2 text-[13px] text-[#DC2626]">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-semibold text-[#1D3557] mb-2">
                  Mobile Number
                </label>
                <div className="flex gap-3">
                  <div className="w-[80px]">
                    <div className="h-[52px] border border-[#E5E7EB] rounded-[10px] px-3 flex items-center justify-center bg-white">
                      <span className="text-base font-medium text-[#1D3557]">+91</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <input
                      id="mobileNumber"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      onBlur={() => phoneNumber && validatePhoneNumber(phoneNumber)}
                      placeholder="10-digit mobile number"
                      className={`w-full h-[52px] border rounded-[10px] px-4 text-base text-[#1D3557] placeholder:text-[#9CA3AF] focus:outline-none transition-all ${
                        errors.phone
                          ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20'
                          : 'border-[#E5E7EB] focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20'
                      }`}
                      aria-label="Mobile number"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                    />
                  </div>
                </div>
                {errors.phone && (
                  <p id="phone-error" className="mt-2 text-[13px] text-[#DC2626]">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#1D3557] mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => email && validateEmail(email)}
                  placeholder="your@email.com"
                  className={`w-full h-[52px] px-4 bg-white border rounded-[10px] text-base text-[#1D3557] placeholder:text-[#9CA3AF] focus:outline-none transition-all ${
                    errors.email
                      ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20'
                      : 'border-[#E5E7EB] focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20'
                  }`}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-2 text-[13px] text-[#DC2626]">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 bg-[#FAFAFA] px-5 py-5 border-t border-[#E5E7EB]">
        <button
          onClick={handleNext}
          disabled={!isValid || isLoading}
          className={`w-full h-[52px] rounded-xl font-semibold text-base transition-all flex items-center justify-center ${
            isValid && !isLoading
              ? 'bg-[#E63946] hover:bg-[#D62828] text-white active:scale-[0.98] shadow-[0_2px_8px_rgba(230,57,70,0.2)]'
              : 'bg-[#E63946] text-white opacity-50 cursor-not-allowed'
          }`}
          aria-label="Continue to next step"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Sending OTP...
            </>
          ) : (
            'Continue'
          )}
        </button>

        <p className="text-xs text-center text-[#6C757D] mt-4 leading-relaxed">
          By continuing, you agree to our{' '}
          <a href="#" className="text-[#1D3557] underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-[#1D3557] underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegistrationScreen1;
