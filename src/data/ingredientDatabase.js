/**
 * Purelytics Ingredient Database
 * 
 * Real, research-backed ingredient safety data compiled from:
 * - FDA (21 CFR regulations, GRAS determinations)
 * - EFSA (European Food Safety Authority opinions)
 * - JECFA (Joint FAO/WHO Expert Committee on Food Additives)
 * - IARC (International Agency for Research on Cancer)
 * - CSPI (Center for Science in the Public Interest)
 * - EWG (Environmental Working Group)
 * - Peer-reviewed studies (PubMed, Nature, Lancet, etc.)
 * 
 * Last updated: February 2025
 */

// =============================================================================
// PRESERVATIVES
// =============================================================================

const preservatives = {
  'sodium-nitrite': {
    id: 'sodium-nitrite',
    name: 'Sodium Nitrite',
    eNumber: 'E250',
    category: 'Preservative',
    score: 25,
    concern: 'high',
    
    plainEnglish: 'A preservative used to cure meats, giving them their pink color and preventing bacterial growth. It can form cancer-causing compounds (nitrosamines) when cooked at high heat or combined with proteins.',
    
    healthNotes: 'IARC classifies processed meat (which uses nitrite) as Group 1 carcinogen. Ingested nitrate/nitrite under conditions of endogenous nitrosation is Group 2A (probably carcinogenic). A 2023 meta-analysis found dietary nitrosamines significantly associated with colorectal cancer risk (RR = 1.36). Can cause methemoglobinemia in infants.',
    
    dailyLimit: 'ADI: 0.07 mg/kg body weight/day (EFSA/JECFA). For a 70kg adult, that\'s about 4.9mg/day.',
    
    regulatoryStatus: {
      fda: 'Approved (21 CFR 172.175). Max 200ppm in finished meat products.',
      efsa: 'Approved with ADI 0.07 mg/kg/day',
      jecfa: 'ADI 0-0.07 mg/kg/day',
      iarc: 'Group 2A (nitrite under nitrosation conditions); Group 1 (processed meat)',
      cspiRating: 'Caution',
      ewgRating: 'Dirty Dozen list'
    },
    
    bans: ['EU restricted levels in 2023-2024 (Regulation 2023/2108)'],
    
    hiddenNames: [
      'Curing salt',
      'Prague Powder #1',
      'Pink curing salt',
      'Nitrite pickling salt',
      'Celery powder',
      'Celery juice',
      'Celery extract'
    ],
    
    foundIn: [
      'Bacon',
      'Ham',
      'Hot dogs',
      'Salami',
      'Corned beef',
      'Smoked fish',
      'Deli meats',
      'Sausages',
      'Pepperoni'
    ],
    
    alternatives: [
      'Uncured meats',
      'Fresh meats',
      'Celery-free alternatives'
    ],
    
    kidAlert: true,
    heartHealthAlert: true,
    diabeticAlert: false,
    
    sources: [
      'IARC Monograph Vol. 94 (2010)',
      'EFSA Journal 2017;15(6):4786',
      'Seyyedsalehi et al., Toxics 2023 (meta-analysis)',
      '21 CFR 172.175',
      '9 CFR 424.21 (USDA meat regulations)'
    ]
  },

  'sodium-benzoate': {
    id: 'sodium-benzoate',
    name: 'Sodium Benzoate',
    eNumber: 'E211',
    category: 'Preservative',
    score: 45,
    concern: 'moderate',
    
    plainEnglish: 'A preservative that prevents mold and bacteria growth in acidic foods. Generally safe alone, but can form benzene (a carcinogen) when combined with vitamin C, especially when heated or exposed to light.',
    
    healthNotes: 'The Southampton Study (2007, Lancet) linked artificial colors + sodium benzoate to hyperactivity in children. FDA found 10 of 200 sodas exceeded safe benzene limits when benzoate + vitamin C were combined. In vitro studies showed chromosome breakage in human cells.',
    
    dailyLimit: 'ADI: 5 mg/kg body weight/day (EFSA/JECFA). For a 70kg adult, that\'s 350mg/day.',
    
    regulatoryStatus: {
      fda: 'GRAS (21 CFR 184.1733). Max 0.1% by weight.',
      efsa: 'Approved with ADI 5 mg/kg/day',
      jecfa: 'ADI 0-5 mg/kg/day',
      iarc: 'Not evaluated (but benzene is Group 1)',
      cspiRating: 'Caution'
    },
    
    bans: [],
    
    hiddenNames: [
      'Benzoate of soda',
      'Sodium salt of benzoic acid',
      'Benzoic acid (E210)',
      'Potassium benzoate (E212)',
      'Calcium benzoate (E213)'
    ],
    
    foundIn: [
      'Soft drinks',
      'Fruit juices',
      'Salad dressings',
      'Pickles',
      'Soy sauce',
      'Hot sauces',
      'Cough syrups',
      'Mouthwash'
    ],
    
    alternatives: [
      'Citric acid preserved products',
      'Refrigerated fresh products',
      'Naturally fermented foods'
    ],
    
    kidAlert: true,
    heartHealthAlert: false,
    diabeticAlert: false,
    
    sources: [
      'McCann et al., Lancet 2007 (Southampton Study)',
      'FDA Benzene in Soft Drinks Survey 2005-2006',
      'Zengin et al., 2011 (chromosome study)',
      '21 CFR 184.1733'
    ]
  },

  'bha': {
    id: 'bha',
    name: 'BHA (Butylated Hydroxyanisole)',
    eNumber: 'E320',
    category: 'Preservative/Antioxidant',
    score: 30,
    concern: 'high',
    
    plainEnglish: 'A synthetic antioxidant that prevents fats and oils from going rancid. It\'s been found to cause cancer in lab animals and is listed as "reasonably anticipated to be a human carcinogen" by the US National Toxicology Program.',
    
    healthNotes: 'IARC Group 2B (possibly carcinogenic). NTP lists as "reasonably anticipated to be a human carcinogen" based on forestomach tumors in rats, mice, and hamsters. Listed under California Proposition 65 as a carcinogen. Banned in Japan for certain food uses.',
    
    dailyLimit: 'ADI: 1.0 mg/kg body weight/day (EFSA); 0.5 mg/kg/day (JECFA)',
    
    regulatoryStatus: {
      fda: 'GRAS since 1958 (21 CFR 172.110). Max 0.02% of fat/oil content.',
      efsa: 'Approved with ADI 1.0 mg/kg/day',
      jecfa: 'ADI 0-0.5 mg/kg/day',
      iarc: 'Group 2B (possibly carcinogenic)',
      cspiRating: 'Caution',
      prop65: 'Listed as carcinogen'
    },
    
    bans: ['Japan (certain food uses)', 'California requires Prop 65 warning'],
    
    hiddenNames: [
      'Butylated hydroxyanisole',
      'tert-butyl-4-hydroxyanisole',
      'Antioxidant BHA',
      'E320'
    ],
    
    foundIn: [
      'Butter',
      'Lard',
      'Cereals',
      'Chewing gum',
      'Potato chips',
      'Vegetable oils',
      'Food packaging',
      'Baked goods'
    ],
    
    alternatives: [
      'Vitamin E (tocopherols)',
      'Rosemary extract',
      'Products without synthetic antioxidants'
    ],
    
    kidAlert: true,
    heartHealthAlert: false,
    diabeticAlert: false,
    
    sources: [
      'IARC Monograph Vol. 40 (1986)',
      'NTP 15th Report on Carcinogens (2021)',
      'EFSA Journal 2011;9(10):2392',
      '21 CFR 172.110'
    ]
  },

  'bht': {
    id: 'bht',
    name: 'BHT (Butylated Hydroxytoluene)',
    eNumber: 'E321',
    category: 'Preservative/Antioxidant',
    score: 40,
    concern: 'moderate',
    
    plainEnglish: 'A synthetic antioxidant similar to BHA, used to keep fats from going rancid. Less concerning than BHA, but major food companies like General Mills have voluntarily removed it from products due to consumer concerns.',
    
    healthNotes: 'IARC Group 3 (not classifiable) due to conflicting evidence of both tumor promotion and inhibition. High doses caused hyperthyroidism, reproductive effects, liver enlargement, and blood clotting issues in animal studies. Many companies voluntarily removing.',
    
    dailyLimit: 'ADI: 0.25-0.3 mg/kg body weight/day (EFSA/JECFA)',
    
    regulatoryStatus: {
      fda: 'GRAS since 1959 (21 CFR 172.115). Max 0.02% of fat/oil content.',
      efsa: 'Approved with ADI 0.25 mg/kg/day',
      jecfa: 'ADI 0-0.3 mg/kg/day',
      iarc: 'Group 3 (not classifiable)',
      cspiRating: 'Caution'
    },
    
    bans: [],
    
    hiddenNames: [
      'Butylated hydroxytoluene',
      '2,6-di-tert-butyl-4-methylphenol',
      'DBPC',
      'E321'
    ],
    
    foundIn: [
      'Breakfast cereals',
      'Snack foods',
      'Chewing gum',
      'Enriched rice',
      'Fats and oils',
      'Food packaging'
    ],
    
    alternatives: [
      'Vitamin E (tocopherols)',
      'Rosemary extract',
      'Products labeled "No BHT"'
    ],
    
    kidAlert: true,
    heartHealthAlert: false,
    diabeticAlert: false,
    
    sources: [
      'IARC Monograph 1987',
      'EFSA 2012 re-evaluation',
      '21 CFR 172.115'
    ]
  },

  'potassium-bromate': {
    id: 'potassium-bromate',
    name: 'Potassium Bromate',
    eNumber: 'E924',
    category: 'Flour Improver',
    score: 10,
    concern: 'high',
    
    plainEnglish: 'A flour improver that makes bread rise higher and gives it a better texture. It\'s been found to cause cancer in animals and is banned in most countries worldwide, but remains legal in the US.',
    
    healthNotes: 'IARC Group 2B (possibly carcinogenic). Complete carcinogen with both initiating and promoting activities. Caused kidney tumors, thyroid tumors, and mesotheliomas in rats. JECFA withdrew ADI due to carcinogenicity concerns. California AB-418 bans it starting 2027.',
    
    dailyLimit: 'No ADI established - JECFA withdrew it due to safety concerns',
    
    regulatoryStatus: {
      fda: 'Permitted under pre-1958 prior-sanctioned status. FDA urges voluntary cessation.',
      efsa: 'Banned in EU since 1990',
      jecfa: 'ADI withdrawn/not allocated',
      iarc: 'Group 2B (possibly carcinogenic)',
      cspiRating: 'Avoid'
    },
    
    bans: [
      'European Union (1990)',
      'Canada (1994)',
      'United Kingdom',
      'China (2005)',
      'India (2016)',
      'Brazil',
      'Argentina',
      'Nigeria',
      'South Korea',
      'Peru',
      'Sri Lanka',
      'California (effective 2027)'
    ],
    
    hiddenNames: [
      'Bromate',
      'Bromated flour',
      'KBrO3'
    ],
    
    foundIn: [
      'White flour',
      'Bread',
      'Rolls',
      'Pizza dough',
      'Bagels',
      'Pastries'
    ],
    
    alternatives: [
      'Unbromated flour products',
      'Whole wheat flour',
      'European-style breads'
    ],
    
    kidAlert: true,
    heartHealthAlert: false,
    diabeticAlert: false,
    
    sources: [
      'IARC Monograph Vol. 73 (1999)',
      'Kurokawa et al., Environmental Health Perspectives 1990',
      'California AB-418 (2023)',
      'EWG analysis of 86+ baked goods'
    ]
  },

  'calcium-propionate': {
    id: 'calcium-propionate',
    name: 'Calcium Propionate',
    eNumber: 'E282',
    category: 'Preservative',
    score: 85,
    concern: 'low',
    
    plainEnglish: 'A mold inhibitor commonly used in bread and baked goods. It\'s the calcium salt of propionic acid, which is naturally produced in your body during metabolism. Considered very safe.',
    
    healthNotes: 'JECFA assigned ADI "Not limited" indicating very low toxicity. Propionic acid is a normal human metabolite. One small study linked it to irritability and sleep disturbance in some children, but this has not been widely replicated.',
    
    dailyLimit: 'No limit established - considered very safe',
    
    regulatoryStatus: {
      fda: 'GRAS (21 CFR 184.1221). No limitation beyond good manufacturing practice.',
      efsa: 'No safety concerns identified',
      jecfa: 'ADI "Not limited"',
      cspiRating: 'Safe'
    },
    
    bans: [],
    
    hiddenNames: [
      'Calcium propanoate',
      'E282'
    ],
    
    foundIn: [
      'Bread',
      'Baked goods',
      'Tortillas',
      'Bagels',
      'English muffins'
    ],
    
    alternatives: [],
    
    kidAlert: false,
    heartHealthAlert: false,
    diabeticAlert: false,
    
    sources: [
      'JECFA 1973 evaluation',
      'EFSA 2014 review',
      '21 CFR 184.1221'
    ]
  }
};

