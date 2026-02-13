/**
 * AI Service - Multi-provider ingredient analysis with web search verification
 * Supports OpenAI GPT-4 Vision, Google Gemini, and Anthropic Claude
 * Integrates Brave Search for product verification before AI analysis
 *
 * Architecture: "Strict Category Anchor" + Web Search Verification
 * 1. (Optional) Brave Search verifies product brand/name/category
 * 2. AI identifies the product category from the label image
 * 3. Web search context is injected into the AI prompt for better accuracy
 * 4. Supplements get specialized dosage/bioavailability/DV%/interaction analysis
 */

import { API_KEYS } from '../config/apiKeys';

// Check which APIs are configured
const getAvailableProviders = () => {
  const available = [];
  if (API_KEYS.openai && API_KEYS.openai.length > 10) available.push('openai');
  if (API_KEYS.gemini && API_KEYS.gemini.length > 10) available.push('gemini');
  if (API_KEYS.anthropic && API_KEYS.anthropic.length > 10) available.push('anthropic');
  return available;
};

// Check if Brave Search is configured
const isBraveConfigured = () => {
  return API_KEYS.brave && API_KEYS.brave.length > 10;
};

// Valid product categories for the Strict Category Anchor
const PRODUCT_CATEGORIES = [
  'Beverage',
  'Dairy',
  'Snack',
  'Meat',
  'Grain',
  'Condiment',
  'Supplement',
  'Baby Food',
  'Frozen',
  'Bakery',
  'Candy',
  'Other',
];

