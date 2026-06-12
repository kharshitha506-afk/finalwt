// ─────────────────────────────────────────────────────────────────────────────
// COMPREHENSIVE EDUCATIONAL KNOWLEDGE BASE
// Covers: Mathematics, Physics, Chemistry, Biology, English
// ─────────────────────────────────────────────────────────────────────────────

const KB = [
  // ══════════════════════════════════════════════════════════
  // MATHEMATICS
  // ══════════════════════════════════════════════════════════
  {
    keys: ['quadratic','quadratic formula','ax2','ax²','discriminant'],
    topic: 'Algebra', subject: 'mathematics',
    answer: `## Quadratic Formula

A **quadratic equation** has the form **ax² + bx + c = 0**

### Solution Formula:
\`\`\`
x = (-b ± √(b² - 4ac)) / 2a
\`\`\`

### The Discriminant (b² - 4ac):
- **> 0** → Two distinct real roots
- **= 0** → One repeated real root  
- **< 0** → No real roots (complex)

### Step-by-Step Example:
Solve **x² - 5x + 6 = 0**

1. Identify: a=1, b=-5, c=6
2. Discriminant: (-5)² - 4(1)(6) = 25 - 24 = **1**
3. x = (5 ± √1) / 2
4. **x = 3** or **x = 2** ✓

> **Tip:** Always check your answers by substituting back into the original equation.`
  },
  {
    keys: ['derivative','differentiation','chain rule','product rule','quotient rule','dy/dx'],
    topic: 'Calculus', subject: 'mathematics',
    answer: `## Differentiation (Derivatives)

The **derivative** f'(x) measures the instantaneous rate of change of a function.

### Fundamental Rules:
| Rule | Formula |
|------|---------|
| Power Rule | d/dx(xⁿ) = nxⁿ⁻¹ |
| Constant | d/dx(c) = 0 |
| Sum | d/dx(f+g) = f' + g' |
| Product | d/dx(fg) = f'g + fg' |
| Chain | d/dx[f(g(x))] = f'(g(x))·g'(x) |
| Quotient | d/dx(u/v) = (u'v - uv')/v² |

### Common Derivatives:
- d/dx(sin x) = cos x
- d/dx(cos x) = −sin x
- d/dx(eˣ) = eˣ
- d/dx(ln x) = 1/x

### Example:
Find the derivative of **f(x) = 3x³ + 2x² − x + 5**

f'(x) = 9x² + 4x − 1`
  },
  {
    keys: ['integration','integral','antiderivative','∫','definite integral','indefinite integral','area under curve'],
    topic: 'Calculus', subject: 'mathematics',
    answer: `## Integration

Integration finds the **area under a curve** and is the reverse of differentiation.

### Indefinite Integral:
\`\`\`
∫f(x)dx = F(x) + C    where F'(x) = f(x)
\`\`\`

### Key Formulas:
- ∫xⁿ dx = xⁿ⁺¹/(n+1) + C  (n ≠ -1)
- ∫eˣ dx = eˣ + C
- ∫sin x dx = −cos x + C
- ∫cos x dx = sin x + C
- ∫1/x dx = ln|x| + C

### Definite Integral (Area):
\`\`\`
∫[a→b] f(x)dx = F(b) − F(a)
\`\`\`

### Example:
Evaluate **∫(2x + 3) dx**

= x² + 3x + C

**Definite:** ∫[0→2] (2x+3)dx = [x²+3x]₀² = (4+6) − 0 = **10**`
  },
  {
    keys: ['trigonometry','sin','cos','tan','sine','cosine','tangent','sohcahtoa','trigonometric'],
    topic: 'Trigonometry', subject: 'mathematics',
    answer: `## Trigonometry

### SOH-CAH-TOA (Right Triangle):
- **sin θ** = Opposite / Hypotenuse
- **cos θ** = Adjacent / Hypotenuse
- **tan θ** = Opposite / Adjacent

### Special Angles:
| θ | 0° | 30° | 45° | 60° | 90° |
|---|---|---|---|---|---|
| sin | 0 | 1/2 | 1/√2 | √3/2 | 1 |
| cos | 1 | √3/2 | 1/√2 | 1/2 | 0 |
| tan | 0 | 1/√3 | 1 | √3 | ∞ |

### Key Identities:
- **Pythagorean:** sin²θ + cos²θ = 1
- **Double Angle:** sin 2θ = 2 sin θ cos θ
- **Compound:** sin(A+B) = sinA cosB + cosA sinB

### Sine Rule:  a/sin A = b/sin B = c/sin C
### Cosine Rule:  a² = b² + c² − 2bc cos A`
  },
  {
    keys: ['limit','limits','lhopital','continuity','approaches'],
    topic: 'Calculus', subject: 'mathematics',
    answer: `## Limits in Calculus

A **limit** describes the value a function approaches as x approaches a point.

### Notation:
\`\`\`
lim[x→a] f(x) = L
\`\`\`

### Limit Laws:
- lim[f + g] = lim f + lim g
- lim[f · g] = lim f · lim g
- **Important:** lim[x→0] (sin x / x) = **1**

### L'Hôpital's Rule (0/0 or ∞/∞ forms):
\`\`\`
lim f(x)/g(x) = lim f'(x)/g'(x)
\`\`\`

### Example:
lim[x→2] (x²−4)/(x−2)
= lim (x+2)(x−2)/(x−2)
= lim (x+2) = **4**`
  },
  {
    keys: ['matrix','matrices','determinant','eigenvalue','linear algebra','inverse matrix'],
    topic: 'Matrices', subject: 'mathematics',
    answer: `## Matrices & Linear Algebra

A **matrix** is a rectangular array of numbers arranged in rows and columns.

### Operations:
- **Addition:** Add corresponding elements
- **Scalar Multiplication:** Multiply each element by the scalar
- **Matrix Multiplication:** (AB)ᵢⱼ = Σ AᵢₖBₖⱼ

### Determinant of 2×2 Matrix:
\`\`\`
|a  b|  = ad − bc
|c  d|
\`\`\`

### Inverse of 2×2:
\`\`\`
A⁻¹ = (1/det A) × [d  −b; −c  a]
\`\`\`

### Eigenvalues:
Solve **det(A − λI) = 0**

If **Av = λv**, then λ is an eigenvalue and v is the eigenvector.

### Applications:
- Solving systems of linear equations
- Computer graphics transformations
- Quantum mechanics`
  },
  {
    keys: ['statistics','mean','median','mode','standard deviation','variance','normal distribution','probability'],
    topic: 'Statistics', subject: 'mathematics',
    answer: `## Statistics & Probability

### Measures of Central Tendency:
- **Mean (μ)** = Σx / n  (sum divided by count)
- **Median** = Middle value when sorted
- **Mode** = Most frequently occurring value

### Measures of Spread:
- **Variance σ²** = Σ(x − μ)² / n
- **Standard Deviation σ** = √(Variance)

### Probability Rules:
- 0 ≤ P(A) ≤ 1
- P(A ∪ B) = P(A) + P(B) − P(A ∩ B)
- **Bayes' Theorem:** P(A|B) = P(B|A)·P(A) / P(B)

### Normal Distribution:
- 68% of data falls within **1σ** of mean
- 95% within **2σ**
- 99.7% within **3σ** (68-95-99.7 rule)

### Combinations & Permutations:
- **nCr** = n! / (r!(n−r)!)
- **nPr** = n! / (n−r)!`
  },
  {
    keys: ['geometry','circle','triangle','area','perimeter','volume','pythagorean','coordinate geometry'],
    topic: 'Geometry', subject: 'mathematics',
    answer: `## Geometry

### 2D Shapes:
| Shape | Area | Perimeter |
|-------|------|-----------|
| Circle | πr² | 2πr |
| Triangle | ½ × base × height | a + b + c |
| Rectangle | length × width | 2(l + w) |
| Trapezoid | ½(a+b) × h | a+b+c+d |

### Pythagorean Theorem:
\`\`\`
a² + b² = c²   (right triangle)
\`\`\`

### 3D Shapes:
| Shape | Volume | Surface Area |
|-------|--------|-------------|
| Sphere | (4/3)πr³ | 4πr² |
| Cylinder | πr²h | 2πr² + 2πrh |
| Cone | (1/3)πr²h | πr² + πrl |

### Coordinate Geometry:
- **Distance:** d = √((x₂−x₁)² + (y₂−y₁)²)
- **Midpoint:** ((x₁+x₂)/2, (y₁+y₂)/2)
- **Slope:** m = (y₂−y₁)/(x₂−x₁)`
  },

  // ══════════════════════════════════════════════════════════
  // PHYSICS
  // ══════════════════════════════════════════════════════════
  {
    keys: ['newton','newtons law','force','inertia','f=ma','second law','third law','action reaction'],
    topic: 'Mechanics', subject: 'physics',
    answer: `## Newton's Laws of Motion

### First Law (Law of Inertia):
> "An object at rest stays at rest, and an object in motion continues in motion with the same speed and direction **unless acted upon by an external force**."

### Second Law:
\`\`\`
F = ma
Force (N) = Mass (kg) × Acceleration (m/s²)
\`\`\`

### Third Law (Action-Reaction):
> "For every action, there is an **equal and opposite reaction**."

### Worked Example:
A 10 kg box accelerates at 3 m/s². What force is applied?

F = ma = 10 × 3 = **30 N**

### Free Body Diagrams:
1. Draw all forces acting on the object
2. Resolve into components (x and y)
3. Apply Fₙₑₜ = ma to each direction

### Types of Forces:
- **Weight:** W = mg (downward)
- **Normal force:** perpendicular to surface
- **Friction:** f = μN
- **Tension:** along a string/rope`
  },
  {
    keys: ['kinematics','suvat','equations of motion','velocity','acceleration','displacement','projectile motion','motion'],
    topic: 'Mechanics', subject: 'physics',
    answer: `## Kinematics — Equations of Motion

### SUVAT Variables:
- **s** = displacement (m)
- **u** = initial velocity (m/s)
- **v** = final velocity (m/s)
- **a** = acceleration (m/s²)
- **t** = time (s)

### The 4 Equations:
\`\`\`
v = u + at
s = ut + ½at²
v² = u² + 2as
s = (u + v)t / 2
\`\`\`

### Projectile Motion:
- **Horizontal:** x = v₀cosθ · t  (no acceleration)
- **Vertical:** y = v₀sinθ · t − ½gt²
- **g = 9.8 m/s²** (acceleration due to gravity)

### Example:
A ball is thrown with u = 20 m/s, a = −9.8 m/s²
Time to reach maximum height: t = v/a = 20/9.8 = **2.04 s**
Maximum height: s = ut + ½at² = **20.4 m**`
  },
  {
    keys: ['energy','kinetic energy','potential energy','work','power','conservation of energy','joule'],
    topic: 'Mechanics', subject: 'physics',
    answer: `## Energy, Work & Power

### Definitions:
| Quantity | Formula | Unit |
|---------|---------|------|
| Kinetic Energy | KE = ½mv² | Joule (J) |
| Gravitational PE | PE = mgh | Joule (J) |
| Elastic PE | PE = ½kx² | Joule (J) |
| Work | W = F·d·cosθ | Joule (J) |
| Power | P = W/t = F·v | Watt (W) |

### Conservation of Energy:
\`\`\`
KE₁ + PE₁ = KE₂ + PE₂  (no friction)
\`\`\`

### Example:
A 2 kg ball falls from h = 5 m:
- PE lost = mgh = 2 × 9.8 × 5 = **98 J**
- KE gained = 98 J
- Speed at bottom: v = √(2KE/m) = √(196/2) = **9.9 m/s**

### Efficiency:
\`\`\`
Efficiency = (Useful output / Total input) × 100%
\`\`\``
  },
  {
    keys: ['circuit','ohm','ohms law','resistance','current','voltage','series','parallel','kirchhoff'],
    topic: 'Electricity', subject: 'physics',
    answer: `## Electricity & Circuits

### Ohm's Law:
\`\`\`
V = IR
Voltage (V) = Current (A) × Resistance (Ω)
\`\`\`

### Power:
- P = VI = I²R = V²/R

### Resistors:
| Configuration | Formula |
|--------------|---------|
| Series | R_total = R₁ + R₂ + R₃ |
| Parallel | 1/R_total = 1/R₁ + 1/R₂ + 1/R₃ |

### Kirchhoff's Laws:
- **KCL:** Sum of currents at a node = 0
- **KVL:** Sum of voltages around a closed loop = 0

### Capacitors:
- C = Q/V  (Capacitance in Farads)
- Energy stored = ½CV²

### Example:
R₁ = 4Ω, R₂ = 6Ω in series, V = 20V
- R_total = 10Ω
- I = V/R = 20/10 = **2 A**
- Power = I²R = 4 × 10 = **40 W**`
  },
  {
    keys: ['wave','waves','frequency','wavelength','amplitude','sound','electromagnetic','doppler','refraction'],
    topic: 'Waves', subject: 'physics',
    answer: `## Waves & Oscillations

### Wave Equation:
\`\`\`
v = fλ
velocity (m/s) = frequency (Hz) × wavelength (m)
\`\`\`

### Key Terms:
- **Amplitude:** Maximum displacement from equilibrium
- **Period T:** Time for one complete cycle; T = 1/f
- **Frequency f:** Cycles per second (Hz)

### Types of Waves:
| Type | Vibration | Examples |
|------|-----------|---------|
| Transverse | ⊥ to propagation | Light, water waves |
| Longitudinal | ∥ to propagation | Sound |

### Important Wave Speeds:
- Sound in air: **343 m/s** (at 20°C)
- Light in vacuum: **c = 3 × 10⁸ m/s**

### Snell's Law (Refraction):
\`\`\`
n₁ sin θ₁ = n₂ sin θ₂
\`\`\`

### Doppler Effect:
f_obs = f_source × (v ± v_observer) / (v ∓ v_source)`
  },
  {
    keys: ['thermodynamics','heat','temperature','entropy','ideal gas','pv=nrt','carnot','specific heat'],
    topic: 'Thermodynamics', subject: 'physics',
    answer: `## Thermodynamics

### Laws of Thermodynamics:
1. **Zeroth Law:** Defines thermal equilibrium (temperature)
2. **First Law:** ΔU = Q − W  (energy conservation)
3. **Second Law:** Entropy of universe always increases
4. **Third Law:** Absolute zero (0 K) is unattainable

### Ideal Gas Law:
\`\`\`
PV = nRT
\`\`\`
P = pressure (Pa), V = volume (m³), n = moles,
R = 8.314 J/mol·K, T = temperature (Kelvin)

### Heat & Specific Heat:
\`\`\`
Q = mcΔT
\`\`\`
m = mass, c = specific heat capacity, ΔT = temperature change

### Carnot Efficiency (Maximum Possible):
\`\`\`
η = 1 − T_cold / T_hot  (in Kelvin)
\`\`\`

### Temperature Conversion:
K = °C + 273.15`
  },
  {
    keys: ['quantum','quantum mechanics','photoelectric','planck','heisenberg','de broglie','uncertainty'],
    topic: 'Modern Physics', subject: 'physics',
    answer: `## Quantum Mechanics & Modern Physics

### Planck's Equation:
\`\`\`
E = hf
h = 6.626 × 10⁻³⁴ J·s (Planck's constant)
\`\`\`

### Einstein's Mass-Energy:
\`\`\`
E = mc²
c = 3 × 10⁸ m/s (speed of light)
\`\`\`

### de Broglie Wavelength (Wave-Particle Duality):
\`\`\`
λ = h/mv  (all matter has wave properties!)
\`\`\`

### Heisenberg Uncertainty Principle:
\`\`\`
Δx · Δp ≥ ℏ/2
\`\`\`
Cannot know both position AND momentum precisely.

### Bohr Model of the Atom:
\`\`\`
E_n = −13.6/n² eV  (energy levels of hydrogen)
\`\`\`

### Photoelectric Effect:
- Light ejects electrons from metal surface
- E_photon = W (work function) + KE_max`
  },

  // ══════════════════════════════════════════════════════════
  // CHEMISTRY
  // ══════════════════════════════════════════════════════════
  {
    keys: ['mole','molar mass','avogadro','stoichiometry','molecular weight','amount of substance'],
    topic: 'Physical Chemistry', subject: 'chemistry',
    answer: `## The Mole Concept & Stoichiometry

### Avogadro's Number:
\`\`\`
1 mole = 6.022 × 10²³ particles
\`\`\`

### Key Formulas:
\`\`\`
n = m / M        (moles = mass ÷ molar mass)
N = n × Nₐ      (number of particles)
V = n × 22.4 L  (volume at STP)
\`\`\`

### Stoichiometry — Step by Step:
1. **Write** and balance the chemical equation
2. **Convert** given mass → moles (÷ molar mass)
3. **Use mole ratios** from the balanced equation
4. **Convert** back to grams (× molar mass)

### Example:
In H₂ + ½O₂ → H₂O
- 4 g H₂ = 4/2 = **2 moles** H₂
- Produces **2 moles** H₂O = 2 × 18 = **36 g** water

### Empirical vs Molecular Formula:
- Empirical = simplest ratio (CH₂O)
- Molecular = actual formula (C₆H₁₂O₆)`
  },
  {
    keys: ['periodic table','element','atomic number','valence','electron configuration','periodic trends','electronegativity'],
    topic: 'Periodic Table', subject: 'chemistry',
    answer: `## The Periodic Table

### Key Definitions:
- **Atomic number (Z):** Number of protons
- **Mass number (A):** Protons + Neutrons
- **Valence electrons:** Outermost shell electrons (determine reactivity)

### Periodic Trends:
| Property | Across Period (→) | Down Group (↓) |
|---------|-------------------|----------------|
| Atomic radius | Decreases | Increases |
| Ionization energy | Increases | Decreases |
| Electronegativity | Increases | Decreases |
| Metallic character | Decreases | Increases |

### Important Groups:
- **Group 1** (Alkali metals): Li, Na, K — highly reactive
- **Group 2** (Alkaline earth): Be, Mg, Ca — reactive
- **Group 17** (Halogens): F, Cl, Br — non-metals
- **Group 18** (Noble gases): He, Ne, Ar — inert

### Electron Configuration:
1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² ...`
  },
  {
    keys: ['chemical bond','bonding','covalent','ionic','polar','vsepr','molecular geometry','hydrogen bond'],
    topic: 'Chemical Bonding', subject: 'chemistry',
    answer: `## Chemical Bonding

### Types of Bonds:
| Bond Type | Formation | Example |
|-----------|-----------|---------|
| Ionic | Metal + Non-metal (electron transfer) | NaCl |
| Covalent | Non-metal + Non-metal (electron sharing) | H₂O |
| Metallic | Metal atoms sharing electron sea | Cu, Fe |
| Hydrogen | N-H, O-H, F-H with lone pairs | Water |

### Bond Polarity:
- ΔEN < 0.4 → Non-polar covalent
- 0.4 < ΔEN < 1.7 → Polar covalent
- ΔEN > 1.7 → Ionic

### VSEPR Theory (Molecular Geometry):
| Electron Pairs | Geometry | Bond Angle |
|---------------|---------|-----------|
| 2 | Linear | 180° |
| 3 | Trigonal planar | 120° |
| 4 | Tetrahedral | 109.5° |
| 4 (1 lone pair) | Trigonal pyramidal | 107° |
| 4 (2 lone pairs) | Bent | 104.5° |`
  },
  {
    keys: ['acid','base','ph','neutralisation','neutralization','buffer','hydronium','alkali'],
    topic: 'Physical Chemistry', subject: 'chemistry',
    answer: `## Acids, Bases & pH

### pH Scale:
\`\`\`
pH = −log[H⁺]
\`\`\`
- pH < 7 → **Acidic**
- pH = 7 → **Neutral** (pure water at 25°C)
- pH > 7 → **Basic/Alkaline**

### Relationship:
\`\`\`
pH + pOH = 14
\`\`\`

### Acid-Base Theories:
| Theory | Acid | Base |
|--------|------|------|
| Arrhenius | Releases H⁺ | Releases OH⁻ |
| Brønsted-Lowry | Proton donor | Proton acceptor |
| Lewis | Electron acceptor | Electron donor |

### Neutralisation:
HCl + NaOH → NaCl + H₂O

### Buffer Solutions:
- Resist changes in pH
- Made from weak acid + conjugate base
- Example: CH₃COOH + CH₃COO⁻Na⁺

### Titration:
At equivalence point: moles of acid = moles of base
n(acid) × V(acid) = n(base) × V(base)`
  },
  {
    keys: ['organic','hydrocarbon','alkane','alkene','alkyne','functional group','benzene','iupac'],
    topic: 'Organic Chemistry', subject: 'chemistry',
    answer: `## Organic Chemistry

### Hydrocarbons:
| Class | Formula | Bonds | Example |
|-------|---------|-------|---------|
| Alkane | CₙH₂ₙ₊₂ | Single only | Methane CH₄ |
| Alkene | CₙH₂ₙ | One double | Ethene C₂H₄ |
| Alkyne | CₙH₂ₙ₋₂ | One triple | Ethyne C₂H₂ |
| Aromatic | — | Benzene ring | Benzene C₆H₆ |

### Key Functional Groups:
| Group | Name | Example |
|-------|------|---------|
| −OH | Alcohol | Ethanol |
| −COOH | Carboxylic acid | Acetic acid |
| −CHO | Aldehyde | Formaldehyde |
| −CO− | Ketone | Acetone |
| −NH₂ | Amine | Methylamine |
| −X | Halide | Chloromethane |

### IUPAC Naming Rules:
1. Find the **longest carbon chain** (parent chain)
2. Number from end nearest to substituent
3. Name substituents as prefixes
4. Add suffix for functional group`
  },
  {
    keys: ['equilibrium','le chatelier','kc','kp','equilibrium constant','reaction quotient'],
    topic: 'Physical Chemistry', subject: 'chemistry',
    answer: `## Chemical Equilibrium

### Equilibrium Expression:
For: aA + bB ⇌ cC + dD
\`\`\`
Kc = [C]^c [D]^d / [A]^a [B]^b
\`\`\`

### Le Chatelier's Principle:
When a system at equilibrium is disturbed, it shifts to **counteract the disturbance**.

| Stress | Direction of shift |
|--------|-------------------|
| Add reactant | Forwards (→) |
| Add product | Backwards (←) |
| Increase pressure | Towards fewer gas moles |
| Increase temperature | Towards endothermic direction |
| Add catalyst | No shift (increases rate only) |

### Haber Process Example:
N₂ + 3H₂ ⇌ 2NH₃  (ΔH = −92 kJ/mol)

Optimum conditions: 450°C, 200 atm, iron catalyst`
  },
  {
    keys: ['redox','oxidation','reduction','electrochemistry','galvanic','electrolysis','oil rig'],
    topic: 'Electrochemistry', subject: 'chemistry',
    answer: `## Redox & Electrochemistry

### OIL RIG:
- **O**xidation **I**s **L**oss (of electrons)
- **R**eduction **I**s **G**ain (of electrons)

### Oxidation States Rules:
- Free element = 0
- Monatomic ion = its charge
- Oxygen usually = −2 (except peroxides)
- Hydrogen usually = +1

### Galvanic Cell (Produces electricity):
- **Anode:** Oxidation occurs (negative terminal)
- **Cathode:** Reduction occurs (positive terminal)
- E°cell = E°cathode − E°anode

### Electrolysis (Uses electricity):
- **Anode:** Oxidation
- **Cathode:** Reduction (metal deposited)

### Faraday's Law:
\`\`\`
m = (M × I × t) / (n × F)
F = 96,485 C/mol (Faraday's constant)
\`\`\``
  },

  // ══════════════════════════════════════════════════════════
  // BIOLOGY
  // ══════════════════════════════════════════════════════════
  {
    keys: ['cell','cell biology','cell structure','organelle','membrane','nucleus','mitochondria','ribosome'],
    topic: 'Cell Biology', subject: 'biology',
    answer: `## Cell Biology

### Prokaryotic vs Eukaryotic Cells:
| Feature | Prokaryotic | Eukaryotic |
|---------|------------|-----------|
| Nucleus | No | Yes |
| Size | 1-10 μm | 10-100 μm |
| DNA | Circular | Linear |
| Examples | Bacteria | Animals, Plants |

### Key Organelles:
| Organelle | Function |
|-----------|---------|
| **Nucleus** | Contains DNA; controls cell activities |
| **Mitochondria** | Produces ATP (energy) via respiration |
| **Ribosome** | Protein synthesis |
| **ER (rough)** | Protein processing |
| **Golgi apparatus** | Packaging and export of proteins |
| **Lysosome** | Digestion of waste |
| **Chloroplast** | Photosynthesis (plants only) |
| **Cell wall** | Structural support (plants, fungi) |

### Cell Division:
- **Mitosis:** 1 cell → 2 identical daughter cells (growth, repair)
- **Meiosis:** 1 cell → 4 genetically unique cells (reproduction)`
  },
  {
    keys: ['dna','rna','genetics','heredity','gene','chromosome','mutation','protein synthesis','transcription','translation'],
    topic: 'Genetics', subject: 'biology',
    answer: `## Genetics & DNA

### DNA Structure:
- **Double helix** — two complementary strands
- Base pairs: **A−T** and **G−C**
- Each nucleotide: phosphate + deoxyribose sugar + nitrogenous base

### Central Dogma:
\`\`\`
DNA → (Transcription) → mRNA → (Translation) → Protein
\`\`\`

### DNA Replication (Semi-conservative):
1. Helicase unwinds the double helix
2. DNA polymerase adds complementary bases
3. Two identical DNA molecules formed

### Mendelian Genetics:
- **Dominant** allele (A) masks recessive (a)
- Genotype AA or Aa = dominant phenotype
- Genotype aa = recessive phenotype

### Punnett Square (Aa × Aa):
\`\`\`
      A        a
A  | AA (25%) | Aa (25%) |
a  | Aa (25%) | aa (25%) |
\`\`\`
Ratio: 1 AA : 2 Aa : 1 aa

### Types of Mutations:
- Point mutation, insertion, deletion, translocation`
  },
  {
    keys: ['photosynthesis','chlorophyll','light reaction','calvin cycle','glucose','plant'],
    topic: 'Plant Biology', subject: 'biology',
    answer: `## Photosynthesis

### Overall Equation:
\`\`\`
6CO₂ + 6H₂O + Light energy → C₆H₁₂O₆ + 6O₂
\`\`\`

### Two Stages:

#### Stage 1 — Light-Dependent Reactions (Thylakoid):
- Water is split (photolysis): H₂O → H⁺ + O₂
- ATP and NADPH are produced
- Oxygen is released as a by-product

#### Stage 2 — Calvin Cycle / Light-Independent (Stroma):
- CO₂ is fixed using ATP and NADPH
- Glucose (C₆H₁₂O₆) is synthesised
- RuBisCO enzyme catalyses CO₂ fixation

### Factors Affecting Rate:
- **Light intensity** — more light = faster (up to saturation)
- **CO₂ concentration** — more CO₂ = faster
- **Temperature** — optimum around 25-30°C

### Chlorophyll absorbs: Red and Blue light (reflects green)`
  },
  {
    keys: ['respiration','cellular respiration','atp','glycolysis','krebs cycle','electron transport'],
    topic: 'Cell Biology', subject: 'biology',
    answer: `## Cellular Respiration

### Overall Equation:
\`\`\`
C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 38 ATP
\`\`\`

### Three Stages:

| Stage | Location | ATP Produced |
|-------|---------|-------------|
| Glycolysis | Cytoplasm | 2 ATP |
| Krebs Cycle | Mitochondrial matrix | 2 ATP |
| Electron Transport Chain | Inner mitochondrial membrane | 34 ATP |

### Glycolysis:
- Glucose (6C) → 2 Pyruvate (3C)
- Produces 2 ATP and 2 NADH

### Anaerobic Respiration (no oxygen):
- Animals: Glucose → Lactic acid + 2 ATP
- Yeast/Plants: Glucose → Ethanol + CO₂ + 2 ATP`
  },
  {
    keys: ['evolution','natural selection','darwin','adaptation','species','mutation','survival of fittest'],
    topic: 'Evolution', subject: 'biology',
    answer: `## Evolution & Natural Selection

### Darwin's Theory (4 Key Points):
1. **Variation:** Individuals in a population vary
2. **Heredity:** Traits are passed to offspring
3. **Selection:** Some traits improve survival
4. **Time:** Small changes accumulate over generations

### Natural Selection:
- More offspring are born than can survive
- Those with advantageous traits survive and reproduce
- These traits become more common over time

### Types of Natural Selection:
- **Directional:** Extreme phenotype favoured
- **Stabilising:** Intermediate phenotype favoured
- **Disruptive:** Both extremes favoured

### Evidence for Evolution:
- Fossil record
- Comparative anatomy (homologous structures)
- DNA similarities
- Vestigial organs (e.g., human tailbone)

### Speciation:
Allopatric (geographic isolation) or Sympatric (within same area)`
  },
  {
    keys: ['ecology','ecosystem','food chain','food web','trophic','biodiversity','population','habitat'],
    topic: 'Ecology', subject: 'biology',
    answer: `## Ecology & Ecosystems

### Ecosystem Levels:
Individual → Population → Community → Ecosystem → Biosphere

### Food Chains & Energy Flow:
\`\`\`
Producer → Primary Consumer → Secondary Consumer → Tertiary Consumer
(Plants)   (Herbivores)       (Carnivores)
\`\`\`

### Energy Transfer:
- Only **10%** of energy is transferred between trophic levels
- 90% is lost as heat, waste, and respiration

### Nutrient Cycles:
- **Carbon cycle:** photosynthesis, respiration, decomposition
- **Nitrogen cycle:** fixation, nitrification, denitrification

### Population Growth:
\`\`\`
dN/dt = rN(K−N)/K   (logistic growth)
K = carrying capacity
\`\`\`

### Biodiversity:
- Species diversity, genetic diversity, ecosystem diversity
- Threats: habitat loss, climate change, invasive species`
  },

  // ══════════════════════════════════════════════════════════
  // ENGLISH
  // ══════════════════════════════════════════════════════════
  {
    keys: ['grammar','tense','past tense','present tense','future tense','past perfect','verb','noun','adjective'],
    topic: 'Grammar', subject: 'english',
    answer: `## English Grammar — Tenses

### Present Tenses:
| Tense | Formula | Example |
|-------|---------|---------|
| Simple Present | Subject + V1 | She reads books |
| Present Continuous | Subject + am/is/are + V-ing | She is reading |
| Present Perfect | Subject + have/has + V3 | She has read |
| Present Perfect Continuous | Subject + have/has been + V-ing | She has been reading |

### Past Tenses:
| Tense | Formula | Example |
|-------|---------|---------|
| Simple Past | Subject + V2 | She read the book |
| Past Continuous | Subject + was/were + V-ing | She was reading |
| Past Perfect | Subject + had + V3 | She had read it |

### Future Tenses:
| Tense | Formula | Example |
|-------|---------|---------|
| Simple Future | Subject + will + V1 | She will read |
| Future Continuous | Subject + will be + V-ing | She will be reading |
| Future Perfect | Subject + will have + V3 | She will have read |

### Parts of Speech:
Noun, Pronoun, Verb, Adjective, Adverb, Preposition, Conjunction, Interjection`
  },
  {
    keys: ['active voice','passive voice','active passive','voice change','by whom'],
    topic: 'Grammar', subject: 'english',
    answer: `## Active and Passive Voice

### Rule:
\`\`\`
Active:  Subject + Verb + Object
Passive: Object + be + V3 + by + Subject
\`\`\`

### How to Convert:
1. The **Object** of active becomes the **Subject** of passive
2. Use appropriate form of **"to be"** (is/was/has been...)
3. The main verb changes to **past participle (V3)**
4. The **Subject** of active goes after "by" (optional)

### Examples by Tense:
| Tense | Active | Passive |
|-------|--------|---------|
| Simple Present | She writes a letter | A letter is written by her |
| Simple Past | He broke the window | The window was broken by him |
| Present Perfect | They have finished the work | The work has been finished |
| Future | She will paint the wall | The wall will be painted |

### When to Use Passive:
- When the agent (doer) is unknown or unimportant
- In scientific writing
- To emphasise the action or object`
  },
  {
    keys: ['parts of speech','noun','pronoun','adjective','adverb','preposition','conjunction','article'],
    topic: 'Grammar', subject: 'english',
    answer: `## Parts of Speech

### The 8 Parts of Speech:

**1. Noun** — Person, place, thing, or idea
*Example:* dog, London, happiness, music

**2. Pronoun** — Replaces a noun
*Example:* I, you, he, she, it, they, we, who

**3. Verb** — Action or state of being
*Example:* run, think, is, become, have

**4. Adjective** — Describes a noun
*Example:* beautiful, tall, three, red

**5. Adverb** — Modifies verb, adjective, or adverb
*Example:* quickly, very, always, here

**6. Preposition** — Shows relationship
*Example:* in, on, at, by, with, between

**7. Conjunction** — Connects words or clauses
*Example:* and, but, or, yet, because, although

**8. Interjection** — Expresses emotion
*Example:* Oh!, Wow!, Alas!

### Articles:
- **Definite:** the (specific noun)
- **Indefinite:** a/an (non-specific noun)`
  },
  {
    keys: ['comprehension','reading','passage','inference','main idea','topic sentence'],
    topic: 'Reading Comprehension', subject: 'english',
    answer: `## Reading Comprehension Skills

### Key Skills:
1. **Skimming** — Reading quickly for the main idea
2. **Scanning** — Looking for specific information
3. **Detailed Reading** — Understanding every part carefully

### Types of Questions:
| Type | What to Do |
|------|-----------|
| Factual | Find the answer directly in the passage |
| Inference | Read between the lines (implied meaning) |
| Vocabulary | Use context clues to understand words |
| Main idea | Summarise what the whole passage is about |
| Author's purpose | Why did the author write this? |

### Answering Techniques:
1. Read the **questions first** before reading the passage
2. Underline **key words** in questions
3. Find the relevant **paragraph or sentence**
4. Answer in your **own words** unless asked to quote
5. Check answers against the text

### Useful Transition Words:
- **Contrast:** however, although, on the other hand
- **Addition:** furthermore, moreover, in addition
- **Conclusion:** therefore, thus, consequently`
  },
  {
    keys: ['essay','writing','paragraph','introduction','conclusion','thesis','composition'],
    topic: 'Writing Skills', subject: 'english',
    answer: `## Essay Writing Skills

### Essay Structure:
\`\`\`
Introduction → Body Paragraphs → Conclusion
\`\`\`

### Introduction (1 paragraph):
- **Hook:** Attention-grabbing opening
- **Background:** Brief context
- **Thesis Statement:** Your main argument

### Body Paragraphs (3+ paragraphs):
Each paragraph should have:
- **Topic sentence** (main point)
- **Evidence/Examples** (support)
- **Explanation** (analysis)
- **Linking sentence** (transition)

### Conclusion (1 paragraph):
- Restate thesis (in different words)
- Summarise key points
- Final thought or call to action

### Useful Linking Words:
| Purpose | Words |
|---------|-------|
| Addition | Furthermore, Moreover, In addition |
| Contrast | However, Nevertheless, On the contrary |
| Cause | Because, Since, Due to |
| Effect | Therefore, As a result, Consequently |
| Example | For instance, For example, Such as |`
  },
  {
    keys: ['vocabulary','word','synonym','antonym','meaning','definition','prefix','suffix'],
    topic: 'Vocabulary', subject: 'english',
    answer: `## Vocabulary Building

### Word Formation:
| Type | Meaning | Example |
|------|---------|---------|
| **Prefix** | Added before root | un+happy = unhappy |
| **Suffix** | Added after root | happy+ness = happiness |
| **Root word** | Core meaning | "bio" = life |

### Common Prefixes:
- **un-** = not (unhappy, unkind)
- **re-** = again (redo, rewrite)
- **pre-** = before (preview, predict)
- **mis-** = wrongly (mistake, misuse)
- **anti-** = against (antibiotic)

### Common Suffixes:
- **-tion/-sion** = act/state (action, tension)
- **-ful** = full of (beautiful, helpful)
- **-less** = without (hopeless, careless)
- **-ment** = result/state (achievement)
- **-ous** = having quality (famous, dangerous)

### Synonyms vs Antonyms:
- **Synonym:** Same meaning (happy = joyful)
- **Antonym:** Opposite meaning (happy ≠ sad)

### Context Clues Strategy:
Look at surrounding words to guess unknown word meaning.`
  },
  {
    keys: ['literature','prose','poetry','drama','novel','character','plot','theme','figurative language'],
    topic: 'Literature', subject: 'english',
    answer: `## Literature & Literary Devices

### Forms of Literature:
- **Prose:** Written in paragraphs (novels, short stories)
- **Poetry:** Verse form with rhythm/rhyme
- **Drama:** Written for performance (plays, scripts)

### Story Elements:
| Element | Definition |
|---------|-----------|
| **Plot** | Sequence of events |
| **Character** | People in the story |
| **Setting** | Time and place |
| **Theme** | Central message/idea |
| **Conflict** | Problem in the story |
| **Narrator** | Who is telling the story |

### Literary Devices:
| Device | Definition | Example |
|--------|-----------|---------|
| **Simile** | Comparison using "like" or "as" | "brave as a lion" |
| **Metaphor** | Direct comparison | "Life is a journey" |
| **Personification** | Giving human traits to non-humans | "The wind whispered" |
| **Alliteration** | Repeated consonant sounds | "Peter Piper picked" |
| **Onomatopoeia** | Words that sound like the sound | buzz, splash, crash |
| **Hyperbole** | Exaggeration | "I've told you a million times" |
| **Irony** | Saying the opposite of what is meant | |`
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// INTELLIGENT RESPONSE ENGINE
// ─────────────────────────────────────────────────────────────────────────────

function scoreEntry(entry, query, subjectId) {
  const q = query.toLowerCase()
  let score = 0
  if (entry.subject === subjectId) score += 3
  for (const key of entry.keys) {
    if (q.includes(key.toLowerCase())) score += key.length + 5
  }
  return score
}

export function getEduResponse(question, subjectId) {
  const q = question.toLowerCase().trim()
  let best = null, bestScore = 0

  for (const entry of KB) {
    const s = scoreEntry(entry, q, subjectId)
    if (s > bestScore) { bestScore = s; best = entry }
  }

  if (best && bestScore >= 8) return best.answer

  // Smart subject-aware fallback
  return buildSmartFallback(question, subjectId)
}

function buildSmartFallback(question, subjectId) {
  const subjectContext = {
    mathematics: {
      domain: 'Mathematics',
      topics: 'Algebra, Calculus, Trigonometry, Geometry, Statistics, Matrices, Probability',
      examples: ['What is integration?', 'Explain the quadratic formula', 'How do I solve trigonometry problems?'],
    },
    physics: {
      domain: 'Physics',
      topics: 'Mechanics, Kinematics, Waves, Electricity, Thermodynamics, Modern Physics',
      examples: ["Explain Newton's laws", 'What is kinetic energy?', 'How do circuits work?'],
    },
    chemistry: {
      domain: 'Chemistry',
      topics: 'Organic Chemistry, Periodic Table, Chemical Bonding, Acids & Bases, Electrochemistry',
      examples: ['Explain the mole concept', 'What is pH?', 'How does chemical bonding work?'],
    },
    biology: {
      domain: 'Biology',
      topics: 'Cell Biology, Genetics, Photosynthesis, Evolution, Ecology, Human Anatomy',
      examples: ['Explain DNA replication', 'What is photosynthesis?', 'How does natural selection work?'],
    },
    english: {
      domain: 'English',
      topics: 'Grammar, Tenses, Active/Passive Voice, Vocabulary, Essay Writing, Literature',
      examples: ['Explain past perfect tense', 'What is active and passive voice?', 'How to write a good essay?'],
    },
  }

  const ctx = subjectContext[subjectId] || subjectContext.mathematics

  return `## Understanding Your Question

I understand you're asking about: **"${question}"**

This is a ${ctx.domain} question. Let me help you effectively!

### Topics I can explain in ${ctx.domain}:
${ctx.topics.split(', ').map(t => `- ${t}`).join('\n')}

### Try asking more specifically:
${ctx.examples.map(e => `- "${e}"`).join('\n')}

### Study Tips for ${ctx.domain}:
- Break complex concepts into smaller parts
- Practice with examples after understanding theory
- Review formulas and key definitions regularly
- Apply concepts to real-world problems

I'll give you a **complete, structured answer** with:
✅ Clear explanation  ✅ Key formulas  ✅ Step-by-step examples`
}

// ─────────────────────────────────────────────────────────────────────────────
// TOPIC DATA FOR SUBJECT PAGES
// ─────────────────────────────────────────────────────────────────────────────

export const TOPIC_DATA = {
  mathematics: [
    { id: 'algebra', label: 'Algebra', icon: '𝑓', difficulty: 'Beginner', desc: 'Variables, equations, polynomials and algebraic structures', keyFormulas: ['ax + b = 0 → x = −b/a', 'ax² + bx + c = 0 → x = (−b ± √Δ)/2a', '(a+b)² = a² + 2ab + b²', 'aⁿ × aᵐ = aⁿ⁺ᵐ'], keyConcepts: ['Linear equations', 'Quadratic equations', 'Polynomial functions', 'Inequalities', 'Simultaneous equations'] },
    { id: 'calculus', label: 'Calculus', icon: '∫', difficulty: 'Advanced', desc: 'Limits, derivatives, integrals and their applications', keyFormulas: ["d/dx(xⁿ) = nxⁿ⁻¹", '∫xⁿ dx = xⁿ⁺¹/(n+1) + C', 'FTC: ∫[a,b]f dx = F(b)−F(a)', 'Chain rule: dy/dx = dy/du × du/dx'], keyConcepts: ['Limits & continuity', 'Differentiation rules', 'Integration techniques', 'Applications of calculus', 'Differential equations'] },
    { id: 'trigonometry', label: 'Trigonometry', icon: 'sin', difficulty: 'Intermediate', desc: 'Angles, triangles, trigonometric functions and identities', keyFormulas: ['sin²θ + cos²θ = 1', 'sin(A+B) = sinA cosB + cosA sinB', 'a/sinA = b/sinB (Sine rule)', 'a² = b² + c² − 2bc cosA'], keyConcepts: ['Trig ratios (SOH-CAH-TOA)', 'Unit circle', 'Trigonometric identities', 'Inverse trig functions', 'Solving trig equations'] },
    { id: 'geometry', label: 'Geometry', icon: '△', difficulty: 'Intermediate', desc: 'Shapes, measurements, proofs and coordinate geometry', keyFormulas: ['a² + b² = c² (Pythagoras)', 'Area of circle = πr²', 'Volume of sphere = (4/3)πr³', 'Distance = √((Δx)² + (Δy)²)'], keyConcepts: ['Euclidean geometry', 'Coordinate geometry', 'Vectors', 'Transformations', 'Circle theorems'] },
    { id: 'statistics', label: 'Statistics', icon: 'Σ', difficulty: 'Intermediate', desc: 'Data analysis, probability and statistical inference', keyFormulas: ['μ = Σx/n (Mean)', 'σ² = Σ(x−μ)²/n (Variance)', 'P(A|B) = P(A∩B)/P(B)', 'nCr = n!/r!(n−r)!'], keyConcepts: ['Descriptive statistics', 'Normal distribution', 'Probability', 'Hypothesis testing', 'Correlation & regression'] },
    { id: 'matrices', label: 'Matrices', icon: '[]', difficulty: 'Advanced', desc: 'Matrix operations, determinants and transformations', keyFormulas: ['det(A) = ad − bc', 'A⁻¹ = (1/det A) × adj(A)', 'Av = λv (eigenvalue)', 'A × A⁻¹ = I'], keyConcepts: ['Matrix operations', 'Determinants', 'Inverse matrices', 'Eigenvalues & eigenvectors', 'Systems of linear equations'] },
  ],
  physics: [
    { id: 'mechanics', label: 'Mechanics', icon: '⚙', difficulty: 'Beginner', desc: "Forces, motion, energy and Newton's laws", keyFormulas: ['F = ma', 'W = Fd cosθ', 'KE = ½mv²', 'f = μN (friction)'], keyConcepts: ["Newton's 3 laws", 'Free body diagrams', 'Friction & normal force', 'Circular motion', 'Momentum & impulse'] },
    { id: 'kinematics', label: 'Kinematics', icon: '→', difficulty: 'Beginner', desc: 'Equations of motion, projectiles and relative velocity', keyFormulas: ['v = u + at', 's = ut + ½at²', 'v² = u² + 2as', 'Range = u²sin2θ/g'], keyConcepts: ['SUVAT equations', 'Distance-time graphs', 'Velocity-time graphs', 'Projectile motion', 'Relative velocity'] },
    { id: 'waves', label: 'Waves & Optics', icon: '∿', difficulty: 'Intermediate', desc: 'Wave properties, sound, light and electromagnetic spectrum', keyFormulas: ['v = fλ', 'T = 1/f', 'n₁sinθ₁ = n₂sinθ₂', 'f_obs = f × (v±v_obs)/(v∓v_src)'], keyConcepts: ['Wave types', 'Superposition', 'Reflection & refraction', 'Diffraction', 'Doppler effect'] },
    { id: 'electricity', label: 'Electricity', icon: '⚡', difficulty: 'Intermediate', desc: "Circuits, Ohm's law, capacitors and electric fields", keyFormulas: ["V = IR (Ohm's law)", 'P = VI = I²R', 'Q = CV (capacitor)', 'E = Q/4πε₀r²'], keyConcepts: ["Ohm's law", 'Series & parallel circuits', 'Kirchhoff\'s laws', 'Capacitors', 'Electric field & potential'] },
    { id: 'thermodynamics', label: 'Thermodynamics', icon: '🌡', difficulty: 'Advanced', desc: 'Heat, temperature, entropy and laws of thermodynamics', keyFormulas: ['PV = nRT', 'Q = mcΔT', 'ΔU = Q − W', 'η = 1 − Tc/Th'], keyConcepts: ['Laws of thermodynamics', 'Ideal gas law', 'Heat transfer', 'Carnot cycle', 'Entropy'] },
    { id: 'modern', label: 'Modern Physics', icon: '⚛', difficulty: 'Advanced', desc: 'Quantum mechanics, relativity and nuclear physics', keyFormulas: ['E = hf (Planck)', 'E = mc² (Einstein)', 'λ = h/mv (de Broglie)', 'E_n = −13.6/n² eV'], keyConcepts: ['Quantum theory', 'Photoelectric effect', 'Special relativity', 'Nuclear physics', 'Radioactive decay'] },
  ],
  chemistry: [
    { id: 'organic', label: 'Organic Chemistry', icon: 'C', difficulty: 'Advanced', desc: 'Carbon compounds, hydrocarbons, functional groups and reactions', keyFormulas: ['CₙH₂ₙ₊₂ (alkanes)', 'CₙH₂ₙ (alkenes)', 'R−COOH (carboxylic acids)', 'R−OH (alcohols)'], keyConcepts: ['IUPAC naming', 'Functional groups', 'Structural isomerism', 'Reaction mechanisms', 'Polymers'] },
    { id: 'periodic', label: 'Periodic Table', icon: '⊞', difficulty: 'Beginner', desc: 'Elements, atomic structure and periodic trends', keyFormulas: ['Z = number of protons', 'A = Z + N (mass number)', 'EN: F > O > N > Cl', 'IE increases across period'], keyConcepts: ['Atomic number & mass', 'Electron configuration', 'Periodic trends', 'Groups & periods', 'Isotopes'] },
    { id: 'bonding', label: 'Chemical Bonding', icon: '⊕', difficulty: 'Intermediate', desc: 'Ionic, covalent and metallic bonds; VSEPR theory', keyFormulas: ['ΔEN > 1.7 → Ionic', 'ΔEN < 1.7 → Covalent', 'VSEPR: 4 pairs → tetrahedral', 'Bond energy ∝ bond order'], keyConcepts: ['Ionic bonding', 'Covalent bonding', 'VSEPR theory', 'Molecular polarity', 'Intermolecular forces'] },
    { id: 'reactions', label: 'Chemical Reactions', icon: '⇌', difficulty: 'Intermediate', desc: 'Reaction types, equilibrium, kinetics and stoichiometry', keyFormulas: ['Kc = [P]^p/[R]^r', 'rate = k[A]^m[B]^n', 'ΔG = ΔH − TΔS', 'Ea = activation energy'], keyConcepts: ['Balancing equations', 'Reaction types', 'Equilibrium constants', "Le Chatelier's principle", 'Reaction rates'] },
    { id: 'acids', label: 'Acids & Bases', icon: 'pH', difficulty: 'Intermediate', desc: 'pH scale, neutralisation, buffers and titration', keyFormulas: ['pH = −log[H⁺]', 'pH + pOH = 14', 'Ka × Kb = Kw', 'Kw = 10⁻¹⁴ at 25°C'], keyConcepts: ['pH scale', 'Acid-base theories', 'Neutralisation reactions', 'Buffer solutions', 'Titration curves'] },
    { id: 'electrochemistry', label: 'Electrochemistry', icon: 'e⁻', difficulty: 'Advanced', desc: 'Redox reactions, galvanic cells and electrolysis', keyFormulas: ['E°cell = E°cathode − E°anode', 'm = MIt/nF', 'ΔG = −nFE°', 'OIL RIG'], keyConcepts: ['Oxidation states', 'Half-equations', 'Galvanic cells', 'Electrolysis', 'Nernst equation'] },
  ],
  biology: [
    { id: 'cell', label: 'Cell Biology', icon: '🔬', difficulty: 'Beginner', desc: 'Cell structure, organelles, transport and division', keyFormulas: ['Surface area / Volume ratio', 'Magnification = image size / actual size', 'Cell cycle: G1→S→G2→M'], keyConcepts: ['Prokaryotic vs eukaryotic', 'Cell organelles', 'Cell membrane transport', 'Mitosis & meiosis', 'Cell cycle'] },
    { id: 'genetics', label: 'Genetics', icon: '🧬', difficulty: 'Intermediate', desc: 'DNA, RNA, heredity, Mendelian genetics and mutations', keyFormulas: ['DNA base pairs: A-T, G-C', 'p² + 2pq + q² = 1 (Hardy-Weinberg)', 'Mutation rate formulas'], keyConcepts: ['DNA structure & replication', 'Protein synthesis', 'Mendelian genetics', 'Punnett squares', 'Types of mutations'] },
    { id: 'anatomy', label: 'Human Anatomy', icon: '🫀', difficulty: 'Intermediate', desc: 'Human organ systems, physiology and homeostasis', keyFormulas: ['Cardiac output = HR × stroke volume', 'BMI = weight(kg)/height(m)²', 'GFR (kidney filtration)'], keyConcepts: ['Digestive system', 'Cardiovascular system', 'Nervous system', 'Respiratory system', 'Homeostasis'] },
    { id: 'plant', label: 'Plant Biology', icon: '🌿', difficulty: 'Beginner', desc: 'Photosynthesis, plant structure and reproduction', keyFormulas: ['6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', 'Transpiration rate formulas', 'Water potential (Ψ)'], keyConcepts: ['Photosynthesis stages', 'Plant structure & tissues', 'Transpiration', 'Plant hormones', 'Reproduction in plants'] },
    { id: 'evolution', label: 'Evolution', icon: '🦋', difficulty: 'Intermediate', desc: 'Natural selection, adaptation, speciation and evidence', keyFormulas: ['Hardy-Weinberg: p + q = 1', 'Fitness = reproductive success', 'dN/dt = rN (population growth)'], keyConcepts: ["Darwin's theory", 'Natural selection types', 'Genetic drift', 'Speciation', 'Evidence for evolution'] },
    { id: 'ecology', label: 'Ecology', icon: '🌍', difficulty: 'Beginner', desc: 'Ecosystems, food chains, energy flow and biodiversity', keyFormulas: ['10% energy rule', 'dN/dt = rN(K−N)/K', 'Simpson\'s diversity index'], keyConcepts: ['Food chains & webs', 'Energy flow', 'Nutrient cycles', 'Population dynamics', 'Conservation'] },
  ],
  english: [
    { id: 'grammar', label: 'Grammar', icon: 'G', difficulty: 'Beginner', desc: 'Tenses, parts of speech, sentence structure and punctuation', keyFormulas: ['Simple Present: S + V1', 'Past Perfect: S + had + V3', 'Passive: Object + be + V3', 'Conditional: If + S + V2, S + would + V1'], keyConcepts: ['All 12 tenses', 'Parts of speech', 'Active & passive voice', 'Direct & indirect speech', 'Conditionals'] },
    { id: 'vocabulary', label: 'Vocabulary', icon: 'W', difficulty: 'Beginner', desc: 'Word formation, synonyms, antonyms, prefixes and suffixes', keyFormulas: ['Root word + Prefix/Suffix', 'Context clues method', 'Word families'], keyConcepts: ['Word formation rules', 'Prefixes & suffixes', 'Synonyms & antonyms', 'Collocations', 'Idioms & phrases'] },
    { id: 'writing', label: 'Writing Skills', icon: '📝', difficulty: 'Intermediate', desc: 'Essay writing, paragraph structure and composition techniques', keyFormulas: ['Essay: Intro + Body×3 + Conclusion', 'PEEL: Point, Evidence, Explain, Link', 'Topic sentence + evidence + analysis'], keyConcepts: ['Essay structure', 'Paragraph writing', 'Linking words', 'Formal vs informal writing', 'Descriptive writing'] },
    { id: 'comprehension', label: 'Reading Comprehension', icon: '📖', difficulty: 'Intermediate', desc: 'Reading strategies, inference, main ideas and analysis', keyFormulas: ['Skim → Scan → Read in detail', 'SQRRR method', 'Context clue strategy'], keyConcepts: ['Skimming & scanning', 'Inference skills', 'Main idea & supporting details', 'Author\'s purpose & tone', 'Critical analysis'] },
    { id: 'literature', label: 'Literature', icon: '📚', difficulty: 'Advanced', desc: 'Prose, poetry, drama, literary devices and analysis', keyFormulas: ['SLIC: Style, Language, Ideas, Context', 'PEE: Point, Evidence, Explain', 'Poetic meter & rhyme scheme'], keyConcepts: ['Literary devices', 'Poetry analysis', 'Novel study techniques', 'Drama & stagecraft', 'Critical appreciation'] },
    { id: 'spoken', label: 'Spoken English', icon: '🎤', difficulty: 'Beginner', desc: 'Communication skills, pronunciation and conversational English', keyFormulas: ['Stress patterns in sentences', 'Intonation: rising/falling', 'Formal vs informal register'], keyConcepts: ['Pronunciation rules', 'Conversation strategies', 'Public speaking', 'Debate skills', 'Interview techniques'] },
  ],
}
