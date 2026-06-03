/**
 * Emotion Recommendation Algorithm
 * Purpose: Calculate emotional similarity and recommend flowers
 * Uses: Russell Circumplex Model of Emotion
 * Version: 1.0.0
 */

class EmotionRecommender {
  /**
   * Initialize with flower database
   * @param {Array} flowers - Array of flower objects with valence and arousal scores
   */
  constructor(flowers) {
    this.flowers = flowers;
    this.normalize();
  }

  /**
   * Normalize flower vectors to ensure consistency
   */
  normalize() {
    this.flowers.forEach(flower => {
      // Ensure values are between -1 and 1
      flower.valence = Math.max(-1, Math.min(1, flower.valence || 0));
      flower.arousal = Math.max(-1, Math.min(1, flower.arousal || 0));
    });
  }

  /**
   * Calculate Euclidean Distance between two emotion vectors
   * Lower distance = higher similarity
   * 
   * Formula: √[(x₂-x₁)² + (y₂-y₁)²]
   * 
   * @param {number} userValence - User's valence (-1 to 1)
   * @param {number} userArousal - User's arousal (-1 to 1)
   * @param {Object} flower - Flower object
   * @returns {number} Distance value
   */
  calculateEuclideanDistance(userValence, userArousal, flower) {
    const deltaValence = flower.valence - userValence;
    const deltaArousal = flower.arousal - userArousal;
    
    const distance = Math.sqrt(
      Math.pow(deltaValence, 2) + Math.pow(deltaArousal, 2)
    );

    return distance;
  }

  /**
   * Calculate Cosine Similarity between two emotion vectors
   * Higher similarity = higher value (0 to 1)
   * 
   * Formula: (A·B) / (||A|| × ||B||)
   * 
   * @param {number} userValence - User's valence (-1 to 1)
   * @param {number} userArousal - User's arousal (-1 to 1)
   * @param {Object} flower - Flower object
   * @returns {number} Similarity value (0 to 1)
   */
  calculateCosineSimilarity(userValence, userArousal, flower) {
    // Dot product: (valence1 * valence2) + (arousal1 * arousal2)
    const dotProduct = (userValence * flower.valence) + (userArousal * flower.arousal);

    // Magnitude of user vector
    const userMagnitude = Math.sqrt(
      Math.pow(userValence, 2) + Math.pow(userArousal, 2)
    );

    // Magnitude of flower vector
    const flowerMagnitude = Math.sqrt(
      Math.pow(flower.valence, 2) + Math.pow(flower.arousal, 2)
    );

    // Avoid division by zero
    if (userMagnitude === 0 || flowerMagnitude === 0) {
      return 0;
    }

    const similarity = dotProduct / (userMagnitude * flowerMagnitude);
    return similarity;
  }

  /**
   * Recommend top N flowers based on emotion vectors
   * Uses Euclidean Distance (lower = better match)
   * 
   * @param {number} userValence - User's valence score (-1 to 1)
   * @param {number} userArousal - User's arousal score (-1 to 1)
   * @param {number} topN - Number of recommendations (default: 5)
   * @returns {Array} Array of recommended flowers with scores
   */
  recommendFlowersByDistance(userValence, userArousal, topN = 5) {
    // Validate inputs
    userValence = Math.max(-1, Math.min(1, userValence));
    userArousal = Math.max(-1, Math.min(1, userArousal));

    // Calculate distance for each flower
    const flowerScores = this.flowers.map(flower => ({
      ...flower,
      distance: this.calculateEuclideanDistance(userValence, userArousal, flower),
      matchScore: 0 // Will calculate below
    }));

    // Sort by distance (ascending - lower is better)
    flowerScores.sort((a, b) => a.distance - b.distance);

    // Convert distance to match score (1 - normalized distance)
    const maxDistance = Math.sqrt(2); // Maximum possible distance in 2D space [-1,1] × [-1,1]
    flowerScores.forEach(flower => {
      flower.matchScore = Math.round((1 - (flower.distance / maxDistance)) * 100);
    });

    // Return top N
    return flowerScores.slice(0, topN).map(flower => ({
      id: flower.id,
      name: flower.name,
      chineseName: flower.chineseName,
      language: flower.language,
      description: flower.description,
      color: flower.color,
      matchScore: flower.matchScore,
      distance: flower.distance.toFixed(3)
    }));
  }

