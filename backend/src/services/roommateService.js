// Calculate roommate compatibility score between two users
const calculateCompatibility = (currentUser, candidate) => {
  let score = 0;
  const breakdown = {
    locationScore: 0,
    budgetScore: 0,
    preferenceScore: 0,
    lifestyleScore: 0,
    matchedHighlights: [],
  };

  // 1. Location Matching (Max 25 pts)
  const userCity = (currentUser.preferredCity || '').trim().toLowerCase();
  const candCity = (candidate.preferredCity || '').trim().toLowerCase();
  const userLocality = (currentUser.preferredLocality || '').trim().toLowerCase();
  const candLocality = (candidate.preferredLocality || '').trim().toLowerCase();

  if (userCity && candCity && userCity === candCity) {
    if (userLocality && candLocality && userLocality === candLocality) {
      breakdown.locationScore = 25;
      breakdown.matchedHighlights.push(`Same locality: ${candidate.preferredLocality}`);
    } else {
      breakdown.locationScore = 18;
      breakdown.matchedHighlights.push(`Same preferred city: ${candidate.preferredCity}`);
    }
  } else if (!userCity || !candCity) {
    breakdown.locationScore = 8;
  } else {
    breakdown.locationScore = 0;
  }
  score += breakdown.locationScore;

  // 2. Budget Overlap (Max 25 pts)
  const min1 = currentUser.budgetMin || 0;
  const max1 = currentUser.budgetMax || 15000;
  const min2 = candidate.budgetMin || 0;
  const max2 = candidate.budgetMax || 15000;

  const overlapStart = Math.max(min1, min2);
  const overlapEnd = Math.min(max1, max2);

  if (overlapEnd >= overlapStart) {
    const overlap = overlapEnd - overlapStart;
    const totalSpan = Math.max(max1, max2) - Math.min(min1, min2);
    const ratio = totalSpan > 0 ? overlap / totalSpan : 1;
    breakdown.budgetScore = Math.min(25, Math.round(15 + 10 * ratio));
    breakdown.matchedHighlights.push(`Compatible budget range (₹${overlapStart.toLocaleString()} - ₹${overlapEnd.toLocaleString()})`);
  } else {
    const gap = overlapStart - overlapEnd;
    if (gap <= 2000) {
      breakdown.budgetScore = 8;
    } else {
      breakdown.budgetScore = 0;
    }
  }
  score += breakdown.budgetScore;

  // 3. Accommodation Type & Gender Preference (Max 20 pts)
  let accomScore = 0;
  const userType = currentUser.preferredAccommodationType || 'Any';
  const candType = candidate.preferredAccommodationType || 'Any';
  if (userType === 'Any' || candType === 'Any' || userType === candType) {
    accomScore += 10;
    if (userType !== 'Any' && userType === candType) {
      breakdown.matchedHighlights.push(`Both prefer ${userType}`);
    }
  } else {
    accomScore += 3;
  }

  // Gender Preference Check
  let genderScore = 0;
  const userPrefGender = currentUser.roommatePreferences?.preferredGender || 'any';
  const candPrefGender = candidate.roommatePreferences?.preferredGender || 'any';
  const userGender = currentUser.gender || '';
  const candGender = candidate.gender || '';

  const userOkWithCand = userPrefGender === 'any' || !candGender || userPrefGender === candGender;
  const candOkWithUser = candPrefGender === 'any' || !userGender || candPrefGender === userGender;

  if (userOkWithCand && candOkWithUser) {
    genderScore += 10;
  } else {
    genderScore = 0;
  }
  breakdown.preferenceScore = accomScore + genderScore;
  score += breakdown.preferenceScore;

  // 4. Lifestyle Preferences (Max 30 pts)
  let lifeScore = 0;
  const uLife = currentUser.roommatePreferences || {};
  const cLife = candidate.roommatePreferences || {};

  // Cleanliness (7 pts)
  if (uLife.cleanliness === cLife.cleanliness) {
    lifeScore += 7;
    breakdown.matchedHighlights.push(`Matching cleanliness routine (${uLife.cleanliness?.replace('_', ' ')})`);
  } else if (
    (uLife.cleanliness === 'moderate' || cLife.cleanliness === 'moderate')
  ) {
    lifeScore += 4;
  }

  // Food habits (7 pts)
  if (uLife.foodHabit === 'any' || cLife.foodHabit === 'any' || uLife.foodHabit === cLife.foodHabit) {
    lifeScore += 7;
    if (uLife.foodHabit === cLife.foodHabit && uLife.foodHabit !== 'any') {
      breakdown.matchedHighlights.push(`Compatible food habits (${uLife.foodHabit})`);
    }
  } else {
    lifeScore += 2;
  }

  // Smoking habits (8 pts)
  if (uLife.smoking === cLife.smoking) {
    lifeScore += 8;
    if (uLife.smoking === 'non_smoker') {
      breakdown.matchedHighlights.push('Both non-smokers');
    }
  } else if (uLife.smoking === 'occasional' || cLife.smoking === 'occasional') {
    lifeScore += 4;
  } else {
    lifeScore += 0;
  }

  // Sleep schedule (8 pts)
  if (uLife.sleepSchedule === 'flexible' || cLife.sleepSchedule === 'flexible' || uLife.sleepSchedule === cLife.sleepSchedule) {
    lifeScore += 8;
    if (uLife.sleepSchedule === cLife.sleepSchedule && uLife.sleepSchedule !== 'flexible') {
      breakdown.matchedHighlights.push(`Similar sleep schedule (${uLife.sleepSchedule?.replace('_', ' ')})`);
    }
  } else {
    lifeScore += 2;
  }

  breakdown.lifestyleScore = Math.min(30, lifeScore);
  score += breakdown.lifestyleScore;

  const compatibility = Math.min(100, Math.max(0, score));

  return {
    compatibility,
    breakdown,
  };
};

module.exports = {
  calculateCompatibility,
};