// =============================================================================
// ARTIFICIAL SWEETENERS
// =============================================================================

const artificialSweeteners = {
  'aspartame': {
    id: 'aspartame',
    name: 'Aspartame',
    eNumber: 'E951',
    category: 'Artificial Sweetener',
    score: 35,
    concern: 'high',
    
    plainEnglish: 'An artificial sweetener about 200 times sweeter than sugar. In July 2023, WHO\'s cancer research agency classified it as "possibly carcinogenic to humans" based on limited evidence linking it to liver cancer.',
    
    healthNotes: 'IARC Group 2B (possibly carcinogenic) as of July 2023, based on limited evidence for liver cancer. The NutriNet-Santé study (102,865 adults) found 15% higher overall cancer risk and 22% higher breast cancer risk in aspartame consumers. Contains phenylalanine - dangerous for people with PKU.',
    
    dailyLimit: 'ADI: 40 mg/kg body weight/day (EFSA/JECFA); 50 mg/kg/day (FDA). A 70kg adult would need 9-14 diet sodas/day to reach JECFA limit.',
    
    regulatoryStatus: {
      fda: 'Approved (21 CFR 172.804). ADI 50 mg/kg/day.',
      efsa: 'Approved with ADI 40 mg/kg/day',
      jecfa: 'ADI 0-40 mg/kg/day (reaffirmed July 2023)',
      iarc: 'Group 2B (possibly carcinogenic) - July 2023',
      cspiRating: 'Avoid'
    },
    
    bans: [],
    
    hiddenNames: [
      'NutraSweet',
      'Equal',
      'Canderel',
      'AminoSweet',
      'L-aspartyl-L-phenylalanine methyl ester',
      'E951'
    ],
    
    foundIn: [
      'Diet Coke',
      'Diet Pepsi',
      'Sugar-free gum',
      'Diet yogurts',
      'Tabletop sweeteners',
      'Sugar-free desserts',
      '6,000+ products including ~500 pharmaceuticals'
    ],
    
    alternatives: [
      'Stevia',
      'Monk fruit',
      'Erythritol',
      'Small amounts of real sugar'
    ],
    
    kidAlert: true,
    heartHealthAlert: false,
    diabeticAlert: true,
    pkuAlert: true,
    
    sources: [
      'IARC Monographs Meeting 134 (July 2023)',
      'WHO press release July 14, 2023',
      'Debras et al., PLoS Medicine 2022 (NutriNet-Santé)',
      'Soffritti et al., Ramazzini Institute studies 2005-2010',
      '21 CFR 172.804'
    ]
  },

  'sucralose': {
    id: 'sucralose',
    name: 'Sucralose',
    eNumber: 'E955',
    category: 'Artificial Sweetener',
    score: 40,
    concern: 'moderate',
    
    plainEnglish: 'An artificial sweetener about 600 times sweeter than sugar, made by chemically modifying sugar molecules with chlorine. Recent research suggests it may harm gut bacteria and affect blood sugar regulation.',
    
    healthNotes: 'A Ramazzini Institute study found increased leukemia in mice. The Weizmann Institute (2022) found sucralose significantly impaired glycemic responses and altered gut microbiome in healthy adults. An earlier study found it reduced beneficial gut bacteria by 50% or more in rats.',
    
    dailyLimit: 'ADI: 5 mg/kg/day (FDA); 15 mg/kg/day (EFSA/JECFA)',
    
    regulatoryStatus: {
      fda: 'Approved 1998 (21 CFR 172.831). ADI 5 mg/kg/day.',
      efsa: 'Approved with ADI 15 mg/kg/day',
      jecfa: 'ADI 0-15 mg/kg/day',
      iarc: 'Not evaluated',
      cspiRating: 'Avoid (downgraded from Safe to Caution to Avoid)'
    },
    
    bans: [],
    
    hiddenNames: [
      'Splenda',
      'Sukrana',
      'SucraPlus',
      'Candys',
      'Nevella',
      'E955'
    ],
    
    foundIn: [
      'Splenda',
      'Diet Pepsi',
      'Protein powders',
      'Sugar-free desserts',
      'Baked goods',
      'Most widely used artificial sweetener in US'
    ],
    
    alternatives: [
      'Stevia',
      'Monk fruit',
      'Erythritol',
      'Small amounts of real sugar'
    ],
    
    kidAlert: true,
    heartHealthAlert: false,
    diabeticAlert: true,
    
    sources: [
      'Suez et al., Cell 2022 (Weizmann Institute)',
      'Ramazzini Institute, Int J Occup Environ Health 2016',
      'Abou-Donia et al., 2008 (gut bacteria study)',
      'CSPI rating history 2013-2016',
      '21 CFR 172.831'
    ]
  },

  'high-fructose-corn-syrup': {
    id: 'high-fructose-corn-syrup',
    name: 'High Fructose Corn Syrup',
    eNumber: null,
    category: 'Sweetener',
    score: 30,
    concern: 'high',
    
    plainEnglish: 'A liquid sweetener made from corn starch, with a similar fructose-glucose ratio to table sugar. It\'s not chemically very different from sugar, but its cheapness has led to massive overuse in processed foods, contributing to obesity and metabolic disease.',
    
    healthNotes: 'Metabolically similar to sucrose according to scientific consensus. A 2022 meta-analysis found HFCS group had higher inflammatory markers (CRP) vs sucrose. The main concern is overconsumption due to its prevalence in processed foods. WHO recommends limiting ALL free sugars to <10% of energy.',
    
    dailyLimit: 'No ADI - treated same as other sugars. WHO recommends <10% of total energy from free sugars (ideally <5%).',
    
    regulatoryStatus: {
      fda: 'GRAS (21 CFR 184.1866)',
      efsa: 'No specific evaluation (treated as sugar)',
      jecfa: 'No ADI (treated as sugar)',
      iarc: 'Not classified',
      cspiRating: 'Limit all added sugars'
    },
    
    bans: [],
    
    hiddenNames: [
      'Isoglucose',
      'Glucose-fructose syrup',
      'Fructose-glucose syrup',
      'Corn sugar (rejected by FDA)',
      'Maize syrup',
      'HFCS-42',
      'HFCS-55',
      'HFCS-90'
    ],
    
    foundIn: [
      'Soft drinks',
      'Ketchup',
      'Bread',
      'Cereals',
      'Salad dressings',
      'Yogurts',
      'Candy',
      'Condiments'
    ],
    
    alternatives: [
      'Products sweetened with real sugar',
      'Unsweetened alternatives',
      'Honey or maple syrup (in moderation)'
    ],
    
    kidAlert: true,
    heartHealthAlert: true,
    diabeticAlert: true,
    
    sources: [
      'Frontiers in Nutrition 2022 meta-analysis',
      'AMA Council Report 2008',
      'WHO sugar guidelines 2015',
      '21 CFR 184.1866'
    ]
  }
};

