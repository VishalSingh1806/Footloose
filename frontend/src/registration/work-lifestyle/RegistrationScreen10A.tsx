import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { countriesData } from '../../countriesData';

interface RegistrationScreen10AProps {
  onNext: (data: { country: string; currentState: string; currentCity: string }) => void;
  onBack: () => void;
}

function RegistrationScreen10A({ onNext, onBack }: RegistrationScreen10AProps) {
  const [country, setCountry] = useState<string>('India');
  const [currentState, setCurrentState] = useState<string>('');
  const [currentCity, setCurrentCity] = useState<string>('');

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const [citySearchQuery, setCitySearchQuery] = useState('');

  const selectedCountryData = countriesData.find(c => c.name === country);
  const states = selectedCountryData?.states ?? [];
  const selectedStateData = states.find(s => s.name === currentState);
  const cities = selectedStateData?.cities ?? [];
  const filteredCities = cities.filter(city =>
    city.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  // Reset state + city when country changes
  useEffect(() => {
    setCurrentState('');
    setCurrentCity('');
    setCitySearchQuery('');
  }, [country]);

  // Reset city when state changes
  useEffect(() => {
    setCurrentCity('');
    setCitySearchQuery('');
  }, [currentState]);

  const handleContinue = () => {
    if (country && currentState && currentCity) {
      onNext({ country, currentState, currentCity });
    }
  };

  const closeAll = () => {
    setShowCountryDropdown(false);
    setShowStateDropdown(false);
    setShowCityDropdown(false);
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
              Location
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-[6px] bg-[#E5E7EB] relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] transition-all duration-500 ease-out"
            style={{ width: '50%' }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5 py-8 pb-28 max-w-[600px] w-full mx-auto">
        <h1 className="text-2xl font-semibold text-[#1D3557] mb-2">
          Where are you based?
        </h1>

        <p className="text-[14px] text-[#6C757D] mb-6">
          This is used for matching and events near you
        </p>

        {/* ── Country ── */}
        <div className="mb-6">
          <label className="block text-[15px] text-[#6C757D] mb-3">
            Country
          </label>
          <div className="relative">
            <button
              onClick={() => {
                setShowCountryDropdown(!showCountryDropdown);
                setShowStateDropdown(false);
                setShowCityDropdown(false);
              }}
              className={`w-full h-[52px] px-4 rounded-xl border-2 bg-white text-base text-left flex items-center justify-between focus:outline-none transition-colors ${
                country
                  ? 'border-[#9B59B6] text-[#1D3557]'
                  : 'border-[#E5E7EB] text-[#ADB5BD]'
              } focus:border-[#9B59B6]`}
            >
              <span className={country ? 'text-[#1D3557]' : 'text-[#ADB5BD]'}>
                {country || 'Select country'}
              </span>
              <ChevronDown
                className={`w-5 h-5 transition-all ${
                  country ? 'text-[#9B59B6]' : 'text-[#6C757D]'
                } ${showCountryDropdown ? 'rotate-180' : ''}`}
              />
            </button>

            {showCountryDropdown && (
              <div className="absolute z-20 w-full mt-2 bg-white border-2 border-[#E5E7EB] rounded-xl shadow-lg max-h-[300px] overflow-y-auto">
                {countriesData.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setCountry(c.name);
                      setShowCountryDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-[#FAFAFA] transition-colors ${
                      country === c.name
                        ? 'bg-[#F5E6FF] text-[#9B59B6] font-semibold'
                        : 'text-[#1D3557]'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── State ── */}
        <div className="mb-6">
          <label className="block text-[15px] text-[#6C757D] mb-3">
            State / Province
          </label>
          <div className="relative">
            <button
              onClick={() => {
                if (!country) return;
                setShowStateDropdown(!showStateDropdown);
                setShowCountryDropdown(false);
                setShowCityDropdown(false);
              }}
              disabled={!country}
              className={`w-full h-[52px] px-4 rounded-xl border-2 bg-white text-base text-left flex items-center justify-between focus:outline-none transition-colors ${
                !country
                  ? 'border-[#E5E7EB] text-[#ADB5BD] cursor-not-allowed opacity-50'
                  : currentState
                  ? 'border-[#9B59B6] text-[#1D3557] focus:border-[#9B59B6]'
                  : 'border-[#E5E7EB] text-[#ADB5BD] focus:border-[#9B59B6]'
              }`}
            >
              <span className={currentState ? 'text-[#1D3557]' : 'text-[#ADB5BD]'}>
                {currentState || (country ? 'Select state' : 'Select country first')}
              </span>
              <ChevronDown
                className={`w-5 h-5 transition-all ${
                  currentState ? 'text-[#9B59B6]' : 'text-[#6C757D]'
                } ${showStateDropdown ? 'rotate-180' : ''}`}
              />
            </button>

            {showStateDropdown && country && (
              <div className="absolute z-20 w-full mt-2 bg-white border-2 border-[#E5E7EB] rounded-xl shadow-lg max-h-[300px] overflow-y-auto">
                {states.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => {
                      setCurrentState(s.name);
                      setShowStateDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-[#FAFAFA] transition-colors ${
                      currentState === s.name
                        ? 'bg-[#F5E6FF] text-[#9B59B6] font-semibold'
                        : 'text-[#1D3557]'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── City ── */}
        <div className="mb-6">
          <label className="block text-[15px] text-[#6C757D] mb-3">
            Current City
          </label>
          <div className="relative">
            <button
              onClick={() => {
                if (!currentState) return;
                setShowCityDropdown(!showCityDropdown);
                setShowCountryDropdown(false);
                setShowStateDropdown(false);
              }}
              disabled={!currentState}
              className={`w-full h-[52px] px-4 rounded-xl border-2 bg-white text-base text-left flex items-center justify-between focus:outline-none transition-colors ${
                !currentState
                  ? 'border-[#E5E7EB] text-[#ADB5BD] cursor-not-allowed opacity-50'
                  : currentCity
                  ? 'border-[#9B59B6] text-[#1D3557] focus:border-[#9B59B6]'
                  : 'border-[#E5E7EB] text-[#ADB5BD] focus:border-[#9B59B6]'
              }`}
            >
              <span className={currentCity ? 'text-[#1D3557]' : 'text-[#ADB5BD]'}>
                {currentCity || (currentState ? 'Select city' : 'Select state first')}
              </span>
              <ChevronDown
                className={`w-5 h-5 transition-all ${
                  currentCity ? 'text-[#9B59B6]' : 'text-[#6C757D]'
                } ${showCityDropdown ? 'rotate-180' : ''}`}
              />
            </button>

            {showCityDropdown && currentState && (
              <div className="absolute z-20 w-full mt-2 bg-white border-2 border-[#E5E7EB] rounded-xl shadow-lg">
                <div className="p-3 border-b border-[#E5E7EB]">
                  <input
                    type="text"
                    value={citySearchQuery}
                    onChange={(e) => setCitySearchQuery(e.target.value)}
                    placeholder="Search city..."
                    className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-[#1D3557] placeholder:text-[#ADB5BD] focus:outline-none focus:border-[#9B59B6]"
                    autoFocus
                  />
                </div>
                <div className="max-h-[250px] overflow-y-auto">
                  {filteredCities.length > 0 ? (
                    filteredCities.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setCurrentCity(city);
                          setShowCityDropdown(false);
                          setCitySearchQuery('');
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-[#FAFAFA] transition-colors ${
                          currentCity === city
                            ? 'bg-[#F5E6FF] text-[#9B59B6] font-semibold'
                            : 'text-[#1D3557]'
                        }`}
                      >
                        {city}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-[#6C757D]">
                      No cities found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FAFAFA] px-5 py-5 border-t border-[#E5E7EB]">
        <div className="max-w-[600px] mx-auto">
          <button
            onClick={handleContinue}
            disabled={!country || !currentState || !currentCity}
            className={`
              w-full h-[52px] rounded-xl font-semibold text-base transition-all
              ${
                country && currentState && currentCity
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

      {/* Click-outside overlay to close all dropdowns */}
      {(showCountryDropdown || showStateDropdown || showCityDropdown) && (
        <div className="fixed inset-0 z-10" onClick={closeAll} />
      )}
    </div>
  );
}

export default RegistrationScreen10A;
