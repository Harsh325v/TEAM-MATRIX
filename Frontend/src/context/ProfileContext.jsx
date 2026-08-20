import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { mockUser } from '../data/mockData';

const STORAGE_KEY = 'idp-mvp-profile';
const ProfileContext = createContext(null);

function readProfile() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...mockUser, ...JSON.parse(saved) } : mockUser;
  } catch {
    return mockUser;
  }
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(readProfile);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const value = useMemo(() => ({
    profile,
    updateProfile: (changes) => setProfile((current) => ({ ...current, ...changes })),
    toggleRecommendation: (id) => setProfile((current) => {
      const completed = current.completedRecommendationIds || [];
      return {
        ...current,
        completedRecommendationIds: completed.includes(id)
          ? completed.filter((item) => item !== id)
          : [...completed, id],
      };
    }),
    reviewFlashcard: (id, known) => setProfile((current) => {
      const reviewed = current.reviewedFlashcardIds || [];
      const knownCards = current.knownFlashcardIds || [];
      return {
        ...current,
        reviewedFlashcardIds: reviewed.includes(id) ? reviewed : [...reviewed, id],
        knownFlashcardIds: known
          ? (knownCards.includes(id) ? knownCards : [...knownCards, id])
          : knownCards.filter((cardId) => cardId !== id),
      };
    }),
  }), [profile]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used inside ProfileProvider');
  return context;
}
