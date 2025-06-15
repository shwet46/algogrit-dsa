"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Play,
  Loader2,
  Copy,
  CheckCheck,
  Terminal,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { executeCode } from "../lib/api";

interface RunResult {
  stdout?: string;
  stderr?: string;
  output?: string;
}

interface ExecutionResponse {
  run: RunResult;
}
interface EditorRef {
  getValue: () => string;
}

interface OutputProps {
  editorRef: React.MutableRefObject<EditorRef | null>;
  language: string;
}

const Output: React.FC<OutputProps> = ({ editorRef, language }) => {
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const runCode = async () => {
    if (!editorRef.current) return;

    setIsExecuting(true);
    setError(null);
    setOutput("");
    setExecutionTime(null);

    const startTime = performance.now();
    const sourceCode = editorRef.current.getValue();

    try {
      const result: ExecutionResponse = await executeCode(language, sourceCode);
      const endTime = performance.now();
      setExecutionTime(Math.round((endTime - startTime) * 100) / 100);

      if (result.run.stderr) {
        setError(result.run.stderr);
      } else {
        let outputText = result.run.stdout || "";
        if (result.run.output && result.run.output !== outputText) {
          outputText += result.run.output;
        }
        setOutput(outputText || "Code executed successfully with no output");
      }
    } catch (err) {
      let errorMessage = "An error occurred while executing the code";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof err.response === "object" &&
        err.response !== null &&
        "data" in err.response &&
        typeof err.response.data === "object" &&
        err.response.data !== null &&
        "message" in err.response.data
      ) {
        errorMessage = String((err.response.data as { message: string }).message);
      }
      setError(errorMessage);
    } finally {
      setIsExecuting(false);
    }
  };

  const copyToClipboard = () => {
    const contentToCopy = error || output;
    if (contentToCopy) {
      navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasContent = output || error;
  const getStatusColor = () => {
    if (error) return "text-red-500";
    if (output) return "text-green-500";
    return "text-muted-foreground";
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2 rounded-t-md bg-muted/30 border-b">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <Terminal className={cn("h-4 w-4 mr-2", getStatusColor())} />
            <div className="font-medium">
              Console
              {error && (
                <Badge variant="destructive" className="ml-2 text-xs py-0 px-1.5">
                  Error
                </Badge>
              )}
              {output && !error && executionTime !== null && (
                <Badge
                  variant="outline"
                  className="ml-2 text-xs py-0 px-1.5 bg-green-500/10 text-green-700 border-green-200"
                >
                  Success
                </Badge>
              )}
            </div>
          </div>

          {executionTime !== null && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {executionTime}ms
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Execution time</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasContent && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="h-8"
                  >
                    {copied ? (
                      <>
                        <CheckCheck className="h-4 w-4 mr-1" />
                        <span className="text-xs">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        <span className="text-xs">Copy</span>
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Copy output to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={runCode}
                  disabled={isExecuting}
                  size="sm"
                  className={cn(
                    "h-8 font-medium",
                    !isExecuting && "bg-green-600 hover:bg-green-700"
                  )}
                >
                  {isExecuting ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Running
                    </>
                  ) : (
                    <>
                      <Play className="mr-1.5 h-3.5 w-3.5 fill-current" />
                      Run Code
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Execute code in {language}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Output Display */}
      <Card className="flex-1 overflow-hidden flex flex-col border-t-0 rounded-t-none shadow-sm">
        <ScrollArea className="flex-1">
          {error ? (
            <Alert
              variant="destructive"
              className="m-3 border rounded-md bg-red-50 dark:bg-red-950/30"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-sm font-semibold">Error</AlertTitle>
              <AlertDescription className="font-mono text-xs whitespace-pre-wrap mt-2 max-h-80 overflow-auto">
                {error}
              </AlertDescription>
            </Alert>
          ) : output ? (
            <div className="p-4">
              <pre className="font-mono text-sm whitespace-pre-wrap rounded-md bg-muted/30 p-4 overflow-auto">
                {output}
              </pre>
            </div>
          ) : (
            <div className="text-muted-foreground flex flex-col items-center justify-center h-full p-8 text-center">
              <Terminal className="h-12 w-12 mb-3 opacity-20" />
              <p className="font-medium mb-1">No output to display</p>
              <span className="text-xs opacity-70">
                Run your code to see the results here
              </span>
            </div>
          )}
        </ScrollArea>
      </Card>
    </div>
  );
};

export default Output;