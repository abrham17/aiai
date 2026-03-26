import type { ModuleData } from '@/core/types';

const optimizersModule: ModuleData = {
  id: 'optimizers',
  tierId: 2,
  clusterId: 'neural-networks',
  title: 'Optimizers: Navigating the Loss Landscape',
  description:
    'Peek under the hood of how AI actually learns. Compare SGD, Momentum, and Adam as they race to find the lowest point in a complex 3D landscape.',
  tags: ['deep-learning', 'optimizers', 'sgd', 'momentum', 'adam', 'loss-landscape'],
  prerequisites: ['backpropagation', 'optimization'],
  difficulty: 'intermediate',
  estimatedMinutes: 50,
  steps: [
    {
      id: 'loss-landscapes',
      title: 'The Loss Landscape',
      visualizationProps: {
        mode: 'landscape-viz',
        surface: 'bowl',
        showPath: true,
      },
      content: {
        text: 'Imagine a high-dimensional mountain range where the "height" is the error (loss). Learning is the act of finding the lowest valley. The steeper the terrain, the faster we move—but the riskier it becomes.',
        goDeeper: {
          explanation: 'In real neural networks, this landscape has millions of dimensions (one for each weight). We can only visualize 2 or 3. The shape of this surface is determined by the network architecture, the activation functions, and the training data.',
        },
      },
      interactionHint: 'Click anywhere on the landscape to drop a "worker" and watch it slide down the gradient toward the minimum.',
    },
    {
      id: 'momentum-physics',
      title: 'Inertia: Momentum',
      visualizationProps: {
        mode: 'comparison-viz',
        surface: 'ravine',
        optimizers: ['sgd', 'momentum'],
      },
      content: {
        text: 'Vanilla SGD (Stochastic Gradient Descent) is like a ball with no mass—it stops the moment the gradient hits 0. Momentum adds "physical inertia." It helps the optimizer blast through small plateaus and stay steady in narrow ravines.',
        goDeeper: {
          math: 'v_t = \\beta v_{t-1} + (1 - \\beta) \\nabla J(\\theta)',
          explanation: 'The velocity $v_t$ is a moving average of past gradients. The hyperparameter $\\beta$ (usually 0.9) determines how much of the "previous speed" we keep. This extra push helps escape shallow local minima and dampens oscillations.',
        },
      },
      interactionHint: 'Watch how Momentum (blue) avoids the jittery oscillations of vanilla SGD (red) in the narrow ravine.',
    },
    {
      id: 'adaptive-rates-adam',
      title: 'Adaptivity: Adam',
      visualizationProps: {
        mode: 'comparison-viz',
        surface: 'saddle',
        optimizers: ['momentum', 'adam'],
      },
      content: {
        text: 'Different weights might need different learning rates. Adam (Adaptive Moment Estimation) keeps track of both the average gradient (momentum) AND the average squared gradient (to measure volatility). It automatically scales the step size for each individual weight.',
        goDeeper: {
          math: 'm_t = \\beta_1 m_{t-1} + (1 - \\beta_1)g_t, \\quad v_t = \\beta_2 v_{t-1} + (1 - \\beta_2)g_t^2',
          explanation: 'Adam combines the benefits of Momentum and RMSprop. It is the "gold standard" for most deep learning tasks today because it requires very little manual tuning of the learning rate.',
        },
      },
      interactionHint: 'Observe how Adam handles the "Saddle Point" (a flat plateau that looks like a horse saddle)—it speeds up much faster than Momentum.',
    },
    {
      id: 'batch-sizes',
      title: 'Batch vs Mini-Batch vs SGD',
      visualizationProps: {
        mode: 'path-comparison-viz',
      },
      content: {
        text: 'Should we calculate the gradient for the WHOLE dataset at once? That is "Batch Gradient Descent". Or one point at a time? That is "Stochastic" (SGD). Most people use "Mini-Batch"—a sweet spot in the middle.',
        goDeeper: {
          explanation: 'Batch is stable but slow and uses too much memory. SGD is fast but bouncy (noisy). Mini-Batch (e.g., 32 or 64 samples) uses the power of modern GPUs to calculate gradients quickly while providing enough noise to escape small local minima.',
        },
      },
    },
    {
      id: 'rmsprop-adagrad',
      title: 'The Ancestors: AdaGrad & RMSprop',
      visualizationProps: {
        mode: 'comparison-viz',
        surface: 'ravine',
        optimizers: ['adagrad', 'rmsprop'],
      },
      content: {
        text: 'Before Adam, we had AdaGrad (which slowed down every weight) and RMSprop (which fixed AdaGrad by using a moving average). Understanding these explains exactly WHY Adam works so well.',
        goDeeper: {
          explanation: 'AdaGrad can stop learning too early because the accumulated squared gradients only grow, eventually making the learning rate zero. RMSprop "forgets" distant history, allowing the optimizer to keep moving.',
        },
      },
    },
    {
      id: 'lr-warmup',
      title: 'The Warmup Phase',
      visualizationProps: {
        mode: 'warmup-viz',
      },
      content: {
        text: 'At the very start of training, the model is totally random and gradients can be massive. We often start with an extremely tiny learning rate and "warm up" to our target over the first few thousand steps.',
        goDeeper: {
          explanation: 'This prevents the initial random gradients from completely destroying the fragile early weight initialization. It is essential for training massive Transformer models stabley.',
        },
      },
    },
    {
      id: 'nesterov-momentum',
      title: 'Nesterov: Looking Ahead',
      visualizationProps: {
        mode: 'nesterov-viz',
      },
      content: {
        text: 'Standard Momentum calculates the gradient at the current spot and THEN adding speed. Nesterov Momentum is "smarter"—it jumps ahead and calculates the gradient where we are MOVING to.',
        goDeeper: {
          explanation: 'This "look-ahead" behavior allows Nesterov to adjust its course sooner, resulting in even faster convergence and less overshooting at the bottom of the valley.',
        },
      },
    },
    {
      id: 'local-minima-depth',
      title: 'Local Minima: Fact or Fiction?',
      visualizationProps: {
        mode: 'landscape-viz',
        surface: 'local-minima',
        interactive: true,
      },
      content: {
        text: 'People used to fear "getting stuck" in a shallow local minimum. In millions of dimensions, this is actually rare—there is usually at least one direction that continues to slope down.',
        goDeeper: {
          explanation: 'The real enemy isn\'t local minima, but "Saddle Points"—vast, flat plateaus where the gradient is near zero. Adaptive optimizers like Adam are specifically designed to power through these flat regions.',
        },
      },
    },
  ],
  playground: {
    description: 'Race different optimizers! Choose a landscape, set hyperparameters, and see who reaches the global minimum first.',
    parameters: [
      { id: 'surface', label: 'Landscape', type: 'select', options: ['bowl', 'ravine', 'saddle', 'local-minima'], default: 'bowl' },
      { id: 'lr', label: 'Learning Rate', type: 'slider', min: 0.001, max: 0.5, step: 0.001, default: 0.1 },
      { id: 'beta', label: 'Momentum (Beta)', type: 'slider', min: 0.5, max: 0.99, step: 0.01, default: 0.9 },
    ],
    tryThis: [
      'Set a very high learning rate on the "Local Minima" surface. Does the optimizer jump out of the trap?',
      'Compare Adam vs SGD on the "Saddle" surface. Notice the difference in "acceleration".',
    ],
  },
  challenges: [
    {
      id: 'escape-saddle',
      title: 'The Saddle Point Escape',
      description: 'Find a combination of Optimizer and Learning Rate that reaches the center (loss < 0.05) in under 100 steps on the "Saddle" surface.',
      props: {
        mode: 'landscape-viz',
        surface: 'saddle',
        interactive: true,
      },
      completionCriteria: { type: 'threshold', target: 0.05, metric: 'minLoss' },
      hints: [
        'Vanilla SGD often gets stuck or moves incredibly slowly on flat saddle points.',
        'Try using Adam or Momentum with a slightly higher learning rate.',
      ],
    },
  ],
};

export default optimizersModule;
