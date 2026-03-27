import { ModuleData } from '../../core/types';

export const moduleData: ModuleData = {
  id: 'python-basics',
  tierId: 0.5,
  clusterId: 'engineering',
  title: 'Python for AI',
  description: 'Master the Python syntax and data structures essential for machine learning.',
  tags: ['Python', 'Basics', 'Engineering'],
  prerequisites: [],
  difficulty: 'beginner',
  estimatedMinutes: 40,
  steps: [
    {
      id: 'intro',
      title: 'Why Python?',
      visualizationProps: { mode: 'code-highlight' },
      content: {
        text: "Python is the lingua franca of AI. Its readable syntax and vast ecosystem (NumPy, PyTorch, Scikit-Learn) make it the perfect tool for research and production. We'll focus on the specific features used in ML: list comprehensions, dictionary unpacking, and clean object-oriented design.",
      },
    },
    {
      id: 'comprehensions',
      title: 'List Comprehensions',
      visualizationProps: { mode: 'interactive-comprehension' },
      content: {
        text: "In AI, we often transform data sequences. List comprehensions are concise, efficient ways to create new lists from existing ones. \n\nFormula: `[expression for item in iterable if condition]`",
        goDeeper: {
          explanation: "Comprehensions are often faster than explicit for-loops because they are optimized at the C-level in CPython. In ML, we use them for preprocessing labels, filtering datasets, or generating configuration grids.",
          math: "\\text{NewList} = \\{ f(x) \\mid x \\in S, P(x) \\}",
        },
      },
      interactionHint: "Modify the transformation function to see how the list changes.",
    },
    {
      id: 'args-kwargs',
      title: 'Flexibility with *args and **kwargs',
      visualizationProps: { mode: 'param-expansion' },
      content: {
        text: "Neural network layers often have dozens of hyperparameters. Python's argument unpacking allows us to pass dictionaries of configurations directly into functions, making our code modular and scalable.",
      },
    },
    {
      id: 'classes',
      title: 'Classes & Inheritance',
      visualizationProps: { mode: 'class-diagram' },
      content: {
        text: "Frameworks like PyTorch rely heavily on Object-Oriented Programming (OOP). Every model is a class that inherits from `nn.Module`. Understanding how classes store state and methods is crucial for building custom architectures.",
      },
    },
     {
      id: 'lambda',
      title: 'Lambda Functions',
      visualizationProps: { mode: 'functional-map' },
      content: {
        text: "Anonymous functions (lambdas) are used for quick data transformations, especially when applying functions to datasets (like in Pandas or Spark).",
      },
    },
     {
      id: 'decorators',
      title: 'Decorators & Wrappers',
      visualizationProps: { mode: 'decorator-viz' },
      content: {
        text: "Decorators allow us to 'wrap' functions to add logging, timing, or device placement (CPU/GPU) without modifying the original logic.",
      },
    },
     {
      id: 'generators',
      title: 'Generators & Data Loaders',
      visualizationProps: { mode: 'stream-viz' },
      content: {
        text: "When training on datasets too large for memory, we use Generators. They yield one item at a time, keeping our memory footprint low—a core concept behind PyTorch DataLoaders.",
      },
    },
    {
      id: 'final',
      title: 'Putting it All Together',
      visualizationProps: { mode: 'full-script' },
      content: {
        text: "You're now ready to tackle NumPy and PyTorch. These foundational Python skills will allow you to read research code and implement complex paper architectures with ease.",
      },
    },
  ],
  playground: {
    description: 'Experiment with Python code snippets.',
    parameters: [],
    tryThis: ['Write a list comprehension that squares all even numbers in a range.'],
  },
  challenges: [],
};
