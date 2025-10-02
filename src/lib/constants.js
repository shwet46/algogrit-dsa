export const CODE_SNIPPETS = {
  assembly: `section .data
    hello db 'Hello, world!',10
section .text
    global _start
_start:
    mov rax, 1
    mov rdi, 1
    mov rsi, hello
    mov rdx, 14
    syscall
    mov rax, 60
    xor rdi, rdi
    syscall`,
  bash: `#!/bin/bash
echo "Hello, world!"`,
  c: `#include <stdio.h>

int main() {
    printf("Hello, world!\\n");
    return 0;
}`,
  cpp: `#include <iostream>

int main() {
    std::cout << "Hello, world!" << std::endl;
    return 0;
}`,
  csharp: `using System;

public class Program
{
    public static void Main()
    {
        Console.WriteLine("Hello, world!");
    }
}`,
  cobol: `IDENTIFICATION DIVISION.
PROGRAM-ID. HELLO-WORLD.
PROCEDURE DIVISION.
    DISPLAY 'Hello, world!'.
    STOP RUN.`,
  elixir: `IO.puts("Hello, world!")`,
  erlang: `main(_) ->
    io:fwrite("Hello, world!\\n").`,
  fortran: `program hello
  print *, "Hello, world!"
end program hello`,
  go: `package main

import "fmt"

func main() {
    fmt.Println("Hello, world!")
}`,
  haskell: `main :: IO ()
main = putStrLn "Hello, world!"`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}`,
  javascript: `console.log("Hello, world!");`,
  kotlin: `fun main() {
    println("Hello, world!")
}`,
  lisp: `(print "Hello, world!")`,
  lua: `print("Hello, world!")`,
  ocaml: `print_endline "Hello, world!"`,
  pascal: `program HelloWorld;
begin
  writeln('Hello, world!');
end.`,
  perl: `use strict;
use warnings;
print "Hello, world!\\n";`,
  php: `<?php
echo "Hello, world!\\n";
?>`,
  powershell: `Write-Host "Hello, world!"`,
  prolog: `:- initialization(main).
main :- write('Hello, world!'), nl.`,
  python: `print("Hello, world!")`,
  ruby: `puts "Hello, world!"`,
  rust: `fn main() {
    println!("Hello, world!");
}`,
  scala: `object Main extends App {
  println("Hello, world!")
}`,
  sql: `SELECT 'Hello, world!';`,
  swift: `print("Hello, world!")`,
  typescript: `function greet(name: string): string {
    return \`Hello, \${name}!\`;
}
console.log(greet("TypeScript"));`,
};

// CODE_SNIPPETS.
export const LANGUAGE_IDS = {
  assembly: 45, // Assembly (NASM 2.14.02)
  bash: 46, // Bash (5.0.0)
  c: 50, // C (GCC 9.2.0)
  cpp: 54, // C++ (GCC 9.2.0)
  csharp: 51, // C# (Mono 6.6.0.161)
  elixir: 57, // Elixir (1.9.4)
  erlang: 58, // Erlang (OTP 22.2)
  fortran: 59, // Fortran (GFortran 9.2.0)
  go: 60, // Go (1.13.5)
  haskell: 61, // Haskell (GHC 8.8.1)
  java: 62, // Java (OpenJDK 13.0.1)
  javascript: 63, // JavaScript (Node.js 12.14.0)
  lua: 64, // Lua (5.3.5)
  ocaml: 65, // OCaml (4.09.0)
  pascal: 67, // Pascal (FPC 3.0.4)
  php: 68, // PHP (7.4.1)
  prolog: 69, // Prolog (GNU Prolog 1.4.5)
  python: 71, // Python (3.8.1)
  ruby: 72, // Ruby (2.7.0)
  rust: 73, // Rust (1.40.0)
  typescript: 74, // TypeScript (3.7.4)
  lisp: 55, // Common Lisp (SBCL 2.0.0)
};