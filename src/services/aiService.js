// ─────────────────────────────────────────────────────────────────────────────
// AI SERVICE LAYER — Gemini API with model fallback chain
// Fix: use v1 API + try multiple model names for compatibility
// ─────────────────────────────────────────────────────────────────────────────

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

// Use v1 (stable) instead of v1beta — broader model support
const GEMINI_BASE_V1 = 'https://generativelanguage.googleapis.com/v1/models'
const GEMINI_BASE_V1BETA = 'https://generativelanguage.googleapis.com/v1beta/models'
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

// Model fallback chain — tries each until one works
const GEMINI_MODEL_CHAIN = [
  { model: 'gemini-1.5-flash-latest', base: GEMINI_BASE_V1BETA },
  { model: 'gemini-1.5-flash',        base: GEMINI_BASE_V1BETA },
  { model: 'gemini-1.5-flash-001',    base: GEMINI_BASE_V1BETA },
  { model: 'gemini-pro',              base: GEMINI_BASE_V1 },
  { model: 'gemini-1.0-pro',          base: GEMINI_BASE_V1 },
  { model: 'gemini-1.0-pro-latest',   base: GEMINI_BASE_V1 },
]

// ─── System prompt ────────────────────────────────────────────────────────────
function buildSystemPrompt(subjectId, subjectLabel) {
  return `You are NeuralPath AI, an expert educational assistant specializing in ${subjectLabel}. You are part of an AI-powered educational platform similar to Khan Academy and ChatGPT.

Your role:
- Answer ANY academic question clearly and thoroughly
- Provide step-by-step explanations for problems
- Show formulas and equations using plain text notation
- Give real-world examples to aid understanding
- Support follow-up questions with full context awareness
- Adapt explanation depth to the question complexity

Subject focus: ${subjectLabel}
Related subjects you also cover: Mathematics, Physics, Chemistry, Biology, English Grammar

Formatting rules:
- Use ## for main headings, ### for subheadings
- Use **bold** for key terms and important values
- Use bullet points (- ) for lists
- Use numbered lists (1. 2. 3.) for steps
- Present formulas clearly: E = mc², F = ma, etc.
- Use tables with | for comparisons when helpful
- Keep responses educational, accurate, and engaging
- Never refuse an academic question
- If unsure, provide the best educational explanation possible

You are NOT a coding assistant. Focus purely on academic education.`
}

// ─── Build Gemini request body ────────────────────────────────────────────────
function buildGeminiBody(messages, systemPrompt, streaming = false) {
  const contents = messages
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }))

  return {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH',        threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',  threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT',  threshold: 'BLOCK_NONE' },
    ],
  }
}

