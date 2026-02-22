import { useState } from 'react';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { STATES, STATES_AND_CITIES } from '../../citiesData';
import CustomDropdown from '../../components/common/CustomDropdown';

interface RegistrationScreen3BProps {
  onNext: (data: { heightFeet: number; heightInches: number; weight: number; city: string; state: string }) => void;
  onBack: () => void;
}

function RegistrationScreen3B({ onNext, onBack }: RegistrationScreen3BProps) {
  const [heightFeet, setHeightFeet] = useState<number | ''>('');
  const [heightInches, setHeightInches] = useState<number | ''>('');
  const [weight, setWeight] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [city, setCity] = useState<string>('');

  const [errors, setErrors] = useState<{
    height?: string;
    weight?: string;
    state?: string;
    city?: string;
  }>({});

  const availableCities = state ? STATES_AND_CITIES[state] || [] : [];

  const validateWeight = (value: string): boolean => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 30 || num > 200) {
      setErrors(prev => ({ ...prev, weight: 'Weight must be between 30-200 kg' }));
      return false;
    }
    setErrors(prev => ({ ...prev, weight: undefined }));
    return true;
  };

  const validateHeight = (): boolean => {
    if (heightFeet === '' || heightInches === '') {
      setErrors(prev => ({ ...prev, height: 'Please select both feet and inches' }));
      return false;
    }
    setErrors(prev => ({ ...prev, height: undefined }));
    return true;
  };

  const validateState = (): boolean => {
    if (!state) {
      setErrors(prev => ({ ...prev, state: 'Please select a state' }));
      return false;
    }
    setErrors(prev => ({ ...prev, state: undefined }));
    return true;
  };

  const validateCity = (): boolean => {
    if (!city) {
      setErrors(prev => ({ ...prev, city: 'Please select a city' }));
      return false;
    }
    setErrors(prev => ({ ...prev, city: undefined }));
    return true;
  };

  const isFormValid = (): boolean => {
    return (
      heightFeet !== '' &&
      heightInches !== '' &&
      weight !== '' &&
      parseFloat(weight) >= 30 &&
      parseFloat(weight) <= 200 &&
      state !== '' &&
      city !== ''
    );
  };

  const handleContinue = () => {
    const heightValid = validateHeight();
    const weightValid = validateWeight(weight);
    const stateValid = validateState();
    const cityValid = validateCity();

    if (heightValid && weightValid && stateValid && cityValid) {
      onNext({
        heightFeet: heightFeet as number,
        heightInches: heightInches as number,
        weight: parseFloat(weight),
        city,
        state,
      });
    }
  };

  const handleWeightChange = (value: string) => {
    setWeight(value);
    if (value) {
      validateWeight(value);
    } else {
      setErrors(prev => ({ ...prev, weight: undefined }));
    }
  };

  const handleStateChange = (value: string) => {
    setState(value);
    setCity('');
    if (value) {
      setErrors(prev => ({ ...prev, state: undefined, city: undefined }));
    }
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    if (value) {
      setErrors(prev => ({ ...prev, city: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="px-5 pt-4 pb-3 relative">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-[#FAFAFA] rounded-lg transition-colors absolute left-3 top-3"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 text-[#1D3557]" />
          </button>
          <div className="text-center">
            <p className="text-xs font-semibold tracking-wider text-[#6C757D] uppercase">
              Personal Details
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-[6px] bg-[#E5E7EB] relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] transition-all duration-500 ease-out"
            style={{ width: '15%' }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5 py-8 pb-28 max-w-[600px] w-full mx-auto">
        <h1 className="text-2xl font-semibold text-[#1D3557] mb-2">
          Basic details
        </h1>

        <p className="text-[14px] text-[#6C757D] mb-6">
          This helps us understand your background
        </p>

        <div className="space-y-5">
          {/* Height */}
          <div>
            <label className="block text-sm font-semibold text-[#1D3557] mb-2">
              Height
            </label>
            <div className="flex gap-[4%]">
              {/* Feet */}
              <div className="w-[48%] relative">
                <select
                  value={heightFeet}
                  onChange={(e) => {
                    setHeightFeet(e.target.value ? Number(e.target.value) : '');
                    if (e.target.value && heightInches !== '') {
                      setErrors(prev => ({ ...prev, height: undefined }));
                    }
                  }}
                  aria-label="Height in feet"
                  className={`
                    w-full h-[52px] px-4 pr-10 bg-white rounded-[10px] border-2 text-base
                    appearance-none cursor-pointer transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-[#9B59B6]/20
                    ${heightFeet !== ''
                      ? 'border-[#9B59B6] text-[#1D3557] focus:border-[#9B59B6]'
                      : 'border-[#E5E7EB] text-[#ADB5BD] hover:border-[#9CA3AF] focus:border-[#9B59B6]'
                    }
                  `}
                >
                  <option value="">Feet</option>
                  <option value="4">4 ft</option>
                  <option value="5">5 ft</option>
                  <option value="6">6 ft</option>
                  <option value="7">7 ft</option>
                </select>
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors ${heightFeet !== '' ? 'text-[#9B59B6]' : 'text-[#6C757D]'}`} />
              </div>

              {/* Inches */}
              <div className="w-[48%] relative">
                <select
                  value={heightInches}
                  onChange={(e) => {
                    setHeightInches(e.target.value ? Number(e.target.value) : '');
                    if (e.target.value && heightFeet !== '') {
                      setErrors(prev => ({ ...prev, height: undefined }));
                    }
                  }}
                  aria-label="Height in inches"
                  className={`
                    w-full h-[52px] px-4 pr-10 bg-white rounded-[10px] border-2 text-base
                    appearance-none cursor-pointer transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-[#9B59B6]/20
                    ${heightInches !== ''
                      ? 'border-[#9B59B6] text-[#1D3557] focus:border-[#9B59B6]'
                      : 'border-[#E5E7EB] text-[#ADB5BD] hover:border-[#9CA3AF] focus:border-[#9B59B6]'
                    }
                  `}
                >
                  <option value="">Inches</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={i}>
                      {i} in
                    </option>
                  ))}
                </select>
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors ${heightInches !== '' ? 'text-[#9B59B6]' : 'text-[#6C757D]'}`} />
              </div>
            </div>
            {errors.height && (
              <p className="mt-2 text-[13px] text-[#DC2626] animate-[slideDown_0.2s_ease-out]">
                {errors.height}
              </p>
            )}
          </div>

          {/* Weight */}
          <div>
            <label htmlFor="weight" className="block text-sm font-semibold text-[#1D3557] mb-2">
              Weight (kg)
            </label>
            <div className="relative">
              <input
                id="weight"
                type="number"
                inputMode="numeric"
                min="30"
                max="200"
                value={weight}
                onChange={(e) => handleWeightChange(e.target.value)}
                placeholder="Enter weight"
                className="w-full h-[52px] px-4 pr-12 bg-white border border-[#E5E7EB] rounded-[10px] text-base text-[#1D3557] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#9B59B6] transition-colors"
                aria-describedby={errors.weight ? 'weight-error' : undefined}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6C757D] text-sm font-medium">
                kg
              </span>
            </div>
            {errors.weight && (
              <p id="weight-error" className="mt-2 text-[13px] text-[#DC2626] animate-[slideDown_0.2s_ease-out]">
                {errors.weight}
              </p>
            )}
          </div>

          {/* State */}
          <CustomDropdown
            id="state"
            label="Home State"
            value={state}
            onChange={(e) => handleStateChange(e.target.value)}
            options={STATES}
            placeholder="Select state"
            error={errors.state}
          />

          {/* City */}
          <CustomDropdown
            id="city"
            label="Home City"
            value={city}
            onChange={(e) => handleCityChange(e.target.value)}
            options={availableCities}
            placeholder={state ? 'Select city' : 'Select state first'}
            disabled={!state}
            error={errors.city}
          />
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FAFAFA] px-5 py-5 border-t border-[#E5E7EB]">
        <div className="max-w-[600px] mx-auto">
          <button
            onClick={handleContinue}
            disabled={!isFormValid()}
            className={`
              w-full h-[52px] rounded-xl font-semibold text-base transition-all
              ${
                isFormValid()
                  ? 'bg-[#9B59B6] hover:bg-[#8E44AD] text-white active:scale-[0.98] shadow-[0_2px_8px_rgba(155,89,182,0.2)] opacity-100'
                  : 'bg-[#9B59B6] text-white opacity-50 cursor-not-allowed'
              }
            `}
            aria-label="Continue to next step"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegistrationScreen3B;
