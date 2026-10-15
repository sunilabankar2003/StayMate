/**
 * Roommate Compatibility Scoring Engine
 * 
 * Calculates a rule-based compatibility score between 0 and 100
 * based on 6 core dimensions:
 * 1. Budget Compatibility (30%): Overlap between minimum and maximum budgets
 * 2. Location Compatibility (25%): Exact city and preferred area matching
 * 3. Room Preference (15%): Single vs Shared preference alignment
 * 4. Food Preference (10%): Veg / Non-Veg / Any alignment
 * 5. Lifestyle Compatibility (10%): Smoking and Drinking tolerance
 * 6. Study / Sleep Schedule (10%): Early bird vs Night owl & study routine
 */

function calculateCompatibility(profileA, profileB) {
  if (!profileA || !profileB) return 0;

  let totalScore = 0;

  // 1. Budget Compatibility (Weight: 30)
  // Check overlap of budget ranges: [minA, maxA] and [minB, maxB]
  const minA = profileA.budgetMin || 0;
  const maxA = profileA.budgetMax || Infinity;
  const minB = profileB.budgetMin || 0;
  const maxB = profileB.budgetMax || Infinity;

  const overlapStart = Math.max(minA, minB);
  const overlapEnd = Math.min(maxA, maxB);

  if (overlapEnd >= overlapStart) {
    // There is an overlap
    const overlapRange = overlapEnd - overlapStart;
    const avgRange = ((maxA - minA) + (maxB - minB)) / 2 || 1;
    const budgetRatio = Math.min(1, (overlapRange + 1000) / avgRange);
    totalScore += Math.round(budgetRatio * 30);
  } else {
    // Gap penalty: proportional to distance between budgets
    const gap = overlapStart - overlapEnd;
    if (gap <= 2000) totalScore += 15;
    else if (gap <= 4000) totalScore += 8;
  }

  // 2. Location Compatibility (Weight: 25)
  const cityMatch = profileA.city?.toLowerCase() === profileB.city?.toLowerCase();
  const areaMatch = profileA.preferredArea?.toLowerCase() === profileB.preferredArea?.toLowerCase();

  if (cityMatch && areaMatch) {
    totalScore += 25;
  } else if (cityMatch) {
    totalScore += 15;
  }

  // 3. Room Preference (Weight: 15)
  if (
    profileA.roomPreference === 'Any' ||
    profileB.roomPreference === 'Any' ||
    profileA.roomPreference === profileB.roomPreference
  ) {
    totalScore += 15;
  }

  // 4. Food Preference (Weight: 10)
  if (
    profileA.foodPreference === 'Any' ||
    profileB.foodPreference === 'Any' ||
    profileA.foodPreference === profileB.foodPreference
  ) {
    totalScore += 10;
  }

  // 5. Lifestyle Compatibility: Smoking & Drinking (Weight: 10)
  let lifestyleScore = 0;
  // Smoking (5 pts)
  if (profileA.smokingPreference === profileB.smokingPreference) {
    lifestyleScore += 5;
  } else if (
    (profileA.smokingPreference === 'No' && profileB.smokingPreference === 'Occasionally') ||
    (profileB.smokingPreference === 'No' && profileA.smokingPreference === 'Occasionally')
  ) {
    lifestyleScore += 2;
  }
  // Drinking (5 pts)
  if (profileA.drinkingPreference === profileB.drinkingPreference) {
    lifestyleScore += 5;
  } else if (
    (profileA.drinkingPreference === 'No' && profileB.drinkingPreference === 'Occasionally') ||
    (profileB.drinkingPreference === 'No' && profileA.drinkingPreference === 'Occasionally')
  ) {
    lifestyleScore += 2;
  }
  totalScore += lifestyleScore;

  // 6. Schedule Compatibility: Sleep & Study (Weight: 10)
  let scheduleScore = 0;
  if (
    profileA.sleepSchedule === 'Flexible' ||
    profileB.sleepSchedule === 'Flexible' ||
    profileA.sleepSchedule === profileB.sleepSchedule
  ) {
    scheduleScore += 5;
  }
  if (
    profileA.studySchedule === 'Flexible' ||
    profileB.studySchedule === 'Flexible' ||
    profileA.studySchedule === profileB.studySchedule
  ) {
    scheduleScore += 5;
  }
  totalScore += scheduleScore;

  return Math.min(100, Math.max(0, Math.round(totalScore)));
}

module.exports = {
  calculateCompatibility,
};
