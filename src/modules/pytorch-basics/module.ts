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
        text: "Tensors are the main data structure in PyTorch. They are essentially NumPy arrays that can live on GPUs (CUDA/MPS) and track their own gradient history. Learn shape operations, reshaping, and broadcasting.",
        goDeeper: {
          explanation: "Tensors are multi-dimensional arrays optimized for fast computation on GPUs. Unlike NumPy arrays, PyTorch tensors can compute gradients and execute on hardware accelerators. Understanding tensor shapes is crucial for debugging neural networks.",
          math: "\\text{Tensor shape} = (d_1, d_2, ..., d_n) \\text{ where each } d_i \\text{ is a dimension}",
        },
      },
    },
    {
      id: 'autograd',
      title: 'Autograd: Automatic Differentiation',
      visualizationProps: { mode: 'computation-graph' },
      content: {
        text: "The 'secret sauce' of PyTorch is Autograd. It builds a dynamic computation graph as you perform operations, allowing you to compute gradients for any complex chain of functions with a single call: `loss.backward()`. Watch how gradients flow backward through the network.",
        goDeeper: {
          explanation: "In the background, PyTorch uses a Tape-based Autograd system. Every operation creates a 'Function' object that knows how to compute the derivative of itself. When you call backward, it traverses these functions in reverse order (Reverse-Mode Automatic Differentiation). This is the foundation of backpropagation in deep learning.",
          math: "\\nabla_x y = \\frac{\\partial y}{\\partial z} \\cdot \\frac{\\partial z}{\\partial x} = \\text{Chain Rule}",
        },
      },
      interactionHint: "Observe the blue forward arrows and pink backward gradient flow.",
    },
    {
      id: 'modules',
      title: 'nn.Module: Building Blocks',
      visualizationProps: { mode: 'module-lifecycle' },
      content: {
        text: "In PyTorch, we organize our networks into 'Modules'. A module contains parameters (weights/biases) and a `forward()` method that defines the data flow. Modules can be nested to create deep, hierarchical architectures. Learn the full lifecycle from definition to training.",
        goDeeper: {
          explanation: "Every PyTorch model inherits from nn.Module. This provides automatic parameter tracking, device management, and built-in methods like .train() and .eval(). Nested modules allow you to build complex architectures from simpler building blocks.",
          math: "\\text{Model: Input} \\rightarrow \\text{Forward} \\rightarrow \\text{Output}",
        },
      },
      interactionHint: "See the step-by-step lifecycle from definition to optimization.",
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
      title: 'DataLoaders & Batching',
      visualizationProps: { mode: 'batch-viz' },
      content: {
        text: "PyTorch's `DataLoader` automates batching, shuffling, and multi-threaded data loading. Efficient data pipelines are critical for training—your GPU should never be idle waiting for data. Visualize how DataLoader batches samples together.",
        goDeeper: {
          explanation: "DataLoader creates mini-batches of data, allowing GPUs to process multiple samples in parallel. Shuffling improves model generalization by randomizing training order. Multi-threaded loading ensures data prefetching happens while the GPU processes the current batch.",
          math: "\\text{Batch} = [x_1, x_2, ..., x_b] \\text{ where } b = \\text{batch_size}",
        },
      },
      interactionHint: "Adjust batch size to see how data is grouped together.",
    },
    {
      id: 'loss-functions',
      title: 'Loss Functions: Measuring Error',
      visualizationProps: { mode: 'loss-functions' },
      content: {
        text: "Loss functions quantify how wrong your model's predictions are. Different tasks use different losses: MSE for regression, Cross-Entropy for classification, and BCE for binary problems. The goal of training is to minimize loss.",
        goDeeper: {
          explanation: "Loss functions are differentiable functions that measure prediction error. Backpropagation computes gradients of the loss with respect to all parameters, allowing the optimizer to update weights. Choosing the right loss function is crucial for model performance.",
          math: "\\text{Loss}(y_{pred}, y_{true}) = \\frac{1}{n}\\sum_i L(y_{pred}^{(i)}, y_{true}^{(i)})",
        },
      },
      interactionHint: "Switch between different loss functions and visualize their characteristics.",
    },
    {
      id: 'deployment',
      title: 'Ready for Research',
      visualizationProps: { mode: 'summary' },
      content: {
        text: "Congratulations! You now have the full stack: Tensors, Autograd, Modules, Data Loading, and Loss Functions. Plus Python fundamentals and NumPy. You are ready to explore the furthest frontiers of Artificial Intelligence and implement cutting-edge research.",
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