// Category-aware alternative suggestions mapped by category
const CATEGORY_ALTERNATIVES = {
  Beverage: [
    { name: 'Organic Kombucha', brand: 'GT\'s', score: 82, price: '$3.99', stores: ['Whole Foods', 'Target', 'Kroger'], highlights: ['Probiotics', 'Low sugar', 'Organic'] },
    { name: 'Sparkling Water with Fruit', brand: 'Spindrift', score: 90, price: '$5.99/8pk', stores: ['Target', 'Walmart', 'Costco'], highlights: ['Real fruit juice', 'No sweeteners', 'Zero calories'] },
    { name: 'Cold-Pressed Green Juice', brand: 'Suja', score: 78, price: '$4.49', stores: ['Whole Foods', 'Target', 'Kroger'], highlights: ['Cold-pressed', 'No added sugar', 'Organic'] },
    { name: 'Coconut Water', brand: 'Harmless Harvest', score: 85, price: '$4.29', stores: ['Whole Foods', 'Sprouts', 'Target'], highlights: ['Raw', 'No added sugar', 'Electrolytes'] },
  ],
  Dairy: [
    { name: 'Organic Whole Milk Yogurt', brand: 'Stonyfield', score: 80, price: '$5.49', stores: ['Target', 'Kroger', 'Whole Foods'], highlights: ['Organic', 'Probiotics', 'No artificial ingredients'] },
    { name: 'Grass-Fed Whole Milk', brand: 'Organic Valley', score: 85, price: '$6.99', stores: ['Whole Foods', 'Kroger', 'Sprouts'], highlights: ['Grass-fed', 'No hormones', 'Pasture-raised'] },
    { name: 'Oat Milk (Unsweetened)', brand: 'Oatly', score: 75, price: '$4.99', stores: ['Target', 'Walmart', 'Whole Foods'], highlights: ['Plant-based', 'No added sugar', 'Fortified'] },
  ],
  Snack: [
    { name: 'Organic Veggie Straws', brand: 'Hippeas', score: 72, price: '$4.29', stores: ['Target', 'Walmart', 'Whole Foods'], highlights: ['Organic chickpeas', 'No artificial flavors', 'Gluten-free'] },
    { name: 'Mixed Nuts (Unsalted)', brand: 'Planters', score: 88, price: '$7.99', stores: ['Target', 'Walmart', 'Costco'], highlights: ['Whole foods', 'Heart-healthy fats', 'Protein'] },
    { name: 'Organic Apple Chips', brand: 'Bare', score: 82, price: '$3.99', stores: ['Target', 'Whole Foods', 'Kroger'], highlights: ['Single ingredient', 'No added sugar', 'Organic'] },
  ],
  Meat: [
    { name: 'Uncured Turkey Dogs', brand: 'Applegate', score: 72, price: '$6.99', stores: ['Target', 'Whole Foods', 'Kroger'], highlights: ['No nitrites', 'No artificial ingredients', 'Organic'] },
    { name: 'Organic Grass-Fed Beef Franks', brand: 'Organic Prairie', score: 78, price: '$8.49', stores: ['Whole Foods', 'Sprouts'], highlights: ['Grass-fed', 'No added sugar', 'No nitrites'] },
    { name: 'All Natural Uncured Beef Franks', brand: 'Niman Ranch', score: 70, price: '$7.49', stores: ['Whole Foods', 'Safeway', 'Costco'], highlights: ['Humanely raised', 'No antibiotics', 'No hormones'] },
  ],
  Grain: [
    { name: 'Organic Sprouted Bread', brand: 'Ezekiel 4:9', score: 88, price: '$5.99', stores: ['Whole Foods', 'Kroger', 'Sprouts'], highlights: ['Sprouted grains', 'No flour', 'Complete protein'] },
    { name: 'Organic Brown Rice', brand: 'Lundberg', score: 92, price: '$4.99', stores: ['Target', 'Whole Foods', 'Kroger'], highlights: ['Whole grain', 'Organic', 'Single ingredient'] },
    { name: 'Ancient Grain Pasta', brand: 'Banza', score: 80, price: '$3.49', stores: ['Target', 'Walmart', 'Kroger'], highlights: ['Chickpea-based', 'High protein', 'Gluten-free'] },
  ],
  Condiment: [
    { name: 'Organic Yellow Mustard', brand: 'Annie\'s', score: 85, price: '$3.49', stores: ['Target', 'Whole Foods', 'Kroger'], highlights: ['Organic', 'Simple ingredients', 'No artificial colors'] },
    { name: 'Avocado Oil Mayo', brand: 'Primal Kitchen', score: 78, price: '$8.99', stores: ['Whole Foods', 'Target', 'Sprouts'], highlights: ['Avocado oil', 'No soybean oil', 'No sugar'] },
    { name: 'Organic Ketchup', brand: 'Annie\'s', score: 72, price: '$3.99', stores: ['Target', 'Kroger', 'Whole Foods'], highlights: ['Organic tomatoes', 'No HFCS', 'Non-GMO'] },
  ],
  Supplement: [
    { name: 'Methylated B-Complex', brand: 'Thorne', score: 92, price: '$28.00', stores: ['Amazon', 'Thorne.com', 'Whole Foods'], highlights: ['Bioavailable forms', 'Third-party tested', 'No fillers'] },
    { name: 'Chelated Magnesium Glycinate', brand: 'Pure Encapsulations', score: 90, price: '$24.00', stores: ['Amazon', 'PureEncapsulations.com'], highlights: ['Chelated form', 'High absorption', 'Hypoallergenic'] },
    { name: 'Whole Food Multivitamin', brand: 'Garden of Life', score: 82, price: '$32.99', stores: ['Whole Foods', 'Amazon', 'Target'], highlights: ['Whole food sourced', 'Probiotics included', 'Non-GMO'] },
  ],
  'Baby Food': [
    { name: 'Organic Baby Puree', brand: 'Happy Baby', score: 88, price: '$1.49', stores: ['Target', 'Walmart', 'Kroger'], highlights: ['Organic', 'No added sugar', 'Non-GMO'] },
    { name: 'Organic Teething Wafers', brand: 'Happy Baby', score: 80, price: '$3.99', stores: ['Target', 'Walmart', 'Whole Foods'], highlights: ['Organic rice', 'No wheat', 'Gentle ingredients'] },
  ],
  Frozen: [
    { name: 'Organic Frozen Vegetables', brand: 'Cascadian Farm', score: 92, price: '$3.49', stores: ['Target', 'Kroger', 'Whole Foods'], highlights: ['Organic', 'Flash frozen', 'No additives'] },
    { name: 'Cauliflower Crust Pizza', brand: 'Caulipower', score: 68, price: '$8.99', stores: ['Target', 'Walmart', 'Kroger'], highlights: ['Cauliflower crust', 'Gluten-free', 'Lower carb'] },
  ],
  Bakery: [
    { name: 'Organic Sourdough Bread', brand: 'Dave\'s Killer Bread', score: 78, price: '$5.49', stores: ['Target', 'Kroger', 'Walmart'], highlights: ['Organic', 'Whole grains', 'Non-GMO'] },
    { name: 'Gluten-Free Seed Crackers', brand: 'Simple Mills', score: 80, price: '$4.99', stores: ['Target', 'Whole Foods', 'Kroger'], highlights: ['Almond flour', 'No grains', 'Simple ingredients'] },
  ],
  Candy: [
    { name: 'Dark Chocolate (85%)', brand: 'Hu', score: 75, price: '$4.99', stores: ['Whole Foods', 'Target', 'Sprouts'], highlights: ['No refined sugar', 'Organic cacao', 'Fair trade'] },
    { name: 'Fruit Snacks (Real Fruit)', brand: 'That\'s It', score: 85, price: '$4.49', stores: ['Target', 'Walmart', 'Whole Foods'], highlights: ['Only fruit', 'No added sugar', 'No preservatives'] },
  ],
  Other: [
    { name: 'Organic Alternative', brand: 'Various', score: 75, price: 'Varies', stores: ['Whole Foods', 'Target', 'Sprouts'], highlights: ['Organic', 'Fewer additives', 'Cleaner label'] },
  ],
};

