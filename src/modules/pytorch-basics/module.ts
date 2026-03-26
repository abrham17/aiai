import { ModuleData } from '../../core/types';

export const moduleData: ModuleData = {
  id: 'pytorch-basics',
  tierId: 0.5,
  clusterId: 'engineering',
  title: 'PyTorch Essentials',
  description: 'Master the framework that powers modern AI research. Tensors, Autograd, and Modules.',
  tags: ['PyTorch', 'Deep Learning', 'Engineering'],
  prerequisites: ['numpy-foundations', 'backpropagation'],
  difficulty: 'intermediate',
  estimatedMinutes: 50,
  steps: [
    {
      id: 'tensors',
      title: 'Tensors: GPU-Accelerated Arrays',
      visualizationProps: { mode: 'tensor-viz' },
      content: {
        text: "Tensors are the main data structure in PyTorch. They are essentially NumPy arrays that can live on GPUs (CUDA/MPS) and track their own gradient history.",
      },
    },
    {
      id: 'autograd',
      title: 'Autograd: Automatic Differentiation',
      visualizationProps: { mode: 'computation-graph' },
      content: {
        text: "The 'secret sauce' of PyTorch is Autograd. It builds a dynamic computation graph as you perform operations, allowing you to compute gradients for any complex chain of functions with a single call: `loss.backward()`.",
        goDeeper: {
          explanation: "In the background, PyTorch uses a Tape-based Autograd system. Every operation creates a 'Function' object that knows how to compute the derivative of itself. When you call backward, it traverses these functions in reverse order (Reverse-Mode AD).",
          math: "\\nabla_x y = \\frac{\\partial y}{\\partial z} \\cdot \\frac{\\partial z}{\\partial x}",
        },
      },
    },
    {
      id: 'modules',
      title: 'nn.Module: Building Blocks',
      visualizationProps: { mode: 'module-lifecycle' },
      content: {
        text: "In PyTorch, we organize our networks into 'Modules'. A module contains parameters (weights/biases) and a `forward()` method that defines the data flow. Modules can be nested to create deep, hierarchical architectures.",
      },
    },
    {
      id: 'training-loop',
      title: 'The 5-Step Training Loop',
      visualizationProps: { mode: 'loop-viz' },
      content: {
        text: "Every PyTorch model for supervised learning follows this flow: \n1. Forward Pass \n2. Compute Loss \n3. zero_grad() \n4. Backward Pass \n5. optimizer.step()",
      },
    },
     {
      id: 'datasets',
      title: 'DataLoaders & Iterators',
      visualizationProps: { mode: 'batch-viz' },
      content: {
        text: "PyTorch's `DataLoader` automates batching, shuffling, and multi-threaded data loading, ensuring your GPU never waits for data from the disk.",
      },
    },
    {
      id: 'deployment',
      title: 'Ready for Research',
      visualizationProps: { mode: 'summary' },
      content: {
        text: "Congratulations! You now have the full stack: the Mathematical Foundations, the Machine Learning intuition, and the Engineering tools (Python, NumPy, PyTorch). You are ready to explore the furthest frontiers of Artificial Intelligence.",
      },
    },
  ],
  playground: {
    description: 'Experiment with PyTorch tensor operations.',
    parameters: [],
    tryThis: ['Perform a matrix multiplication of two tensors on the GPU.'],
  },
  challenges: [],
};
