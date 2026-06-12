// ─────────────────────────────────────────────────────────────────────────────
// ACADEMIC QUIZ QUESTIONS — No programming content
// Subjects: Mathematics, Physics, Chemistry, Biology, English
// ─────────────────────────────────────────────────────────────────────────────

export const QUIZ_QUESTIONS = [
  // ── MATHEMATICS ─────────────────────────────────────────────────────────────
  { id: 1, subject: 'mathematics', topic: 'Algebra', difficulty: 'easy',
    question: 'Solve for x: 2x + 6 = 14',
    options: ['x = 3', 'x = 4', 'x = 5', 'x = 7'],
    answer: 'x = 4',
    hint: 'Subtract 6 from both sides, then divide by 2.',
    explanation: '2x + 6 = 14 → 2x = 8 → x = 4' },

  { id: 2, subject: 'mathematics', topic: 'Algebra', difficulty: 'medium',
    question: 'What are the roots of x² − 5x + 6 = 0?',
    options: ['x = 2 and x = 3', 'x = 1 and x = 6', 'x = −2 and x = −3', 'x = 5 and x = 1'],
    answer: 'x = 2 and x = 3',
    hint: 'Factorise: find two numbers that multiply to 6 and add to −5.',
    explanation: '(x−2)(x−3) = 0, so x = 2 or x = 3' },

  { id: 3, subject: 'mathematics', topic: 'Calculus', difficulty: 'medium',
    question: "What is the derivative of f(x) = x³ + 2x²?",
    options: ['3x² + 4x', 'x² + 2x', '3x² + 2x', '3x + 4'],
    answer: '3x² + 4x',
    hint: 'Apply the power rule: d/dx(xⁿ) = nxⁿ⁻¹ to each term.',
    explanation: 'd/dx(x³) = 3x², d/dx(2x²) = 4x → f\'(x) = 3x² + 4x' },

  { id: 4, subject: 'mathematics', topic: 'Trigonometry', difficulty: 'easy',
    question: 'In a right triangle, sin 30° equals:',
    options: ['1/2', '√3/2', '1/√2', '1'],
    answer: '1/2',
    hint: 'Use the special angle values for 30°.',
    explanation: 'sin 30° = 1/2. This is one of the standard trigonometric values.' },

  { id: 5, subject: 'mathematics', topic: 'Geometry', difficulty: 'easy',
    question: 'The area of a circle with radius 7 cm is:',
    options: ['49π cm²', '14π cm²', '7π cm²', '154π cm²'],
    answer: '49π cm²',
    hint: 'Area of circle = πr²',
    explanation: 'A = πr² = π × 7² = 49π cm²' },

  { id: 6, subject: 'mathematics', topic: 'Statistics', difficulty: 'medium',
    question: 'Find the mean of: 4, 8, 6, 10, 12',
    options: ['8', '9', '10', '7'],
    answer: '8',
    hint: 'Add all values and divide by the count.',
    explanation: 'Mean = (4+8+6+10+12)/5 = 40/5 = 8' },

  { id: 7, subject: 'mathematics', topic: 'Calculus', difficulty: 'hard',
    question: 'Evaluate ∫(3x² + 2x) dx',
    options: ['x³ + x² + C', '6x + 2 + C', 'x² + x + C', '3x³ + 2x² + C'],
    answer: 'x³ + x² + C',
    hint: 'Apply ∫xⁿ dx = xⁿ⁺¹/(n+1) + C to each term.',
    explanation: '∫3x² dx = x³, ∫2x dx = x², so the answer is x³ + x² + C' },

  // ── PHYSICS ─────────────────────────────────────────────────────────────────
  { id: 8, subject: 'physics', topic: 'Mechanics', difficulty: 'easy',
    question: "According to Newton's Second Law, Force equals:",
    options: ['mass × acceleration', 'mass × velocity', 'mass × displacement', 'mass × time'],
    answer: 'mass × acceleration',
    hint: 'F = ma is one of the most fundamental equations in physics.',
    explanation: "Newton's 2nd Law: F = ma. Force (N) = mass (kg) × acceleration (m/s²)" },

  { id: 9, subject: 'physics', topic: 'Kinematics', difficulty: 'medium',
    question: 'A car accelerates from 0 to 20 m/s in 4 seconds. What is its acceleration?',
    options: ['5 m/s²', '4 m/s²', '8 m/s²', '10 m/s²'],
    answer: '5 m/s²',
    hint: 'a = (v − u) / t',
    explanation: 'a = (v − u)/t = (20 − 0)/4 = 5 m/s²' },

  { id: 10, subject: 'physics', topic: 'Energy', difficulty: 'medium',
    question: 'A 2 kg object moving at 10 m/s has a kinetic energy of:',
    options: ['100 J', '20 J', '50 J', '200 J'],
    answer: '100 J',
    hint: 'KE = ½mv²',
    explanation: 'KE = ½mv² = ½ × 2 × 10² = ½ × 2 × 100 = 100 J' },

  { id: 11, subject: 'physics', topic: 'Electricity', difficulty: 'easy',
    question: "If voltage is 12V and resistance is 4Ω, the current (Ohm's Law) is:",
    options: ['3 A', '48 A', '8 A', '0.33 A'],
    answer: '3 A',
    hint: 'V = IR, so I = V/R',
    explanation: 'I = V/R = 12/4 = 3 A' },

  { id: 12, subject: 'physics', topic: 'Waves', difficulty: 'medium',
    question: 'A wave has frequency 500 Hz and wavelength 0.68 m. Its speed is:',
    options: ['340 m/s', '500 m/s', '0.68 m/s', '1000 m/s'],
    answer: '340 m/s',
    hint: 'v = fλ',
    explanation: 'v = fλ = 500 × 0.68 = 340 m/s (speed of sound in air)' },

  { id: 13, subject: 'physics', topic: 'Thermodynamics', difficulty: 'hard',
    question: 'Which law of thermodynamics states that entropy always increases?',
    options: ['Second Law', 'First Law', 'Third Law', 'Zeroth Law'],
    answer: 'Second Law',
    hint: 'The second law deals with the direction of heat flow and entropy.',
    explanation: 'The Second Law of Thermodynamics states entropy of an isolated system always increases.' },

  // ── CHEMISTRY ───────────────────────────────────────────────────────────────
  { id: 14, subject: 'chemistry', topic: 'Periodic Table', difficulty: 'easy',
    question: 'What is the atomic number of Carbon?',
    options: ['6', '12', '4', '8'],
    answer: '6',
    hint: 'Atomic number = number of protons.',
    explanation: 'Carbon has 6 protons, so its atomic number Z = 6.' },

  { id: 15, subject: 'chemistry', topic: 'Acids & Bases', difficulty: 'easy',
    question: 'A solution with pH = 3 is:',
    options: ['Acidic', 'Neutral', 'Alkaline', 'Strongly basic'],
    answer: 'Acidic',
    hint: 'pH < 7 is acidic, pH = 7 is neutral, pH > 7 is alkaline.',
    explanation: 'pH = 3 < 7, so the solution is acidic. (Lower pH = more acidic)' },

  { id: 16, subject: 'chemistry', topic: 'Chemical Bonding', difficulty: 'medium',
    question: 'Which type of bond is formed between Na and Cl in NaCl?',
    options: ['Ionic bond', 'Covalent bond', 'Metallic bond', 'Hydrogen bond'],
    answer: 'Ionic bond',
    hint: 'NaCl involves electron transfer between a metal and non-metal.',
    explanation: 'Na (metal) transfers one electron to Cl (non-metal), forming Na⁺ and Cl⁻ — ionic bond.' },

  { id: 17, subject: 'chemistry', topic: 'Physical Chemistry', difficulty: 'medium',
    question: 'How many moles are in 44 g of CO₂? (Molar mass of CO₂ = 44 g/mol)',
    options: ['1 mole', '2 moles', '0.5 moles', '44 moles'],
    answer: '1 mole',
    hint: 'n = m/M',
    explanation: 'n = 44g ÷ 44 g/mol = 1 mole of CO₂' },

  { id: 18, subject: 'chemistry', topic: 'Electrochemistry', difficulty: 'hard',
    question: 'At which electrode does reduction occur in a galvanic cell?',
    options: ['Cathode', 'Anode', 'Both electrodes', 'Neither electrode'],
    answer: 'Cathode',
    hint: 'Remember: OIL RIG — Reduction Is Gain (of electrons)',
    explanation: 'In a galvanic cell, reduction occurs at the cathode. Oxidation occurs at the anode.' },

  // ── BIOLOGY ─────────────────────────────────────────────────────────────────
  { id: 19, subject: 'biology', topic: 'Cell Biology', difficulty: 'easy',
    question: 'Which organelle is known as the "powerhouse of the cell"?',
    options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Golgi apparatus'],
    answer: 'Mitochondria',
    hint: 'This organelle produces ATP through cellular respiration.',
    explanation: 'Mitochondria produce ATP (energy) through aerobic respiration, earning the name "powerhouse of the cell".' },

  { id: 20, subject: 'biology', topic: 'Genetics', difficulty: 'medium',
    question: 'Which base pairs with Adenine (A) in DNA?',
    options: ['Thymine (T)', 'Guanine (G)', 'Cytosine (C)', 'Uracil (U)'],
    answer: 'Thymine (T)',
    hint: 'In DNA: A pairs with T, and G pairs with C.',
    explanation: 'In DNA, Adenine (A) pairs with Thymine (T) through 2 hydrogen bonds. (In RNA, A pairs with Uracil)' },

  { id: 21, subject: 'biology', topic: 'Plant Biology', difficulty: 'medium',
    question: 'What is the overall equation for photosynthesis?',
    options: ['6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O', '6O₂ + 6H₂O → C₆H₁₂O₆ + 6CO₂', 'CO₂ + H₂O → CH₄ + O₂'],
    answer: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂',
    hint: 'Plants take in CO₂ and water, using sunlight to produce glucose and oxygen.',
    explanation: 'Photosynthesis: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ (glucose) + 6O₂' },

  { id: 22, subject: 'biology', topic: 'Evolution', difficulty: 'medium',
    question: 'Who proposed the theory of evolution by natural selection?',
    options: ['Charles Darwin', 'Gregor Mendel', 'Louis Pasteur', 'James Watson'],
    answer: 'Charles Darwin',
    hint: 'He published "On the Origin of Species" in 1859.',
    explanation: "Charles Darwin proposed natural selection in 1859. Alfred Russel Wallace independently reached the same conclusion." },

  { id: 23, subject: 'biology', topic: 'Cell Biology', difficulty: 'easy',
    question: 'Which type of cell division produces 4 genetically different daughter cells?',
    options: ['Meiosis', 'Mitosis', 'Binary fission', 'Budding'],
    answer: 'Meiosis',
    hint: 'This type of division is used for sexual reproduction.',
    explanation: 'Meiosis produces 4 haploid daughter cells (gametes) that are all genetically unique.' },

  // ── ENGLISH ─────────────────────────────────────────────────────────────────
  { id: 24, subject: 'english', topic: 'Grammar', difficulty: 'easy',
    question: 'She _____ to the market yesterday.',
    options: ['went', 'goes', 'go', 'going'],
    answer: 'went',
    hint: '"Yesterday" indicates simple past tense.',
    explanation: '"Went" is the past tense of "go". Simple past is used for completed actions in the past.' },

  { id: 25, subject: 'english', topic: 'Grammar', difficulty: 'medium',
    question: 'Convert to passive voice: "The chef cooked the meal."',
    options: ['The meal was cooked by the chef.', 'The meal is cooked by the chef.', 'The meal has been cooked.', 'The chef was cooking the meal.'],
    answer: 'The meal was cooked by the chef.',
    hint: 'Simple past passive: Object + was/were + past participle + by + Subject',
    explanation: 'Active: Subject (chef) + Verb (cooked) + Object (meal). Passive: The meal (object) + was + cooked (V3) + by the chef.' },

  { id: 26, subject: 'english', topic: 'Vocabulary', difficulty: 'easy',
    question: 'Which word is a synonym for "happy"?',
    options: ['Joyful', 'Sorrowful', 'Angry', 'Frightened'],
    answer: 'Joyful',
    hint: 'A synonym has the same or similar meaning.',
    explanation: '"Joyful" means feeling great happiness — a synonym for "happy". Sorrowful is the antonym.' },

  { id: 27, subject: 'english', topic: 'Grammar', difficulty: 'medium',
    question: 'Choose the correct sentence:',
    options: [
      'She has been studying for three hours.',
      'She have been studying for three hours.',
      'She had been studying since three hours.',
      'She has study for three hours.'
    ],
    answer: 'She has been studying for three hours.',
    hint: 'Present perfect continuous: Subject + have/has + been + V-ing',
    explanation: 'Present Perfect Continuous: "has been studying" is correct. "For" is used with duration.' },

  { id: 28, subject: 'english', topic: 'Literature', difficulty: 'medium',
    question: '"The world is a stage" is an example of:',
    options: ['Metaphor', 'Simile', 'Alliteration', 'Personification'],
    answer: 'Metaphor',
    hint: 'Does it use "like" or "as" in the comparison?',
    explanation: 'A metaphor makes a direct comparison without using "like" or "as". A simile would say "like a stage".' },
]

export const getQuestionsBySubject = (subject) =>
  QUIZ_QUESTIONS.filter(q => q.subject === subject)

export const getQuestionsByTopic = (topic) =>
  QUIZ_QUESTIONS.filter(q => q.topic === topic)

export const getAdaptiveQuestion = (usedIds, difficulty, subject, weakTopics = []) => {
  let pool = QUIZ_QUESTIONS.filter(q => !usedIds.includes(q.id) && q.difficulty === difficulty && q.subject === subject)
  if (pool.length === 0) pool = QUIZ_QUESTIONS.filter(q => !usedIds.includes(q.id) && q.subject === subject)
  if (pool.length === 0) pool = QUIZ_QUESTIONS.filter(q => !usedIds.includes(q.id))
  if (pool.length === 0) return null
  const weakPool = pool.filter(q => weakTopics.includes(q.topic))
  return weakPool.length > 0
    ? weakPool[Math.floor(Math.random() * weakPool.length)]
    : pool[Math.floor(Math.random() * pool.length)]
}