// ──────────────────────────────────────────────────────────────────
// BRAVE SEARCH INTEGRATION
// ──────────────────────────────────────────────────────────────────

/**
 * Search Brave for product information to verify brand, name, category
 * Returns a context string to inject into the AI prompt
 */
async function searchProductWithBrave(productName, brand) {
  if (!isBraveConfigured()) {
    return null;
  }

  const query = `${brand || ''} ${productName || ''} product ingredients nutrition`.trim();
  if (query.length < 5) return null;

  try {
    console.log(`Brave Search: "${query}"`);
    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`,
      {
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip',
          'X-Subscription-Token': API_KEYS.brave,
        },
      }
    );

    if (!response.ok) {
      console.warn('Brave Search failed:', response.status);
      return null;
    }

    const data = await response.json();
    const results = data.web?.results || [];

    if (results.length === 0) return null;

    // Extract relevant snippets
    const snippets = results
      .slice(0, 3)
      .map(r => `- ${r.title}: ${r.description}`)
      .join('\n');

    return `WEB SEARCH CONTEXT (use this to verify product identity and category):\n${snippets}`;
  } catch (error) {
    console.warn('Brave Search error:', error.message);
    return null;
  }
}

/**
 * Post-scan verification: search for the product detected by AI
 * Returns enriched context for the second pass or for user review
 */
export async function verifyProductWithSearch(productName, brand, category) {
  if (!isBraveConfigured()) {
    return { verified: false, reason: 'Brave Search not configured' };
  }

  try {
    const query = `"${brand}" "${productName}" ${category} product`.trim();
    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`,
      {
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip',
          'X-Subscription-Token': API_KEYS.brave,
        },
      }
    );

    if (!response.ok) return { verified: false, reason: 'Search failed' };

    const data = await response.json();
    const results = data.web?.results || [];

    return {
      verified: results.length > 0,
      resultCount: results.length,
      topResult: results[0] ? { title: results[0].title, url: results[0].url, description: results[0].description } : null,
      searchContext: results.slice(0, 3).map(r => r.description).join(' '),
    };
  } catch (error) {
    return { verified: false, reason: error.message };
  }
}

