'use client';

import React, { useState, useEffect } from 'react';

/* ═══════════════════════════════════════════════════════════════════
   PyTorch Essentials Visualization — Computation Graph Explorer
   ═══════════════════════════════════════════════════════════════════ */

interface PyTorchVizProps {
  mode?: string;
}

export default function PyTorchVisualization({ mode = 'tensor-viz' }: PyTorchVizProps) {
  const [pulse, setPulse] = useState(0);
  const [tensorShape, setTensorShape] = useState('2x3');
  const [batchSize, setBatchSize] = useState(32);
  const [lossValue, setLossValue] = useState(2.5);
  const [selectedLoss, setSelectedLoss] = useState('mse');

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => (p + 1) % 100), 50);
    return () => clearInterval(interval);
  }, []);

  const renderComputationGraph = () => (
    <div className="flex justify-center items-center h-[400px]">
      <svg width="500" height="350" viewBox="0 0 500 350">
        <defs>
          <marker id="ptr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--slate-500)" />
          </marker>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Inputs */}
        <g className="cursor-pointer group">
            <rect x="50" y="150" width="80" height="40" rx="8" fill="var(--slate-800)" stroke="var(--slate-600)" strokeWidth="2" />
            <text x="90" y="175" textAnchor="middle" fill="white" fontSize="14">Input X</text>
        </g>
        <g className="cursor-pointer group">
            <rect x="50" y="50" width="80" height="40" rx="8" fill="var(--yellow-600)" fillOpacity="0.2" stroke="var(--yellow-400)" strokeWidth="2" />
            <text x="90" y="75" textAnchor="middle" fill="var(--yellow-100)" fontSize="14">W (Param)</text>
        </g>

        {/* Ops */}
        <line x1="130" y1="170" x2="210" y2="120" stroke="var(--slate-600)" strokeWidth="2" markerEnd="url(#ptr)" />
        <line x1="130" y1="70" x2="210" y2="110" stroke="var(--slate-600)" strokeWidth="2" markerEnd="url(#ptr)" />

        <circle cx="230" cy="115" r="30" fill="var(--blue-500)" fillOpacity="0.2" stroke="var(--blue-400)" strokeWidth="2" />
        <text x="230" y="120" textAnchor="middle" fill="white" fontWeight="bold">MUL</text>

        <line x1="260" y1="115" x2="340" y2="115" stroke="var(--slate-600)" strokeWidth="2" markerEnd="url(#ptr)" />

        {/* Output */}
        <rect x="350" y="90" width="100" height="50" rx="8" fill="var(--pink-600)" fillOpacity="0.2" stroke="var(--pink-400)" strokeWidth="2" />
        <text x="400" y="122" textAnchor="middle" fill="var(--pink-100)" fontSize="16" fontWeight="bold">LOSS</text>

        {/* Backward Animation (The Miracle of Autograd) */}
        {pulse > 50 && (
            <g opacity={(100 - pulse) / 50}>
                <path d="M 350 115 L 260 115" fill="none" stroke="var(--pink-400)" strokeWidth="4" strokeDasharray="10 5" filter="url(#glow)">
                    <animate attributeName="stroke-dashoffset" from="0" to="100" dur="1s" repeatCount="indefinite" />
                </path>
                <path d="M 200 110 L 130 70" fill="none" stroke="var(--pink-400)" strokeWidth="4" strokeDasharray="10 5" filter="url(#glow)">
                    <animate attributeName="stroke-dashoffset" from="0" to="100" dur="1s" repeatCount="indefinite" />
                </path>
                <text x="260" y="70" fill="var(--pink-300)" fontSize="12" fontWeight="bold">grad_loss / grad_W</text>
            </g>
        )}
      </svg>
    </div>
  );

  const renderTensorOperations = () => (
    <div className="flex flex-col gap-6 p-6 w-full overflow-auto max-h-96">
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <p className="text-blue-400 mb-3 font-mono text-sm font-bold">Tensor Shape Operations</p>
          <div className="space-y-3">
            <div>
              <label htmlFor="shape-slider" className="text-xs text-slate-400 block mb-2">Shape: <span className="text-blue-300">{tensorShape}</span></label>
              <input
                id="shape-slider"
                type="range"
                min="1"
                max="4"
                value={tensorShape === '2x3' ? 1 : tensorShape === '3x4' ? 2 : tensorShape === '4x5' ? 3 : 4}
                onChange={(e) => {
                  const shapes = ['2x3', '3x4', '4x5', '5x6'];
                  setTensorShape(shapes[parseInt(e.target.value) - 1]);
                }}
                className="w-full cursor-pointer accent-blue-500"
              />
            </div>
            <div className="bg-slate-900 p-3 rounded text-sm font-mono text-slate-300">
              <p>x = torch.randn({tensorShape})</p>
              <p className="text-slate-400 mt-1">x.shape = torch.Size([{tensorShape}])</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <p className="text-purple-400 text-xs mb-2">Reshape</p>
            <code className="text-slate-300 text-xs">x.reshape(3, 2)</code>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <p className="text-pink-400 text-xs mb-2">Transpose</p>
            <code className="text-slate-300 text-xs">x.t() or x.T</code>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <p className="text-green-400 text-xs mb-2">Flatten</p>
            <code className="text-slate-300 text-xs">x.flatten()</code>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <p className="text-yellow-400 text-xs mb-2">Concatenate</p>
            <code className="text-slate-300 text-xs">torch.cat([x, y])</code>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
        <p className="text-blue-400 font-mono text-xs mb-2">Broadcasting</p>
        <p className="text-slate-300 text-xs">
          Shape (3,) broadcasts with (3,1) {'→'} (3,3)
        </p>
        <p className="text-slate-400 text-xs mt-2">Allows operations on different-sized tensors!</p>
      </div>
    </div>
  );

  const renderAutogradGraph = () => (
    <div className="flex justify-center items-center h-[400px]">
      <svg width="550" height="350" viewBox="0 0 550 350">
        <defs>
          <marker id="grad-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--pink-400)" />
          </marker>
          <filter id="glow-grad">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Forward Pass */}
        <text x="20" y="30" fill="var(--slate-400)" fontSize="12" fontWeight="bold">FORWARD PASS</text>

        <rect x="40" y="50" width="70" height="40" rx="6" fill="var(--slate-800)" stroke="var(--blue-400)" strokeWidth="2" />
        <text x="75" y="75" textAnchor="middle" fill="var(--blue-200)" fontSize="12">x (input)</text>

        <line x1="110" y1="70" x2="150" y2="70" stroke="var(--slate-600)" strokeWidth="2" markerEnd="url(#grad-arrow)" />

        <circle cx="170" cy="70" r="25" fill="var(--blue-500)" fillOpacity="0.2" stroke="var(--blue-400)" strokeWidth="2" />
        <text x="170" y="75" textAnchor="middle" fill="var(--blue-200)" fontSize="10" fontWeight="bold">Linear</text>

        <line x1="195" y1="70" x2="235" y2="70" stroke="var(--slate-600)" strokeWidth="2" markerEnd="url(#grad-arrow)" />

        <circle cx="255" cy="70" r="25" fill="var(--green-500)" fillOpacity="0.2" stroke="var(--green-400)" strokeWidth="2" />
        <text x="255" y="75" textAnchor="middle" fill="var(--green-200)" fontSize="10" fontWeight="bold">ReLU</text>

        <line x1="280" y1="70" x2="320" y2="70" stroke="var(--slate-600)" strokeWidth="2" markerEnd="url(#grad-arrow)" />

        <rect x="340" y="50" width="70" height="40" rx="6" fill="var(--slate-800)" stroke="var(--yellow-400)" strokeWidth="2" />
        <text x="375" y="75" textAnchor="middle" fill="var(--yellow-200)" fontSize="12">loss</text>

        {/* Backward Pass */}
        <text x="20" y="180" fill="var(--slate-400)" fontSize="12" fontWeight="bold">BACKWARD PASS (Gradients)</text>

        <path d="M 375 95 L 375 120" stroke="var(--pink-500)" strokeWidth="3" markerEnd="url(#grad-arrow)" filter="url(#glow-grad)" />
        <text x="400" y="140" fill="var(--pink-300)" fontSize="10">∂loss/∂output</text>

        <path d="M 255 130 L 255 155" stroke="var(--pink-500)" strokeWidth="3" markerEnd="url(#grad-arrow)" filter="url(#glow-grad)" />
        <text x="270" y="185" fill="var(--pink-300)" fontSize="10">∂loss/∂relu</text>

        <path d="M 170 130 L 170 155" stroke="var(--pink-500)" strokeWidth="3" markerEnd="url(#grad-arrow)" filter="url(#glow-grad)" />
        <text x="185" y="185" fill="var(--pink-300)" fontSize="10">∂loss/∂linear</text>

        <path d="M 75 130 L 75 155" stroke="var(--pink-500)" strokeWidth="3" markerEnd="url(#grad-arrow)" filter="url(#glow-grad)" />
        <text x="90" y="185" fill="var(--pink-300)" fontSize="10">∂loss/∂x</text>

        {/* Legend */}
        <text x="40" y="280" fill="var(--blue-300)" fontSize="10" fontWeight="bold">Blue: Forward data flow</text>
        <text x="40" y="300" fill="var(--pink-300)" fontSize="10" fontWeight="bold">Pink: Gradient flow (backward)</text>
        <text x="40" y="320" fill="var(--slate-400)" fontSize="10">Automatic Differentiation: PyTorch tracks all operations!</text>
      </svg>
    </div>
  );

  const renderModuleLifecycle = () => (
    <div className="flex flex-col gap-6 p-6">
      <div className="space-y-4">
        <div className="bg-blue-500/10 border border-blue-500 p-4 rounded-lg">
          <p className="text-blue-400 font-mono font-bold mb-2">1. Define Architecture</p>
          <code className="text-slate-300 text-sm block">
            class Model(nn.Module):<br />
            &nbsp;&nbsp;def __init__(self):<br />
            &nbsp;&nbsp;&nbsp;&nbsp;super().__init__()<br />
            &nbsp;&nbsp;&nbsp;&nbsp;self.linear = nn.Linear(10, 5)
          </code>
        </div>

        <div className="bg-green-500/10 border border-green-500 p-4 rounded-lg">
          <p className="text-green-400 font-mono font-bold mb-2">2. Forward Pass</p>
          <code className="text-slate-300 text-sm block">
            def forward(self, x):<br />
            &nbsp;&nbsp;return self.linear(x)
          </code>
        </div>

        <div className="bg-purple-500/10 border border-purple-500 p-4 rounded-lg">
          <p className="text-purple-400 font-mono font-bold mb-2">3. Create Instance</p>
          <code className="text-slate-300 text-sm block">
            model = Model()<br />
            optimizer = Adam(model.parameters())
          </code>
        </div>

        <div className="bg-pink-500/10 border border-pink-500 p-4 rounded-lg">
          <p className="text-pink-400 font-mono font-bold mb-2">4. Training Loop</p>
          <code className="text-slate-300 text-sm block">
            for x, y in dataloader:<br />
            &nbsp;&nbsp;pred = model(x)<br />
            &nbsp;&nbsp;loss = criterion(pred, y)<br />
            &nbsp;&nbsp;optimizer.zero_grad()<br />
            &nbsp;&nbsp;loss.backward()<br />
            &nbsp;&nbsp;optimizer.step()
          </code>
        </div>
      </div>
    </div>
  );

  const renderDataLoading = () => (
    <div className="flex flex-col gap-6 p-6 w-full overflow-auto max-h-96">
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <label htmlFor="batch-slider" className="text-blue-400 mb-3 font-mono text-sm font-bold block">Batch Size: <span className="text-yellow-300">{batchSize}</span></label>
          <input
            id="batch-slider"
            type="range"
            min="8"
            max="256"
            step="8"
            value={batchSize}
            onChange={(e) => setBatchSize(parseInt(e.target.value))}
            className="w-full cursor-pointer accent-green-500"
          />
          <p className="text-slate-400 text-xs mt-2">Adjust to see batching effects</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {[1, 2, 3, 4].map((batch) => (
            <div key={batch} className="bg-slate-900 p-3 rounded border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-400 text-sm font-mono">Batch {batch}</span>
                <span className="text-slate-500 text-xs">({batchSize} samples)</span>
              </div>
              <div className="flex gap-1 flex-wrap">
                {Array.from({ length: Math.min(batchSize, 16) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 bg-green-500/50 border border-green-500 rounded text-xs flex items-center justify-center text-green-200"
                  >
                    {i + 1}
                  </div>
                ))}
                {batchSize > 16 && (
                  <span className="text-slate-500 text-xs ml-2">+{batchSize - 16} more</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
          <p className="text-slate-300 text-xs">
            <span className="text-blue-400 font-mono">DataLoader</span> handles:
          </p>
          <ul className="text-slate-400 text-xs mt-2 space-y-1 ml-2">
            <li>✓ Batching data into groups</li>
            <li>✓ Shuffling for randomness</li>
            <li>✓ Multi-threaded loading</li>
            <li>✓ GPU prefetching</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderLossFunctions = () => (
    <div className="flex flex-col gap-6 p-6">
      <div className="space-y-4">
        <fieldset>
          <legend className="text-slate-300 text-sm font-bold mb-3">Loss Function Type:</legend>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedLoss('mse')}
              className={`p-3 rounded text-sm transition-all font-semibold ${
                selectedLoss === 'mse'
                  ? 'bg-blue-600 text-white border-2 border-blue-300'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-blue-500'
              }`}
              aria-pressed={selectedLoss === 'mse'}
            >
              MSE Loss
            </button>
            <button
              onClick={() => setSelectedLoss('ce')}
              className={`p-3 rounded text-sm transition-all font-semibold ${
                selectedLoss === 'ce'
                  ? 'bg-green-600 text-white border-2 border-green-300'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-green-500'
              }`}
              aria-pressed={selectedLoss === 'ce'}
            >
              Cross Entropy
            </button>
            <button
              onClick={() => setSelectedLoss('mae')}
              className={`p-3 rounded text-sm transition-all font-semibold ${
                selectedLoss === 'mae'
                  ? 'bg-purple-600 text-white border-2 border-purple-300'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-purple-500'
              }`}
              aria-pressed={selectedLoss === 'mae'}
            >
              MAE Loss
            </button>
            <button
              onClick={() => setSelectedLoss('bce')}
              className={`p-3 rounded text-sm transition-all font-semibold ${
                selectedLoss === 'bce'
                  ? 'bg-pink-600 text-white border-2 border-pink-300'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-pink-500'
              }`}
              aria-pressed={selectedLoss === 'bce'}
            >
              BCE Loss
            </button>
          </div>
        </fieldset>

        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
          {selectedLoss === 'mse' && (
            <>
              <p className="text-blue-400 font-mono mb-2">Mean Squared Error</p>
              <code className="text-slate-300 text-xs block">Loss = (1/n) * Σ(y_pred - y_true)²</code>
              <p className="text-slate-400 text-xs mt-2">Used for regression tasks</p>
            </>
          )}
          {selectedLoss === 'ce' && (
            <>
              <p className="text-green-400 font-mono mb-2">Cross Entropy</p>
              <code className="text-slate-300 text-xs block">Loss = -Σ y_true * log(y_pred)</code>
              <p className="text-slate-400 text-xs mt-2">Used for multi-class classification</p>
            </>
          )}
          {selectedLoss === 'mae' && (
            <>
              <p className="text-purple-400 font-mono mb-2">Mean Absolute Error</p>
              <code className="text-slate-300 text-xs block">Loss = (1/n) * Σ|y_pred - y_true|</code>
              <p className="text-slate-400 text-xs mt-2">Robust to outliers, used for regression</p>
            </>
          )}
          {selectedLoss === 'bce' && (
            <>
              <p className="text-pink-400 font-mono mb-2">Binary Cross Entropy</p>
              <code className="text-slate-300 text-xs block">Loss = -[y * log(p) + (1-y) * log(1-p)]</code>
              <p className="text-slate-400 text-xs mt-2">Used for binary classification</p>
            </>
          )}
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <label htmlFor="loss-slider" className="text-yellow-400 text-sm mb-3 block font-mono">Loss Value Progression: <span className="text-orange-300">{lossValue.toFixed(2)}</span></label>
          <input
            id="loss-slider"
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={lossValue}
            onChange={(e) => setLossValue(parseFloat(e.target.value))}
            className="w-full mb-3 cursor-pointer accent-orange-500"
          />
          <div className="bg-slate-900 p-3 rounded">
            <div className="text-slate-300 font-mono text-sm">
              Loss: {lossValue.toFixed(2)}
            </div>
            <div
              className="h-6 bg-gradient-to-r from-red-600 to-green-600 rounded mt-2 relative overflow-hidden"
              style={{ width: `${(5 - lossValue) / 5 * 100}%` }}
            >
              <span className="text-xs text-white font-bold absolute right-1 top-0">
                {((5 - lossValue) / 5 * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-2">
              Decreasing loss indicates improving model!
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrainingLoop = () => (
      <div className="flex flex-col items-center gap-6">
          <div className="relative w-64 h-64 border-4 border-dashed border-slate-800 rounded-full flex items-center justify-center">
              <div className="absolute w-full h-full animate-[spin_10s_linear_infinite]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-lg">FORWARD</div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-24 h-12 bg-pink-500 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-lg">BACKWARD</div>
                  <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-lg rotate-90">LOSS</div>
                  <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-24 h-12 bg-green-500 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-lg rotate-90">OPTIMIZE</div>
              </div>
              <div className="text-center">
                  <span className="text-4xl">⚙️</span>
                  <p className="text-slate-400 mt-2 font-mono">Epoch: 42</p>
              </div>
          </div>
          <p className="text-slate-400 text-sm italic">The infinite cycle of error and correction.</p>
      </div>
  );

  return (
    <div className="w-full h-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center p-8">
      {mode === 'tensor-viz' && renderTensorOperations()}
      {mode === 'computation-graph' && renderAutogradGraph()}
      {mode === 'module-lifecycle' && renderModuleLifecycle()}
      {mode === 'batch-viz' && renderDataLoading()}
      {mode === 'loss-functions' && renderLossFunctions()}
      {mode === 'loop-viz' && renderTrainingLoop()}
      {mode !== 'tensor-viz' && mode !== 'computation-graph' && mode !== 'module-lifecycle' && 
       mode !== 'batch-viz' && mode !== 'loss-functions' && mode !== 'loop-viz' && (
        <div className="text-center">
            <div className="w-24 h-24 mb-6 mx-auto rounded-3xl bg-pink-500/20 flex items-center justify-center border border-pink-500 animate-pulse">
                <span className="text-4xl font-bold text-pink-400">🔥</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">PyTorch Essentials</h3>
            <p className="text-slate-400 max-w-sm">
                Master tensors, autograd, modules, data loading, and loss functions. Select a step to explore.
            </p>
        </div>
      )}
    </div>
  );
}
