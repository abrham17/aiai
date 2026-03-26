import type { ModuleData } from '@/core/types';

const perceptronsModule: ModuleData = {
  id: 'perceptrons',
  tierId: 2,
  clusterId: 'neural-networks',
  title: 'Perceptrons & MLPs',
  description:
    'The artificial neuron, weights, biases, and activation functions — the building blocks of deep learning.',
  tags: ['perceptrons', 'neural-networks', 'deep-learning', 'activation'],
  prerequisites: ['linear-regression', 'optimization'],
  difficulty: 'intermediate',
  estimatedMinutes: 40,
  steps: [
    {
      id: 'biological-inspiration',
      title: 'The Artificial Neuron',
      visualizationProps: {
        mode: 'biological',
        inputs: [{ value: 1, weight: 0.5 }, { value: -1, weight: -0.5 }],
        bias: 0.5,
        activation: 'step',
      },
      content: {
        text: 'A perceptron takes inputs, multiplies them by weights, adds a bias, and passes the sum through an activation function.',
        goDeeper: {
          math: 'y = f(\\sum_{i=1}^{n} w_i x_i + b)',
          explanation:
            'This loosely mimics a biological neuron deciding whether to fire based on incoming signals. $w_i$ are synaptic strengths, $b$ is the firing threshold.',
        },
      },
    },
    {
      id: 'weighted-sum',
      title: 'The Weighted Sum',
      visualizationProps: {
        mode: 'interactive',
        draggableWeights: true,
        inputs: [{ value: 1, weight: 1 }, { value: 1, weight: 1 }],
        bias: -1.5,
        activation: 'step',
        showCalculation: true,
      },
      content: {
        text: 'Adjust the weights and bias. See how the sum changes. If the sum is > 0, the perceptron outputs 1. Otherwise, 0.',
        goDeeper: {
          explanation: 'The weighted sum is a linear operation, exactly like a dot product. The perceptron is essentially looking at how well the input aligns with its weights.',
        },
      },
      quiz: {
        question: 'If inputs are [1, 1], weights are [0.5, 0.5], and bias is -1, what is the weighted sum before activation?',
        options: ['1', '0', '-0.5', '0.5'],
        correctIndex: 1,
        explanation: '(1 * 0.5) + (1 * 0.5) - 1 = 1 - 1 = 0.',
      },
      interactionHint: 'Drag the sliders to change weights and bias',
    },
    {
      id: 'activation-functions',
      title: 'Activation Functions',
      visualizationProps: {
        mode: 'activation',
        draggableWeights: true,
        inputs: [{ value: 2, weight: 1 }],
        bias: 0,
        activation: 'sigmoid',
        showGraph: true,
      },
      content: {
        text: 'A step function is too rigid for training (its derivative is 0 almost everywhere). We use smooth functions like Sigmoid or ReLU instead.',
        goDeeper: {
          math: '\\sigma(x) = \\frac{1}{1 + e^{-x}} \\quad \\text{ReLU}(x) = \\max(0, x)',
          explanation: 'Without non-linear activation functions, a neural network, no matter how deep, collapses into a single linear transformation.',
        },
      },
    },
    {
      id: 'the-xor-problem',
      title: 'The XOR Problem (Preview)',
      visualizationProps: {
        mode: 'xor-preview',
      },
      content: {
        text: 'A single perceptron can only draw a straight line to separate data. It cannot solve problems where classes cannot be separated by a line (like XOR). This is why we need Multi-Layer Perceptrons (MLPs) — deep neural networks.',
        goDeeper: {
          explanation: 'Historically, Minsky and Papert proved this in 1969, leading to an "AI winter". It was only overcome when backpropagation allowed training multi-layer networks.',
        },
      },
    },
    {
      id: 'nand-universality',
      title: 'NAND: The Universal Builder',
      visualizationProps: {
        mode: 'interactive',
        draggableWeights: true,
        inputs: [{ value: 1, weight: -2 }, { value: 1, weight: -2 }],
        bias: 3,
        activation: 'step',
      },
      content: {
        text: 'Computers are built with NAND gates. If a perceptron can act as a NAND gate, it can technically compute ANYTHING a computer can. All you need are enough perceptrons chained together.',
        goDeeper: {
          explanation: 'By setting weights to -2 and bias to 3, the neuron fires for (0,0), (0,1), and (1,0), but NOT for (1,1). This is the definition of NAND. This proves that neural networks are "Computationally Universal".',
        },
      },
    },
    {
      id: 'linear-separability',
      title: 'Linear Separability',
      visualizationProps: {
        mode: '2d-sep-viz',
      },
      content: {
        text: 'A single perceptron is a linear classifier. It can only solve a problem if you can draw a perfectly straight line between the classes. If the data is "interleaved" or circular, a single neuron is powerless.',
        goDeeper: {
          explanation: 'Many real-world signals (audio, images) are highly non-linear. This is why a single neuron is not enough for modern AI—we need hundreds of layers to "warp" the data into a shape that becomes linearly separable.',
        },
      },
    },
    {
      id: 'update-rule-math',
      title: 'The Perceptron Update Rule',
      visualizationProps: {
        mode: 'learning-viz',
        interactive: true,
      },
      content: {
        text: 'How do neurons learn? If the neuron makes a mistake, we nudge the weights in the direction that would have fixed it. If we predicted 0 but wanted 1, we add the input to the weight.',
        goDeeper: {
          math: 'w_{new} = w_{old} + \\eta(y - \\hat{y})x',
          explanation: 'This is the most basic form of computer learning. Unlike Backprop (which uses calculus), the Perceptron rule is purely additive. It works, but only for simple, linearly separable problems.',
        },
      },
    },
    {
      id: 'convergence-theorem',
      title: 'Convergence Theorem',
      visualizationProps: {
        mode: 'convergence-sim',
      },
      content: {
        text: 'Frank Rosenblatt proved in 1958 that if a linear solution EXISTS, this simple update rule is GUARANTEED to find it in a finite number of steps.',
        goDeeper: {
          explanation: 'This theorem gave people immense hope in the 50s. However, the theorem doesn\'t say how LONG it will take, nor does it help if the data is not perfectly separable.',
        },
      },
    },
    {
      id: 'multiclass-neurons',
      title: 'Multiclass Perceptrons',
      visualizationProps: {
        mode: 'vector-output-viz',
      },
      content: {
        text: 'To classify digits (0-9), we use a layer of 10 neurons. Each neuron "competes" to recognize one specific digit. The one with the highest output score wins.',
        goDeeper: {
          explanation: 'This is the precursor to the "Final Layer" of modern deep models. Instead of a single binary choice, we have a biological-style competition across a population of neurons.',
        },
      },
    },
  ],
  playground: {
    description: 'Experiment with a single neuron. Change its inputs, weights, bias, and observe the activation.',
    parameters: [
      { id: 'w1', label: 'Weight 1', type: 'slider', min: -2, max: 2, step: 0.1, default: 1 },
      { id: 'w2', label: 'Weight 2', type: 'slider', min: -2, max: 2, step: 0.1, default: 1 },
      { id: 'bias', label: 'Bias', type: 'slider', min: -3, max: 3, step: 0.1, default: -1.5 },
      { id: 'activation', label: 'Activation', type: 'select', options: ['step', 'sigmoid', 'relu'], default: 'step' },
    ],
    tryThis: [
      'Set weights to 1 and bias to -1.5. What inputs are needed to make the neuron fire? (This is an AND gate).',
      'Change bias to -0.5. How does the required input change? (This is an OR gate).',
    ],
  },
  challenges: [
    {
      id: 'build-and-gate',
      title: 'Build an AND Gate',
      description: 'Adjust weights and bias so the neuron fires ONLY when both inputs are 1.',
      props: {
        mode: 'interactive',
        draggableWeights: true,
        inputs: [{ value: 1, weight: 0 }, { value: 1, weight: 0 }],
        bias: 0,
        activation: 'step',
        showCalculation: true,
      },
      completionCriteria: { type: 'threshold', target: 0, metric: 'and_gate_error' },
      hints: [
        'If x1=0 and x2=0, output should be 0. (Set bias < 0).',
        'If x1=1 and x2=1, output should be 1. (Make weights large enough to overcome bias).',
      ],
    },
  ],
};

export default perceptronsModule;