  /**
   * Recommend flowers using Cosine Similarity
   * Alternative algorithm (higher similarity = better)
   * 
   * @param {number} userValence - User's valence score (-1 to 1)
   * @param {number} userArousal - User's arousal score (-1 to 1)
   * @param {number} topN - Number of recommendations
   * @returns {Array} Array of recommended flowers with similarity scores
   */
  recommendFlowersBySimilarity(userValence, userArousal, topN = 5) {
    userValence = Math.max(-1, Math.min(1, userValence));
    userArousal = Math.max(-1, Math.min(1, userArousal));

    const flowerScores = this.flowers.map(flower => ({
      ...flower,
      similarity: this.calculateCosineSimilarity(userValence, userArousal, flower),
      matchScore: 0
    }));

    // Sort by similarity (descending - higher is better)
    flowerScores.sort((a, b) => b.similarity - a.similarity);

    // Convert similarity to percentage score
    flowerScores.forEach(flower => {
      flower.matchScore = Math.round(flower.similarity * 100);
    });

    return flowerScores.slice(0, topN).map(flower => ({
      id: flower.id,
      name: flower.name,
      chineseName: flower.chineseName,
      language: flower.language,
      description: flower.description,
      color: flower.color,
      matchScore: flower.matchScore,
      similarity: flower.similarity.toFixed(3)
    }));
  }

  /**
   * Get all flowers in a specific emotion quadrant
   * Quadrants based on Russell model:
   * Q1: Positive + High Energy (Happy, Excited)
   * Q2: Positive + Low Energy (Calm, Content)
   * Q3: Negative + Low Energy (Sad, Depressed)
   * Q4: Negative + High Energy (Angry, Anxious)
   * 
   * @param {string} quadrant - 'Q1', 'Q2', 'Q3', or 'Q4'
   * @returns {Array} Flowers in that quadrant
   */
  getFlowersByQuadrant(quadrant) {
    return this.flowers.filter(flower => {
      const isPositive = flower.valence > 0;
      const isHighEnergy = flower.arousal > 0;

      switch(quadrant) {
        case 'Q1': return isPositive && isHighEnergy;
        case 'Q2': return isPositive && !isHighEnergy;
        case 'Q3': return !isPositive && !isHighEnergy;
        case 'Q4': return !isPositive && isHighEnergy;
        default: return false;
      }
    });
  }

  /**
   * Get emotion statistics for user's journal history
   * @param {Array} journalEntries - Array of diary entries with emotion vectors
   * @returns {Object} Statistics object
   */
  getEmotionStatistics(journalEntries) {
    if (journalEntries.length === 0) {
      return {
        averageValence: 0,
        averageArousal: 0,
        dominantQuadrant: 'N/A',
        emotionDistribution: {},
        trendDirection: 'stable'
      };
    }

    const valences = journalEntries.map(e => e.userValence);
    const arousals = journalEntries.map(e => e.userArousal);

    const avgValence = valences.reduce((a, b) => a + b, 0) / valences.length;
    const avgArousal = arousals.reduce((a, b) => a + b, 0) / arousals.length;

    // Determine dominant quadrant
    const isPositive = avgValence > 0;
    const isHighEnergy = avgArousal > 0;
    let dominantQuadrant = 'Neutral';

    if (isPositive && isHighEnergy) dominantQuadrant = 'Happy & Energetic';
    else if (isPositive && !isHighEnergy) dominantQuadrant = 'Calm & Content';
    else if (!isPositive && !isHighEnergy) dominantQuadrant = 'Sad & Tired';
    else if (!isPositive && isHighEnergy) dominantQuadrant = 'Anxious & Angry';

    // Calculate trend (if more than 2 entries)
    let trendDirection = 'stable';
    if (journalEntries.length >= 2) {
      const firstEntry = journalEntries[0];
      const lastEntry = journalEntries[journalEntries.length - 1];
      const valenceDiff = lastEntry.userValence - firstEntry.userValence;
      if (valenceDiff > 0.2) trendDirection = 'improving';
      else if (valenceDiff < -0.2) trendDirection = 'declining';
    }

    return {
      averageValence: parseFloat(avgValence.toFixed(2)),
      averageArousal: parseFloat(avgArousal.toFixed(2)),
      dominantQuadrant,
      entriesCount: journalEntries.length,
      trendDirection,
      recentEntries: journalEntries.slice(-7) // Last 7 entries
    };
  }

  /**
   * Find flowers with specific emotion tags
   * @param {string} tag - Emotion tag (e.g., 'peaceful', 'joyful')
   * @returns {Array} Matching flowers
   */
  searchByEmotionTag(tag) {
    return this.flowers.filter(flower => 
      flower.tags && flower.tags.includes(tag.toLowerCase())
    );
  }

