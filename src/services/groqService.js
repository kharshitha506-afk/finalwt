// ─────────────────────────────────────────────────────────────────────────────
// GROQ AI SERVICE — Production-ready with fallback chain
// Endpoint: https://api.groq.com/openai/v1/chat/completions
// ─────────────────────────────────────────────────────────────────────────────

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'

// Stable production Groq models — ordered by preference
const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama3-70b-8192',
  'mixtral-8x7b-32768',
  'llama3-8b-8192',
]

const LANGUAGE_INSTRUCTIONS = {
  en: 'Respond in English.',
  hi: 'Respond in Hindi (हिंदी में उत्तर दें). Use Devanagari script.',
  kn: 'Respond in Kannada (ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ). Use Kannada script.',
  te: 'Respond in Telugu (తెలుగులో సమాధానం ఇవ్వండి). Use Telugu script.',
  ta: 'Respond in Tamil (தமிழில் பதில் சொல்லுங்கள்). Use Tamil script.',
  ml: 'Respond in Malayalam (മലയാളത്തിൽ ഉത്തരം നൽകൂ). Use Malayalam script.',
}

// ─── System prompt builder ────────────────────────────────────────────────────
function buildSystemPrompt(subjectLabel, language = 'en') {
  const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.en
  return `You are NeuralPath AI, an expert educational tutor specializing in ${subjectLabel}. You are part of a premium AI-powered educational platform.

${langInstruction}

CORE BEHAVIOR:
- Answer ANY academic question thoroughly and clearly
- Provide step-by-step solutions for problems
- Explain formulas, concepts, and theories naturally
- Support follow-up questions using conversation context
- Solve numerical problems with complete working shown
- Explain grammar rules, literature, and writing skills
- Cover all subjects: Mathematics, Physics, Chemistry, Biology, English

FORMATTING RULES:
- Use ## for main headings
- Use ### for subheadings
- Use **bold** for key terms and formulas
- Use bullet points (- ) for lists
- Use numbered lists (1. 2. 3.) for step-by-step
- Present formulas clearly: F = ma, E = mc², pH = -log[H⁺]
- Use | tables for comparisons

PERSONALITY:
- Be encouraging and supportive
- Explain at the right depth for the question
- Use simple language then build up complexity
- Give real-world examples whenever helpful
- Never refuse an academic question
- Behave naturally like ChatGPT or Claude`
}

// ─── Core Groq API call ───────────────────────────────────────────────────────
async function callGroq(model, messages, stream = false) {
  const key = GROQ_API_KEY?.trim()
  if (!key || key === 'your_groq_api_key_here') {
    throw new Error('NO_API_KEY')
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    const res = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 1024,
        temperature: 0.7,
        stream,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}))
      const msg = errBody?.error?.message || `HTTP ${res.status}`

      if (res.status === 401) throw new Error('INVALID_KEY')
      if (res.status === 429) throw new Error('RATE_LIMIT')
      if (res.status === 503) throw new Error('SERVICE_UNAVAILABLE')
      if (msg.includes('model_not_found') || msg.includes('does not exist')) {
        throw new Error('MODEL_NOT_FOUND')
      }
      throw new Error(`API_ERROR:${msg}`)
    }

    return res
  } catch (err) {
    clearTimeout(timeout)
    if (err.name === 'AbortError') throw new Error('TIMEOUT')
    throw err
  }
}

// ─── Non-streaming with model fallback ───────────────────────────────────────
export async function getGroqResponse(chatMessages, subjectLabel, language = 'en', retry = 0) {
  const key = GROQ_API_KEY?.trim()
  if (!key || key === 'your_groq_api_key_here') {
    // Try Gemini fallback
    return getGeminiFallback(chatMessages, subjectLabel, language)
  }

  const systemPrompt = buildSystemPrompt(subjectLabel, language)
  const messages = [
    { role: 'system', content: systemPrompt },
    ...chatMessages.filter(m => m.role === 'user' || m.role === 'assistant').map(m => ({
      role: m.role,
      content: m.content,
    })),
  ]

  for (const model of GROQ_MODELS) {
    try {
      const res = await callGroq(model, messages, false)
      const data = await res.json()
      const text = data?.choices?.[0]?.message?.content
      if (!text) throw new Error('EMPTY_RESPONSE')

      // Cache working model
      sessionStorage.setItem('groq_working_model', model)
      return text
    } catch (err) {
      if (err.message === 'MODEL_NOT_FOUND') continue
      if (err.message === 'RATE_LIMIT' && retry < 2) {
        await new Promise(r => setTimeout(r, 1500 * (retry + 1)))
        return getGroqResponse(chatMessages, subjectLabel, language, retry + 1)
      }
      if (err.message === 'INVALID_KEY') throw err
      // Try next model for other errors
      continue
    }
  }

  // All Groq models failed — try Gemini
  return getGeminiFallback(chatMessages, subjectLabel, language)
}

