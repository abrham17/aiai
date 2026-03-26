import type { ModuleData } from '@/core/types';

const mlpsModule: ModuleData = {
  id: 'mlps',
  tierId: 2,
  clusterId: 'neural-networks',
  title: 'Multi-Layer Perceptrons & Universal Approximation',
  description:
    'How hidden layers create non-linear decision boundaries. Solve XOR, classify spirals, and understand why MLPs can approximate any continuous function.',
  tags: ['deep-learning', 'mlp', 'hidden-layers', 'universal-approximation', 'xor'],
  prerequisites: ['perceptrons', 'backpropagation', 'activations'],
  difficulty: 'intermediate',
  estimatedMinutes: 60,
  steps: [
    {
      id: 'the-xor-problem',
      title: 'The XOR Problem: Why One Layer Isn\'t Enough',
      visualizationProps: {
        mode: 'xor-problem',
        dataset: 'xor',
        hiddenNeurons: 0,
      },
      content: {
        text: 'A single perceptron draws one straight line. It can solve AND and OR gates perfectly. But XOR (where the answer is 1 only when the inputs differ) is impossible to separate with a single line. This was the crisis that nearly killed neural networks in the 1960s.',
        goDeeper: {
          explanation: 'Minsky and Papert proved in 1969 that a single-layer perceptron cannot represent XOR. This triggered the first "AI Winter." The solution? Adding hidden layers—but the mathematics for training them (backpropagation) wasn\'t popularized until 1986.',
        },
      },
    },
    {
      id: 'hidden-layers',
      title: 'Adding a Hidden Layer',
      visualizationProps: {
        mode: 'network-diagram',
        dataset: 'xor',
        hiddenNeurons: 2,
        showBoundaries: true,
      },
      content: {
        text: 'With just 2 hidden neurons, each neuron draws its own line. The output neuron then combines these lines. Two lines together can carve out a region that isolates the XOR pattern!',
        goDeeper: {
          explanation: 'Each hidden neuron creates one linear boundary. The output neuron acts as a logical combiner. With 2 hidden neurons, we get 2 lines that create a "corridor" in the middle separating the classes. Adding more hidden neurons adds more lines, creating more complex shapes.',
        },
      },
      interactionHint: 'Adjust the number of hidden neurons to see how the decision boundary evolves from a simple line to a complex shape.',
    },
    {
      id: 'non-linear-boundaries',
      title: 'Non-Linear Decision Boundaries',
      visualizationProps: {
        mode: 'playground',
        dataset: 'circles',
        hiddenNeurons: 4,
        showBoundaries: true,
        interactive: true,
      },
      content: {
        text: 'With activations between layers, the straight lines get bent and warped into curves. More neurons = more segments = smoother curves. This is how neural networks learn to classify complex, non-linear patterns like concentric circles.',
        goDeeper: {
          explanation: 'Each neuron contributes a "fold" in the decision surface. In 2D, more neurons create more intricate polygonal boundaries that approximate smooth curves. In higher dimensions (like images), these folds create incredibly sophisticated feature detectors.',
        },
      },
      interactionHint: 'Try different datasets (XOR, Circles, Spiral) and adjust the hidden neurons to see the boundary morph.',
    },
    {
      id: 'universal-approximation',
      title: 'The Universal Approximation Theorem',
      visualizationProps: {
        mode: 'approximation',
        hiddenNeurons: 4,
        targetFunction: 'sine',
        interactive: true,
      },
      content: {
        text: 'The Universal Approximation Theorem (Cybenko, 1989) states: a neural network with a single hidden layer containing enough neurons can approximate ANY continuous function to arbitrary precision.',
        goDeeper: {
          explanation: 'This is a deep mathematical guarantee. It says MLPs are "universal function approximators." The catch is that "enough neurons" might be astronomically large. In practice, deeper networks with fewer neurons per layer are far more efficient than extremely wide shallow ones. Depth provides exponential expressiveness compared to width.',
        },
      },
      interactionHint: 'Increase the number of hidden neurons and watch the network\'s approximation of the target function (sin, step, etc.) progressively improve.',
    },
    {
      id: 'depth-vs-width',
      title: 'Depth vs Width: Why Deep is Better',
      visualizationProps: {
        mode: 'depth-comparison',
      },
      content: {
        text: 'A network with 1 hidden layer of 1000 neurons can approximate any function, but a network with 3 hidden layers of 10 neurons each often does it better and with far fewer total parameters.',
        goDeeper: {
          explanation: 'Deep networks learn hierarchical representations. Layer 1 learns edges, Layer 2 combines edges into textures, Layer 3 combines textures into shapes. Each layer builds on the abstractions of the previous layer, creating a compositional structure that mirrors the hierarchical nature of real-world data.',
        },
      },
    },
    {
      id: 'parameter-counting',
      title: 'The Burden of Intelligence: Parameters',
      visualizationProps: {
        mode: 'param-counter-viz',
      },
      content: {
        text: 'Every connection in our network is a "Weight" that must be learned. In a "Fully Connected" MLP, the number of weights explodes quickly: $(Input \\times Hidden) + (Hidden \\times Hidden) + ...$',
        goDeeper: {
          math: 'P = \\sum_{l=1}^{L} (n_{l-1} \\cdot n_l + n_l)',
          explanation: 'Adding a single bias to every neuron ($+n_l$) gives the total parameters. Modern models like GPT-4 have hundreds of billions of parameters, requiring massive supercomputers just to store the numbers.',
        },
      },
    },
    {
      id: 'initialization-math',
      title: 'Initialization: Avoiding the Dead Zones',
      visualizationProps: {
        mode: 'init-viz',
      },
      content: {
        text: 'If you set all weights to zero, the network will never learn. If you set them too high, the gradients explode. We use smart methods like "He" or "Xavier" initialization to keep the signal active from the start.',
        goDeeper: {
          math: 'w \\sim \\mathcal{N}(0, \\frac{2}{n_{in}})',
          explanation: 'He Initialization (for ReLU) scales weights based on the number of incoming connections. It ensures that the variance of the signal remains consistent through each layer, preventing it from disappearing into noise or spiking to infinity.',
        },
      },
    },
    {
      id: 'dropout-regularization',
      title: 'Dropout: Training for Robustness',
      visualizationProps: {
        mode: 'dropout-viz',
        interactive: true,
      },
      content: {
        text: 'To prevent the network from relying too heavily on any one "star" neuron, we randomly "turn off" neurons during training. This forces the entire network to work together and learn more generalized patterns.',
        goDeeper: {
          explanation: 'Dropout is like a team practice where the coach randomly benched players. The remaining team must learn to cover for any missing member, creating a much more robust and "redundant" intelligence.',
        },
      },
    },
    {
      id: 'batch-norm-intuition',
      title: 'Batch Normalization',
      visualizationProps: {
        mode: 'batch-norm-viz',
      },
      content: {
        text: 'As data flows through a deep network, its mean and variance can shift, making it hard for later layers to keep up. Batch Normalization re-centers the data between every single layer.',
        goDeeper: {
          explanation: 'By standardizing the inputs to each layer, we stabilize the learning process. This allows us to use much higher learning rates and significantly speeds up training time.',
        },
      },
    },
    {
      id: 'training-lifecycle',
      title: 'The Training Lifecycle',
      visualizationProps: {
        mode: 'lifecycle-summary',
      },
      content: {
        text: 'Forward Pass -> Calculate Loss -> Backward Pass -> Update Weights. Repeat millions of times across hundreds of "Epochs" until the model achieves mastery.',
        goDeeper: {
          explanation: 'One "Epoch" is when the network has seen the entire dataset once. Modern models are often trained for 10-100 epochs. Finding the right balance between underfitting (not enough training) and overfitting (too much training) is the art of Deep Learning.',
        },
      },
    },
  ],
  playground: {
    description: 'Build your own MLP. Choose a dataset, adjust hidden neurons, and watch the decision boundary form.',
    parameters: [
      { id: 'dataset', label: 'Dataset', type: 'select', options: ['xor', 'circles', 'spiral', 'moons'], default: 'xor' },
      { id: 'hiddenNeurons', label: 'Hidden Neurons', type: 'slider', min: 1, max: 16, step: 1, default: 4 },
      { id: 'activation', label: 'Activation', type: 'select', options: ['relu', 'sigmoid', 'tanh'], default: 'relu' },
    ],
    tryThis: [
      'Can you solve XOR with only 2 hidden neurons? What about with 1?',
      'Try the Spiral dataset. What happens with only 2 hidden neurons? What about 8?',
      'Switch to sigmoid activation with many neurons. Notice the boundary is always smooth curves, never sharp corners.',
    ],
  },
  challenges: [
    {
      id: 'solve-xor',
      title: 'Crack the XOR Code',
      description: 'Find the minimum number of hidden neurons needed to perfectly classify all 4 XOR data points.',
      props: {
        mode: 'playground',
        dataset: 'xor',
        hiddenNeurons: 1,
        showBoundaries: true,
        interactive: true,
      },
      completionCriteria: { type: 'threshold', target: 100, metric: 'accuracy' },
      hints: [
        'One hidden neuron draws one line. Can one line separate XOR? Nope!',
        'Two lines (two hidden neurons) can create a corridor. Try 2 hidden neurons!',
      ],
    },
  ],
};

export default mlpsModule;
