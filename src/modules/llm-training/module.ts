import type { ModuleData } from '@/core/types';

export const llmTrainingModule: ModuleData = {
  id: 'llm-training',
  tierId: 3,
  clusterId: 'advanced-architectures',
  title: 'LLM Training Pipeline',
  description: 'From Pre-training on the internet to RLHF and specialized Fine-tuning.',
  tags: ['LLMs', 'RLHF', 'Fine-tuning', 'Pre-training'],
  prerequisites: ['transformers'],
  difficulty: 'advanced',
  estimatedMinutes: 60,
  steps: [
    {
      id: 'pre-training-objective',
      title: 'Pre-training: Causal Language Modeling',
      visualizationProps: {
        mode: 'clm-viz',
      },
      content: {
        text: 'Language models are first trained to predict the next token in a sequence. By doing this on trillions of words from the internet, they learn the structure of human language, facts about the world, and even reasoning abilities.',
        goDeeper: {
          math: '\\mathcal{L} = \\sum_t \\log P(x_t | x_{<t}, \\theta)',
          explanation: 'The loss function is the negative log-likelihood of the correct next token. We minimize this across the entire training corpus.',
        },
      },
    },
    {
      id: 'tokenization-depth',
      title: 'Tokenization: Byte-Pair Encoding (BPE)',
      visualizationProps: {
        mode: 'tokenizer-interactive',
        interactive: true,
      },
      content: {
        text: 'Models don\'t see words. They see "tokens". Tokenization is the process of breaking text into sub-word units. BPE iteratively merges the most frequent pairs of characters into new tokens.',
        goDeeper: {
          explanation: 'Sub-word tokenization allows the model to handle rare words and even made-up words by breaking them into familiar pieces. A vocabulary of 32k to 128k tokens is common today.',
        },
      },
    },
    {
      id: 'supervised-fine-tuning',
      title: 'SFT: Learning to Follow Instructions',
      visualizationProps: {
        mode: 'sft-viz',
      },
      content: {
        text: 'After pre-training, a model is a "completion machine". To make it an "assistant", we fine-tune it on a high-quality dataset of Instruction-Response pairs ($Q \\to A$).',
        goDeeper: {
          explanation: 'Supervised Fine-Tuning (SFT) teaches the model the "style" of being helpful. This is where it learns that when a human says "write a poem", it should respond with a poem, not just more text about poems.',
        },
      },
    },
    {
      id: 'rlhf-overview',
      title: 'RLHF: Reward Modeling',
      visualizationProps: {
        mode: 'rlhf-loop-viz',
      },
      content: {
        text: 'SFT is limited by the amount of perfect data we have. Reinforcement Learning from Human Feedback (RLHF) allows the model to learn from human "preferences" (A is better than B).',
        goDeeper: {
          explanation: 'We first train a "Reward Model" to predict which response a human would prefer. Then, we use an RL algorithm (like PPO or DPO) to optimize the LLM to maximize that reward.',
        },
      },
    },
    {
      id: 'lora-efficiency',
      title: 'LoRA: Parameter-Efficient Fine-Tuning',
      visualizationProps: {
        mode: 'lo-ra-viz',
        interactive: true,
      },
      content: {
        text: 'Fine-tuning a 70B parameter model is expensive. Low-Rank Adaptation (LoRA) allows us to train only a tiny fraction of the weights (low-rank matrices) while keeping the base model frozen.',
        goDeeper: {
          math: 'W\' = W + BA \\quad (A \\in \\mathbb{R}^{r \\times d}, B \\in \\mathbb{R}^{d \\times r})',
          explanation: 'By setting rank $r$ to be very small (e.g., 8 or 16), we reduce the number of trainable parameters by 10,000x with almost no loss in performance.',
        },
      },
    },
  ],
  playground: {
    description: 'Experiment with LLM training parameters like Temperature and LoRA rank.',
    parameters: [],
    tryThis: [
      'Adjust the temperature to see how the probability distribution shifts.',
      'Change the LoRA rank and notice the change in trainable parameter count.',
    ],
  },
  challenges: [],
};

export default llmTrainingModule;