// ─── Streaming with model fallback ────────────────────────────────────────────
export async function streamGroqResponse(chatMessages, subjectLabel, language = 'en', onChunk, onDone, onError) {
  const key = GROQ_API_KEY?.trim()
  if (!key || key === 'your_groq_api_key_here') {
    // Try Gemini streaming fallback
    streamGeminiFallback(chatMessages, subjectLabel, language, onChunk, onDone, onError)
    return
  }

  const systemPrompt = buildSystemPrompt(subjectLabel, language)
  const messages = [
    { role: 'system', content: systemPrompt },
    ...chatMessages.filter(m => m.role === 'user' || m.role === 'assistant').map(m => ({
      role: m.role,
      content: m.content,
    })),
  ]

  // Try cached model first for speed
  const cachedModel = sessionStorage.getItem('groq_working_model')
  const orderedModels = cachedModel
    ? [cachedModel, ...GROQ_MODELS.filter(m => m !== cachedModel)]
    : GROQ_MODELS

  for (const model of orderedModels) {
    try {
      const res = await callGroq(model, messages, true)
      sessionStorage.setItem('groq_working_model', model)

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))

        for (const line of lines) {
          const data = line.slice(6).trim()
          if (data === '[DONE]') continue
          try {
            const parsed = JSON.parse(data)
            const delta = parsed?.choices?.[0]?.delta?.content
            if (delta) {
              fullText += delta
              onChunk(delta, fullText)
            }
          } catch { /* ignore malformed */ }
        }
      }

      onDone(fullText || 'I was unable to generate a response. Please try again.')
      return
    } catch (err) {
      if (err.message === 'MODEL_NOT_FOUND') continue
      if (err.message === 'RATE_LIMIT') {
        onError('RATE_LIMIT')
        return
      }
      if (err.message === 'INVALID_KEY') {
        onError('INVALID_KEY')
        return
      }
      // Try next model
      continue
    }
  }

  // All Groq failed — try Gemini streaming
  streamGeminiFallback(chatMessages, subjectLabel, language, onChunk, onDone, onError)
}