// =============================================================================
// ARTIFICIAL COLORS
// =============================================================================

const artificialColors = {
  'red-40': {
    id: 'red-40',
    name: 'Red 40 (Allura Red AC)',
    eNumber: 'E129',
    category: 'Artificial Color',
    score: 35,
    concern: 'high',
    
    plainEnglish: 'The most widely used artificial food dye in the US. Derived from petroleum. The EU requires warning labels stating it "may have an adverse effect on activity and attention in children."',
    
    healthNotes: 'Part of the "Southampton Six" dyes linked to hyperactivity in children (2007 Lancet study). Requires EU warning label. A 2022 Nature Communications study found chronic exposure exacerbated colitis in mice. Red 40 + Yellow 5 + Yellow 6 account for 90% of all dyes used in the US.',
    
    dailyLimit: 'ADI: 7 mg/kg body weight/day (FDA/EFSA/JECFA)',
    
    regulatoryStatus: {
      fda: 'Approved. ADI 7 mg/kg/day.',
      efsa: 'Approved with ADI 7 mg/kg/day + mandatory warning label',
      jecfa: 'ADI 0-7 mg/kg/day',
      iarc: 'Not evaluated',
      cspiRating: 'Avoid',
      euWarning: '"May have an adverse effect on activity and attention in children"'
    },
    
    bans: ['EU requires warning label (not banned)'],
    
    hiddenNames: [
      'Allura Red AC',
      'CI 16035',
      'Red 40 Lake',
      'FD&C Red No. 40',
      'INS 129',
      'E129'
    ],
    
    foundIn: [
      'Candy',
      'Cereals',
      'Beverages',
      'Desserts',
      'Medications',
      'Found in ~37,771 branded US foods (8.6%)'
    ],
    
    alternatives: [
      'Beet juice/powder',
      'Paprika',
      'Tomato',
      'Natural colorings'
    ],
    
    kidAlert: true,
    heartHealthAlert: false,
    diabeticAlert: false,
    
    sources: [
      'McCann et al., Lancet 2007 (Southampton Study)',
      'Kwon et al., Nature Communications 2022',
      'EFSA 2009 re-evaluation',
      'EU Regulation (EC) No. 1333/2008'
    ]
  },

  'yellow-5': {
    id: 'yellow-5',
    name: 'Yellow 5 (Tartrazine)',
    eNumber: 'E102',
    category: 'Artificial Color',
    score: 35,
    concern: 'high',
    
    plainEnglish: 'A bright yellow dye derived from petroleum. One of the "Southampton Six" dyes linked to hyperactivity in children. Can cause allergic reactions, especially in people sensitive to aspirin.',
    
    healthNotes: 'Southampton Six member requiring EU warning label. Hypersensitivity reactions occur especially in aspirin-sensitive individuals (~0.12% of population). May be contaminated with benzidine and 4-aminobiphenyl (known carcinogens).',
    
    dailyLimit: 'ADI: 5 mg/kg/day (FDA); 7.5 mg/kg/day (EFSA/JECFA)',
    
    regulatoryStatus: {
      fda: 'Approved. ADI 5 mg/kg/day.',
      efsa: 'Approved with ADI 7.5 mg/kg/day + mandatory warning label',
      jecfa: 'ADI 0-7.5 mg/kg/day',
      iarc: 'Not evaluated',
      cspiRating: 'Avoid',
      euWarning: '"May have an adverse effect on activity and attention in children"'
    },
    
    bans: ['EU requires warning label'],
    
    hiddenNames: [
      'Tartrazine',
      'CI 19140',
      'Acid Yellow 23',
      'FD&C Yellow No. 5',
      'INS 102',
      'E102'
    ],
    
    foundIn: [
      'Mac and cheese',
      'Candy',
      'Soft drinks',
      'Chips',
      'Pickles',
      'Found in ~34,170 branded US foods (7.7%)'
    ],
    
    alternatives: [
      'Turmeric',
      'Annatto',
      'Saffron',
      'Beta-carotene'
    ],
    
    kidAlert: true,
    heartHealthAlert: false,
    diabeticAlert: false,
    
    sources: [
      'McCann et al., Lancet 2007',
      'EFSA 2009 re-evaluation',
      'EU Regulation (EC) No. 1333/2008'
    ]
  },

  'yellow-6': {
    id: 'yellow-6',
    name: 'Yellow 6 (Sunset Yellow)',
    eNumber: 'E110',
    category: 'Artificial Color',
    score: 35,
    concern: 'high',
    
    plainEnglish: 'An orange-yellow dye derived from petroleum. Part of the "Southampton Six" linked to hyperactivity in children. EFSA temporarily lowered its safe limit due to concerns about reproductive toxicity.',
    
    healthNotes: 'Southampton Six member requiring EU warning label. EFSA temporarily lowered ADI to 1 mg/kg/day in 2009 due to reproductive toxicity concerns, later restored to 4 mg/kg/day after further review.',
    
    dailyLimit: 'ADI: 3.75 mg/kg/day (FDA); 4 mg/kg/day (EFSA); 2.5 mg/kg/day (JECFA)',
    
    regulatoryStatus: {
      fda: 'Approved. ADI 3.75 mg/kg/day.',
      efsa: 'Approved with ADI 4 mg/kg/day + mandatory warning label',
      jecfa: 'ADI 0-2.5 mg/kg/day',
      iarc: 'Not evaluated',
      cspiRating: 'Avoid',
      euWarning: '"May have an adverse effect on activity and attention in children"'
    },
    
    bans: ['EU requires warning label'],
    
    hiddenNames: [
      'Sunset Yellow FCF',
      'CI 15985',
      'Orange Yellow S',
      'FD&C Yellow No. 6',
      'INS 110',
      'E110'
    ],
    
    foundIn: [
      'Orange soda',
      'Candy',
      'Cheese-flavored snacks',
      'Cereals',
      'Found in ~25,034 branded US foods (5.7%)'
    ],
    
    alternatives: [
      'Annatto',
      'Paprika',
      'Beta-carotene',
      'Carrot juice'
    ],
    
    kidAlert: true,
    heartHealthAlert: false,
    diabeticAlert: false,
    
    sources: [
      'McCann et al., Lancet 2007',
      'EFSA 2009 and 2014 opinions',
      'EU Regulation (EC) No. 1333/2008'
    ]
  },

  'red-3': {
    id: 'red-3',
    name: 'Red 3 (Erythrosine)',
    eNumber: 'E127',
    category: 'Artificial Color',
    score: 15,
    concern: 'high',
    
    plainEnglish: 'A cherry-red dye that was just BANNED by the FDA in January 2025. It was linked to thyroid tumors in rats and was already banned in cosmetics since 1990. Food companies have until 2027 to remove it.',
    
    healthNotes: 'FDA BANNED January 15, 2025 due to thyroid tumors in male rats at high doses. Ban triggered by Delaney Clause which prohibits any food additive shown to cause cancer in humans or animals. Previously banned from cosmetics in 1990. Has the lowest ADI of any approved food dye (0.1 mg/kg/day).',
    
    dailyLimit: 'ADI: 0.1 mg/kg body weight/day - the lowest of any food dye, reflecting thyroid concerns',
    
    regulatoryStatus: {
      fda: 'BANNED (January 2025). Compliance deadline: January 2027 for food, January 2028 for drugs.',
      efsa: 'Approved with ADI 0.1 mg/kg/day',
      jecfa: 'ADI 0-0.1 mg/kg/day',
      iarc: 'Not evaluated',
      cspiRating: 'Avoid'
    },
    
    bans: ['US (effective January 2027)', 'US cosmetics (since 1990)'],
    
    hiddenNames: [
      'Erythrosine B',
      'CI 45430',
      'Acid Red 51',
      'FD&C Red No. 3',
      'INS 127',
      'E127'
    ],
    
    foundIn: [
      'Maraschino cherries',
      'Candy corn',
      'Peeps',
      'Cake decorations',
      'Gummy vitamins',
      'Found in ~8,000+ branded US foods (pre-ban)'
    ],
    
    alternatives: [
      'Beet juice',
      'Carmine (from cochineal)',
      'Anthocyanins from berries'
    ],
    
    kidAlert: true,
    heartHealthAlert: false,
    diabeticAlert: false,
    
    sources: [
      'FDA ban announcement January 15, 2025',
      'Delaney Clause application',
      'Thyroid tumor studies',
      'JECFA/WHO evaluation'
    ]
  },

  'caramel-color': {
    id: 'caramel-color',
    name: 'Caramel Color (Class III/IV)',
    eNumber: 'E150c/E150d',
    category: 'Color',
    score: 50,
    concern: 'moderate',
    
    plainEnglish: 'The most widely used food coloring in the world, giving brown color to colas and many other products. Classes III and IV contain 4-MEI, a chemical classified as "possibly carcinogenic" that forms during production.',
    
    healthNotes: '4-methylimidazole (4-MEI), a byproduct in Classes III and IV, is IARC Group 2B (possibly carcinogenic) and on California Prop 65. NTP found increased lung tumors in mice. Consumer Reports found huge variation: Malta Goya had >300 µg/serving vs Coca-Cola at 3.6-4.3 µg after reformulation.',
    
    dailyLimit: 'ADI for Class III: 100 mg/kg/day (EFSA - reduced due to immunotoxicity); 200 mg/kg/day (JECFA). California Prop 65 NSRL for 4-MEI: 29 µg/day.',
    
    regulatoryStatus: {
      fda: 'GRAS. No specific limit on 4-MEI.',
      efsa: 'Class III ADI reduced to 100 mg/kg/day due to THI immunotoxicity',
      jecfa: 'ADI 0-200 mg/kg/day for Classes III & IV',
      iarc: '4-MEI is Group 2B (possibly carcinogenic)',
      prop65: '4-MEI listed as carcinogen (NSRL 29 µg/day)',
      cspiRating: 'Avoid (Classes III & IV)'
    },
    
    bans: [],
    
    hiddenNames: [
      'Caramel color',
      'E150a (Class I - Plain, safer)',
      'E150b (Class II - Caustic sulfite)',
      'E150c (Class III - Ammonia, contains 4-MEI)',
      'E150d (Class IV - Sulfite ammonia, contains 4-MEI)'
    ],
    
    foundIn: [
      'Cola drinks',
      'Soy sauce',
      'Beer',
      'Bread',
      'Gravies',
      'Nearly ubiquitous in processed foods'
    ],
    
    alternatives: [
      'Products colored with Class I/II caramel',
      'Naturally dark foods',
      'Molasses'
    ],
    
    kidAlert: true,
    heartHealthAlert: false,
    diabeticAlert: false,
    
    sources: [
      'NTP 2007 4-MEI study',
      'California Prop 65 listing 2011',
      'Consumer Reports 2014 testing',
      'EFSA 2011 THI immunotoxicity assessment'
    ]
  }
};