// ──────────────────────────────────────────────────────────────────
// PROMPTS
// ──────────────────────────────────────────────────────────────────

// Base prompt shared by all product types
const BASE_PROMPT = `You are an expert food scientist and ingredient safety analyst. Analyze the product label image.

STEP 1 — STRICT CATEGORY ANCHOR (do this FIRST):
Identify the product category from EXACTLY one of these options:
${PRODUCT_CATEGORIES.join(', ')}

The category you choose MUST anchor all further analysis. When suggesting alternatives later, they MUST be within the SAME category (e.g., a Beverage must only get Beverage alternatives, never Food).

STEP 2 — Return a JSON object with this EXACT structure:
{
  "productName": "detected product name or null",
  "brand": "detected brand or null",
  "productCategory": "one of the categories listed above",
  "rawText": "the complete raw ingredient text as shown on label",
  "ingredients": [
    {
      "name": "Ingredient Name",
      "score": 0-100,
      "concern": "none|low|moderate|high",
      "category": "category type",
      "plainEnglish": "simple explanation of what this is",
      "healthNotes": "brief health impact info"
    }
  ],
  "concerns": {
    "sugar": { "count": 0, "names": [] },
    "preservatives": { "count": 0, "names": [] },
    "artificial": { "count": 0, "names": [] }
  },
  "overallScore": 0-100
}

CATEGORIES for ingredients: Sweetener, Preservative, Artificial Color, Flavor Enhancer, Emulsifier, Thickener, Natural Extract, Herb/Botanical, Vitamin/Mineral, Acid/pH Regulator, Oil/Fat, Protein, Fiber, Water, Probiotic, Enzyme, Other

For ingredients you don't recognize or are region-specific (Korean, Japanese, Chinese, European, etc.), research your knowledge and provide the best assessment. If truly unknown, score 50 with "moderate" concern and note it needs verification.

Return ONLY valid JSON, no markdown or explanation.`;

// Standard food/drink scoring guide
const FOOD_SCORING = `
SCORING GUIDE (for food, drink, snack, dairy, meat, grain, condiment, bakery, candy, frozen, baby food, other):
- 90-100: Whole foods, natural ingredients (water, herbs, fruits, vegetables)
- 70-89: Generally safe additives, natural extracts, vitamins
- 50-69: Moderate concern - processed ingredients, some additives
- 30-49: Higher concern - artificial colors, some preservatives, HFCS
- 0-29: Significant concern - linked to health issues (nitrites, BHA/BHT, trans fats)

CONCERN LEVELS:
- "none": Natural whole foods
- "low": Generally recognized as safe
- "moderate": Some studies show concerns, limit intake
- "high": Linked to health issues, avoid if possible`;

