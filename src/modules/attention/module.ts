import type { ModuleData } from '@/core/types';

const attentionModule: ModuleData = {
  id: 'attention',
  tierId: 3,
  clusterId: 'advanced-architectures',
  title: 'Attention Mechanism',
  description:
    'Queries, Keys, and Values — the core mechanism that powers Transformers and modern LLMs.',
  tags: ['attention', 'transformers', 'nlp', 'deep-learning'],
  prerequisites: ['perceptrons', 'dot-product'],
  difficulty: 'advanced',
  estimatedMinutes: 50,
  steps: [
    {
      id: 'the-database-analogy',
      title: 'The Database Analogy',
      visualizationProps: {
        mode: 'database',
        query: [1, 0, 0],
        keys: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
        values: ['Apple', 'Banana', 'Cherry'],
      },
      content: {
        text: 'Think of attention like a soft dictionary lookup. You have a Query (what you want). The database has Keys (what they offer) mapped to Values (the actual content).',
        goDeeper: {
          explanation:
            'Unlike a normal database where a query either exactly matches a key or doesn\'t, attention computes a similarity score (via dot product) between the query and EVERY key, returning a weighted sum of all values.',
        },
      },
    },
    {
      id: 'query-key-dot-product',
      title: 'Query-Key Dot Product',
      visualizationProps: {
        mode: 'interactive',
        draggableQuery: true,
        query: [1, 0],
        keys: [[1, 0], [0.7, 0.7], [0, 1], [-1, 0]],
        showScores: true,
      },
      content: {
        text: 'We measure similarity using the dot product. Drag the Query vector around. Notice how Keys that point in the same direction get high scores, and opposites get low scores.',
        goDeeper: {
          math: '\\text{Score}(Q, K_i) = Q \\cdot K_i',
          explanation: 'This relies heavily on the dot product measuring alignment. This is why we spent time on the Dot Product in the Mathematical Foundations tier!',
        },
      },
      interactionHint: 'Drag the Query vector to change similarity scores',
    },
    {
      id: 'softmax-weights',
      title: 'Softmax: Turning Scores into Probabilities',
      visualizationProps: {
        mode: 'softmax',
        draggableQuery: true,
        query: [1, 0],
        keys: [[1, 0], [0.7, 0.7], [0, 1], [-1, 0]],
        showScores: true,
        showSoftmax: true,
      },
      content: {
        text: 'Dot products can be large numbers, positive or negative. We pass them through a Softmax function to squash them into probabilities that sum to 1.',
        goDeeper: {
          math: '\\alpha_i = \\frac{e^{\\text{Score}_i}}{\\sum_j e^{\\text{Score}_j}}',
          explanation: 'Exponentiating the scores makes them positive and exaggerates differences (the "max" part). Dividing by the sum makes them a valid probability distribution (the "soft" part).',
        },
      },
    },
    {
      id: 'weighted-sum-values',
      title: 'The Weighted Sum of Values',
      visualizationProps: {
        mode: 'values',
        draggableQuery: true,
        query: [1, 0],
        keys: [[1, 0], [-1, 0]],
        values: [[1, 1], [2, -1]],
        showSoftmax: true,
        showOutput: true,
      },
      content: {
        text: 'Finally, we multiply the Values by these probabilities and add them up. If the Query perfectly matches Key 1, the output is exactly Value 1.',
        goDeeper: {
          math: '\\text{Output} = \\sum_i \\alpha_i V_i',
          explanation: 'This whole process is differentiable! The model learns the weight matrices that project inputs into useful Q, K, and V spaces during training.',
        },
      },
    },
    {
      id: 'self-attention',
      title: 'Self-Attention: Context is Everything',
      visualizationProps: {
        mode: 'self-attention',
      },
      content: {
        text: 'In "Self-Attention" (like in a Transformer), every word in a sentence acts as a Query, Key, AND Value simultaneously. This allows words to update their meaning based on their context.',
        goDeeper: {
          math: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V',
          explanation: 'The paper "Attention Is All You Need" introduced this structure. Scaling by the square root of the dimension prevents the dot products from growing too large and pushing softmax into regions with vanishing gradients.',
        },
      },
    },
    {
      id: 'multi-head-attention',
      title: 'Multi-Head Attention: Parallel Reasoning',
      visualizationProps: {
        mode: 'multihead-viz',
      },
      content: {
        text: 'Why just one attention head? Modern models use 8, 12, or even 96 "Heads". Each head learns to focus on different things: one might find grammar, another might find physical relationships, and a third might find emotion.',
        goDeeper: {
          explanation: 'Each head is a separate set of Q, K, V projection matrices. We run them in parallel, concatenate the results, and project them back down. This allows the model to look at the same sentence from many different "angles" at once.',
        },
      },
    },
    {
      id: 'scaling-factor-depth',
      title: 'The Scaling Factor: Why $\\sqrt{d_k}$?',
      visualizationProps: {
        mode: 'scaling-viz',
        interactive: true,
      },
      content: {
        text: 'As the dimension of our vectors ($d_k$) grows, dot products grow larger. Without the $\\sqrt{d_k}$ scaling, the Softmax gets "stuck" on a single key, making learning impossible.',
        goDeeper: {
          explanation: 'If dot products are too large, the softmax output becomes a "one-hot" vector with gradients near zero everywhere else. Scaling keeps the distribution soft enough for backpropagation to work effectively.',
        },
      },
    },
    {
      id: 'masked-attention',
      title: 'Masked Attention: No Peeking!',
      visualizationProps: {
        mode: 'masking-viz',
      },
      content: {
        text: 'When generating text one word at a time, the model shouldn\'t see "future" words. We use a mask to set future similarity scores to $-\\infty$, effectively making future words invisible to the attention mechanism.',
        goDeeper: {
          explanation: 'This maintains "Causality". Without masking, a model would simply learn to copy the next word in the training data rather than learning to predict it from context.',
        },
      },
    },
    {
      id: 'cross-attention',
      title: 'Cross-Attention: The Bridge',
      visualizationProps: {
        mode: 'cross-attention-viz',
      },
      content: {
        text: 'In translation, the "Decoder" (generating target language) needs to look at the "Encoder" (reading source language). This is Cross-Attention: the Queries come from the decoder, but the Keys and Values come from the encoder.',
        goDeeper: {
          explanation: 'This allows the model to "peek" at the original French sentence while deciding which English word to write next. It is the key to high-quality machine translation.',
        },
      },
    },
  ],
  playground: {
    description: 'Experiment with queries and keys to see how attention focuses on different values.',
    parameters: [
      { id: 'qX', label: 'Query X', type: 'slider', min: -1, max: 1, step: 0.1, default: 1 },
      { id: 'qY', label: 'Query Y', type: 'slider', min: -1, max: 1, step: 0.1, default: 0 },
    ],
    tryThis: [
      'Point the query exactly at Key 2. Notice how its softmax weight approaches 1.0.',
      'Point the query halfway between two keys. See how the attention is split.',
    ],
  },
  challenges: [
    {
      id: 'focus-attention',
      title: 'Retrieve the Value',
      description: 'Adjust the Query vector to output a value close to [2, -1] (Value 2).',
      props: {
        mode: 'values',
        draggableQuery: true,
        query: [0, 1],
        keys: [[1, 0], [-1, 0]],
        values: [[1, 1], [2, -1]],
        showSoftmax: true,
        showOutput: true,
      },
      completionCriteria: { type: 'threshold', target: 0.1, metric: 'distance_to_target' },
      hints: [
        'You want to give maximum weight to Key 2.',
        'Which direction should your Query point to maximize its dot product with Key 2?',
      ],
    },
  ],
};

export default attentionModule;
