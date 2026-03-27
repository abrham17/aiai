'use client';

import React, { useState, useRef, useEffect } from 'react';

interface PyodidePlaygroundProps {
  defaultCode?: string;
  height?: string;
}

declare global {
  interface Window {
    pyodide?: any;
  }
}

export default function PyodidePlayground({
  defaultCode = 'print("Hello, Python!")',
  height = 'h-96',
}: PyodidePlaygroundProps) {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const pyodideRef = useRef<any>(null);

  // Initialize Pyodide
  useEffect(() => {
    const initPyodide = async () => {
      try {
        if (!window.pyodide) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
          script.onload = async () => {
            const pyodide = await window.pyodide.loadPyodide();
            pyodideRef.current = pyodide;
            setLoading(false);
            setOutput('✓ Python environment ready. Write code and click "Run".');
          };
          document.head.appendChild(script);
        } else {
          pyodideRef.current = window.pyodide;
          setLoading(false);
          setOutput('✓ Python environment ready. Write code and click "Run".');
        }
      } catch (err: any) {
        setError(`Failed to load Pyodide: ${err.message}`);
        setLoading(false);
      }
    };

    initPyodide();
  }, []);

  const runCode = async () => {
    if (!pyodideRef.current) {
      setError('Python environment not ready. Please wait...');
      return;
    }

    if (!code.trim()) {
      setError('Please enter some Python code.');
      return;
    }

    setIsRunning(true);
    setError('');
    setOutput('Running...');

    try {
      // Capture print output
      const pythonCode = `
import sys
from io import StringIO
old_stdout = sys.stdout
sys.stdout = StringIO()

try:
    exec("""${code.replace(/"/g, '\\"').replace(/\n/g, '\\n')}""")
except Exception as e:
    print(f"Error: {e}")
finally:
    output = sys.stdout.getvalue()
    sys.stdout = old_stdout
    print(output, end='')
`;

      const result = await pyodideRef.current.runPythonAsync(pythonCode);
      setOutput(result || '(no output)');
    } catch (err: any) {
      setError(`Runtime Error: ${err.message}`);
      setOutput('');
    } finally {
      setIsRunning(false);
    }
  };

  const clearCode = () => {
    setCode('');
    setOutput('');
    setError('');
  };

  const insertExample = (example: string) => {
    setCode(example);
  };

  const examples = [
    { name: 'Variables', code: 'name = "Alice"\nage = 30\nprint(f"Name: {name}, Age: {age}")' },
    { name: 'List Comprehension', code: 'numbers = [1, 2, 3, 4, 5]\nsquares = [x**2 for x in numbers]\nprint(squares)' },
    { name: 'Function', code: 'def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Python"))' },
    { name: 'Loop', code: 'for i in range(5):\n    print(f"Iteration {i}")' },
    { name: 'Dictionary', code: 'student = {"name": "Bob", "grade": "A"}\nfor key, value in student.items():\n    print(f"{key}: {value}")' },
    { name: 'Class', code: 'class Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        return f"{self.name} says Woof!"\n\ndog = Dog("Buddy")\nprint(dog.bark())' },
  ];

  return (
    <div className="w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Python Playground</h3>
            <p className="text-xs text-slate-400">Run Python code in your browser with Pyodide</p>
          </div>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin">⏳</div>
              <span className="text-sm text-slate-400">Loading Python...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-green-400">Ready</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 p-6">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col gap-3">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
            Code Editor
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={loading}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none disabled:opacity-50"
            placeholder="Write your Python code here..."
            style={{ minHeight: '200px' }}
          />

          {/* Quick Examples */}
          <div>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2">
              Quick Examples
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {examples.map((ex) => (
                <button
                  key={ex.name}
                  onClick={() => insertExample(ex.code)}
                  disabled={loading || isRunning}
                  className="text-xs px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {ex.name}
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button
              onClick={runCode}
              disabled={loading || isRunning}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? '⏳ Running...' : '▶ Run Code'}
            </button>
            <button
              onClick={clearCode}
              disabled={loading || isRunning}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Output Console */}
        <div className="flex-1 flex flex-col gap-3">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
            Output
          </label>
          <div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-100 overflow-auto">
            {error && <div className="text-red-400 whitespace-pre-wrap">{error}</div>}
            {!error && output && (
              <div className="text-green-400 whitespace-pre-wrap">{output}</div>
            )}
            {!error && !output && !loading && (
              <div className="text-slate-500 italic">Output will appear here...</div>
            )}
            {loading && <div className="text-slate-400 animate-pulse">Initializing Python...</div>}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 border-t border-slate-700 px-6 py-3">
        <p className="text-xs text-slate-400">
          💡 Tip: Try list comprehensions, functions, loops, and more! Scroll right to see full output.
        </p>
      </div>
    </div>
  );
}
