import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Share2, Download } from 'lucide-react';

interface PhotoCarouselProps {
  photos: string[];
  initialIndex?: number;
  userName: string;
  onClose: () => void;
}

function PhotoCarousel({ photos, initialIndex = 0, userName, onClose }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [scale, setScale] = useState(1);
  const [lastTap, setLastTap] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setScale(1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setScale(1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < photos.length - 1) {
      handleNext();
    }
    if (isRightSwipe && currentIndex > 0) {
      handlePrevious();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTap < DOUBLE_TAP_DELAY) {
      setScale(scale === 1 ? 2 : 1);
    }
    setLastTap(now);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${userName}'s Photo`,
          text: `Check out this photo from ${userName}'s profile`,
          url: photos[currentIndex],
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(photos[currentIndex]);
      alert('Link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photos[currentIndex];
    link.download = `${userName}-photo-${currentIndex + 1}.jpg`;
    link.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm
                   flex items-center justify-center hover:bg-white/20 transition-colors"
        aria-label="Close gallery"
      >
        <X size={24} className="text-white" />
      </button>

      {/* Photo Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
          {currentIndex + 1} / {photos.length}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 left-4 z-50 flex gap-2">
        <button
          onClick={handleShare}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm
                     flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label="Share photo"
        >
          <Share2 size={20} className="text-white" />
        </button>
        <button
          onClick={handleDownload}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm
                     flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label="Download photo"
        >
          <Download size={20} className="text-white" />
        </button>
      </div>

      {/* Previous Button */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrevious}
          className="absolute left-4 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm
                     flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label="Previous photo"
        >
          <ChevronLeft size={28} className="text-white" />
        </button>
      )}

      {/* Next Button */}
      {currentIndex < photos.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm
                     flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label="Next photo"
        >
          <ChevronRight size={28} className="text-white" />
        </button>
      )}

      {/* Main Photo */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleDoubleTap}
      >
        <img
          src={photos[currentIndex]}
          alt={`${userName} - Photo ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain transition-transform duration-300"
          style={{ transform: `scale(${scale})` }}
        />
      </div>

      {/* Photo Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-2">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setScale(1);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-6' : 'bg-white/50'
            }`}
            aria-label={`View photo ${index + 1}`}
          />
        ))}
      </div>

      {/* Zoom hint */}
      {scale === 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs opacity-70">
            Double-tap to zoom
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoCarousel;
