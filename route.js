import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const PROMPT = `You are a senior LinkedIn content strategist briefing a mid-level ghostwriter on why a viral post works. Write in tight analytical prose. No fluff. No hedging.

HARD RULES:
- No em dashes anywhere in your output.
- No AI jargon (no "leverage", "optimize", "seamless", "robust", "revolutionize").
- Specific observations only. Numbers and concrete examples over vague claims.
- Use labeled sub-points in bold for each section like: **Hook type** followed by the explanation on the same line.
- Paragraphs not bullet lists.

Return EXACTLY these 5 section headers, nothing before or after.
For each section, format sub-points as **Label** followed by the explanation on the same line.

## 1. HOOK MECHANICS
**Hook type** [explanation]
**Emotional trigger** [explanation]
**Open loop** [explanation]
**Why it works** [explanation]
**What would kill it** [explanation]

## 2. NARRATIVE ARC
**Arc type** [explanation]
**Story beats** [explanation]
**Tension point** [explanation]
**Resolution** [explanation]

## 3. PACING AND RHYTHM
**Rhythm type** [explanation]
**Line break logic** [explanation]
**Sentence pattern** [explanation]

## 4. PSYCHOLOGICAL JOURNEY
**Emotional payoff** [explanation]
**Identity trigger** [explanation]

## 5. STEAL VS ADAPT
What to steal directly: [1-2 sentences]
What to adapt: [1-2 sentences]
What not to copy: [1-2 sentences]
3-sentence writer summary: [direct brief to ghostwriter on how to apply this]`

export async function POST(req) {
  const { post } = await req.json()

  if (!post) {
    return new Response(JSON.stringify({ error: 'Missing post' }), { status: 400 })
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const result = await model.generateContentStream(
    PROMPT + '\n\nAnalyse this LinkedIn post:\n\n' + post
  )

  const encoder = new TextEncoder()

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        const text = chunk.text()
        if (text) controller.enqueue(encoder.encode(text))
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  })
}
