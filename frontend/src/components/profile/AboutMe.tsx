import ProfileSection from './ProfileSection';

interface AboutMeProps {
  bio: string;
  lifestyleTags?: string[];
}

function AboutMe({ bio, lifestyleTags = [] }: AboutMeProps) {
  return (
    <ProfileSection title="About Me">
      {/* Bio Text */}
      <div className="text-[15px] leading-relaxed text-[#1D3557] space-y-4">
        {bio.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {/* Lifestyle Tags */}
      {lifestyleTags.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {lifestyleTags.map((tag, index) => (
              <span
                key={index}
                className="bg-[#FFE5E5] text-[#E63946] px-4 py-2 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </ProfileSection>
  );
}

export default AboutMe;
