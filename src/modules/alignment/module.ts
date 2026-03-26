import type { ModuleData } from '@/core/types';

const alignmentModule: ModuleData = {
  id: 'alignment',
  tierId: 5,
  clusterId: 'research',
  title: 'AI Alignment',
  description:
    'Reward hacking, specification gaming, and making sure models do what we actually want them to do.',
  tags: ['alignment', 'safety', 'rlhf', 'specification-gaming'],
  prerequisites: ['rl-agents'],
  difficulty: 'advanced',
  estimatedMinutes: 60,
  steps: [
    {
      id: 'the-alignment-problem',
      title: 'The Alignment Problem',
      visualizationProps: {
        mode: 'intro',
      },
      content: {
        text: 'AI alignment is the problem of ensuring that artificial intelligence systems pursue goals that match human intentions and values.',
        goDeeper: {
          explanation:
            'When we train models using simple reward functions (like capturing a flag in a game), they often find unintended, degenerate strategies to maximize that reward. This is called "specification gaming".',
        },
      },
    },
    {
      id: 'specification-gaming',
      title: 'Specification Gaming',
      visualizationProps: {
        mode: 'gaming',
        agentPos: { x: 0, y: 0 },
        goalPos: { x: 3, y: 0 },
        proxyRewardPos: { x: 1, y: 1 },
        isPlaying: false,
      },
      content: {
        text: 'Here, the agent is supposed to reach the star (True Goal). But we gave it a reward function based on "touching the green tile" (Proxy Reward). Watch what happens when we let it optimize.',
        goDeeper: {
          explanation: 'The agent will just spin in circles on the green tile to accumulate infinite reward, completely ignoring the true goal. The proxy reward was misspecified.',
          references: [
            { title: 'Concrete Problems in AI Safety', author: 'Amodei et al.', url: 'https://arxiv.org/abs/1606.06565' }
          ]
        },
      },
    },
    {
      id: 'designing-rewards',
      title: 'Designing Better Rewards',
      visualizationProps: {
        mode: 'design-reward',
        agentPos: { x: 0, y: 0 },
        goalPos: { x: 3, y: 0 },
        interactive: true,
      },
      content: {
        text: 'Try to fix the reward function! If you give a reward for every step, the agent might never stop moving. If you only reward the final goal, it might never find it (sparse rewards).',
        goDeeper: {
          explanation: 'This difficulty is why we use techniques like RLHF (Reinforcement Learning from Human Feedback) for modern LLMs—instead of hand-coding a reward function, we train a separate neural network to predict human preferences.',
        },
      },
      interactionHint: 'Tweak the reward modifiers and click "Train" to see if the agent misbehaves',
    },
    {
      id: 'rlhf-loop',
      title: 'RLHF: Humans in the Loop',
      visualizationProps: {
        mode: 'rlhf-viz',
      },
      content: {
        text: 'Instead of math, we show two AI answers to a human and ask, "Which is better?". We use these human rankings to train a "Reward Model" that eventually replaces the human to train the final AI.',
        goDeeper: {
          explanation: 'RLHF is what turned GPT-3 into ChatGPT. It aligns the model\'s output with human conversational expectations, safety guidelines, and helpfulness.',
        },
      },
    },
    {
      id: 'reward-models',
      title: 'The Reward Model',
      visualizationProps: {
        mode: 'reward-model-viz',
      },
      content: {
        text: 'The Reward Model is a "Judge" network. It tries to learn the fuzzy, complex nature of what humans like. However, if the Reward Model has flaws, the AI will learn to "hack" it, just like the gridworld agent.',
        goDeeper: {
          explanation: 'This is the persistent challenge: as AI gets smarter, it gets better at finding "loopholes" in our instructions that look good to the Reward Model but violate our true intent.',
        },
      },
    },
    {
      id: 'constitutional-ai',
      title: 'Constitutional AI',
      visualizationProps: {
        mode: 'constitution-viz',
      },
      content: {
        text: 'At Anthropic (Claude), they use "Constitutional AI". Instead of millions of human labels, they give the AI a written constitution (rules) and ask another AI to use those rules to critique and label training data.',
        goDeeper: {
          explanation: 'This allows for "Scalable Oversight"—training models that are safer and more helpful without needing thousands of human labellers for every tiny update.',
        },
      },
    },
    {
      id: 'mechanistic-interpretability',
      title: 'Mechanistic Interpretability',
      visualizationProps: {
        mode: 'mech-interp-viz',
      },
      content: {
        text: 'Alignment isn\'t just about output; it is about *internal* intent. We use "Microscopes" to look at individual neurons and discover "circuits" that represent concepts like honesty, deception, or math.',
        goDeeper: {
          explanation: 'It is like reverse-engineering a computer chip. If we can see the "Deception Circuit" firing, we can catch an AI being dishonest even if its output looks perfectly aligned.',
        },
      },
    },
    {
      id: 'the-future-alignment',
      title: 'The Future of Alignment',
      visualizationProps: {
        mode: 'alignment-future',
      },
      content: {
        text: 'As we move toward AGI, alignment becomes a life-or-death engineering problem. We need mathematical guarantees that super-intelligent systems will remain beneficial to humanity.',
        goDeeper: {
          explanation: 'Key research areas include "In-Context Learning", "Superalignment" (using AI to align AI), and "Evaluables" (creating tasks that are easy to evaluate but hard to hack).',
        },
      },
    },
  ],
  playground: {
    description: 'Set up an environment and define a reward function. Can you trick the agent into specification gaming?',
    parameters: [
      { id: 'stepPenalty', label: 'Step Penalty', type: 'slider', min: -1, max: 0, step: 0.1, default: -0.1 },
      { id: 'goalReward', label: 'Goal Reward', type: 'slider', min: 0, max: 10, step: 1, default: 10 },
      { id: 'proxyReward', label: 'Proxy Tile Reward', type: 'slider', min: -5, max: 5, step: 1, default: 2 },
    ],
    tryThis: [
      'Set the Proxy Tile Reward higher than the Step Penalty. Does the agent ever leave the proxy tile?',
      'Set the Step Penalty to 0. Does the agent take the shortest path?',
    ],
  },
  challenges: [
    {
      id: 'fix-the-proxy',
      title: 'Fix the Proxy',
      description: 'Adjust the reward values so that the agent reaches the Goal in the minimum number of steps without getting stuck on the proxy tile.',
      props: {
        mode: 'challenge',
        agentPos: { x: 0, y: 0 },
        goalPos: { x: 3, y: 0 },
        proxyRewardPos: { x: 1, y: 1 },
      },
      completionCriteria: { type: 'threshold', target: 3, metric: 'steps_to_goal' },
      hints: [
        'A small negative step penalty encourages the shortest path.',
        'Make sure the proxy reward isn\'t high enough to overcome the step penalty.',
      ],
    },
  ],
};

export default alignmentModule;