// ─── Gemini fallback (non-streaming) ─────────────────────────────────────────
async function getGeminiFallback(chatMessages, subjectLabel, language) {
  const key = GEMINI_API_KEY?.trim()
  if (!key || key === 'your_gemini_api_key_here') {
    throw new Error('NO_API_KEY')
  }

  const GEMINI_MODELS = [
    { model: 'gemini-1.5-flash-latest', base: 'https://generativelanguage.googleapis.com/v1beta/models' },
    { model: 'gemini-pro', base: 'https://generativelanguage.googleapis.com/v1/models' },
    { model: 'gemini-1.0-pro', base: 'https://generativelanguage.googleapis.com/v1/models' },
  ]

  const systemPrompt = buildSystemPrompt(subjectLabel, language)
  const contents = chatMessages
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] }))

  for (const { model, base } of GEMINI_MODELS) {
    try {
      const res = await fetch(`${base}/${model}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      })
      if (!res.ok) { const e = await res.json().catch(() => ({})); const m2 = e?.error?.message || ''; if (m2.includes('not found') || m2.includes('not supported')) continue; throw new Error(`API_ERROR:${m2}`) }
      const data = await res.json()
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) return text
    } catch (e) { if (e.message?.includes('not found')) continue; throw e }
  }
  throw new Error('NO_API_KEY')
}

// ─── Gemini streaming fallback ────────────────────────────────────────────────
async function streamGeminiFallback(chatMessages, subjectLabel, language, onChunk, onDone, onError) {
  try {
    const text = await getGeminiFallback(chatMessages, subjectLabel, language)
    // Simulate streaming for Gemini non-streaming
    let i = 0
    const interval = setInterval(() => {
      if (i >= text.length) { clearInterval(interval); onDone(text); return }
      const chunk = text.slice(i, i + 6)
      onChunk(chunk, text.slice(0, i + 6))
      i += 6
    }, 15)
  } catch (err) {
    onError(err.message)
  }
}

// ─── Utilities ────────────────────────────────────────────────────────────────
export function hasAnyApiKey() {
  const groq = GROQ_API_KEY?.trim()
  const gemini = GEMINI_API_KEY?.trim()
  return (groq && groq !== 'your_groq_api_key_here') ||
    (gemini && gemini !== 'your_gemini_api_key_here')
}

export function getProviderName() {
  const groq = GROQ_API_KEY?.trim()
  const gemini = GEMINI_API_KEY?.trim()
  if (groq && groq !== 'your_groq_api_key_here') return 'Groq'
  if (gemini && gemini !== 'your_gemini_api_key_here') return 'Gemini'
  return null
}

export function getUserFriendlyError(errCode) {
  if (!errCode) return 'Something went wrong. Please try again.'
  if (errCode === 'NO_API_KEY' || errCode === 'NO_KEY_CONFIGURED') {
    return '## API Key Required\n\nTo use the AI tutor, add your **Groq API key** to the `.env` file:\n\n```\nVITE_GROQ_API_KEY=your_key_here\n```\n\nGet a **free** key at [console.groq.com](https://console.groq.com) — no credit card needed. Then restart the dev server.'
  }
  if (errCode === 'INVALID_KEY') return '## Invalid API Key\n\nYour API key is invalid. Please check it\'s correctly copied from [console.groq.com](https://console.groq.com) with no extra spaces.'
  if (errCode === 'RATE_LIMIT') return '## Rate Limit\n\nToo many requests. Please wait a moment and try again. The free Groq tier is very generous — this should clear in seconds.'
  if (errCode === 'TIMEOUT') return '## Request Timeout\n\nThe AI took too long to respond. Please try again with a shorter question.'
  if (errCode === 'SERVICE_UNAVAILABLE') return '## Service Temporarily Unavailable\n\nThe AI service is temporarily down. Please try again in a moment.'
  return '## AI Error\n\nSomething went wrong. Please try again. If this persists, check your API key in the `.env` file.'
}

// AI Question Generator for Adaptive Quiz
export async function generateAIQuestions(subject, difficulty, weakTopics = [], accuracy = 70, streak = 0) {
  const key = GROQ_API_KEY?.trim()
  
  // Fallback to Gemini if Groq key is not set
  if (!key || key === 'your_groq_api_key_here') {
    return generateGeminiAIQuestions(subject, difficulty, weakTopics, accuracy, streak)
  }

  const langLabel = {
    hi: 'Hindi (हिंदी)',
    kn: 'Kannada (ಕನ್ನಡ)',
    te: 'Telugu (తెలుగు)',
    ta: 'Tamil (தமிழ்)',
    ml: 'Malayalam (മലയാളം)',
  }[localStorage.getItem('neuralpath_language') || 'en'] || 'English'

  const systemPrompt = `You are NeuralPath AI, an expert academic question generator for Indian high school and college students.

Your ONLY output must be a STRICT, VALID JSON array of exactly 8 multiple-choice questions.
Do NOT include any markdown, code blocks, backticks, explanations, comments, or text outside the JSON array.
Do NOT wrap the JSON in \`\`\`json or any other formatting.
Start your response with [ and end it with ].

SUBJECT: ${subject}
DIFFICULTY: ${difficulty}
STUDENT ACCURACY: ${accuracy}%
STREAK: ${streak}
WEAK TOPICS TO PRIORITIZE: ${weakTopics.length > 0 ? weakTopics.join(', ') : 'general ' + subject + ' topics'}
RESPONSE LANGUAGE: ${langLabel}

RULES:
1. Generate EXACTLY 8 unique questions with NO duplicates.
2. Each question must be academically accurate — NO factual errors or hallucinations.
3. All 4 answer choices must be plausible and relevant.
4. The "answer" field must EXACTLY match one of the 4 strings in the "options" array — character for character.
5. Write clear step-by-step explanations suitable for a student who got it wrong.
6. Adjust difficulty: if accuracy < 50% use more easy/medium; if accuracy > 80% use more hard.
7. Cover the specified weak topics primarily, then fill remaining questions with other ${subject} topics.
8. Write all text (question, options, hint, explanation) in ${langLabel}.
9. No markdown formatting inside any field values.

EXACT JSON SCHEMA (follow precisely):
[
  {
    "id": 1,
    "subject": "${subject}",
    "topic": "specific subtopic name",
    "difficulty": "easy" or "medium" or "hard",
    "question": "Clear, complete question text",
    "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
    "answer": "Option A text",
    "hint": "A concise helpful hint without revealing the answer",
    "explanation": "Step-by-step explanation of why the answer is correct"
  }
]

Generate all 8 questions now:`

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: 'Generate the JSON array of 8 questions now. Start with [ and end with ]. No other text.' }
  ]

  try {
    const res = await callGroq(model, messages, false)
    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content
    if (!text) throw new Error('EMPTY_RESPONSE')
    
    const start = text.indexOf('[')
    const end = text.lastIndexOf(']')
    if (start === -1 || end === -1) {
      throw new Error('NO_JSON_ARRAY_FOUND')
    }
    
    const parsed = JSON.parse(text.slice(start, end + 1))
    // Accept 6–8 questions (sometimes model returns 7 — still usable)
    if (Array.isArray(parsed) && parsed.length >= 6) {
      const validated = parsed.slice(0, 8).map((q, idx) => ({
        id: q.id || (1000 + idx),
        subject: q.subject || subject,
        topic: q.topic || 'General',
        difficulty: ['easy','medium','hard'].includes(q.difficulty) ? q.difficulty : difficulty,
        question: q.question || 'Academic question placeholder',
        options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
        answer: q.answer && Array.isArray(q.options) && q.options.includes(q.answer)
          ? q.answer
          : (Array.isArray(q.options) ? q.options[0] : 'Option A'),
        hint: q.hint || 'Review the core concept behind this question.',
        explanation: q.explanation || 'The correct answer is the most accurate based on standard curriculum.'
      }))
      return validated
    }
    throw new Error('INVALID_ARRAY_SIZE')
  } catch (err) {
    console.error('AI quiz generation failed on Groq, trying Gemini fallback:', err)
    return generateGeminiAIQuestions(subject, difficulty, weakTopics, accuracy, streak)
  }
}