// =============================================================================
// EMULSIFIERS & THICKENERS
// =============================================================================

const emulsifiersThickeners = {
  'carrageenan': {
    id: 'carrageenan',
    name: 'Carrageenan',
    eNumber: 'E407',
    category: 'Thickener/Stabilizer',
    score: 55,
    concern: 'moderate',
    
    plainEnglish: 'A seaweed extract used to thicken and stabilize foods, especially dairy alternatives and ice cream. There\'s ongoing debate about whether it causes gut inflammation, and it was removed from the approved organic foods list.',
    
    healthNotes: 'Food-grade carrageenan is IARC Group 3 (not classifiable), but degraded carrageenan (poligeenan) is Group 2B (possibly carcinogenic). Debate exists on whether it degrades in the GI tract. National Organic Standards Board removed it from approved organic list (2018). Some studies link it to gut inflammation.',
    
    dailyLimit: 'ADI: 75 mg/kg body weight/day (EFSA, temporary pending more data)',
    
    regulatoryStatus: {
      fda: 'GRAS (21 CFR 182.7255 and 172.620)',
      efsa: 'Temporary ADI 75 mg/kg/day (2018)',
      jecfa: 'ADI "Not specified"',
      iarc: 'Group 3 (food-grade); Group 2B (degraded/poligeenan)',
      cspiRating: 'Caution'
    },
    
    bans: ['Removed from USDA organic approved list (2018)'],
    
    hiddenNames: [
      'Irish moss extract',
      'Chondrus crispus extract',
      'E407a (processed Eucheuma seaweed)',
      'PES',
      'E407'
    ],
    
    foundIn: [
      'Chocolate milk',
      'Ice cream',
      'Yogurt',
      'Plant-based milks (almond, soy, coconut)',
      'Deli meats',
      'Infant formula'
    ],
    
    alternatives: [
      'Gellan gum',
      'Locust bean gum',
      'Guar gum',
      'Carrageenan-free products'
    ],
    
    kidAlert: true,
    heartHealthAlert: false,
    diabeticAlert: false,
    
    sources: [
      'EFSA 2018 re-evaluation',
      'IARC classification',
      'National Organic Standards Board 2016 vote'
    ]
  },

  'xanthan-gum': {
    id: 'xanthan-gum',
    name: 'Xanthan Gum',
    eNumber: 'E415',
    category: 'Thickener/Stabilizer',
    score: 90,
    concern: 'low',
    
    plainEnglish: 'A natural thickener produced by bacterial fermentation. It\'s considered one of the safest food additives available and is widely used in gluten-free baking as a binder.',
    
    healthNotes: 'JECFA and EFSA both set ADI as "Not specified" - indicating very low toxicity. Generally considered one of the safest food additives. Only notable concern: FDA warned about a xanthan gum-based thickener linked to problems in premature infants (specific product issue, not general safety concern).',
    
    dailyLimit: 'ADI: "Not specified" (JECFA/EFSA) - indicating very low toxicity',
    
    regulatoryStatus: {
      fda: 'Approved (21 CFR 172.695). Also GRAS.',
      efsa: 'ADI "Not specified"',
      jecfa: 'ADI "Not specified"',
      cspiRating: 'Safe'
    },
    
    bans: [],
    
    hiddenNames: [
      'Corn sugar gum',
      'Polysaccharide gum',
      'E415'
    ],
    
    foundIn: [
      'Salad dressings',
      'Sauces',
      'Gluten-free baked goods',
      'Ice cream',
      'Beverages',
      'Cosmetics'
    ],
    
    alternatives: [],
    
    kidAlert: false,
    heartHealthAlert: false,
    diabeticAlert: false,
    
    sources: [
      'JECFA evaluation',
      'EFSA evaluation',
      '21 CFR 172.695'
    ]
  },

  'mono-diglycerides': {
    id: 'mono-diglycerides',
    name: 'Mono- and Diglycerides',
    eNumber: 'E471',
    category: 'Emulsifier',
    score: 40,
    concern: 'moderate',
    
    plainEnglish: 'Common emulsifiers that help ingredients blend together. THE MAJOR TRANS FAT LOOPHOLE: Because they\'re classified as emulsifiers, not fats, they\'re exempt from trans fat labeling - even though they can contain up to 60% trans fat.',
    
    healthNotes: 'EFSA found trans fat content in mono/diglyceride formulations ranged from 0.01% to 59.92%. A food can claim "0g trans fat" while containing trans fats from this source. They represent ~70% of emulsifiers in US food products. A 2024 French study suggested higher intake correlated with 15% increased cancer risk.',
    
    dailyLimit: 'ADI: "Not limited" (JECFA) - but trans fat content is the concern, not the mono/diglycerides themselves',
    
    regulatoryStatus: {
      fda: 'GRAS (21 CFR 184.1505). EXEMPT from trans fat labeling and PHO ban.',
      efsa: 'No numerical ADI needed, but flagged trans fat and 3-MCPD contamination concerns',
      jecfa: 'ADI "Not limited"',
      cspiRating: 'Caution (due to hidden trans fats)'
    },
    
    bans: [],
    
    hiddenNames: [
      'Glyceryl monostearate (GMS)',
      'Glyceryl monopalmitate',
      'Distilled monoglycerides',
      'Acetylated monoglycerides',
      'DATEM (E472e)',
      'E471'
    ],
    
    foundIn: [
      'Bread',
      'Margarine',
      'Peanut butter',
      'Ice cream',
      'Whipped toppings',
      'Baked goods',
      '~70% of US food products with emulsifiers'
    ],
    
    alternatives: [
      'Products without emulsifiers',
      'Butter (for baking)',
      'Homemade versions'
    ],
    
    kidAlert: false,
    heartHealthAlert: true,
    diabeticAlert: false,
    
    sources: [
      'EFSA trans fat content analysis',
      '21 CFR 184.1505',
      'French observational study 2024',
      'EFSA 3-MCPD contamination concerns'
    ]
  }
};

