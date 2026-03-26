import type { ModuleData } from '@/core/types';

const activationsModule: ModuleData = {
  id: 'activations',
  tierId: 2,
  clusterId: 'neural-networks',
  title: 'Activation Functions & Vanishing Gradients',
  description:
    'Why neural networks need non-linearity. Explore Sigmoid, Tanh, ReLU and learn why deep networks used to fail—and how modern activations fixed it.',
  tags: ['deep-learning', 'relu', 'sigmoid', 'tanh', 'vanishing-gradients'],
  prerequisites: ['perceptrons', 'backpropagation'],
  difficulty: 'intermediate',
  estimatedMinutes: 50,
  steps: [
    {
      id: 'why-non-linearity',
      title: 'Why We Need Non-Linearity',
      visualizationProps: {
        mode: 'linear-stack',
        activation: 'none',
        layers: 3,
      },
      content: {
        text: 'Without activation functions, stacking layers is pointless. No matter how many linear layers you stack, the result is always a single linear function. Three layers of y=2x composed together just give y=8x. You can never learn curves, spirals, or non-linear patterns.',
        goDeeper: {
          math: 'f(x) = W_3(W_2(W_1 x)) = (W_3 W_2 W_1)x = W_{combined} x',
          explanation: 'Matrix multiplication is associative. Any chain of linear transformations collapses into a single linear transformation. An activation function between layers breaks this collapse and allows the network to model any shape.',
        },
      },
    },
    {
      id: 'sigmoid-activation',
      title: 'Sigmoid: The Classic (And Its Fatal Flaw)',
      visualizationProps: {
        mode: 'function-plot',
        activation: 'sigmoid',
        showDerivative: true,
      },
      content: {
        text: 'The Sigmoid squishes any input to (0, 1). It was the original activation function. But look at its derivative—the maximum is only 0.25! When backpropagation multiplies this through 50 layers, gradients effectively become zero.',
        goDeeper: {
          math: '\\sigma(x) = \\frac{1}{1+e^{-x}}, \\quad \\sigma\'(x) = \\sigma(x)(1-\\sigma(x))',
          explanation: 'The derivative peaks at 0.25 when x=0. After multiplying 0.25 × 0.25 × ... across 50 layers, the gradient reaching the first layer is approximately 0.25^50 ≈ 10^{-30}. The early layers literally cannot learn. This is the Vanishing Gradient Problem.',
        },
      },
      interactionHint: 'Hover over the curve to see both the function value and its derivative at any point.',
    },
    {
      id: 'tanh-activation',
      title: 'Tanh: A Better Sigmoid',
      visualizationProps: {
        mode: 'function-plot',
        activation: 'tanh',
        showDerivative: true,
      },
      content: {
        text: 'Tanh is zero-centered (outputs range from -1 to +1), which helps with training dynamics. Its derivative peaks at 1.0 instead of 0.25. But it still saturates at the tails, so the vanishing gradient problem persists for very deep networks.',
        goDeeper: {
          math: '\\tanh(x) = \\frac{e^x - e^{-x}}{e^x + e^{-x}}, \\quad \\tanh\'(x) = 1 - \\tanh^2(x)',
          explanation: 'Tanh is actually a rescaled sigmoid: tanh(x) = 2σ(2x) - 1. Being zero-centered means the average output is 0, which prevents the gradients from being systematically biased in one direction.',
        },
      },
    },
    {
      id: 'relu-revolution',
      title: 'ReLU: The Revolution',
      visualizationProps: {
        mode: 'function-plot',
        activation: 'relu',
        showDerivative: true,
      },
      content: {
        text: 'ReLU (Rectified Linear Unit) is embarrassingly simple: max(0, x). For positive inputs, its derivative is exactly 1. This means gradients flow backward completely undiminished, no matter how deep the network. This single insight unlocked modern deep learning.',
        goDeeper: {
          math: 'f(x) = \\max(0, x), \\quad f\'(x) = \\begin{cases} 1 & x > 0 \\\\ 0 & x \\leq 0 \\end{cases}',
          explanation: 'The downside is the "Dying ReLU" problem: if a neuron\'s input is always negative, the gradient is permanently 0 and that neuron can never recover. Variants like Leaky ReLU (f(x) = max(0.01x, x)) fix this by allowing a small gradient for negative inputs.',
        },
      },
    },
    {
      id: 'vanishing-gradient-sim',
      title: 'The Vanishing Gradient Simulator',
      visualizationProps: {
        mode: 'gradient-flow',
        activation: 'sigmoid',
        layers: 10,
        interactive: true,
      },
      content: {
        text: 'This is the key insight. Watch how the gradient signal decays as it propagates backward through layers. With Sigmoid, it vanishes. With ReLU, it flows cleanly. Toggle between activations to see the dramatic difference.',
        goDeeper: {
          explanation: 'In 2012, using ReLU activations allowed AlexNet to train an 8-layer network on ImageNet, which was previously considered impossible with sigmoid/tanh. Today, networks with hundreds of layers (ResNets) are standard, thanks partly to ReLU and techniques like skip connections.',
        },
      },
      interactionHint: 'Switch between Sigmoid, Tanh, and ReLU to see the gradient magnitude at each layer. The bar height represents how much learning signal reaches that layer.',
    },
    {
      id: 'leaky-relu-variants',
      title: 'Solving "Dying ReLU": Leaky & PReLU',
      visualizationProps: {
        mode: 'function-plot',
        activation: 'leaky-relu',
        showDerivative: true,
      },
      content: {
        text: 'If a ReLU neuron stays in the negative zone (x < 0) for too long, it "dies" (its gradient is forever 0). Leaky ReLU adds a tiny slope (0.01) to keep the neuron alive.',
        goDeeper: {
          math: 'f(x) = \\max(0.01x, x)',
          explanation: 'By allowing a tiny bit of training signal through for negative inputs, we prevent entire sections of the brain from becoming permanently inactive. Parametric ReLU (PReLU) takes this further by let the network *learn* the best leakage slope.',
        },
      },
    },
    {
      id: 'elu-selu-math',
      title: 'Exponential Linear Units (ELU)',
      visualizationProps: {
        mode: 'function-plot',
        activation: 'elu',
        showDerivative: true,
      },
      content: {
        text: 'ELU makes the negative side smooth instead of jagged. This helps it converge faster by making the average activation closer to zero, much like zero-centered Tanh but without the vanishing gradient problems.',
        goDeeper: {
          math: 'f(x) = \\begin{cases} x & x > 0 \\\\ \\alpha(e^x - 1) & x \\leq 0 \\end{cases}',
          explanation: 'SELU (Scaled ELU) is a special variant that can make deep networks "Self-Normalizing," ensuring that activations don\'t explode or vanish even without Batch Normalization layers.',
        },
      },
    },
    {
      id: 'gelu-transformers',
      title: 'GeLU: The Transformer Standard',
      visualizationProps: {
        mode: 'function-plot',
        activation: 'gelu',
      },
      content: {
        text: 'Modern AI like ChatGPT and Stable Diffusion use GeLU (Gaussian Error Linear Unit). It blends the logic of ReLU with probability, creating a smooth "curved" activation that performs better in complex attention layers.',
        goDeeper: {
          explanation: 'GeLU weights inputs by their percentile in a normal distribution. It is effectively a stochastic ReLU: neurons follow the same principle but with a smoother, more differentiable "soft" activation around zero.',
        },
      },
    },
    {
      id: 'activation-hub',
      title: 'The Great Comparison Hub',
      visualizationProps: {
        mode: 'hub-comparison',
      },
      content: {
        text: 'Choosing an activation is a balance of speed, stability, and expressive power. ReLU is fast. GeLU is sophisticated. Sigmoid is legacy. Softmax is for outputs.',
        goDeeper: {
          explanation: 'Most modern practitioners start with ReLU/Leaky ReLU for hidden layers and use Softmax (classification) or Linear (regression) for the final output. When scaling to massive Transformers, GeLU/SwiGLU are the current state-of-the-art.',
        },
      },
    },
  ],
  playground: {
    description: 'Compare all activation functions side-by-side. Adjust the input range and layer depth.',
    parameters: [
      { id: 'activation', label: 'Activation Function', type: 'select', options: ['sigmoid', 'tanh', 'relu', 'leaky-relu'], default: 'sigmoid' },
      { id: 'layers', label: 'Number of Layers', type: 'slider', min: 1, max: 50, step: 1, default: 10 },
    ],
    tryThis: [
      'Set layers to 50 with Sigmoid. Watch the gradient bar for Layer 1 practically disappear.',
      'Switch to ReLU with 50 layers. Notice the gradient stays strong all the way back.',
    ],
  },
  challenges: [
    {
      id: 'fix-vanishing',
      title: 'Rescue the Deep Network',
      description: 'A 20-layer network with Sigmoid activations has a vanishing gradient (Layer 1 gradient < 0.001). Change the activation function to restore the gradient above 0.5.',
      props: {
        mode: 'gradient-flow',
        activation: 'sigmoid',
        layers: 20,
        interactive: true,
      },
      completionCriteria: { type: 'threshold', target: 0.5, metric: 'first_layer_gradient' },
      hints: [
        'Sigmoid\'s max derivative is 0.25. After 20 layers that\'s 0.25^20 ≈ 10^{-12}.',
        'Try ReLU! Its derivative for positive inputs is exactly 1.',
      ],
    },
  ],
};

export default activationsModule;
