import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';

interface RegistrationScreen1Props {
  onNext: (data: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
  }) => void;
  onBack: () => void;
}

function RegistrationScreen1({ onNext, onBack }: RegistrationScreen1Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({ firstName: '', lastName: '', phone: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const firstNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstNameInputRef.current?.focus();
  }, []);

  const validateFirstName = (name: string): boolean => {
    if (!name || name.trim().length < 2) {
      setErrors(prev => ({ ...prev, firstName: 'First name must be at least 2 characters' }));
      return false;
    }
    setErrors(prev => ({ ...prev, firstName: '' }));
    return true;
  };

  const validateLastName = (name: string): boolean => {
    if (!name || name.trim().length < 2) {
      setErrors(prev => ({ ...prev, lastName: 'Last name must be at least 2 characters' }));
      return false;
    }
    setErrors(prev => ({ ...prev, lastName: '' }));
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

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
    setErrors(prev => ({ ...prev, firstName: '' }));
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
    setErrors(prev => ({ ...prev, lastName: '' }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrors(prev => ({ ...prev, email: '' }));
  };

  const handleNext = async () => {
    const firstNameValid = validateFirstName(firstName);
    const lastNameValid = validateLastName(lastName);
    const phoneValid = validatePhoneNumber(phoneNumber);
    const emailValid = validateEmail(email);

    if (!firstNameValid || !lastNameValid || !phoneValid || !emailValid) {
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onNext({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber: '+91' + phoneNumber,
      email: email.trim()
    });
  };

  const isFirstNameValid = firstName.trim().length >= 2;
  const isLastNameValid = lastName.trim().length >= 2;
  const isPhoneValid = phoneNumber.replace(/\D/g, '').length === 10;
  const isEmailFormatValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValid = isFirstNameValid && isLastNameValid && isPhoneValid && isEmailFormatValid;

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
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-[#1D3557] mb-2">
                  First Name <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  ref={firstNameInputRef}
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  onBlur={() => firstName && validateFirstName(firstName)}
                  placeholder="Your first name"
                  className={`w-full h-[52px] px-4 bg-white border rounded-[10px] text-base text-[#1D3557] placeholder:text-[#9CA3AF] focus:outline-none transition-all ${
                    errors.firstName
                      ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20'
                      : 'border-[#E5E7EB] focus:border-[#9B59B6] focus:ring-2 focus:ring-[#9B59B6]/20'
                  }`}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                />
                {errors.firstName && (
                  <p id="firstName-error" className="mt-2 text-[13px] text-[#DC2626]">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-[#1D3557] mb-2">
                  Last Name <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={handleLastNameChange}
                  onBlur={() => lastName && validateLastName(lastName)}
                  placeholder="Your last name"
                  className={`w-full h-[52px] px-4 bg-white border rounded-[10px] text-base text-[#1D3557] placeholder:text-[#9CA3AF] focus:outline-none transition-all ${
                    errors.lastName
                      ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20'
                      : 'border-[#E5E7EB] focus:border-[#9B59B6] focus:ring-2 focus:ring-[#9B59B6]/20'
                  }`}
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                />
                {errors.lastName && (
                  <p id="lastName-error" className="mt-2 text-[13px] text-[#DC2626]">
                    {errors.lastName}
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-semibold text-[#1D3557] mb-2">
                  Mobile Number <span className="text-[#DC2626]">*</span>
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
                          : 'border-[#E5E7EB] focus:border-[#9B59B6] focus:ring-2 focus:ring-[#9B59B6]/20'
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
                  Email Address <span className="text-[#DC2626]">*</span>
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
                      : 'border-[#E5E7EB] focus:border-[#9B59B6] focus:ring-2 focus:ring-[#9B59B6]/20'
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
              ? 'bg-[#9B59B6] hover:bg-[#8E44AD] text-white active:scale-[0.98] shadow-[0_2px_8px_rgba(155,89,182,0.2)]'
              : 'bg-[#9B59B6] text-white opacity-50 cursor-not-allowed'
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