// =============================================================================
// OTHER ADDITIVES
// =============================================================================

const otherAdditives = {
  'msg': {
    id: 'msg',
    name: 'MSG (Monosodium Glutamate)',
    eNumber: 'E621',
    category: 'Flavor Enhancer',
    score: 70,
    concern: 'low',
    
    plainEnglish: 'A flavor enhancer that adds "umami" or savory taste. Despite its bad reputation, large-scale scientific studies have consistently failed to confirm "MSG sensitivity" in the general population. Your body naturally produces ~50g of glutamate per day.',
    
    healthNotes: 'The FASEB 1995 Report (350+ pages) concluded MSG is safe at customary levels. A small subgroup may experience transient symptoms at 3g or more in a single dose without food. Typical servings contain less than 0.5g. Glutamate occurs naturally in tomatoes, parmesan cheese, mushrooms, and seaweed.',
    
    dailyLimit: 'ADI: "Not specified" (JECFA); 30 mg/kg/day (EFSA, changed from "not specified" in 2017)',
    
    regulatoryStatus: {
      fda: 'GRAS since 1959. Must be declared as "monosodium glutamate."',
      efsa: 'ADI 30 mg/kg/day (2017, group ADI for glutamates)',
      jecfa: 'ADI "Not specified"',
      cspiRating: 'Safe (for most people)'
    },
    
    bans: [],
    
    hiddenNames: [
      'Glutamic acid (E620)',
      'Monopotassium glutamate (E622)',
      'Yeast extract',
      'Autolyzed yeast',
      'Hydrolyzed protein',
      'Natural flavors (may contain)'
    ],
    
    foundIn: [
      'Chinese food',
      'Chips and snacks',
      'Frozen dinners',
      'Soups',
      'Fast food',
      'Naturally in: tomatoes, parmesan, soy sauce'
    ],
    
    alternatives: [
      'Natural umami sources (tomatoes, mushrooms, parmesan)',
      'Sea salt',
      'Herbs and spices'
    ],
    
    kidAlert: false,
    heartHealthAlert: false,
    diabeticAlert: false,
    
    sources: [
      'FASEB 1995 Report (FDA commissioned)',
      'EFSA 2017 opinion',
      'Multiple double-blind studies'
    ]
  },

  'maltodextrin': {
    id: 'maltodextrin',
    name: 'Maltodextrin',
    eNumber: null,
    category: 'Filler/Thickener',
    score: 50,
    concern: 'moderate',
    
    plainEnglish: 'A highly processed carbohydrate made from starch, used as a filler and thickener. Its main concern is an extremely high glycemic index (85-136) - even higher than table sugar (65) - which can spike blood sugar rapidly.',
    
    healthNotes: 'Glycemic index of 85-136 (higher than table sugar at 65). Cleveland Clinic research found it may alter gut bacteria in ways that increase susceptibility to inflammatory bowel disease by enhancing E. coli adhesion to intestinal cells. However, a 2022 RCT found no significant increase in intestinal permeability at doses up to 50g/day over 12 weeks.',
    
    dailyLimit: 'No ADI established - classified as a food/carbohydrate, not an additive',
    
    regulatoryStatus: {
      fda: 'GRAS (21 CFR 184.1444)',
      efsa: 'No E-number (classified as food ingredient)',
      cspiRating: 'Caution for diabetics'
    },
    
    bans: [],
    
    hiddenNames: [
      'Modified cornstarch',
      'Modified food starch',
      'Glucose polymer',
      'Dextrin',
      'Corn starch solids'
    ],
    
    foundIn: [
      'Protein powders',
      'Sugar-free products',
      'Salad dressings',
      'Spice mixes',
      'Instant puddings',
      'Sports drinks',
      'Baby formula'
    ],
    
    alternatives: [
      'Whole food sources of carbohydrates',
      'Products without fillers'
    ],
    
    kidAlert: false,
    heartHealthAlert: false,
    diabeticAlert: true,
    
    sources: [
      'Cleveland Clinic IBD research',
      'Gut journal 2022 RCT',
      '21 CFR 184.1444',
      'Glycemic index studies'
    ]
  },

  'partially-hydrogenated-oils': {
    id: 'partially-hydrogenated-oils',
    name: 'Partially Hydrogenated Oils (PHOs)',
    eNumber: null,
    category: 'Fat/Oil',
    score: 5,
    concern: 'high',
    
    plainEnglish: 'Artificial trans fats created by adding hydrogen to vegetable oils. BANNED BY FDA since 2018 because they\'re considered unsafe at ANY level - they simultaneously raise bad cholesterol AND lower good cholesterol. WHO estimates they cause 500,000+ deaths annually worldwide.',
    
    healthNotes: 'FDA revoked GRAS status in 2015, determining no consensus that PHOs are safe for any human food use. Trans fats are "doubly dangerous" - they raise LDL ("bad") and lower HDL ("good") cholesterol. WHO estimates more than 500,000 premature deaths from cardiovascular disease annually worldwide. NYC\'s 2006 ban led to 6% drop in heart attacks and strokes within 3 years.',
    
    dailyLimit: 'No safe level identified - considered unsafe at any intake',
    
    regulatoryStatus: {
      fda: 'NOT GRAS. BANNED. Final compliance August 2023.',
      who: 'REPLACE Initiative calls for global elimination',
      cspiRating: 'Avoid completely'
    },
    
    bans: [
      'United States (2018, final 2023)',
      'Denmark (2004 - first country)',
      'Canada (2018)',
      'European Union (2021 - max 2g per 100g fat)',
      '53 countries with best-practice policies as of 2024'
    ],
    
    hiddenNames: [
      'Partially hydrogenated vegetable oil',
      'Partially hydrogenated soybean oil',
      'Partially hydrogenated cottonseed oil',
      'Partially hydrogenated canola oil',
      'Shortening (when made from PHOs)',
      'Hard margarine'
    ],
    
    foundIn: [
      'Some imported foods',
      'Older packaged goods',
      'Some restaurant foods',
      '98% removed from US food supply by 2015-2018'
    ],
    
    alternatives: [
      'Olive oil',
      'Avocado oil',
      'Butter (in moderation)',
      'Fully hydrogenated oil (no trans fat)'
    ],
    
    kidAlert: true,
    heartHealthAlert: true,
    diabeticAlert: true,
    
    sources: [
      'FDA 80 FR 34650 (June 2015)',
      'WHO REPLACE Initiative (2018)',
      'JAMA Cardiology NYC study',
      'FDA final rule August 2023'
    ]
  }
};

