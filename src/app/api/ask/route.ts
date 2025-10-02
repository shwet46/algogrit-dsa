import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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
        console.log('Gemini API key not found');
        return null;
      }

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `You are an expert programming assistant specializing in Data Structures and Algorithms (DSA) and general coding help. Provide clear, detailed explanations with code examples when relevant. Format code blocks properly with language identifiers.

User Question: ${message}`,
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
          const errText = await response.text().catch(() => '');
          console.error(
            `Gemini API error: ${response.status} ${response.statusText}`,
            errText
          );
          return null;
        }

        const data = await response.json();
        
        const candidates = data?.candidates;
        if (!candidates || !Array.isArray(candidates) || candidates.length === 0) {
          console.error('No candidates in Gemini response');
          return null;
        }

        const parts = candidates[0]?.content?.parts;
        if (!parts || !Array.isArray(parts) || parts.length === 0) {
          console.error('No parts in Gemini response');
          return null;
        }

        const botReply = parts
          .map((p: { text?: string }) => p?.text || '')
          .join('')
          .trim();

        return botReply || null;
      } catch (error) {
        console.error('Gemini API call failed:', error);
        return null;
      }
    };

    const callHuggingFace = async (): Promise<string | null> => {
      const hfKey =
        process.env.HUGGING_FACE_API_KEY ||
        process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY;
      
      if (!hfKey) {
        console.log('Hugging Face API key not found');
        return null;
      }

      const model =
        process.env.HF_MODEL || 'mistralai/Mistral-7B-Instruct-v0.3';

      const prompt = `<s>[INST] You are an expert programming assistant specializing in Data Structures and Algorithms. Provide clear, detailed explanations with code examples.

Question: ${message} [/INST]`;

      try {
        const hfRes = await fetch(
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

        if (!hfRes.ok) {
          const errText = await hfRes.text().catch(() => '');
          console.error(
            `Hugging Face API error: ${hfRes.status} ${hfRes.statusText}`,
            errText
          );
          return null;
        }

        const hfData = await hfRes.json();

        const extractText = (obj: unknown): string | null => {
          if (obj && typeof obj === 'object') {
            const rec = obj as Record<string, unknown>;
            const gt = rec.generated_text;
            const st = rec.summary_text;
            if (typeof gt === 'string' && gt.trim()) return gt.trim();
            if (typeof st === 'string' && st.trim()) return st.trim();
          }
          return null;
        };

        if (Array.isArray(hfData) && hfData.length > 0) {
          const t = extractText(hfData[0]);
          if (t) return t;
        }

        const objText = extractText(hfData);
        if (objText) return objText;

        if (hfData && typeof hfData === 'object' && 'error' in hfData) {
          const errVal = (hfData as { error?: unknown }).error;
          console.error('Hugging Face error:', errVal);
          return null;
        }

        console.error('Unexpected Hugging Face response format:', hfData);
        return null;
      } catch (error) {
        console.error('Hugging Face API call failed:', error);
        return null;
      }
    };

    let botReply: string | null = null;

    console.log('Attempting to use Gemini API...');
    botReply = await callGemini();
    
    if (botReply) {
      console.log('Gemini responded successfully');
      return NextResponse.json({ reply: botReply });
    }

    console.log('Gemini failed, attempting Hugging Face fallback...');
    botReply = await callHuggingFace();
    
    if (botReply) {
      console.log('Hugging Face responded successfully');
      return NextResponse.json({ reply: botReply });
    }

    console.error('Both AI services failed to respond');
    return NextResponse.json(
      {
        reply: "I'm having trouble connecting to the AI services right now. Please check that your API keys are properly configured in your environment variables (GEMINI_API_KEY or HUGGING_FACE_API_KEY) and try again.",
      },
      { status: 503 }
    );
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      {
        error: 'Failed to get response from AI assistant',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}