// ─── Single Gemini model attempt ──────────────────────────────────────────────
async function tryGeminiModel(modelEntry, messages, systemPrompt) {
  const { model, base } = modelEntry
  const key = GEMINI_API_KEY.trim()
  const url = `${base}/${model}:generateContent?key=${key}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildGeminiBody(messages, systemPrompt)),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = err?.error?.message || `HTTP ${res.status}`

    // 400 with "not found" / "not supported" → try next model
    if (res.status === 400 && (msg.includes('not found') || msg.includes('not supported') || msg.includes('ListModels'))) {
      throw new Error('MODEL_NOT_FOUND')
    }
    if (res.status === 403 || msg.includes('API_KEY_INVALID')) throw new Error('API_KEY_INVALID')
    if (res.status === 429) throw new Error('RATE_LIMIT')
    throw new Error(`API_ERROR: ${msg}`)
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('API_ERROR: Empty response from Gemini')
  return { text, model }
}

// ─── Gemini with model fallback chain ────────────────────────────────────────
async function callGemini(messages, subjectId, subjectLabel) {
  const key = GEMINI_API_KEY?.trim()
  if (!key || key === 'your_gemini_api_key_here') throw new Error('NO_API_KEY')

  const systemPrompt = buildSystemPrompt(subjectId, subjectLabel)
  let lastError = null

  for (const modelEntry of GEMINI_MODEL_CHAIN) {
    try {
      const result = await tryGeminiModel(modelEntry, messages, systemPrompt)
      // Cache working model in sessionStorage so next calls skip the chain
      sessionStorage.setItem('gemini_working_model', JSON.stringify(modelEntry))
      return result.text
    } catch (err) {
      if (err.message === 'MODEL_NOT_FOUND') {
        lastError = err
        continue // try next model
      }
      throw err // real error — propagate immediately
    }
  }

  throw new Error(`API_ERROR: No compatible Gemini model found. ${lastError?.message || ''}`)
}

// ─── OpenAI fallback ──────────────────────────────────────────────────────────
async function callOpenAI(messages, subjectId, subjectLabel) {
  const key = OPENAI_API_KEY?.trim()
  if (!key || key === 'your_openai_api_key_here') throw new Error('NO_API_KEY')

  const systemPrompt = buildSystemPrompt(subjectId, subjectLabel)
  const formatted = [
    { role: 'system', content: systemPrompt },
    ...messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({ role: m.role, content: m.content })),
  ]

  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: formatted, max_tokens: 1024, temperature: 0.7 }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    if (res.status === 401) throw new Error('API_KEY_INVALID')
    if (res.status === 429) throw new Error('RATE_LIMIT')
    throw new Error(`API_ERROR: ${err?.error?.message || `HTTP ${res.status}`}`)
  }

  const data = await res.json()
  return data?.choices?.[0]?.message?.content || ''
}

// ─── Main exported function ───────────────────────────────────────────────────
export async function getAIResponse(messages, subjectId, subjectLabel, retryCount = 0) {
  // Try Gemini first
  try {
    return await callGemini(messages, subjectId, subjectLabel)
  } catch (err) {
    if (err.message === 'NO_API_KEY') {
      // No Gemini key → try OpenAI
      try {
        return await callOpenAI(messages, subjectId, subjectLabel)
      } catch (oaiErr) {
        if (oaiErr.message === 'NO_API_KEY') throw new Error('NO_KEY_CONFIGURED')
        throw oaiErr
      }
    }

    if (err.message === 'RATE_LIMIT' && retryCount < 2) {
      await new Promise(r => setTimeout(r, 1500 * (retryCount + 1)))
      return getAIResponse(messages, subjectId, subjectLabel, retryCount + 1)
    }

    throw err
  }
}

// ─── Streaming with model fallback ───────────────────────────────────────────
export async function streamGeminiResponse(messages, subjectId, subjectLabel, onChunk, onDone, onError) {
  const key = GEMINI_API_KEY?.trim()
  if (!key || key === 'your_gemini_api_key_here') {
    onError('NO_KEY_CONFIGURED')
    return
  }

  const systemPrompt = buildSystemPrompt(subjectId, subjectLabel)

  // Check if we have a cached working model
  let modelChain = [...GEMINI_MODEL_CHAIN]
  try {
    const cached = sessionStorage.getItem('gemini_working_model')
    if (cached) {
      const cachedModel = JSON.parse(cached)
      // Put cached model first
      modelChain = [cachedModel, ...GEMINI_MODEL_CHAIN.filter(m => m.model !== cachedModel.model)]
    }
  } catch { /* ignore */ }

  // Try each model for streaming
  for (const { model, base } of modelChain) {
    const url = `${base}/${model}:streamGenerateContent?key=${key}&alt=sse`

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildGeminiBody(messages, systemPrompt, true)),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        const msg = err?.error?.message || ''
        if (res.status === 400 && (msg.includes('not found') || msg.includes('not supported') || msg.includes('ListModels'))) {
          continue // try next model
        }
        if (res.status === 403) { onError('API_KEY_INVALID'); return }
        if (res.status === 429) { onError('RATE_LIMIT'); return }
        onError(`API_ERROR: ${msg}`)
        return
      }

      // Cache working model
      sessionStorage.setItem('gemini_working_model', JSON.stringify({ model, base }))

      // Stream the response
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))

        for (const line of lines) {
          if (line === 'data: [DONE]') continue
          try {
            const json = JSON.parse(line.slice(6))
            const text = json?.candidates?.[0]?.content?.parts?.[0]?.text
            if (text) {
              fullText += text
              onChunk(text, fullText)
            }
          } catch { /* ignore malformed chunks */ }
        }
      }

      onDone(fullText || 'I was unable to generate a response. Please try again.')
      return

    } catch (err) {
      if (err.message?.includes('not found') || err.message?.includes('not supported')) {
        continue // try next model
      }
      onError(`API_ERROR: ${err.message}`)
      return
    }
  }

  // All models failed — fall back to non-streaming
  try {
    const response = await getAIResponse(messages, subjectId, subjectLabel)
    onDone(response)
  } catch (err) {
    onError(err.message)
  }
}

// ─── Utilities ────────────────────────────────────────────────────────────────
export function hasApiKey() {
  const gemini = GEMINI_API_KEY?.trim()
  const openai = OPENAI_API_KEY?.trim()
  return (gemini && gemini !== 'your_gemini_api_key_here') ||
         (openai && openai !== 'your_openai_api_key_here')
}

export function getConfiguredProvider() {
  const gemini = GEMINI_API_KEY?.trim()
  const openai = OPENAI_API_KEY?.trim()
  if (gemini && gemini !== 'your_gemini_api_key_here') return 'Gemini'
  if (openai && openai !== 'your_openai_api_key_here') return 'OpenAI'
  return null
}
