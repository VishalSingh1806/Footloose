import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { countriesData } from '../../countriesData';

interface RegistrationScreen10AProps {
  onNext: (data: { country: string; currentCity: string }) => void;
  onBack: () => void;
}

function RegistrationScreen10A({ onNext, onBack }: RegistrationScreen10AProps) {
  const [country, setCountry] = useState<string>('India');
  const [currentCity, setCurrentCity] = useState<string>('');
  const [cities, setCities] = useState<string[]>([]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');

  useEffect(() => {
    const selectedCountry = countriesData.find(c => c.name === country);
    if (selectedCountry) {
      setCities(selectedCountry.cities);
      setCurrentCity('');
      setCitySearchQuery('');
    }
  }, [country]);

  const handleContinue = () => {
    if (country && currentCity) {
      onNext({ country, currentCity });
    }
  };

  const filteredCities = cities.filter(city =>
    city.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

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
          Where do you live now?
        </h1>

        <p className="text-[14px] text-[#6C757D] mb-6">
          This is used for matching and events near you
        </p>

        {/* Country Dropdown */}
        <div className="mb-6">
          <label className="block text-[15px] text-[#6C757D] mb-3">
            Country
          </label>
          <div className="relative">
            <button
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              className="w-full h-[52px] px-4 rounded-xl border-2 border-[#E5E7EB] bg-white text-[#1D3557] text-base text-left flex items-center justify-between focus:outline-none focus:border-[#9B59B6] transition-colors"
            >
              <span className={country ? 'text-[#1D3557]' : 'text-[#ADB5BD]'}>
                {country || 'Select country'}
              </span>
              <ChevronDown className={`w-5 h-5 text-[#6C757D] transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showCountryDropdown && (
              <div className="absolute z-20 w-full mt-2 bg-white border-2 border-[#E5E7EB] rounded-xl shadow-lg max-h-[300px] overflow-y-auto">
                {countriesData.map((countryData) => (
                  <button
                    key={countryData.name}
                    onClick={() => {
                      setCountry(countryData.name);
                      setShowCountryDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-[#FAFAFA] transition-colors ${
                      country === countryData.name ? 'bg-[#F5E6FF] text-[#9B59B6] font-semibold' : 'text-[#1D3557]'
                    }`}
                  >
                    {countryData.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* City Dropdown */}
        <div className="mb-6">
          <label className="block text-[15px] text-[#6C757D] mb-3">
            Current City
          </label>
          <div className="relative">
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              disabled={!country}
              className={`w-full h-[52px] px-4 rounded-xl border-2 bg-white text-base text-left flex items-center justify-between focus:outline-none transition-colors ${
                !country
                  ? 'border-[#E5E7EB] text-[#ADB5BD] cursor-not-allowed'
                  : 'border-[#E5E7EB] text-[#1D3557] focus:border-[#9B59B6]'
              }`}
            >
              <span className={currentCity ? 'text-[#1D3557]' : 'text-[#ADB5BD]'}>
                {currentCity || 'Select city'}
              </span>
              <ChevronDown className={`w-5 h-5 text-[#6C757D] transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showCityDropdown && country && (
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
                          currentCity === city ? 'bg-[#F5E6FF] text-[#9B59B6] font-semibold' : 'text-[#1D3557]'
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
            disabled={!country || !currentCity}
            className={`
              w-full h-[52px] rounded-xl font-semibold text-base transition-all
              ${
                country && currentCity
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

      {/* Click outside handler */}
      {(showCountryDropdown || showCityDropdown) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowCountryDropdown(false);
            setShowCityDropdown(false);
          }}
        />
      )}
    </div>
  );
}

export default RegistrationScreen10A;
