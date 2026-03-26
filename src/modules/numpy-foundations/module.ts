import { ModuleData } from '../../core/types';

export const moduleData: ModuleData = {
  id: 'numpy-foundations',
  tierId: 0.5,
  clusterId: 'engineering',
  title: 'NumPy Foundations',
  description: 'The engine of numerical computing. Master broadcasting, indexing, and vectorization.',
  tags: ['NumPy', 'Arrays', 'Engineering'],
  prerequisites: ['python-basics', 'matrices'],
  difficulty: 'beginner',
  estimatedMinutes: 40,
  steps: [
    {
      id: 'arrays',
      title: 'The NDArray',
      visualizationProps: { mode: 'array-structure' },
      content: {
        text: "Unlike Python lists, NumPy arrays are contiguous blocks of memory. This allows for 'Vectorization'—performing operations on entire arrays at once via optimized C and Fortran kernels.",
      },
    },
    {
      id: 'vectorization',
      title: 'Vectorization vs. Loops',
      visualizationProps: { mode: 'speed-comparison' },
      content: {
        text: "In AI, speed is everything. A vectorized NumPy operation can be 100x faster than a Python for-loop. Always look for ways to replace loops with array operations.",
        goDeeper: {
          explanation: "Vectorization utilizes SIMD (Single Instruction, Multiple Data) instructions on modern CPUs. This means a single cycle can perform operations on multiple data points simultaneously.",
          math: "\\mathbf{C} = \\mathbf{A} + \\mathbf{B} \\quad \\text{vs} \\quad \\forall i, c_i = a_i + b_i",
        },
      },
    },
    {
      id: 'broadcasting',
      title: 'The Magic of Broadcasting',
      visualizationProps: { mode: 'broadcasting-viz' },
      content: {
        text: "Broadcasting allows NumPy to work with arrays of different shapes during arithmetic operations. The smaller array is 'broadcast' across the larger one so that they have compatible shapes.",
      },
      interactionHint: "Change the shape of the secondary array to see if it can broadcast.",
    },
    {
      id: 'indexing',
      title: 'Slicing & Fancy Indexing',
      visualizationProps: { mode: 'slicing-viz' },
      content: {
        text: "Efficiently selecting data is key for preprocessing. NumPy supports multidimensional slicing and boolean masking (selecting elements that meet a condition).",
      },
    },
     {
      id: 'reshape',
      title: 'Reshaping & Axes',
      visualizationProps: { mode: 'axis-viz' },
      content: {
        text: "Understanding axes (rows=0, cols=1) is vital for operations like `np.sum` or `np.mean`. Reshaping allows us to change how data is viewed without copying it in memory.",
      },
    },
    {
      id: 'linalg',
      title: 'Linear Algebra in NumPy',
      visualizationProps: { mode: 'dot-product' },
      content: {
        text: "NumPy provides `np.dot`, `np.matmul`, and `@` for matrix multiplication. This is the mathematical core of neural network forward passes.",
      },
    },
    {
      id: 'random',
      title: 'Random Number Generation',
      visualizationProps: { mode: 'random-dist' },
      content: {
        text: "Initializing weights requires random numbers from specific distributions (Normal, Uniform, Xavier). NumPy's `random` module is the standard for this.",
      },
    },
    {
      id: 'summary',
      title: 'NumPy Mastery',
      visualizationProps: { mode: 'logo' },
      content: {
        text: "You've mastered the foundation of high-performance computing in Python. Next, we'll see how PyTorch takes these concepts and adds GPU acceleration and automatic gradients.",
      },
    },
  ],
  playground: {
    description: 'Experiment with NumPy array operations.',
    parameters: [],
    tryThis: ['Create a 3x3 identity matrix and multiply it by a random vector.'],
  },
  challenges: [],
};