// =============================================================================
// SAFE/BENEFICIAL INGREDIENTS
// =============================================================================

const safeIngredients = {
  'citric-acid': {
    id: 'citric-acid',
    name: 'Citric Acid',
    eNumber: 'E330',
    category: 'Acidulant/Preservative',
    score: 90,
    concern: 'low',
    
    plainEnglish: 'A natural acid found in citrus fruits, used to add tartness and as a preservative. Commercially produced by fungal fermentation. Generally recognized as safe with no established upper limit.',
    
    healthNotes: 'GRAS with no ADI needed. Natural component of all living cells. May rarely cause sensitivity in some individuals but generally very well tolerated.',
    
    regulatoryStatus: {
      fda: 'GRAS',
      efsa: 'No numerical ADI needed',
      jecfa: 'ADI "Not limited"',
      cspiRating: 'Safe'
    },
    
    foundIn: ['Beverages', 'Candy', 'Canned foods', 'Jams', 'Cosmetics'],
    
    kidAlert: false,
    heartHealthAlert: false,
    diabeticAlert: false
  },

  'ascorbic-acid': {
    id: 'ascorbic-acid',
    name: 'Ascorbic Acid (Vitamin C)',
    eNumber: 'E300',
    category: 'Antioxidant/Vitamin',
    score: 95,
    concern: 'low',
    
    plainEnglish: 'Vitamin C, used as an antioxidant to prevent browning and preserve freshness. An essential nutrient that also provides health benefits beyond preservation.',
    
    healthNotes: 'Essential nutrient with RDA of 75-90mg for adults. Acts as antioxidant in foods. Very safe with upper limit of 2,000mg/day set by IOM.',
    
    regulatoryStatus: {
      fda: 'GRAS. Also an essential nutrient.',
      efsa: 'No safety concerns',
      cspiRating: 'Safe'
    },
    
    foundIn: ['Fruit juices', 'Processed meats', 'Cereals', 'Supplements'],
    
    kidAlert: false,
    heartHealthAlert: false,
    diabeticAlert: false
  },

  'tocopherols': {
    id: 'tocopherols',
    name: 'Tocopherols (Vitamin E)',
    eNumber: 'E306-E309',
    category: 'Antioxidant/Vitamin',
    score: 92,
    concern: 'low',
    
    plainEnglish: 'Vitamin E compounds used as natural antioxidants to prevent fats from going rancid. A healthy alternative to synthetic antioxidants like BHA and BHT.',
    
    healthNotes: 'Essential nutrient and effective natural antioxidant. Preferred alternative to BHA/BHT. Well-tolerated at typical food levels.',
    
    regulatoryStatus: {
      fda: 'GRAS',
      efsa: 'No safety concerns',
      cspiRating: 'Safe'
    },
    
    foundIn: ['Vegetable oils', 'Nuts', 'Cereals', 'Supplements'],
    
    kidAlert: false,
    heartHealthAlert: false,
    diabeticAlert: false
  },

  'stevia': {
    id: 'stevia',
    name: 'Stevia (Steviol Glycosides)',
    eNumber: 'E960',
    category: 'Natural Sweetener',
    score: 80,
    concern: 'low',
    
    plainEnglish: 'A zero-calorie sweetener extracted from the stevia plant, about 200-300 times sweeter than sugar. Generally considered safer than artificial sweeteners, though WHO advises against using any non-sugar sweeteners for weight control.',
    
    healthNotes: 'ADI 4 mg/kg/day (as steviol). WHO 2023 guideline recommends against using non-sugar sweeteners for weight control, but stevia is considered safer than artificial alternatives. Does not raise blood sugar.',
    
    regulatoryStatus: {
      fda: 'GRAS (high-purity steviol glycosides)',
      efsa: 'ADI 4 mg/kg/day',
      jecfa: 'ADI 0-4 mg/kg/day',
      cspiRating: 'Safe'
    },
    
    foundIn: ['Tabletop sweeteners', 'Beverages', 'Yogurt', 'Baked goods'],
    
    kidAlert: false,
    heartHealthAlert: false,
    diabeticAlert: false
  },

  'pectin': {
    id: 'pectin',
    name: 'Pectin',
    eNumber: 'E440',
    category: 'Gelling Agent',
    score: 95,
    concern: 'low',
    
    plainEnglish: 'A natural fiber found in fruits, used as a gelling agent in jams and jellies. It\'s essentially a soluble fiber that may even have health benefits like lowering cholesterol.',
    
    healthNotes: 'Natural soluble fiber. JECFA ADI "Not specified." May provide health benefits including cholesterol reduction and improved gut health. Very well tolerated.',
    
    regulatoryStatus: {
      fda: 'GRAS',
      jecfa: 'ADI "Not specified"',
      cspiRating: 'Safe'
    },
    
    foundIn: ['Jams', 'Jellies', 'Fruit preparations', 'Gummy candies'],
    
    kidAlert: false,
    heartHealthAlert: false,
    diabeticAlert: false
  }
};

