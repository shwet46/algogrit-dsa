import { NextResponse } from 'next/server';
import axios from 'axios';

const MAX_RETRIES = 15; 
const POLLING_INTERVAL_MS = 1000; 
const STATUS_PROCESSING = 2;

interface ExecutionRequest {
  language_id: number;
  source_code: string; 
  stdin?: string; 
}

interface Judge0Status {
  id: number;
  description: string;
}

interface Judge0Submission {
  token: string;
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  time: string | null;
  memory: number | null;
  status: Judge0Status;
  language_id: number;
  source_code?: string;
}

export async function POST(request: Request) {
  try {
    const { language_id, source_code, stdin }: ExecutionRequest = await request.json();

    if (!language_id || !source_code) {
      return NextResponse.json(
        { error: 'Language ID and source code are required.' },
        { status: 400 }
      );
    }
    const apiHost = process.env.JUDGE0_API_HOST;
    const apiKey = process.env.JUDGE0_API_KEY;

    if (apiHost && apiKey) {
      const submissionResponse = await axios.post<{ token: string }>(
        `https://${apiHost}/submissions`,
        {
          language_id,
          source_code,
          stdin: stdin ?? '',
        },
        {
          params: { base64_encoded: 'false', wait: 'false' },
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Host': apiHost,
            'X-RapidAPI-Key': apiKey,
          },
        }
      );

      const token = submissionResponse.data.token;

      for (let i = 0; i < MAX_RETRIES; i++) {
        await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL_MS));
        const resultResponse = await axios.get<Judge0Submission>(
          `https://${apiHost}/submissions/${token}`,
          {
            params: { base64_encoded: 'false', fields: '*' },
            headers: {
              'X-RapidAPI-Host': apiHost,
              'X-RapidAPI-Key': apiKey,
            },
          }
        );

        const statusId = resultResponse.data.status.id;
        if (statusId > STATUS_PROCESSING) {
          return NextResponse.json(resultResponse.data, { status: 200 });
        }
      }

      return NextResponse.json(
        { error: `Execution timed out after ${MAX_RETRIES} seconds.` },
        { status: 408 }
      );
    }

    const baseURL = 'https://ce.judge0.com';
    const toBase64 = (s: string) => Buffer.from(s, 'utf-8').toString('base64');

    const ceResponse = await axios.post<Judge0Submission>(
      `${baseURL}/submissions?base64_encoded=true&wait=true`,
      {
        language_id,
        source_code: toBase64(source_code),
        stdin: toBase64(stdin ?? ''),
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    return NextResponse.json(ceResponse.data, { status: 200 });

  } catch (error: unknown) {
    let errorMessage = 'An unexpected error occurred.';
    let errorStatus = 500;

    if (axios.isAxiosError(error)) {
      console.error('Judge0 API Error:', error.response?.data || error.message);
      const data = error.response?.data as { error?: string; message?: string } | undefined;
      errorMessage = data?.error || data?.message || error.message;
      errorStatus = error.response?.status || 500;
    } else if (error && typeof error === 'object' && 'message' in error) {
      console.error('Generic Error:', (error as { message?: string }).message);
    } else {
      console.error('Unknown Error');
    }

    return NextResponse.json({ error: errorMessage }, { status: errorStatus });
  }
}