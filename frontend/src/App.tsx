import { useState, useEffect } from 'react';
import { useBackButton } from './hooks/useBackButton';
import LandingPage from './LandingPage';
import ApprovalPendingScreen from './ApprovalPendingScreen';
import AppShellDemo from './components/layout/AppShellDemo';

// Initial Information (Screens 1-9 + Placeholder A)
import RegistrationScreen1 from './registration/initial-information/RegistrationScreen1';
import RegistrationScreen2 from './registration/initial-information/RegistrationScreen2';
import RegistrationScreen3A from './registration/initial-information/RegistrationScreen3A';
import RegistrationScreen3B from './registration/initial-information/RegistrationScreen3B';
import PlaceholderA from './registration/initial-information/PlaceholderA';
import RegistrationScreen4 from './registration/initial-information/RegistrationScreen4';
import RegistrationScreen5 from './registration/initial-information/RegistrationScreen5';
import RegistrationScreen6 from './registration/initial-information/RegistrationScreen6';
import RegistrationScreen7 from './registration/initial-information/RegistrationScreen7';
import RegistrationScreen8 from './registration/initial-information/RegistrationScreen8';
import RegistrationScreen9 from './registration/initial-information/RegistrationScreen9';

// Work & Lifestyle (Screens 10-15 + Placeholder B)
import PlaceholderB from './registration/work-lifestyle/PlaceholderB';
import RegistrationScreen10A from './registration/work-lifestyle/RegistrationScreen10A';
import RegistrationScreen10B from './registration/work-lifestyle/RegistrationScreen10B';
import RegistrationScreen11 from './registration/work-lifestyle/RegistrationScreen11';
import RegistrationScreen12 from './registration/work-lifestyle/RegistrationScreen12';
import RegistrationScreen13 from './registration/work-lifestyle/RegistrationScreen13';
import RegistrationScreen14 from './registration/work-lifestyle/RegistrationScreen14';
import RegistrationScreen15 from './registration/work-lifestyle/RegistrationScreen15';

// Relationship Preferences (Screens 16-18 + Placeholder C)
import PlaceholderC from './registration/relationship-preferences/PlaceholderC';
import RegistrationScreen16 from './registration/relationship-preferences/RegistrationScreen16';
import RegistrationScreen17 from './registration/relationship-preferences/RegistrationScreen17';
import RegistrationScreen18 from './registration/relationship-preferences/RegistrationScreen18';

// Photos & Verification (Screens 19-24 + Placeholder D)
import PlaceholderD from './registration/photos-verification/PlaceholderD';
import RegistrationScreen19 from './registration/photos-verification/RegistrationScreen19';
import RegistrationScreen20 from './registration/photos-verification/RegistrationScreen20';
import RegistrationScreen21 from './registration/photos-verification/RegistrationScreen21';
import RegistrationScreen22 from './registration/photos-verification/RegistrationScreen22';
import RegistrationScreen23 from './registration/photos-verification/RegistrationScreen23';
import RegistrationScreen24 from './registration/photos-verification/RegistrationScreen24';

type Screen = 'landing' | 'registration-1' | 'registration-2' | 'registration-3a' | 'registration-3b' | 'placeholder-a' | 'registration-4' | 'registration-5' | 'registration-6' | 'registration-7' | 'registration-8' | 'registration-9' | 'placeholder-b' | 'registration-10a' | 'registration-10b' | 'registration-11' | 'registration-12' | 'registration-13' | 'registration-14' | 'registration-15' | 'placeholder-c' | 'registration-16' | 'registration-17' | 'registration-18' | 'placeholder-d' | 'registration-19' | 'registration-20' | 'registration-21' | 'registration-22' | 'registration-23' | 'registration-24' | 'approval-pending' | 'app-shell';

interface RegistrationData {
  authType: 'phone';
  fullName: string;
  phoneNumber: string;
  email: string;
  gender: string;
  maritalStatus: string;
  heightFeet: number;
  heightInches: number;
  weight: number;
  city: string;
  state: string;
  familyBackground: string;
  parentsOutlook: string;
  familyComfort: string;
  whereYouLive: string;
  livingArrangement: string;
  religion: string;
  community: string;
  country: string;
  currentCity: string;
  industry: string;
  role: string;
  income: string;
  lifePace: string;
  weekdayActivity: string;
  weekendActivities: string[];
  spendingPreference: string;
  partnerPriorities: string[];
  relationshipIntent: string;
  childrenPreference: string;
  photos: string[];
  lifestylePhotos: string[];
  governmentId: File | null;
  companyId: File | null;
}

