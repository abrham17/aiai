import type { ModuleData } from '@/core/types';

const backpropagationModule: ModuleData = {
  id: 'backpropagation',
  tierId: 2,
  clusterId: 'neural-networks',
  title: 'Backpropagation & Computational Graphs',
  description:
    'Peek inside the black box. Discover how neural networks learn via the chain rule, discovering how every weight contributed to the final error.',
  tags: ['deep-learning', 'backprop', 'chain-rule', 'computational-graph'],
  prerequisites: ['perceptrons', 'chain-rule', 'optimization'],
  difficulty: 'intermediate',
  estimatedMinutes: 60,
  steps: [
    {
      id: 'the-forward-pass',
      title: 'The Forward Pass',
      visualizationProps: {
        mode: 'forward',
        nodes: ['x', 'w', 'mult', 'b', 'add', 'relu', 'loss'],
        edges: [
          { from: 'x', to: 'mult' }, { from: 'w', to: 'mult' },
          { from: 'mult', to: 'add' }, { from: 'b', to: 'add' },
          { from: 'add', to: 'relu' }, { from: 'relu', to: 'loss' }
        ],
        values: { x: 2, w: 3, b: -4, target: 5 },
      },
      content: {
        text: 'A Neural Network is just a massive sequence of simple math operations (multiplication, addition, activation). We can draw this as a "Computational Graph". Data flows from left to right—this is the Forward Pass.',
        goDeeper: {
          explanation:
            'Notice how each node only knows about its immediate inputs. The final node computes the "Loss" (Error). If our target is 5 and we predict 2, our loss is high. How do we change `w` and `b` to make the prediction exactly 5?',
        },
      },
      interactionHint: 'Change the inputs (x), weights (w), or bias (b) and see how the computation ripples forward to change the Loss.',
    },
    {
      id: 'local-gradients',
      title: 'Local Gradients',
      visualizationProps: {
        mode: 'local-gradients',
        nodes: ['x', 'w', 'mult', 'b', 'add', 'relu', 'loss'],
        edges: [
          { from: 'x', to: 'mult' }, { from: 'w', to: 'mult' },
          { from: 'mult', to: 'add' }, { from: 'b', to: 'add' },
          { from: 'add', to: 'relu' }, { from: 'relu', to: 'loss' }
        ],
        values: { x: 2, w: 3, b: -4, target: 5 },
      },
      content: {
        text: 'To fix the error, we need to know: "If I tweak this specific number slightly, how much will the immediate output change?" This is the partial derivative, or Local Gradient.',
        goDeeper: {
          math: '\\frac{\\partial (w \\cdot x)}{\\partial w} = x',
          explanation: 'Every node in the graph comes with a built-in rule for calculating its local gradient. For example, in an addition node `a + b = c`, changing `a` by +1 increases `c` by +1, so the local gradient is 1.',
        },
      },
      interactionHint: 'Hover over the mathematical operations to see their local gradient formulas.',
    },
    {
      id: 'the-backward-pass',
      title: 'The Backward Pass (Chain Rule)',
      visualizationProps: {
        mode: 'backward',
        nodes: ['x', 'w', 'mult', 'b', 'add', 'relu', 'loss'],
        edges: [
          { from: 'x', to: 'mult' }, { from: 'w', to: 'mult' },
          { from: 'mult', to: 'add' }, { from: 'b', to: 'add' },
          { from: 'add', to: 'relu' }, { from: 'relu', to: 'loss' }
        ],
        values: { x: 2, w: 3, b: -4, target: 5 },
      },
      content: {
        text: 'This is the magic of Deep Learning. Starting from the error at the end, we cascade backward. We multiply the incoming gradient by the local gradient to pass the error blame down the chain.',
        goDeeper: {
          math: '\\frac{\\partial L}{\\partial w} = \\frac{\\partial L}{\\partial z} \\cdot \\frac{\\partial z}{\\partial w}',
          explanation: 'This is literally just the Chain Rule from calculus! Because we process it from right-to-left, we can efficiently calculate the gradient for millions of weights in a single sweep. This algorithm is called Backpropagation.',
        },
      },
      interactionHint: 'Click "Backpropagate!" to watch the gradients flow backward. Red means increase the weight, Blue means decrease.',
    },
    {
      id: 'gradient-descent',
      title: 'Gradient Descent (Weight Update)',
      visualizationProps: {
        mode: 'update',
        nodes: ['x', 'w', 'mult', 'b', 'add', 'relu', 'loss'],
        edges: [
          { from: 'x', to: 'mult' }, { from: 'w', to: 'mult' },
          { from: 'mult', to: 'add' }, { from: 'b', to: 'add' },
          { from: 'add', to: 'relu' }, { from: 'relu', to: 'loss' }
        ],
        values: { x: 2, w: 3, b: -4, target: 5 },
        learningRate: 0.1,
      },
      content: {
        text: 'Once every weight knows its gradient, we update it. We subtract a tiny fraction of the gradient from the weight. This fraction is the "Learning Rate".',
        goDeeper: {
          math: 'w_{new} = w_{old} - \\alpha \\cdot \\frac{\\partial L}{\\partial w}',
          explanation: 'If the learning rate is too large, you bounce wildly and miss the minimum loss. If it is too small, your network takes centuries to train.',
        },
      },
      interactionHint: 'Adjust the Learning Rate slider and click "Step" to watch the weights update and the loss drop.',
    },
    {
      id: 'jacobian-math',
      title: 'Jacobians: Multi-Dimensional Gradients',
      visualizationProps: {
        mode: 'jacobian-viz',
      },
      content: {
        text: 'In real networks, we don\'t have single numbers; we have vectors and matrices. When we pass a vector through a layer, the local gradient becomes a matrix of every output\'s change relative to every input—the Jacobian.',
        goDeeper: {
          math: 'J = \\begin{bmatrix} \\frac{\\partial y_1}{\\partial x_1} & \\cdots & \\frac{\\partial y_1}{\\partial x_n} \\\\ \\vdots & \\ddots & \\vdots \\\\ \\frac{\\partial y_m}{\\partial x_1} & \\cdots & \\frac{\\partial y_m}{\\partial x_n} \\end{bmatrix}',
          explanation: 'Computing full Jacobians is slow. Backpropagation avoids this by calculating "Vector-Jacobian Products" (VJPs), which only computes exactly what we need for the backward pass.',
        },
      },
    },
    {
      id: 'chain-rule-3d',
      title: 'Chain Rule in 3D',
      visualizationProps: {
        mode: '3d-graph-viz',
      },
      content: {
        text: 'Visualization often simplifies the graph. In reality, multiple paths can lead to the same weight. The gradient for that weight is the sum of gradients from all incoming paths.',
        goDeeper: {
          math: '\\frac{\\partial L}{\\partial w} = \\sum_{paths} \\text{Gradient Along Path}',
          explanation: 'This "Addition Rule" for gradients allows us to handle complex architectures like Skip Connections (ResNets) where paths diverge and reconverge.',
        },
      },
    },
    {
      id: 'auto-diff',
      title: 'Automatic Differentiation',
      visualizationProps: {
        mode: 'auto-diff-demo',
      },
      content: {
        text: 'You don\'t have to write the math for every new model. Libraries like PyTorch and TensorFlow use "Auto-Diff" to automatically track every operation in a "Tape" and compute gradients for you.',
        goDeeper: {
          explanation: 'Reverse-mode auto-differentiation (the math behind backprop) is mathematically the most efficient way to compute many gradients from a single scalar loss. It is the engine that powers the entire AI industry.',
        },
      },
    },
    {
      id: 'learning-schedules',
      title: 'Learning Rate Schedules',
      visualizationProps: {
        mode: 'lr-scheduler-viz',
      },
      content: {
        text: 'Why pick one learning rate? We often use "Schedules" that start fast and slow down as the model approaches the minimum to ensure perfectly fine-tuned results.',
        goDeeper: {
          explanation: 'Popular methods include "Cosine Annealing" and "One-Cycle" policies. These help the model jump out of local minima early on and settle into the global minimum with high precision late in training.',
        },
      },
    },
    {
      id: 'momentum-physics-deep',
      title: 'Physics of Momentum',
      visualizationProps: {
        mode: 'momentum-ball-viz',
      },
      content: {
        text: 'Backprop can be jittery. "Momentum" adds physical inertia. It accumulates speed in directions where the gradient is consistent and ignores noisy, bouncing directions.',
        goDeeper: {
          math: 'v_t = \\beta v_{t-1} + (1 - \\beta)g_t',
          explanation: 'Beta (usually 0.9) determines the "friction". High beta means the optimizer keeps 90% of its speed from the previous step. This helps it roll over small hills in the loss landscape.',
        },
      },
    },
  ],
  playground: {
    description: 'Experiment with a small computational graph. Change the target, learning rate, and inputs.',
    parameters: [
      { id: 'lr', label: 'Learning Rate', type: 'slider', min: 0.01, max: 0.5, step: 0.01, default: 0.1 },
      { id: 'target', label: 'Target Output', type: 'slider', min: -10, max: 10, step: 1, default: 5 },
      { id: 'x', label: 'Input (x)', type: 'slider', min: -5, max: 5, step: 0.5, default: 2 },
    ],
    tryThis: [
      'Set learning rate to 0.5 and watch the weights explode as they overshoot the target!',
      'Make the input (x) exactly 0. What happens to the gradient for the weight (w)?',
    ],
  },
  challenges: [
    {
      id: 'train-the-neuron',
      title: 'Manual Gradient Descent',
      description: 'Use the "Step" button to run backpropagation and drive the loss below 0.1.',
      props: {
        mode: 'challenge',
        nodes: ['x', 'w', 'mult', 'b', 'add', 'loss'],
        edges: [
          { from: 'x', to: 'mult' }, { from: 'w', to: 'mult' },
          { from: 'mult', to: 'add' }, { from: 'b', to: 'add' },
          { from: 'add', to: 'loss' }
        ],
        values: { x: 1.5, w: 1, b: 0, target: 8 },
        learningRate: 0.1,
      },
      completionCriteria: { type: 'threshold', target: 0.1, metric: 'loss' },
      hints: [
        'If learning rate is too low, you\'ll have to click Step many times.',
        'If it\'s too high, the loss might start increasing!',
      ],
    },
  ],
};

export default backpropagationModule;