// Enhanced Supplement-specific analysis prompt with DV%, interactions
const SUPPLEMENT_SCORING = `
THIS IS A SUPPLEMENT — use specialized supplement analysis:

SCORING GUIDE (for supplements, vitamins, probiotics):
Score each ingredient based on EFFICACY and SAFETY, not caloric health:
- 90-100: Bioavailable form, clinically studied dose, no fillers (e.g., methylfolate, chelated magnesium)
- 70-89: Acceptable form, reasonable dose, minor fillers (e.g., calcium carbonate, standard probiotics)
- 50-69: Less bioavailable form, underdosed, or unnecessary filler (e.g., magnesium oxide, low-CFU probiotics)
- 30-49: Poor form, proprietary blend hiding doses, concerning excipients (e.g., titanium dioxide coating)
- 0-29: Potentially harmful at stated dose, banned in some countries, or known contaminant risk

For each supplement ingredient, "healthNotes" MUST include:
1. Form quality (e.g., "Methylcobalamin is the active, bioavailable form of B12" or "Cyanocobalamin requires conversion and is less efficient")
2. Dosage assessment if visible (e.g., "500mg is within the recommended daily range" or "50mg is well below clinical doses studied")
3. Bioavailability note (e.g., "Chelated minerals absorb 2-3x better than oxide forms")
4. Daily Value percentage if visible on label (e.g., "Provides 250% DV")

CONCERN LEVELS for supplements:
- "none": Well-studied, bioavailable, safe at stated dose
- "low": Generally safe but suboptimal form or dose
- "moderate": Poor bioavailability, unnecessary fillers, or underdosed
- "high": Potentially harmful dose, banned elsewhere, or contamination risk

Also add to the JSON root:
"supplementInfo": {
  "formQuality": "excellent|good|average|poor",
  "dosageAdequacy": "optimal|adequate|underdosed|overdosed|unknown",
  "bioavailabilityNotes": "brief overall assessment of the supplement's absorbability",
  "thirdPartyTested": "unknown (cannot determine from label)",
  "dvPercentages": [
    {
      "nutrient": "Vitamin D3",
      "amount": "50mcg",
      "dailyValue": "250%",
      "assessment": "Above RDA but within safe UL of 100mcg"
    }
  ],
  "interactions": [
    {
      "pair": ["Calcium", "Iron"],
      "severity": "moderate",
      "note": "Calcium can inhibit iron absorption when taken together. Take at separate times."
    }
  ],
  "megadoseWarnings": ["Vitamin A at 300% DV - fat-soluble vitamin, can accumulate. Monitor intake from other sources."]
}`;

/**
 * Build the appropriate system prompt based on detected product type.
 * Optionally includes web search context for better accuracy.
 */
function buildPrompt(isSupplementHint = false, webSearchContext = null) {
  let prompt = BASE_PROMPT;

  if (webSearchContext) {
    prompt += '\n\n' + webSearchContext;
  }

  if (isSupplementHint) {
    prompt += '\n' + SUPPLEMENT_SCORING;
  } else {
    prompt += '\n' + FOOD_SCORING;
  }

  return prompt;
}

// ──────────────────────────────────────────────────────────────────
// PROVIDER API CALLS
// ──────────────────────────────────────────────────────────────────

/**
 * Analyze image with OpenAI GPT-4 Vision
 */
async function analyzeWithOpenAI(base64Image, systemPrompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEYS.openai}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: 'high',
              },
            },
            {
              type: 'text',
              text: 'Analyze this product label image. First identify the category, then provide the full analysis.',
            },
          ],
        },
      ],
      max_tokens: 4096,
    }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(`OpenAI: ${data.error.message}`);
  }

  return parseAIResponse(data.choices[0].message.content);
}

/**
 * Analyze image with Google Gemini
 */
async function analyzeWithGemini(base64Image, systemPrompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEYS.gemini}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: base64Image,
                },
              },
              {
                text: systemPrompt + '\n\nAnalyze this product label image. First identify the category, then provide the full analysis.',
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 4096,
        },
      }),
    }
  );

  const data = await response.json();

  if (data.error) {
    throw new Error(`Gemini: ${data.error.message}`);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini: No response received');
  }

  return parseAIResponse(text);
}

/**
 * Analyze image with Anthropic Claude
 */
async function analyzeWithClaude(base64Image, systemPrompt) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': API_KEYS.anthropic,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: 'Analyze this product label image. First identify the category, then provide the full analysis.',
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(`Claude: ${data.error.message}`);
  }

  const text = data.content?.[0]?.text;
  if (!text) {
    throw new Error('Claude: No response received');
  }

  return parseAIResponse(text);
}

// ──────────────────────────────────────────────────────────────────
// RESPONSE PARSING
// ──────────────────────────────────────────────────────────────────

/**
 * Parse AI response to extract JSON
 */