// =============================================================================
// HIDDEN NAMES DATABASES
// =============================================================================

export const hiddenSugarNames = [
  'sucrose', 'glucose', 'fructose', 'dextrose', 'maltose', 'lactose', 'galactose', 'trehalose',
  'high fructose corn syrup', 'corn syrup', 'corn syrup solids', 'malt syrup', 'maple syrup',
  'rice syrup', 'brown rice syrup', 'golden syrup', 'agave syrup', 'agave nectar', 'carob syrup',
  'buttered syrup', 'sorghum syrup', 'refiner\'s syrup', 'tapioca syrup', 'oat syrup', 'starch syrup',
  'brown sugar', 'cane sugar', 'raw sugar', 'beet sugar', 'coconut sugar', 'coconut palm sugar',
  'date sugar', 'grape sugar', 'golden sugar', 'yellow sugar', 'castor sugar', 'confectioner\'s sugar',
  'powdered sugar', 'icing sugar', 'turbinado sugar', 'demerara sugar', 'muscovado sugar',
  'panela sugar', 'sucanat', 'granulated sugar', 'table sugar', 'florida crystals', 'cane juice crystals',
  'organic raw sugar', 'fruit juice', 'fruit juice concentrate', 'evaporated cane juice',
  'concentrated fruit juice', 'barley malt', 'barley malt extract', 'malt extract', 'maltodextrin',
  'diastatic malt', 'ethyl maltol', 'malted barley', 'honey', 'molasses', 'blackstrap molasses',
  'treacle', 'invert sugar', 'crystalline fructose', 'dextrin', 'caramel', 'panocha',
  'glucose syrup solids', 'mannose', 'sweet sorghum'
];