function App() {
  // Load persisted state from localStorage on mount
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    const saved = localStorage.getItem('currentScreen');
    return (saved as Screen) || 'landing';
  });

  const [registrationData, setRegistrationData] = useState<RegistrationData>(() => {
    const saved = localStorage.getItem('registrationData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // If parse fails, return default
      }
    }
    return {
      authType: 'phone',
      fullName: '',
      phoneNumber: '',
      email: '',
      gender: '',
      maritalStatus: '',
      heightFeet: 0,
      heightInches: 0,
      weight: 0,
      city: '',
      state: '',
      familyBackground: '',
      parentsOutlook: '',
      familyComfort: '',
      whereYouLive: '',
      livingArrangement: '',
      religion: '',
      community: '',
      country: '',
      currentCity: '',
      industry: '',
      role: '',
      income: '',
      lifePace: '',
      weekdayActivity: '',
      weekendActivities: [],
      spendingPreference: '',
      partnerPriorities: [],
      relationshipIntent: '',
      childrenPreference: '',
      photos: [],
      lifestylePhotos: [],
      governmentId: null,
      companyId: null,
    };
  });

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentScreen', currentScreen);
  }, [currentScreen]);

  useEffect(() => {
    // Don't save File objects or large base64 photo strings to localStorage
    const dataToSave = {
      ...registrationData,
      governmentId: null,
      companyId: null,
      photos: [],          // Excluded: base64 strings can exceed localStorage quota
      lifestylePhotos: [], // Excluded: base64 strings can exceed localStorage quota
    };
    try {
      localStorage.setItem('registrationData', JSON.stringify(dataToSave));
    } catch {
      // localStorage quota exceeded - continue without persistence
    }
  }, [registrationData]);

  const handleGetStarted = () => {
    setCurrentScreen('registration-1');
  };

  const handleBackToLanding = () => {
    // Clear persisted data when going back to landing
    localStorage.removeItem('currentScreen');
    localStorage.removeItem('registrationData');
    setCurrentScreen('landing');
  };

  const handleAuthSubmit = (data: { fullName: string; phoneNumber: string; email: string }) => {
    setRegistrationData({
      ...registrationData,
      authType: 'phone',
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      email: data.email
    });
    setCurrentScreen('registration-2');
  };

  const handleBackToPhone = () => {
    setCurrentScreen('registration-1');
  };

  const handleOtpVerified = () => {
    setCurrentScreen('registration-3a');
  };

  const handleBackToOtp = () => {
    setCurrentScreen('registration-2');
  };

  const handleIdentitySubmit = (data: { gender: string; maritalStatus: string }) => {
    setRegistrationData({ ...registrationData, ...data });
    setCurrentScreen('registration-3b');
  };

  const handleBackToIdentity = () => {
    setCurrentScreen('registration-3a');
  };

  const handleBasicDetailsSubmit = (data: { heightFeet: number; heightInches: number; weight: number; city: string; state: string }) => {
    setRegistrationData({ ...registrationData, ...data });
    setCurrentScreen('placeholder-a');
  };

  const handlePlaceholderAContinue = () => {
    setCurrentScreen('registration-4');
  };

  const handleBackToBasicDetails = () => {
    setCurrentScreen('registration-3b');
  };

  const handleFamilyBackgroundSubmit = (data: { familyBackground: string }) => {
    setRegistrationData({ ...registrationData, ...data });
    setCurrentScreen('registration-5');
  };

  const handleBackToFamilyBackground = () => {
    setCurrentScreen('registration-4');
  };

  const handleParentsOutlookSubmit = (data: { parentsOutlook: string }) => {
    setRegistrationData({ ...registrationData, ...data });
    setCurrentScreen('registration-6');
  };

  const handleBackToParentsOutlook = () => {
    setCurrentScreen('registration-5');
  };

  const handleFamilyComfortSubmit = (data: { familyComfort: string }) => {
    setRegistrationData({ ...registrationData, ...data });
    setCurrentScreen('registration-7');
  };

  const handleBackToFamilyComfort = () => {
    setCurrentScreen('registration-6');
  };

  const handleWhereYouLiveSubmit = (data: { whereYouLive: string }) => {
    setRegistrationData({ ...registrationData, ...data });
    setCurrentScreen('registration-8');
  };

  const handleBackToWhereYouLive = () => {
    setCurrentScreen('registration-7');
  };

  const handleLivingArrangementSubmit = (data: { livingArrangement: string }) => {
    setRegistrationData({ ...registrationData, ...data });
    setCurrentScreen('registration-9');
  };

  const handleBackToLivingArrangement = () => {
    setCurrentScreen('registration-8');
  };

  const handleReligionCommunitySubmit = (data: { religion: string; community: string }) => {
    setRegistrationData({ ...registrationData, ...data });
    setCurrentScreen('placeholder-b');
  };

  const handlePlaceholderBContinue = () => {
    setCurrentScreen('registration-10a');
  };

  const handleBackToReligionCommunity = () => {
    setCurrentScreen('registration-9');
  };

  const handleLocationSubmit = (data: { country: string; currentCity: string }) => {
    setRegistrationData({ ...registrationData, ...data });
    setCurrentScreen('registration-10b');
  };

  const handleBackToLocation = () => {
    setCurrentScreen('registration-10a');
  };

  const handleWorkSubmit = (data: { industry: string; role: string }) => {
    setRegistrationData({ ...registrationData, ...data });
    setCurrentScreen('registration-11');
  };

  const handleBackToWork = () => {
    setCurrentScreen('registration-10b');
  };

  const handleIncomeSubmit = (data: { income: string }) => {
    setRegistrationData({ ...registrationData, ...data });
    setCurrentScreen('registration-12');
  };

  const handleBackToIncome = () => {
    setCurrentScreen('registration-11');
  };

  const handleLifePaceSubmit = (data: { lifePace: string }) => {
    setRegistrationData({ ...registrationData, ...data });
    setCurrentScreen('registration-13');
  };

  const handleBackToLifePace = () => {
    setCurrentScreen('registration-12');
  };

  const handleWeekdayActivitySubmit = (data: { weekdayActivity: string }) => {
    setRegistrationData({ ...registrationData, ...data });
    setCurrentScreen('registration-14');
  };

  const handleBackToWeekdayActivity = () => {
    setCurrentScreen('registration-13');
  };

  const handleWeekendActivitiesSubmit = (data: { weekendActivities: string[] }) => {
    setRegistrationData({ ...registrationData, ...data });
    setCurrentScreen('registration-15');
  };

  const handleBackToWeekendActivities = () => {
    setCurrentScreen('registration-14');
  };

  const handleSpendingPreferenceSubmit = (data: { spendingPreference: string }) => {
    setRegistrationData({ ...registrationData, ...data });
    setCurrentScreen('placeholder-c');
  };

  const handlePlaceholderCContinue = () => {
    setCurrentScreen('registration-16');
  };

  const handleBackToSpendingPreference = () => {
    setCurrentScreen('registration-15');
  };

  const handlePartnerPrioritiesSubmit = (data: { partnerPriorities: string[] }) => {
    setRegistrationData({ ...registrationData, ...data });
    setCurrentScreen('registration-17');
  };

  const handleBackToPartnerPriorities = () => {
    setCurrentScreen('registration-16');
  };

  const handleRelationshipIntentSubmit = (data: { relationshipIntent: string }) => {
    setRegistrationData({ ...registrationData, ...data });
    setCurrentScreen('registration-18');
  };

  const handleBackToRelationshipIntent = () => {
    setCurrentScreen('registration-17');
  };

  const handleChildrenPreferenceSubmit = (data: { childrenPreference: string }) => {
    setRegistrationData({ ...registrationData, ...data });
    setCurrentScreen('placeholder-d');
  };

  const handlePlaceholderDContinue = () => {
    setCurrentScreen('registration-19');
  };

  const handleBackToChildrenPreference = () => {
    setCurrentScreen('registration-18');
  };

  const handlePhotosSubmit = (data: { photos: string[] }) => {
    setRegistrationData({ ...registrationData, ...data });
    setCurrentScreen('registration-20');
  };

  const handleBackToPhotos = () => {
    setCurrentScreen('registration-19');
  };

  const handleLifestylePhotosSubmit = (data: { photos: string[] }) => {
    setRegistrationData({ ...registrationData, lifestylePhotos: data.photos });
    setCurrentScreen('registration-21');
  };

  const handleBackToLifestylePhotos = () => {
    setCurrentScreen('registration-20');
  };

  const handleIdVerificationSubmit = (data: { governmentId: File | null; companyId: File | null }) => {
    setRegistrationData({ ...registrationData, ...data });
    setCurrentScreen('registration-22');
  };

  const handleBackToIdVerification = () => {
    setCurrentScreen('registration-21');
  };

  const handleVideoVerificationSubmit = () => {
    setCurrentScreen('registration-23');
  };

  const handleBackToVideoVerification = () => {
    setCurrentScreen('registration-22');
  };

  const handleProfileReviewSubmit = () => {
    setCurrentScreen('registration-24');
  };

  const handleBackToProfileReview = () => {
    setCurrentScreen('registration-23');
  };

  const handleExploreMatches = () => {
    console.log('Registration complete! Data:', registrationData);
    setCurrentScreen('approval-pending');
    setTimeout(() => setCurrentScreen('app-shell'), 3000);
  };

  const handleViewProfile = () => {
    console.log('View profile clicked. Data:', registrationData);
    // Navigate to app shell profile page
    setCurrentScreen('app-shell');
  };

  if (currentScreen === 'registration-1') {
    return (
      <RegistrationScreen1
        onNext={handleAuthSubmit}
        onBack={handleBackToLanding}
      />
    );
  }

  if (currentScreen === 'registration-2') {
    return (
      <RegistrationScreen2
        phoneNumber={registrationData.phoneNumber || ''}
        onNext={handleOtpVerified}
        onBack={handleBackToPhone}
        onChangeNumber={handleBackToPhone}
      />
    );
  }

  if (currentScreen === 'registration-3a') {
    return (
      <RegistrationScreen3A
        onNext={handleIdentitySubmit}
        onBack={handleBackToOtp}
      />
    );
  }

  if (currentScreen === 'registration-3b') {
    return (
      <RegistrationScreen3B
        onNext={handleBasicDetailsSubmit}
        onBack={handleBackToIdentity}
      />
    );
  }

  if (currentScreen === 'placeholder-a') {
    return (
      <PlaceholderA
        onContinue={handlePlaceholderAContinue}
      />
    );
  }

  if (currentScreen === 'registration-4') {
    return (
      <RegistrationScreen4
        onNext={handleFamilyBackgroundSubmit}
        onBack={handleBackToBasicDetails}
      />
    );
  }

  if (currentScreen === 'registration-5') {
    return (
      <RegistrationScreen5
        onNext={handleParentsOutlookSubmit}
        onBack={handleBackToFamilyBackground}
      />
    );
  }

  if (currentScreen === 'registration-6') {
    return (
      <RegistrationScreen6
        onNext={handleFamilyComfortSubmit}
        onBack={handleBackToParentsOutlook}
      />
    );
  }

  if (currentScreen === 'registration-7') {
    return (
      <RegistrationScreen7
        onNext={handleWhereYouLiveSubmit}
        onBack={handleBackToFamilyComfort}
      />
    );
  }

  if (currentScreen === 'registration-8') {
    return (
      <RegistrationScreen8
        onNext={handleLivingArrangementSubmit}
        onBack={handleBackToWhereYouLive}
      />
    );
  }

  if (currentScreen === 'registration-9') {
    return (
      <RegistrationScreen9
        onNext={handleReligionCommunitySubmit}
        onBack={handleBackToLivingArrangement}
      />
    );
  }

  if (currentScreen === 'placeholder-b') {
    return (
      <PlaceholderB
        onContinue={handlePlaceholderBContinue}
        onBack={handleBackToReligionCommunity}
      />
    );
  }

  if (currentScreen === 'registration-10a') {
    return (
      <RegistrationScreen10A
        onNext={handleLocationSubmit}
        onBack={handleBackToReligionCommunity}
      />
    );
  }

  if (currentScreen === 'registration-10b') {
    return (
      <RegistrationScreen10B
        onNext={handleWorkSubmit}
        onBack={handleBackToLocation}
      />
    );
  }

  if (currentScreen === 'registration-11') {
    return (
      <RegistrationScreen11
        onNext={handleIncomeSubmit}
        onBack={handleBackToWork}
      />
    );
  }

  if (currentScreen === 'registration-12') {
    return (
      <RegistrationScreen12
        onNext={handleLifePaceSubmit}
        onBack={handleBackToIncome}
      />
    );
  }

  if (currentScreen === 'registration-13') {
    return (
      <RegistrationScreen13
        onNext={handleWeekdayActivitySubmit}
        onBack={handleBackToLifePace}
      />
    );
  }

  if (currentScreen === 'registration-14') {
    return (
      <RegistrationScreen14
        onNext={handleWeekendActivitiesSubmit}
        onBack={handleBackToWeekdayActivity}
      />
    );
  }

  if (currentScreen === 'registration-15') {
    return (
      <RegistrationScreen15
        onNext={handleSpendingPreferenceSubmit}
        onBack={handleBackToWeekendActivities}
      />
    );
  }

  if (currentScreen === 'placeholder-c') {
    return (
      <PlaceholderC
        onContinue={handlePlaceholderCContinue}
        onBack={handleBackToSpendingPreference}
      />
    );
  }

  if (currentScreen === 'registration-16') {
    return (
      <RegistrationScreen16
        onNext={handlePartnerPrioritiesSubmit}
        onBack={handleBackToSpendingPreference}
      />
    );
  }

  if (currentScreen === 'registration-17') {
    return (
      <RegistrationScreen17
        onNext={handleRelationshipIntentSubmit}
        onBack={handleBackToPartnerPriorities}
      />
    );
  }

  if (currentScreen === 'registration-18') {
    return (
      <RegistrationScreen18
        onNext={handleChildrenPreferenceSubmit}
        onBack={handleBackToRelationshipIntent}
      />
    );
  }

  if (currentScreen === 'placeholder-d') {
    return (
      <PlaceholderD
        onContinue={handlePlaceholderDContinue}
        onBack={handleBackToChildrenPreference}
      />
    );
  }

  if (currentScreen === 'registration-19') {
    return (
      <RegistrationScreen19
        onNext={handlePhotosSubmit}
        onBack={handleBackToChildrenPreference}
      />
    );
  }

  if (currentScreen === 'registration-20') {
    return (
      <RegistrationScreen20
        onNext={handleLifestylePhotosSubmit}
        onBack={handleBackToPhotos}
      />
    );
  }

  if (currentScreen === 'registration-21') {
    return (
      <RegistrationScreen21
        onNext={handleIdVerificationSubmit}
        onBack={handleBackToLifestylePhotos}
      />
    );
  }

  if (currentScreen === 'registration-22') {
    return (
      <RegistrationScreen22
        onNext={handleVideoVerificationSubmit}
        onBack={handleBackToIdVerification}
      />
    );
  }

  if (currentScreen === 'registration-23') {
    return (
      <RegistrationScreen23
        onNext={handleProfileReviewSubmit}
        onBack={handleBackToVideoVerification}
        profileData={{
          name: 'User',
          age: 28,
          city: registrationData.city,
          state: registrationData.state,
          heightFeet: registrationData.heightFeet,
          heightInches: registrationData.heightInches,
          religion: registrationData.religion,
          role: registrationData.role,
          income: registrationData.income,
          photos: registrationData.photos,
          lifestylePhotos: registrationData.lifestylePhotos,
          gender: registrationData.gender,
          familyBackground: registrationData.familyBackground,
          parentsOutlook: registrationData.parentsOutlook,
          whereYouLive: registrationData.whereYouLive,
          partnerPriorities: registrationData.partnerPriorities,
          relationshipIntent: registrationData.relationshipIntent,
          childrenPreference: registrationData.childrenPreference,
        }}
      />
    );
  }

  if (currentScreen === 'registration-24') {
    return (
      <RegistrationScreen24
        onExploreMatches={handleExploreMatches}
        onViewProfile={handleViewProfile}
      />
    );
  }

  if (currentScreen === 'approval-pending') {
    return <ApprovalPendingScreen />;
  }

  if (currentScreen === 'app-shell') {
    return <AppShellDemo />;
  }

  return <LandingPage onGetStarted={handleGetStarted} />;
}

export default App;
