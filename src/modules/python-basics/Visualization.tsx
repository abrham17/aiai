'use client';

import React, { useState, useEffect } from 'react';

/* ═══════════════════════════════════════════════════════════════════
   Python Basics Visualization — Premium Interactive Syntax Lab
   ═══════════════════════════════════════════════════════════════════ */

interface PythonVizProps {
  mode?: string;
}

export default function PythonVisualization({ mode = 'code-highlight' }: PythonVizProps) {
  const [listData, setListData] = useState([1, 2, 3, 4, 5]);
  const [transform, setTransform] = useState('x * 2');
  const [loopStep, setLoopStep] = useState(0);
  const [scopeLevel, setScopeLevel] = useState('local');
  const [selectedCollection, setSelectedCollection] = useState('list');

  const output = React.useMemo(() => {
    try {
      const fn = new Function('x', `return ${transform}`);
      return listData.map(x => fn(x));
    } catch (e) {
      return [];
    }
  }, [listData, transform]);

  const renderComprehension = () => (
    <div className="flex flex-col gap-6 p-4">
      <div className="bg-slate-900 rounded-lg p-6 font-mono text-sm border border-slate-700 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-slate-400 ml-2 italic">interactive_python.py</span>
        </div>
        
        <div className="space-y-2">
          <p className="text-blue-400"># Input Data</p>
          <p className="text-pink-400">data = <span className="text-yellow-200">[{listData.join(', ')}]</span></p>
          
          <div className="mt-6 py-4 px-2 border-l-2 border-blue-500 bg-blue-500/5">
            <p className="text-blue-400"># The Comprehension</p>
            <div className="flex items-center gap-2 text-lg">
              <span className="text-slate-200">[</span>
              <input 
                value={transform}
                onChange={(e) => setTransform(e.target.value)}
                className="bg-slate-800 text-yellow-300 border-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1 w-32 outline-none font-bold"
              />
              <span className="text-pink-400">for</span>
              <span className="text-yellow-200">x</span>
              <span className="text-pink-400">in</span>
              <span className="text-slate-200">data]</span>
            </div>
          </div>

          <div className="mt-6 space-y-1">
            <p className="text-green-400">{">>>"} Output</p>
            <p className="text-yellow-100 text-lg font-bold">
              [{output.join(', ')}]
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-blue-500 transition-colors cursor-pointer group"
          onClick={() => setTransform('x**2')}>
          <p className="text-xs text-slate-400 mb-1 group-hover:text-blue-400 transition-colors uppercase tracking-widest">Preset 1</p>
          <code className="text-yellow-200 group-hover:text-white transition-colors">x**2 (Square)</code>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-blue-500 transition-colors cursor-pointer group"
          onClick={() => setTransform('x + 10')}>
          <p className="text-xs text-slate-400 mb-1 group-hover:text-blue-400 transition-colors uppercase tracking-widest">Preset 2</p>
          <code className="text-yellow-200 group-hover:text-white transition-colors">x + 10 (Add)</code>
        </div>
      </div>
    </div>
  );

  const renderVariablesTypes = () => (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors">
          <p className="text-xs text-slate-400 mb-2">String</p>
          <code className="text-yellow-300 text-lg">name = "Alice"</code>
          <p className="text-slate-400 text-sm mt-2">text data</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 hover:border-green-500 transition-colors">
          <p className="text-xs text-slate-400 mb-2">Integer</p>
          <code className="text-yellow-300 text-lg">age = 30</code>
          <p className="text-slate-400 text-sm mt-2">whole numbers</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 hover:border-purple-500 transition-colors">
          <p className="text-xs text-slate-400 mb-2">Float</p>
          <code className="text-yellow-300 text-lg">pi = 3.14</code>
          <p className="text-slate-400 text-sm mt-2">decimal numbers</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 hover:border-pink-500 transition-colors">
          <p className="text-xs text-slate-400 mb-2">Boolean</p>
          <code className="text-yellow-300 text-lg">is_ready = True</code>
          <p className="text-slate-400 text-sm mt-2">True or False</p>
        </div>
      </div>
      <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
        <p className="text-blue-400 text-sm mb-2 font-mono">type() function:</p>
        <p className="text-slate-300 font-mono text-sm">type(age)  {'→'} &lt;class 'int'&gt;</p>
        <p className="text-slate-300 font-mono text-sm">type(pi)   {'→'} &lt;class 'float'&gt;</p>
      </div>
    </div>
  );

  const renderControlFlow = () => (
    <div className="flex flex-col gap-6 p-6 w-full overflow-auto max-h-96">
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <p className="text-blue-400 mb-3 font-bold">Loop Iteration Visualization</p>
          <p className="text-slate-400 text-xs mb-3 font-mono">Current iteration: <span className="text-green-400 font-bold">{loopStep % 5}</span></p>
          <div className="flex gap-2 flex-wrap">
            {[0, 1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                role="status"
                aria-label={i === loopStep % 5 ? `Current iteration ${i}` : `Iteration ${i}`}
                className={`w-12 h-12 flex items-center justify-center rounded font-bold transition-all ${
                  i === loopStep % 5
                    ? 'bg-green-500 text-white scale-110 ring-2 ring-green-300'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {i}
              </div>
            ))}
          </div>
          <p className="text-slate-400 text-sm mt-3 font-mono">for i in range(5):</p>
        </div>
        <button
          onClick={() => setLoopStep(s => s + 1)}
          className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium transition-colors"
          aria-label={`Step through loop: current iteration ${loopStep % 5}`}
        >
          → Step Through Loop
        </button>
      </div>
      <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
        <p className="text-slate-300 font-mono text-sm">
          {`if x > 5:`} <span className="text-green-400">do_something()</span>
        </p>
        <p className="text-slate-300 font-mono text-sm">
          {`elif x == 5:`} <span className="text-yellow-400">do_middle()</span>
        </p>
        <p className="text-slate-300 font-mono text-sm">
          {`else:`} <span className="text-red-400">do_else()</span>
        </p>
      </div>
    </div>
  );

  const renderFunctionsScope = () => (
    <div className="flex flex-col gap-6 p-6 w-full overflow-auto max-h-96">
      <div className="space-y-4">
        <fieldset>
          <legend className="text-slate-300 text-sm font-bold mb-3">Select Scope Level:</legend>
          <div className="space-y-2">
            <button
              onClick={() => setScopeLevel('local')}
              className={`w-full px-4 py-3 rounded text-sm transition-all text-left ${
                scopeLevel === 'local'
                  ? 'bg-blue-600 text-white border border-blue-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
              aria-pressed={scopeLevel === 'local'}
            >
              <span className="font-semibold">Local Scope</span> - Inside current function
            </button>
            <button
              onClick={() => setScopeLevel('global')}
              className={`w-full px-4 py-3 rounded text-sm transition-all text-left ${
                scopeLevel === 'global'
                  ? 'bg-pink-600 text-white border border-pink-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
              aria-pressed={scopeLevel === 'global'}
            >
              <span className="font-semibold">Global Scope</span> - At module level
            </button>
            <button
              onClick={() => setScopeLevel('nonlocal')}
              className={`w-full px-4 py-3 rounded text-sm transition-all text-left ${
                scopeLevel === 'nonlocal'
                  ? 'bg-purple-600 text-white border border-purple-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
              aria-pressed={scopeLevel === 'nonlocal'}
            >
              <span className="font-semibold">Nonlocal Scope</span> - In enclosing function
            </button>
          </div>
        </fieldset>
      </div>
      <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
        <p className="text-slate-300 font-mono text-sm mb-3">LEGB Resolution Order:</p>
        <ol className="space-y-1 text-sm">
          <li className="text-blue-400">1. <strong>Local</strong> - Inside current function</li>
          <li className="text-green-400">2. <strong>Enclosing</strong> - In enclosing function</li>
          <li className="text-yellow-400">3. <strong>Global</strong> - In module/script</li>
          <li className="text-purple-400">4. <strong>Built-in</strong> - Python built-ins</li>
        </ol>
      </div>
    </div>
  );

  const renderCollections = () => (
    <div className="flex flex-col gap-6 p-6 w-full overflow-auto max-h-96">
      <fieldset>
        <legend className="text-slate-300 text-sm font-bold mb-3">Select Collection Type:</legend>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedCollection('list')}
            className={`p-4 rounded text-sm transition-all font-semibold ${
              selectedCollection === 'list'
                ? 'bg-blue-600 text-white border-2 border-blue-300'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-blue-500'
            }`}
            aria-pressed={selectedCollection === 'list'}
            aria-describedby="list-desc"
          >
            List []
          </button>
          <button
            onClick={() => setSelectedCollection('dict')}
            className={`p-4 rounded text-sm transition-all font-semibold ${
              selectedCollection === 'dict'
                ? 'bg-green-600 text-white border-2 border-green-300'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-green-500'
            }`}
            aria-pressed={selectedCollection === 'dict'}
            aria-describedby="dict-desc"
          >
            Dict {}
          </button>
          <button
            onClick={() => setSelectedCollection('tuple')}
            className={`p-4 rounded text-sm transition-all font-semibold ${
              selectedCollection === 'tuple'
                ? 'bg-purple-600 text-white border-2 border-purple-300'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-purple-500'
            }`}
            aria-pressed={selectedCollection === 'tuple'}
            aria-describedby="tuple-desc"
          >
            Tuple ()
          </button>
          <button
            onClick={() => setSelectedCollection('set')}
            className={`p-4 rounded text-sm transition-all font-semibold ${
              selectedCollection === 'set'
                ? 'bg-pink-600 text-white border-2 border-pink-300'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-pink-500'
            }`}
            aria-pressed={selectedCollection === 'set'}
            aria-describedby="set-desc"
          >
            Set {}
          </button>
        </div>
      </fieldset>
      <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
        {selectedCollection === 'list' && (
          <>
            <p className="text-blue-400 font-mono mb-2">Ordered, Mutable</p>
            <code className="text-slate-300 text-sm">names = ["Alice", "Bob", "Charlie"]</code>
            <p className="text-slate-400 text-xs mt-2">names[0] = "Alice"  (Indexable)</p>
          </>
        )}
        {selectedCollection === 'dict' && (
          <>
            <p className="text-green-400 font-mono mb-2">Key-Value Pairs, Mutable</p>
            <code className="text-slate-300 text-sm">ages = {"{"}"Alice": 30, "Bob": 25{"}"}</code>
            <p className="text-slate-400 text-xs mt-2">ages["Alice"] = 30  (Fast lookup)</p>
          </>
        )}
        {selectedCollection === 'tuple' && (
          <>
            <p className="text-purple-400 font-mono mb-2">Ordered, Immutable</p>
            <code className="text-slate-300 text-sm">point = (10, 20)</code>
            <p className="text-slate-400 text-xs mt-2">point[0] = 10  (Hashable, can be dict key)</p>
          </>
        )}
        {selectedCollection === 'set' && (
          <>
            <p className="text-pink-400 font-mono mb-2">Unique Items, Unordered</p>
            <code className="text-slate-300 text-sm">unique = {"{"}1, 2, 3, 2{"}"}</code>
            <p className="text-slate-400 text-xs mt-2">unique = {"{"}1, 2, 3{"}"}  (Duplicates removed)</p>
          </>
        )}
      </div>
    </div>
  );

  const renderFileStrings = () => (
    <div className="flex flex-col gap-6 p-6">
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <p className="text-blue-400 mb-2 font-mono text-sm">F-String Formatting:</p>
          <code className="text-slate-300 text-sm block">
            name = "Alice"<br />
            age = 30<br />
            print(f"Hello, {"{name}"}, age {"{age}"}")
          </code>
          <p className="text-green-400 text-sm mt-2">{'→'} Hello, Alice, age 30</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <p className="text-purple-400 mb-2 font-mono text-sm">File Operations:</p>
          <code className="text-slate-300 text-sm block">
            with open("data.txt", "r") as f:<br />
            &nbsp;&nbsp;content = f.read()
          </code>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <p className="text-yellow-400 mb-2 font-mono text-sm">String Methods:</p>
          <code className="text-slate-300 text-sm block">
            text = "hello world"<br />
            text.upper() {'→'} "HELLO WORLD"<br />
            text.split() {'→'} ["hello", "world"]
          </code>
        </div>
      </div>
    </div>
  );

  const renderClassDiagram = () => (
    <div className="flex justify-center items-center h-[400px]">
      <svg width="450" height="350" viewBox="0 0 450 350">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--slate-400)" />
          </marker>
        </defs>

        {/* Base Class */}
        <rect x="150" y="20" width="150" height="80" rx="4" fill="var(--slate-800)" stroke="var(--slate-600)" />
        <text x="225" y="45" textAnchor="middle" fill="white" fontWeight="bold">nn.Module</text>
        <line x1="150" y1="55" x2="300" y2="55" stroke="var(--slate-700)" />
        <text x="160" y="72" fill="var(--slate-400)" fontSize="10">__init__()</text>
        <text x="160" y="88" fill="var(--slate-400)" fontSize="10">forward()</text>

        {/* Inherited Class */}
        <path d="M 225 140 L 225 105" stroke="var(--slate-600)" strokeWidth="2" markerEnd="url(#arrow)" />
        
        <rect x="125" y="150" width="200" height="120" rx="4" fill="var(--blue-500)" fillOpacity="0.1" stroke="var(--blue-500)" />
        <text x="225" y="175" textAnchor="middle" fill="white" fontWeight="bold">TransformerModel</text>
        <line x1="125" y1="185" x2="325" y2="185" stroke="var(--blue-500)" strokeWidth="2" />
        <text x="140" y="205" fill="var(--blue-200)" fontSize="12">def __init__(self):</text>
        <text x="155" y="225" fill="var(--blue-100)" fontSize="12">super().__init__()</text>
        <text x="140" y="250" fill="var(--blue-200)" fontSize="12">def forward(self, x):</text>

        <circle cx="340" cy="160" r="15" fill="var(--yellow-500)" opacity="0.8">
          <animate attributeName="r" values="15;18;15" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x="365" y="165" fill="var(--yellow-200)" fontSize="10">Subclassing Pattern</text>
      </svg>
    </div>
  );

  return (
    <div className="w-full h-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center p-8">
      {mode === 'variables-types' && renderVariablesTypes()}
      {mode === 'control-flow' && renderControlFlow()}
      {mode === 'functions-scope' && renderFunctionsScope()}
      {mode === 'collections' && renderCollections()}
      {mode === 'interactive-comprehension' && renderComprehension()}
      {mode === 'file-strings' && renderFileStrings()}
      {mode === 'class-diagram' && renderClassDiagram()}
      {mode !== 'variables-types' && mode !== 'control-flow' && mode !== 'functions-scope' && 
       mode !== 'collections' && mode !== 'interactive-comprehension' && mode !== 'file-strings' && 
       mode !== 'class-diagram' && (
        <div className="text-center">
            <div className="w-24 h-24 mb-6 mx-auto rounded-3xl bg-blue-500/20 flex items-center justify-center border border-blue-500 animate-pulse">
                <span className="text-4xl text-blue-400">🐍</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Python for AI</h3>
            <p className="text-slate-400 max-w-sm">
                Interactive syntax lab. Select a step to begin exploring foundational Python features.
            </p>
        </div>
      )}
    </div>
  );
}