// Gemini fallback for generating AI questions
async function generateGeminiAIQuestions(subject, difficulty, weakTopics = [], accuracy = 70, streak = 0) {
  const key = GEMINI_API_KEY?.trim()
  if (!key || key === 'your_gemini_api_key_here') {
    return null // Fallback to static bank
  }

  const systemPrompt = `You are NeuralPath AI, an expert educational system that generates academic quiz questions.
You must respond ONLY with a valid JSON array of exactly 8 multiple-choice questions. Do not write any explanations, preamble, or postscript outside of the JSON.
The questions must be for high school/college students on the subject "${subject}".
Prioritize these weak topics if possible: ${weakTopics.join(', ') || 'any topics in ' + subject}.
The starting difficulty is "${difficulty}". Adjust the question difficulty dynamically (easy, medium, or hard) based on the student's accuracy of ${accuracy}% and streak of ${streak}.

Each question in the JSON array must follow this exact schema:
{
  "id": number,
  "subject": "${subject}",
  "topic": "string (the specific sub-topic name, e.g. Algebra)",
  "difficulty": "easy" | "medium" | "hard",
  "question": "string (the question text)",
  "options": ["string", "string", "string", "string"],
  "answer": "string (must match EXACTLY one of the 4 values in options)",
  "hint": "string (a helpful tip for the student)",
  "explanation": "string (detailed step-by-step resolution)"
}
`

  const contents = [
    { role: 'user', parts: [{ text: 'Generate the 8 MCQ questions JSON array now.' }] }
  ]

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${key}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json'
        }
      })
    })

    if (!res.ok) throw new Error(`Gemini HTTP error ${res.status}`)
    const data = await res.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) throw new Error('EMPTY_RESPONSE')

    const start = text.indexOf('[')
    const end = text.lastIndexOf(']')
    if (start === -1 || end === -1) throw new Error('NO_JSON_ARRAY_FOUND')

    const parsed = JSON.parse(text.slice(start, end + 1))
    if (Array.isArray(parsed) && parsed.length === 8) {
      return parsed.map((q, idx) => ({
        id: q.id || (2000 + idx),
        subject: q.subject || subject,
        topic: q.topic || 'General',
        difficulty: q.difficulty || difficulty,
        question: q.question || 'Academic question placeholder',
        options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
        answer: q.answer || (q.options ? q.options[0] : 'Option A'),
        hint: q.hint || 'Analyze the question details.',
        explanation: q.explanation || 'Step-by-step resolution details.'
      }))
    }
    throw new Error('INVALID_ARRAY_SIZE')
  } catch (err) {
    console.error('AI quiz generation failed on Gemini:', err)
    return null
  }
}