export const hiddenMSGNames = {
  alwaysContainsMSG: [
    'monosodium glutamate', 'glutamic acid', 'glutamate', 'monopotassium glutamate',
    'calcium glutamate', 'monoammonium glutamate', 'magnesium glutamate', 'natrium glutamate',
    'yeast extract', 'torula yeast', 'autolyzed yeast', 'brewer\'s yeast', 'nutritional yeast',
    'yeast food', 'yeast nutrient', 'hydrolyzed protein', 'hydrolyzed soy protein',
    'hydrolyzed wheat protein', 'hydrolyzed pea protein', 'hydrolyzed whey protein',
    'hydrolyzed corn protein', 'hydrolyzed vegetable protein', 'calcium caseinate',
    'sodium caseinate', 'gelatin', 'textured protein', 'soy protein', 'soy protein concentrate',
    'soy protein isolate', 'whey protein', 'whey protein concentrate', 'whey protein isolate',
    'soy sauce', 'soy sauce extract', 'protease', 'vetsin', 'ajinomoto'
  ],
  oftenContainsMSG: [
    'carrageenan', 'bouillon', 'broth', 'stock', 'flavors', 'flavoring',
    'natural flavor', 'natural flavoring', 'maltodextrin', 'oligodextrin', 'citric acid',
    'barley malt', 'malted barley', 'pectin', 'malt extract', 'seasonings'
  ],
  synergisticIndicators: [
    'disodium 5\'-guanylate (E627)',
    'disodium 5\'-inosinate (E631)',
    'disodium 5\'-ribonucleotides (E635)'
  ]
};

// =============================================================================
// COMBINE ALL DATABASES
// =============================================================================

const ingredientDatabase = {
  ...preservatives,
  ...artificialSweeteners,
  ...artificialColors,
  ...emulsifiersThickeners,
  ...otherAdditives,
  ...safeIngredients
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export function searchIngredients(query) {
  const normalizedQuery = query.toLowerCase().trim();
  const results = [];
  
  for (const [id, ingredient] of Object.entries(ingredientDatabase)) {
    if (ingredient.name.toLowerCase().includes(normalizedQuery)) {
      results.push({ ...ingredient, matchType: 'name' });
      continue;
    }
    
    if (ingredient.hiddenNames) {
      const hiddenMatch = ingredient.hiddenNames.find(name => 
        name.toLowerCase().includes(normalizedQuery)
      );
      if (hiddenMatch) {
        results.push({ ...ingredient, matchType: 'hidden', matchedName: hiddenMatch });
      }
    }
  }
  
  return results;
}

export function isHiddenSugar(name) {
  return hiddenSugarNames.some(sugar => 
    name.toLowerCase().includes(sugar.toLowerCase())
  );
}

export function checkForMSG(name) {
  const normalizedName = name.toLowerCase();
  
  if (hiddenMSGNames.alwaysContainsMSG.some(n => normalizedName.includes(n.toLowerCase()))) {
    return { containsMSG: true, certainty: 'high' };
  }
  
  if (hiddenMSGNames.oftenContainsMSG.some(n => normalizedName.includes(n.toLowerCase()))) {
    return { containsMSG: true, certainty: 'moderate' };
  }
  
  return { containsMSG: false, certainty: null };
}

export function getIngredientsByConcern(concernLevel) {
  return Object.values(ingredientDatabase).filter(i => i.concern === concernLevel);
}

export function getIngredientsWithAlert(alertType) {
  return Object.values(ingredientDatabase).filter(i => i[alertType] === true);
}

// =============================================================================
// EXPORTS
// =============================================================================

export {
  ingredientDatabase,
  preservatives,
  artificialSweeteners,
  artificialColors,
  emulsifiersThickeners,
  otherAdditives,
  safeIngredients
};

export default ingredientDatabase;