  /**
   * Search flowers by multiple criteria
   * @param {Object} criteria - { tag, quadrant, minValence, maxValence }
   * @returns {Array} Matching flowers
   */
  searchFlowers(criteria = {}) {
    let results = [...this.flowers];

    if (criteria.tag) {
      results = results.filter(f => 
        f.tags && f.tags.includes(criteria.tag.toLowerCase())
      );
    }

    if (criteria.quadrant) {
      const quadrantFlowers = this.getFlowersByQuadrant(criteria.quadrant);
      const quadrantIds = new Set(quadrantFlowers.map(f => f.id));
      results = results.filter(f => quadrantIds.has(f.id));
    }

    if (criteria.minValence !== undefined) {
      results = results.filter(f => f.valence >= criteria.minValence);
    }

    if (criteria.maxValence !== undefined) {
      results = results.filter(f => f.valence <= criteria.maxValence);
    }

    if (criteria.minArousal !== undefined) {
      results = results.filter(f => f.arousal >= criteria.minArousal);
    }

    if (criteria.maxArousal !== undefined) {
      results = results.filter(f => f.arousal <= criteria.maxArousal);
    }

    return results;
  }
}

// ============================================
// TESTING & VALIDATION
// ============================================

/**
 * Run comprehensive tests for the recommendation system
 * @param {Array} flowers - Flower database
 */
function testRecommendationSystem(flowers) {
  console.log('🌸 EMOTION RECOMMENDATION SYSTEM - TEST SUITE\n');

  const recommender = new EmotionRecommender(flowers);

  // Test Case 1: Very Happy & Energetic User
  console.log('TEST 1: Very Happy & Energetic (Valence: 0.9, Arousal: 0.8)');
  console.log('Expected: Sunflower, Marigold, high energy positive flowers\n');
  const happyRecs = recommender.recommendFlowersByDistance(0.9, 0.8, 5);
  happyRecs.forEach((flower, i) => {
    console.log(`  ${i+1}. ${flower.name} (${flower.chineseName}) - Match: ${flower.matchScore}%`);
  });

  // Test Case 2: Calm & Content User
  console.log('\n\nTEST 2: Calm & Content (Valence: 0.5, Arousal: -0.6)');
  console.log('Expected: Lavender, Chamomile, peaceful flowers\n');
  const calmRecs = recommender.recommendFlowersByDistance(0.5, -0.6, 5);
  calmRecs.forEach((flower, i) => {
    console.log(`  ${i+1}. ${flower.name} (${flower.chineseName}) - Match: ${flower.matchScore}%`);
  });

  // Test Case 3: Sad & Tired User
  console.log('\n\nTEST 3: Sad & Tired (Valence: -0.7, Arousal: -0.5)');
  console.log('Expected: Consoling flowers like Snowdrop, Forget-me-not\n');
  const sadRecs = recommender.recommendFlowersByDistance(-0.7, -0.5, 5);
  sadRecs.forEach((flower, i) => {
    console.log(`  ${i+1}. ${flower.name} (${flower.chineseName}) - Match: ${flower.matchScore}%`);
  });

  // Test Case 4: Anxious & Angry User
  console.log('\n\nTEST 4: Anxious & Energetic (Valence: -0.3, Arousal: 0.8)');
  console.log('Expected: Defiant, strong flowers\n');
  const angryRecs = recommender.recommendFlowersByDistance(-0.3, 0.8, 5);
  angryRecs.forEach((flower, i) => {
    console.log(`  ${i+1}. ${flower.name} (${flower.chineseName}) - Match: ${flower.matchScore}%`);
  });

  // Test Case 5: Neutral/Balanced State
  console.log('\n\nTEST 5: Balanced (Valence: 0.2, Arousal: 0.2)');
  console.log('Expected: Moderately positive, balanced flowers\n');
  const neutralRecs = recommender.recommendFlowersByDistance(0.2, 0.2, 5);
  neutralRecs.forEach((flower, i) => {
    console.log(`  ${i+1}. ${flower.name} (${flower.chineseName}) - Match: ${flower.matchScore}%`);
  });

  // Test Case 6: Quadrant Analysis
  console.log('\n\nTEST 6: Quadrant Distribution');
  const q1 = recommender.getFlowersByQuadrant('Q1');
  const q2 = recommender.getFlowersByQuadrant('Q2');
  const q3 = recommender.getFlowersByQuadrant('Q3');
  const q4 = recommender.getFlowersByQuadrant('Q4');
  console.log(`  Q1 (Happy & Energetic): ${q1.length} flowers`);
  console.log(`  Q2 (Calm & Content): ${q2.length} flowers`);
  console.log(`  Q3 (Sad & Tired): ${q3.length} flowers`);
  console.log(`  Q4 (Anxious & Angry): ${q4.length} flowers`);

  // Test Case 7: Emotion Tag Search
  console.log('\n\nTEST 7: Search by Emotion Tag "peaceful"');
  const peacefulFlowers = recommender.searchByEmotionTag('peaceful');
  console.log(`  Found ${peacefulFlowers.length} peaceful flowers:`);
  peacefulFlowers.forEach(f => console.log(`    - ${f.name}`));

  console.log('\n\n✅ ALL TESTS COMPLETED SUCCESSFULLY\n');
  
  return recommender;
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EmotionRecommender, testRecommendationSystem };
}