function parseAIResponse(text) {
  let jsonStr = text;

  // Remove markdown code blocks if present (handle both complete and truncated)
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1];
  } else {
    const openMatch = text.match(/```(?:json)?\s*([\s\S]*)/);
    if (openMatch) {
      jsonStr = openMatch[1];
    }
  }

  // Try to find JSON object in text
  const objectMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    jsonStr = objectMatch[0];
  }

  try {
    return JSON.parse(jsonStr.trim());
  } catch (e) {
    // Try to repair truncated JSON by closing open structures
    try {
      let repaired = jsonStr.trim();
      let braces = 0, brackets = 0, inString = false, escape = false;
      for (const ch of repaired) {
        if (escape) { escape = false; continue; }
        if (ch === '\\') { escape = true; continue; }
        if (ch === '"') { inString = !inString; continue; }
        if (inString) continue;
        if (ch === '{') braces++;
        if (ch === '}') braces--;
        if (ch === '[') brackets++;
        if (ch === ']') brackets--;
      }
      if (inString) repaired += '"';
      repaired = repaired.replace(/,\s*$/, '');
      repaired = repaired.replace(/,\s*"[^"]*$/, '');
      for (let i = 0; i < brackets; i++) repaired += ']';
      for (let i = 0; i < braces; i++) repaired += '}';
      return JSON.parse(repaired);
    } catch (e2) {
      console.error('Failed to parse AI response:', text.substring(0, 500));
      throw new Error('Failed to parse ingredient data from AI response');
    }
  }
}

/**
 * Validate and normalize the AI result to ensure category anchor is present
 */
function normalizeResult(result) {
  // Ensure productCategory is valid
  if (!result.productCategory || !PRODUCT_CATEGORIES.includes(result.productCategory)) {
    // Try to infer from deprecated productType field
    const typeMap = {
      'food': 'Other',
      'drink': 'Beverage',
      'snack': 'Snack',
      'supplement': 'Supplement',
      'condiment': 'Condiment',
      'other': 'Other',
    };
    result.productCategory = typeMap[result.productType] || 'Other';
  }

  // Clean up legacy field
  delete result.productType;

  return result;
}

// ──────────────────────────────────────────────────────────────────
// ANALYSIS PIPELINE
// ──────────────────────────────────────────────────────────────────

/**
 * Send image to a specific provider with the given prompt
 */
async function sendToProvider(provider, base64Image, systemPrompt) {
  switch (provider) {
    case 'openai':
      return analyzeWithOpenAI(base64Image, systemPrompt);
    case 'gemini':
      return analyzeWithGemini(base64Image, systemPrompt);
    case 'anthropic':
      return analyzeWithClaude(base64Image, systemPrompt);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

/**
 * Two-pass analysis with optional web search verification:
 * 1. First pass with general prompt (+ web search context if available)
 * 2. If supplement detected, second pass with specialized prompt
 */
async function analyzeWithProvider(provider, base64Image, webSearchContext = null) {
  // First pass: use general prompt with web search context
  const prompt = buildPrompt(false, webSearchContext);

  let result = await sendToProvider(provider, base64Image, prompt);
  result = normalizeResult(result);

  // If the first pass detected a Supplement, re-analyze with the specialized prompt
  if (result.productCategory === 'Supplement') {
    console.log('Supplement detected — running specialized DV%/interaction analysis...');
    const supplementPrompt = buildPrompt(true, webSearchContext);
    let supplementResult = await sendToProvider(provider, base64Image, supplementPrompt);
    supplementResult = normalizeResult(supplementResult);
    // Force the category to Supplement in case second pass drifted
    supplementResult.productCategory = 'Supplement';
    return supplementResult;
  }

  return result;
}

/**
 * Main function - Analyze ingredient label with best available AI
 * Tries providers in order: Claude -> Gemini -> OpenAI (based on vision quality)
 */
export async function analyzeIngredientLabel(base64Image) {
  const providers = getAvailableProviders();

  if (providers.length === 0) {
    throw new Error('No AI API keys configured. Please add your API keys in src/config/apiKeys.js');
  }

  const priority = ['anthropic', 'gemini', 'openai'];
  const orderedProviders = priority.filter(p => providers.includes(p));

  let lastError = null;

  for (const provider of orderedProviders) {
    try {
      console.log(`Trying ${provider}...`);
      const result = await analyzeWithProvider(provider, base64Image);
      console.log(`${provider} succeeded! Category: ${result.productCategory}`);
      return { ...result, provider };
    } catch (error) {
      console.error(`${provider} failed:`, error.message);
      lastError = error;
    }
  }

  throw lastError || new Error('All AI providers failed');
}

/**
 * Analyze with user's preferred provider, optionally with web search verification
 */
export async function analyzeWithPreferred(base64Image, preferredProvider = 'auto') {
  const providers = getAvailableProviders();

  if (providers.length === 0) {
    throw new Error('No AI API keys configured. Please add your API keys in src/config/apiKeys.js');
  }

  // Run web search in parallel with image analysis setup (non-blocking)
  // Web search context will be null if Brave is not configured
  let webSearchContext = null;
  // Note: We can't search before we know the product name, so web search
  // is used in the post-scan verification step (verifyProductWithSearch)

  if (preferredProvider !== 'auto' && providers.includes(preferredProvider)) {
    try {
      console.log(`Using preferred provider: ${preferredProvider}`);
      const result = await analyzeWithProvider(preferredProvider, base64Image, webSearchContext);
      return { ...result, provider: preferredProvider };
    } catch (error) {
      console.error(`Preferred provider ${preferredProvider} failed, falling back...`);
    }
  }

  return analyzeIngredientLabel(base64Image);
}

/**
 * Re-analyze with web search context after initial scan
 * Used when ReviewScanScreen confirms the product and web search data is available
 */
export async function reanalyzeWithContext(base64Image, webSearchContext, provider = 'auto') {
  const providers = getAvailableProviders();
  if (providers.length === 0) {
    throw new Error('No AI API keys configured.');
  }

  const targetProvider = (provider !== 'auto' && providers.includes(provider))
    ? provider
    : (['anthropic', 'gemini', 'openai'].find(p => providers.includes(p)));

  if (!targetProvider) throw new Error('No provider available');

  const result = await analyzeWithProvider(targetProvider, base64Image, webSearchContext);
  return { ...result, provider: targetProvider };
}

/**
 * Get category-aware alternatives for a product
 */
export function getAlternativesForCategory(category, originalScore) {
  const alternatives = CATEGORY_ALTERNATIVES[category] || CATEGORY_ALTERNATIVES['Other'];
  return alternatives
    .map((alt, index) => ({
      id: index + 1,
      ...alt,
      improvement: Math.max(0, alt.score - originalScore),
      priceLevel: parseFloat(alt.price.replace(/[^0-9.]/g, '')) > 7 ? 'high' : parseFloat(alt.price.replace(/[^0-9.]/g, '')) > 4 ? 'moderate' : 'budget',
      budgetPick: parseFloat(alt.price.replace(/[^0-9.]/g, '')) <= 4,
    }))
    .filter(alt => alt.score > originalScore)
    .sort((a, b) => b.improvement - a.improvement);
}

export function isAIConfigured() {
  return getAvailableProviders().length > 0;
}

export function getConfiguredProviders() {
  return getAvailableProviders();
}

export function isProviderConfigured(providerId) {
  return getAvailableProviders().includes(providerId);
}

export { PRODUCT_CATEGORIES, CATEGORY_ALTERNATIVES, isBraveConfigured };

export default {
  analyzeIngredientLabel,
  analyzeWithPreferred,
  reanalyzeWithContext,
  verifyProductWithSearch,
  getAlternativesForCategory,
  isAIConfigured,
  getConfiguredProviders,
  isProviderConfigured,
  isBraveConfigured,
  PRODUCT_CATEGORIES,
  CATEGORY_ALTERNATIVES,
};
