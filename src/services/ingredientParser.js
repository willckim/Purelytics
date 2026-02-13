/**
 * Ingredient Parser - Match extracted ingredients to our database
 * Calculates health scores and identifies concerns
 */

import { 
  ingredientDatabase, 
  searchIngredients,
  isHiddenSugar,
  checkForMSG,
  hiddenSugarNames,
} from '../data/ingredientDatabase';

/**
 * Normalize ingredient name for matching
 */
function normalizeIngredient(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Find best match in database for an ingredient
 */
function findIngredientMatch(ingredientName) {
  const normalized = normalizeIngredient(ingredientName);
  
  // Direct search
  const searchResults = searchIngredients(ingredientName);
  if (searchResults.length > 0) {
    return searchResults[0];
  }
  
  // Check each database entry
  for (const [id, data] of Object.entries(ingredientDatabase)) {
    const dbNormalized = normalizeIngredient(data.name);
    
    // Exact match
    if (normalized === dbNormalized) {
      return data;
    }
    
    // Partial match
    if (normalized.includes(dbNormalized) || dbNormalized.includes(normalized)) {
      return data;
    }
    
    // Check hidden names
    if (data.hiddenNames) {
      for (const hiddenName of data.hiddenNames) {
        const hiddenNormalized = normalizeIngredient(hiddenName);
        if (normalized.includes(hiddenNormalized) || hiddenNormalized.includes(normalized)) {
          return data;
        }
      }
    }
  }
  
  return null;
}

/**
 * Determine concern level for unknown ingredients
 */
function assessUnknownIngredient(name) {
  const lower = name.toLowerCase();
  
  // Check if it's a hidden sugar
  if (isHiddenSugar(name)) {
    return {
      score: 30,
      concern: 'moderate',
      category: 'Hidden Sugar',
      note: 'This is a form of added sugar',
    };
  }
  
  // Check for MSG
  const msgCheck = checkForMSG(name);
  if (msgCheck.containsMSG) {
    return {
      score: msgCheck.certainty === 'high' ? 50 : 60,
      concern: 'moderate',
      category: 'Flavor Enhancer',
      note: `May contain MSG (${msgCheck.certainty} certainty)`,
    };
  }
  
  // Red flags in name
  const redFlags = ['artificial', 'synthetic', 'hydrogenated', 'modified'];
  if (redFlags.some(flag => lower.includes(flag))) {
    return { score: 40, concern: 'moderate', category: 'Processed Additive' };
  }
  
  // Yellow flags
  const yellowFlags = ['flavor', 'color', 'dye', 'preservative'];
  if (yellowFlags.some(flag => lower.includes(flag))) {
    return { score: 50, concern: 'moderate', category: 'Additive' };
  }
  
  // Likely natural/safe
  const greenFlags = ['organic', 'natural', 'vitamin', 'mineral', 'water', 'salt', 'spice'];
  if (greenFlags.some(flag => lower.includes(flag))) {
    return { score: 80, concern: 'low', category: 'Natural Ingredient' };
  }
  
  // Default for unknown
  return { score: 70, concern: 'low', category: 'Ingredient' };
}

/**
 * Parse AI results and match to database
 */
export function parseIngredients(aiResult) {
  const { productName, brand, ingredients, rawText } = aiResult;
  
  const parsedIngredients = [];
  const concerns = {
    sugar: { count: 0, names: [] },
    preservatives: { count: 0, names: [] },
    artificial: { count: 0, names: [] },
  };
  const profileAlerts = [];
  
  let totalScore = 0;
  let highConcernCount = 0;
  
  // Process each ingredient
  for (const ingredientName of ingredients) {
    const match = findIngredientMatch(ingredientName);
    
    let ingredientData;
    
    if (match) {
      // Found in database
      ingredientData = {
        id: match.id,
        name: match.name,
        score: match.score,
        category: match.category,
        concern: match.concern,
        plainEnglish: match.plainEnglish,
        healthNotes: match.healthNotes,
        foundInDatabase: true,
      };
      
      // Track concerns
      if (match.category.toLowerCase().includes('sweetener') || isHiddenSugar(ingredientName)) {
        concerns.sugar.count++;
        concerns.sugar.names.push(match.name);
      }
      if (match.category.toLowerCase().includes('preservative')) {
        concerns.preservatives.count++;
        concerns.preservatives.names.push(match.name);
      }
      if (match.category.toLowerCase().includes('artificial') || match.category.toLowerCase().includes('color')) {
        concerns.artificial.count++;
        concerns.artificial.names.push(match.name);
      }
      
      // Check for profile alerts
      if (match.kidAlert) {
        const existing = profileAlerts.find(a => a.profile.includes('Kids'));
        if (!existing) {
          profileAlerts.push({
            profile: '👧 Kids',
            message: `Contains ${match.name} - ${match.kidAlert === true ? 'caution advised for children' : match.kidAlert}`,
          });
        }
      }
      if (match.heartHealthAlert) {
        const existing = profileAlerts.find(a => a.profile.includes('Heart'));
        if (!existing) {
          profileAlerts.push({
            profile: '❤️ Heart Health',
            message: `Contains ${match.name} - monitor for heart health`,
          });
        }
      }
      if (match.diabeticAlert) {
        const existing = profileAlerts.find(a => a.profile.includes('Diabetic'));
        if (!existing) {
          profileAlerts.push({
            profile: '🩺 Diabetic',
            message: `Contains ${match.name} - watch glycemic impact`,
          });
        }
      }
      
    } else {
      // Not in database - assess based on name
      const assessment = assessUnknownIngredient(ingredientName);
      ingredientData = {
        id: normalizeIngredient(ingredientName).replace(/\s+/g, '-'),
        name: ingredientName,
        score: assessment.score,
        category: assessment.category,
        concern: assessment.concern,
        note: assessment.note,
        foundInDatabase: false,
      };
      
      // Track hidden sugars
      if (assessment.category === 'Hidden Sugar') {
        concerns.sugar.count++;
        concerns.sugar.names.push(ingredientName);
      }
    }
    
    parsedIngredients.push(ingredientData);
    totalScore += ingredientData.score;
    
    if (ingredientData.concern === 'high') {
      highConcernCount++;
    }
  }
  
  // Calculate overall score
  // Weight towards worse ingredients (a few bad ones significantly impact score)
  let overallScore = parsedIngredients.length > 0 
    ? Math.round(totalScore / parsedIngredients.length) 
    : 50;
  
  // Penalize for high concern ingredients
  overallScore = Math.max(5, overallScore - (highConcernCount * 8));
  
  // Penalize for many concerns
  const totalConcerns = concerns.sugar.count + concerns.preservatives.count + concerns.artificial.count;
  if (totalConcerns > 5) {
    overallScore = Math.max(5, overallScore - 10);
  }
  
  return {
    id: `scan-${Date.now()}`,
    name: productName || 'Scanned Product',
    brand: brand || 'Unknown Brand',
    category: 'Food Product',
    overallScore,
    rawText: rawText || ingredients.join(', '),
    ingredients: parsedIngredients,
    concerns,
    profileAlerts,
    scannedAt: new Date().toISOString(),
  };
}

/**
 * Quick ingredient lookup
 */
export function lookupIngredient(name) {
  const match = findIngredientMatch(name);
  if (match) return match;
  
  const assessment = assessUnknownIngredient(name);
  return {
    id: normalizeIngredient(name).replace(/\s+/g, '-'),
    name,
    ...assessment,
    foundInDatabase: false,
  };
}

export default {
  parseIngredients,
  lookupIngredient,
};