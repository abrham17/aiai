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
        text: "Python is the lingua franca of AI. Its readable syntax and vast ecosystem (NumPy, PyTorch, Scikit-Learn) make it the perfect tool for research and production. We'll learn the fundamentals from variables to object-oriented design.",
      },
    },
    {
      id: 'variables-types',
      title: 'Variables & Data Types',
      visualizationProps: { mode: 'variables-types' },
      content: {
        text: "Every program starts with data. Python supports strings, integers, floats, and booleans. These are the building blocks of all AI systems.",
        goDeeper: {
          explanation: "In Python, variables are just names pointing to objects. Unlike languages like C, you don't declare types—Python infers them. This flexibility is one reason Python is so popular for research and rapid prototyping.",
          math: "\\text{variable} := \\text{value}",
        },
      },
      interactionHint: "Try creating variables and see their types in the playground.",
    },
    {
      id: 'control-flow',
      title: 'Control Flow: Loops & Conditionals',
      visualizationProps: { mode: 'control-flow' },
      content: {
        text: "Decision making (if/else) and iteration (for/while) are the backbone of any algorithm. Learn how to control program execution based on conditions and automate repetitive tasks.",
        goDeeper: {
          explanation: "Python's for-loop uses iterables, not traditional C-style indexed loops. This makes code more Pythonic and less error-prone. The range() function is crucial for generating sequences.",
          math: "\\text{for } x \\text{ in } S: \\text{process}(x)",
        },
      },
      interactionHint: "Observe how loop iterations progress step-by-step.",
    },
    {
      id: 'functions-scope',
      title: 'Functions & Variable Scope',
      visualizationProps: { mode: 'functions-scope' },
      content: {
        text: "Functions are reusable blocks of code. Understanding scope (local vs global vs nonlocal) prevents bugs and makes code maintainable. This is crucial for building complex ML pipelines.",
        goDeeper: {
          explanation: "Python uses LEGB rule: Local, Enclosing, Global, Built-in. Variables are resolved in this order. Understanding scope prevents name collisions and improves code clarity.",
          math: "f(x, y=10) \\rightarrow \\text{return } x + y",
        },
      },
      interactionHint: "Modify function parameters and return values.",
    },
    {
      id: 'collections',
      title: 'Lists, Dicts, Sets & Tuples',
      visualizationProps: { mode: 'collections' },
      content: {
        text: "Collections are groups of data. Lists are ordered and mutable, tuples immutable, dicts map keys to values, and sets store unique items. Mastering these is essential for data processing.",
        goDeeper: {
          explanation: "Different collections have different characteristics. Lists are versatile; dicts are fast for lookups; sets guarantee uniqueness. Choosing the right data structure is key to performance.",
          math: "\\text{dict} = \\{\\text{key}: \\text{value}\\}",
        },
      },
      interactionHint: "Try operations like indexing, slicing, and membership testing.",
    },
    {
      id: 'comprehensions',
      title: 'List Comprehensions & Generators',
      visualizationProps: { mode: 'interactive-comprehension' },
      content: {
        text: "In AI, we often transform data sequences. List comprehensions are concise, efficient ways to create new lists. Generator expressions save memory for large datasets.",
        goDeeper: {
          explanation: "Comprehensions are often faster than explicit for-loops because they are optimized at the C-level in CPython. In ML, we use them for preprocessing labels, filtering datasets, or generating configuration grids.",
          math: "\\text{NewList} = \\{ f(x) \\mid x \\in S, P(x) \\}",
        },
      },
      interactionHint: "Modify the transformation function to see how the list changes.",
    },
    {
      id: 'classes',
      title: 'Classes & Object-Oriented Design',
      visualizationProps: { mode: 'class-diagram' },
      content: {
        text: "Frameworks like PyTorch rely heavily on OOP. Every model is a class that inherits from `nn.Module`. Learn classes, methods, attributes, and inheritance patterns used in production code.",
        goDeeper: {
          explanation: "Classes bundle data (attributes) and behavior (methods). Inheritance allows code reuse and hierarchical design. Understanding `self`, `__init__()`, and method overriding is crucial for PyTorch.",
          math: "\\text{class Child(Parent)}: \\text{ inherits properties}",
        },
      },
      interactionHint: "Explore the inheritance hierarchy of a PyTorch-like model.",
    },
    {
      id: 'file-strings',
      title: 'File I/O & String Operations',
      visualizationProps: { mode: 'file-strings' },
      content: {
        text: "Handling files and text is essential for loading datasets and processing NLP data. Learn reading/writing files, string formatting (f-strings), and common string methods.",
        goDeeper: {
          explanation: "F-strings (f\"value is {x}\") are the modern, efficient way to format strings in Python. File operations often use context managers (with statement) to ensure proper resource cleanup.",
          math: "\\text{f-string} = \\text{f}\\\"\\{\\text{expression}\\}\\\"",
        },
      },
      interactionHint: "Try reading files and formatting strings with variables.",
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
      id: 'lambda',
      title: 'Lambda Functions & Functional Programming',
      visualizationProps: { mode: 'functional-map' },
      content: {
        text: "Anonymous functions (lambdas) are used for quick data transformations, especially with map(), filter(), and sorted(). They're concise but use sparingly for readability.",
      },
    },
    {
      id: 'decorators',
      title: 'Decorators & Function Wrappers',
      visualizationProps: { mode: 'decorator-viz' },
      content: {
        text: "Decorators allow us to 'wrap' functions to add logging, timing, or device placement (CPU/GPU) without modifying the original logic. Essential for clean PyTorch code.",
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
        text: "Congratulations! You've mastered Python fundamentals from variables to OOP. You're now ready to tackle NumPy and PyTorch. These skills will allow you to read research code and implement complex architectures with ease.",
      },
    },
  ],
  playground: {
    description: 'Experiment with Python code snippets in an interactive playground.',
    parameters: [
      {
        name: 'code_editor',
        description: 'Write and execute Python code in real-time',
        type: 'string',
        default: 'print("Hello, Python!")',
      },
    ],
    tryThis: [
      'Write a list comprehension that squares all even numbers from 1 to 10.',
      'Create a function that takes *args and prints them all.',
      'Define a class with __init__ and a method that prints instance attributes.',
      'Use a for loop to iterate through a dictionary and print key-value pairs.',
      'Write a lambda function that sorts a list of tuples by the second element.',
    ],
  },
  challenges: [],
};
