import { NextRequest, NextResponse } from 'next/server';
import { NlpManager } from 'node-nlp';
import { trainPairs } from '@/lib/assistantCorpus';

let nlpManager: NlpManager | null = null;

async function getLocalNlpManager() {
  if (nlpManager) return nlpManager;

  const manager = new NlpManager({ languages: ['en'], forceNER: true });
  for (const [q, a] of trainPairs) {
    manager.addDocument('en', q, 'dsa.answer');
    manager.addAnswer('en', 'dsa.answer', a);
  }
  await manager.train();

  nlpManager = manager;
  return manager;
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // ensure not running on edge

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    const callGemini = async (): Promise<string | null> => {
      const apiKey =
        process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('Gemini API key missing');
        return null;
      }

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `You are an expert programming assistant specializing in Data Structures and Algorithms (DSA) and general coding help. Provide clear, detailed explanations with code examples when relevant. Format code blocks properly with language identifiers.\n\nUser Question: ${message}`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
                topP: 0.95,
              },
            }),
          }
        );

        if (!response.ok) {
          const text = await response.text().catch(() => '');
          console.error('Gemini API error:', response.status, text);
          return null;
        }

        const data = await response.json().catch(() => null);
        type GeminiPart = { text?: string };
        const text: string | null =
          data?.candidates?.[0]?.content?.parts
            ?.map((p: GeminiPart) => (p?.text ? p.text : ''))
            .join('')
            .trim() || null;

        return text;
      } catch (err) {
        console.error('Gemini call failed:', err);
        return null;
      }
    };
    const callHuggingFace = async (): Promise<string | null> => {
      const hfKey =
        process.env.HUGGING_FACE_API_KEY ||
        process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY;
      if (!hfKey) {
        console.warn('Hugging Face API key missing');
        return null;
      }

      const model =
        process.env.HF_MODEL || 'mistralai/Mistral-7B-Instruct-v0.3';
      const prompt = `<s>[INST] You are an expert programming assistant specializing in Data Structures and Algorithms. Provide clear, detailed explanations with code examples.\n\nQuestion: ${message} [/INST]`;

      try {
        const res = await fetch(
          `https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${hfKey}`,
            },
            body: JSON.stringify({
              inputs: prompt,
              parameters: {
                max_new_tokens: 1024,
                temperature: 0.7,
                top_p: 0.95,
                return_full_text: false,
              },
            }),
          }
        );

        if (!res.ok) {
          const text = await res.text().catch(() => '');
          console.error('HF API error:', res.status, text);
          return null;
        }

        const data = await res.json().catch(() => null);
        if (!data) return null;

        if (Array.isArray(data) && data[0]?.generated_text)
          return data[0].generated_text.trim();

        if (data.generated_text) return data.generated_text.trim();
        if (data.summary_text) return data.summary_text.trim();

        console.warn('Unexpected HF response format:', data);
        return null;
      } catch (err) {
        console.error('HF call failed:', err);
        return null;
      }
    };
    console.log('→ Trying Gemini...');
    let reply = await callGemini();

    if (reply) return NextResponse.json({ reply });

    console.log('→ Gemini failed, trying Hugging Face...');
    reply = await callHuggingFace();

    if (reply) return NextResponse.json({ reply });

    console.log('→ Both external calls failed, using local NLP fallback...');
    const manager = await getLocalNlpManager();
    const result = await manager.process('en', message);
    const fallback =
      result.answer ||
      'I do not have a trained answer for that yet. Try rephrasing or ask about algorithms, complexity, graphs, DP, or data structures.';

    return NextResponse.json({
      reply: `${fallback}\n\n> (Local fallback model – external AI services unavailable)`,
      degraded: true,
    });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      {
        error: 'Failed to get response from AI assistant',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}