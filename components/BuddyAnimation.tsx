import React, { useState, useRef, useEffect } from 'react';
import { BuddyType } from '../types';

interface BuddyAnimationProps {
  buddy: BuddyType;
  health: number;
  happiness: number;
  isPoking: boolean;
  triggerEating: boolean;
  onEatingComplete?: () => void;
}

const DEFAULT_BUDDY_IMAGE: Record<BuddyType, string> = {
  astronaut: "Assets/Base_characters/astronaut.png",
  dracula: "Assets/Base_characters/dracula.png",
  princess: "Assets/Base_characters/princess.png"
};

export const BuddyAnimation: React.FC<BuddyAnimationProps> = ({
  buddy,
  health,
  happiness,
  isPoking,
  triggerEating,
  onEatingComplete
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isEating, setIsEating] = useState(false);
  const [currentStage, setCurrentStage] = useState<'good' | 'bad'>('good');
  const [useVideo, setUseVideo] = useState(true);
  const supportedFormatsRef = useRef<Record<string, 'webm' | 'mp4' | 'image'>>({});

  // Determine current stage (good or bad) based on health/happiness
  const getStage = (): 'good' | 'bad' => {
    return health < 40 || happiness < 40 ? 'bad' : 'good';
  };

  // Try loading a video with fallback chain: webm → mp4 → static image
  const loadVideoWithFallback = async (
    animationType: 'idle' | 'eating',
    stage: 'good' | 'bad'
  ): Promise<'webm' | 'mp4' | 'image'> => {
    const cacheKey = `${animationType}_${stage}`;
    
    // Return cached result if available
    if (supportedFormatsRef.current[cacheKey]) {
      return supportedFormatsRef.current[cacheKey];
    }

    // Try WebM first (preferred format with no background)
    const webmPath = `Assets/animation/${buddy}_${stage}_${animationType}_D1.webm`;
    const mp4Path = `Assets/animation/${buddy}_${stage}_${animationType}_D1.mp4`;

    // Try to load WebM
    try {
      const webmResponse = await fetch(webmPath, { method: 'HEAD' });
      if (webmResponse.ok && videoRef.current) {
        videoRef.current.src = webmPath;
        supportedFormatsRef.current[cacheKey] = 'webm';
        return 'webm';
      }
    } catch (err) {
      // WebM not available, try MP4
    }

    // Try to load MP4
    try {
      const mp4Response = await fetch(mp4Path, { method: 'HEAD' });
      if (mp4Response.ok && videoRef.current) {
        videoRef.current.src = mp4Path;
        supportedFormatsRef.current[cacheKey] = 'mp4';
        return 'mp4';
      }
    } catch (err) {
      // MP4 not available, fall back to image
    }

    // Fall back to static image
    supportedFormatsRef.current[cacheKey] = 'image';
    return 'image';
  };

  // Play video when ready
  const playVideoWhenReady = () => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.error('Error playing video:', err);
        });
      }
    }
  };

  // Update stage when health/happiness changes
  useEffect(() => {
    const newStage = getStage();
    if (newStage !== currentStage && !isEating) {
      setCurrentStage(newStage);
      // Load new idle animation for the stage
      loadVideoWithFallback('idle', newStage).then(format => {
        if (format === 'image') {
          setUseVideo(false);
        } else {
          setUseVideo(true);
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
            playVideoWhenReady();
          }
        }
      });
    }
  }, [health, happiness, buddy, isEating, currentStage]);

  // Handle eating animation trigger
  useEffect(() => {
    if (triggerEating && !isEating) {
      setIsEating(true);
      loadVideoWithFallback('eating', currentStage).then(format => {
        if (format === 'image') {
          // Can't animate with image, just show default
          setUseVideo(false);
          // Immediately complete eating
          setTimeout(() => {
            setIsEating(false);
            if (onEatingComplete) {
              onEatingComplete();
            }
          }, 500);
        } else {
          setUseVideo(true);
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.loop = false;
            playVideoWhenReady();
          }
        }
      });
    }
  }, [triggerEating, isEating, currentStage]);

  // Handle video ended event
  const handleVideoEnded = () => {
    if (isEating) {
      // Eating animation completed, resume idle
      setIsEating(false);
      if (onEatingComplete) {
        onEatingComplete();
      }
      // Switch back to idle animation
      loadVideoWithFallback('idle', currentStage).then(format => {
        if (format === 'image') {
          setUseVideo(false);
        } else {
          setUseVideo(true);
          if (videoRef.current) {
            videoRef.current.loop = true;
            videoRef.current.currentTime = 0;
            playVideoWhenReady();
          }
        }
      });
    }
  };

  // Initialize animations on mount
  useEffect(() => {
    const initialStage = getStage();
    setCurrentStage(initialStage);
    loadVideoWithFallback('idle', initialStage).then(format => {
      if (format === 'image') {
        setUseVideo(false);
      } else {
        setUseVideo(true);
        if (videoRef.current) {
          videoRef.current.loop = true;
          playVideoWhenReady();
        }
      }
    });
  }, []);

  return (
    <div
      className={`relative w-64 h-64 flex items-center justify-center animate-float mx-auto cursor-pointer transition-transform duration-150 ${
        isPoking ? 'scale-90 rotate-3' : 'scale-100 rotate-0'
      }`}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {useVideo ? (
          <video
            ref={videoRef}
            onEnded={handleVideoEnded}
            className={`w-full h-full object-contain drop-shadow-2xl transition-all duration-500 ${
              isPoking ? 'brightness-125' : ''
            } ${health < 20 || happiness < 20 ? 'animate-pulse' : ''}`}
            playsInline
            muted
          />
        ) : (
          <img
            src={DEFAULT_BUDDY_IMAGE[buddy]}
            alt="Tamagotchi"
            className={`w-full h-full object-contain drop-shadow-2xl transition-all duration-500 ${
              isPoking ? 'brightness-125' : ''
            } ${health < 20 || happiness < 20 ? 'animate-pulse' : ''}`}
          />
        )}
      </div>
    </div>
  );
};

export default BuddyAnimation;
