import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Heart, Phone, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';

interface RegistrationScreen1Props {
  onNext: (data: {
    type: 'phone';
    firstName: string;
    lastName: string;
    phoneNumber: string
  } | {
    type: 'email';
    firstName: string;
    lastName: string;
    email: string;
    password: string
  }) => void;
  onBack: () => void;
}

type SignUpMode = 'phone' | 'email';

function RegistrationScreen1({ onNext, onBack }: RegistrationScreen1Props) {
  const [mode, setMode] = useState<SignUpMode>('phone');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ firstName: '', lastName: '', phone: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const firstNameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstNameInputRef.current?.focus();
  }, []);

  const validatePhoneNumber = (number: string): boolean => {
    const cleaned = number.replace(/\D/g, '');
    return cleaned.length === 10;
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

  const validatePassword = (value: string): boolean => {
    if (value.length < 8) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters' }));
      return false;
    }
    setErrors(prev => ({ ...prev, password: '' }));
    return true;
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
    if (value && errors.email) {
      validateEmail(value);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (value && errors.password) {
      validatePassword(value);
    }
  };

  const validateName = (name: string, field: 'firstName' | 'lastName'): boolean => {
    if (!name || name.trim().length < 2) {
      setErrors(prev => ({ ...prev, [field]: `${field === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters` }));
      return false;
    }
    setErrors(prev => ({ ...prev, [field]: '' }));
    return true;
  };

  const handleNext = async () => {
    const firstNameValid = validateName(firstName, 'firstName');
    const lastNameValid = validateName(lastName, 'lastName');

    if (!firstNameValid || !lastNameValid) {
      return;
    }

    if (mode === 'phone') {
      if (!validatePhoneNumber(phoneNumber)) {
        setErrors(prev => ({ ...prev, phone: 'Please enter a valid 10-digit mobile number' }));
        return;
      }

      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onNext({ type: 'phone', firstName: firstName.trim(), lastName: lastName.trim(), phoneNumber: '+91' + phoneNumber });
    } else {
      const emailValid = validateEmail(email);
      const passwordValid = validatePassword(password);

      if (emailValid && passwordValid) {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        onNext({ type: 'email', firstName: firstName.trim(), lastName: lastName.trim(), email, password });
      }
    }
  };

  const isNamesValid = firstName.trim().length >= 2 && lastName.trim().length >= 2;
  const isPhoneValid = validatePhoneNumber(phoneNumber);
  const isEmailValid = email && password && !errors.email && !errors.password && password.length >= 8;
  const isValid = mode === 'phone' ? (isNamesValid && isPhoneValid) : (isNamesValid && isEmailValid);

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
            <h1 className="text-2xl font-semibold text-[#1D3557] mb-3">
              Register yourself to Meet Someone Amazing
            </h1>
            <Heart className="w-6 h-6 text-[#E63946] mx-auto" fill="#E63946" />
          </div>

          {/* Segmented Control */}
          <div className="flex bg-white rounded-[12px] p-1 mb-8 border border-[#E5E7EB]">
            <button
              onClick={() => setMode('phone')}
              className={`
                flex-1 h-[44px] rounded-[10px] font-semibold text-sm transition-all flex items-center justify-center gap-2
                ${
                  mode === 'phone'
                    ? 'bg-[#E63946] text-white shadow-sm'
                    : 'text-[#6C757D] hover:text-[#1D3557]'
                }
              `}
              aria-label="Sign up with phone"
            >
              <Phone className="w-4 h-4" />
              Phone
            </button>
            <button
              onClick={() => setMode('email')}
              className={`
                flex-1 h-[44px] rounded-[10px] font-semibold text-sm transition-all flex items-center justify-center gap-2
                ${
                  mode === 'email'
                    ? 'bg-[#E63946] text-white shadow-sm'
                    : 'text-[#6C757D] hover:text-[#1D3557]'
                }
              `}
              aria-label="Sign up with email"
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
          </div>

          <div className="flex-1">
            {/* Name Fields (Common for both modes) */}
            <div className="space-y-5 mb-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-[#1D3557] mb-2">
                  First Name
                </label>
                <input
                  ref={firstNameInputRef}
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setErrors(prev => ({ ...prev, firstName: '' }));
                  }}
                  onBlur={() => firstName && validateName(firstName, 'firstName')}
                  placeholder="Enter your first name"
                  className={`w-full h-[52px] px-4 bg-white border rounded-[10px] text-base text-[#1D3557] placeholder:text-[#9CA3AF] focus:outline-none transition-all ${
                    errors.firstName
                      ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20'
                      : 'border-[#E5E7EB] focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20'
                  }`}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                />
                {errors.firstName && (
                  <p id="firstName-error" className="mt-2 text-[13px] text-[#DC2626] animate-[slideDown_0.2s_ease-out]">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-[#1D3557] mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setErrors(prev => ({ ...prev, lastName: '' }));
                  }}
                  onBlur={() => lastName && validateName(lastName, 'lastName')}
                  placeholder="Enter your last name"
                  className={`w-full h-[52px] px-4 bg-white border rounded-[10px] text-base text-[#1D3557] placeholder:text-[#9CA3AF] focus:outline-none transition-all ${
                    errors.lastName
                      ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20'
                      : 'border-[#E5E7EB] focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20'
                  }`}
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                />
                {errors.lastName && (
                  <p id="lastName-error" className="mt-2 text-[13px] text-[#DC2626] animate-[slideDown_0.2s_ease-out]">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Phone Mode */}
            {mode === 'phone' && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-6 h-6 text-[#E63946]" />
                  <h2 className="text-xl font-semibold text-[#E63946]">Enter Mobile Number</h2>
                </div>

                <p className="text-[15px] text-[#6C757D] mb-6">
                  Enter your number to begin your journey.
                </p>

                <div className="mb-2">
                  <div className="flex gap-3">
                    <div className="w-[80px]">
                      <div className="h-[52px] border border-[#E5E7EB] rounded-[10px] px-3 flex items-center justify-center bg-white">
                        <span className="text-base font-medium text-[#1D3557]">+91</span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <input
                        ref={phoneInputRef}
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder="Enter Mobile Number..."
                        className={`w-full h-[52px] border rounded-[10px] px-4 text-base focus:outline-none transition-all ${
                          errors.phone
                            ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20'
                            : 'border-[#E5E7EB] focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20'
                        }`}
                        aria-label="Mobile number"
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? 'phone-error' : 'phone-help'}
                      />
                    </div>
                  </div>

                  {errors.phone ? (
                    <p id="phone-error" className="text-sm text-[#DC2626] mt-2 animate-[slideDown_0.2s_ease-out]">
                      {errors.phone}
                    </p>
                  ) : (
                    <p id="phone-help" className="text-[13px] text-[#6C757D] mt-2">
                      We'll send you a one-time verification code.
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Email Mode */}
            {mode === 'email' && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-6 h-6 text-[#E63946]" />
                  <h2 className="text-xl font-semibold text-[#E63946]">Create Your Account</h2>
                </div>

                <p className="text-[15px] text-[#6C757D] mb-6">
                  Sign up with your email and password.
                </p>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-[#1D3557] mb-2">
                      Email address
                    </label>
                    <input
                      ref={emailInputRef}
                      id="email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      onBlur={() => email && validateEmail(email)}
                      placeholder="your.email@example.com"
                      className={`w-full h-[52px] px-4 bg-white border rounded-[10px] text-base text-[#1D3557] placeholder:text-[#9CA3AF] focus:outline-none transition-all ${
                        errors.email
                          ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20'
                          : 'border-[#E5E7EB] focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20'
                      }`}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-2 text-[13px] text-[#DC2626] animate-[slideDown_0.2s_ease-out]">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-[#1D3557] mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={handlePasswordChange}
                        onBlur={() => password && validatePassword(password)}
                        placeholder="Minimum 8 characters"
                        className={`w-full h-[52px] px-4 pr-12 bg-white border rounded-[10px] text-base text-[#1D3557] placeholder:text-[#9CA3AF] focus:outline-none transition-all ${
                          errors.password
                            ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20'
                            : 'border-[#E5E7EB] focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20'
                        }`}
                        aria-describedby={errors.password ? 'password-error' : undefined}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6C757D] hover:text-[#1D3557] transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p id="password-error" className="mt-2 text-[13px] text-[#DC2626] animate-[slideDown_0.2s_ease-out]">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

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
              {mode === 'phone' ? 'Sending OTP...' : 'Creating Account...'}
            </>
          ) : (
            mode === 'phone' ? 'Next' : 'Continue with Email'
          )}
        </button>

        <p className="text-xs text-center text-[#6C757D] mt-4 leading-relaxed">
          By continuing, you agree to our{' '}
          <a href="#" className="text-[#E63946] underline">
            Terms & Conditions
          </a>{' '}
          and{' '}
          <a href="#" className="text-[#E63946] underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegistrationScreen1;
