import type { ModuleData } from '@/core/types';

const rlAgentsModule: ModuleData = {
  id: 'rl-agents',
  tierId: 4,
  clusterId: 'frontiers',
  title: 'Reinforcement Learning Agents',
  description:
    'States, actions, rewards, and Q-learning — teaching machines to learn from interaction.',
  tags: ['reinforcement-learning', 'q-learning', 'agents', 'rl'],
  prerequisites: ['perceptrons'],
  difficulty: 'intermediate',
  estimatedMinutes: 60,
  steps: [
    {
      id: 'agent-environment',
      title: 'Agent and Environment',
      visualizationProps: {
        mode: 'gridworld',
        gridSize: 4,
        agentPos: { x: 0, y: 0 },
        goalPos: { x: 3, y: 3 },
        obstacles: [{ x: 1, y: 1 }, { x: 2, y: 2 }],
        interactive: false,
      },
      content: {
        text: 'In Reinforcement Learning (RL), an Agent takes Actions in an Environment to maximize its cumulative Reward.',
        goDeeper: {
          explanation:
            'Unlike supervised learning where we have the "correct answers", RL relies on a reward signal. The agent must discover which actions yield the most reward by trying them.',
        },
      },
    },
    {
      id: 'exploration-vs-exploitation',
      title: 'Exploration vs Exploitation',
      visualizationProps: {
        mode: 'q-learning',
        gridSize: 4,
        agentPos: { x: 0, y: 0 },
        goalPos: { x: 3, y: 3 },
        obstacles: [{ x: 1, y: 1 }, { x: 2, y: 2 }],
        epsilon: 0.5,
        interactive: true,
      },
      content: {
        text: 'Should the agent try a random action to discover new paths (Explore), or use what it already knows to get a reward (Exploit)? This is controlled by Epsilon (ε).',
        goDeeper: {
          explanation: 'If ε = 1, the agent moves completely randomly. If ε = 0, it always picks the action it thinks is best. Typically, we start with high ε and decay it over time.',
        },
      },
      interactionHint: 'Change the Epsilon slider and watch the agent\'s behavior',
    },
    {
      id: 'the-bellman-equation',
      title: 'The Bellman Equation',
      visualizationProps: {
        mode: 'bellman',
        gridSize: 4,
        agentPos: { x: 0, y: 0 },
        goalPos: { x: 3, y: 3 },
        obstacles: [{ x: 1, y: 1 }, { x: 2, y: 2 }],
        learningRate: 0.1,
        discountFactor: 0.9,
        showQValues: true,
      },
      content: {
        text: 'The agent learns the value of being in a state using the Bellman Equation, which updates values backwards from the goal.',
        goDeeper: {
          math: 'Q(s, a) = (1-\\alpha)Q(s,a) + \\alpha (r + \\gamma \\max_{a\'} Q(s\', a\'))',
          explanation: 'It updates the Q-value by blending the old value with the new target: the immediate reward plus the discounted max value of the next state.',
        },
      },
    },
    {
      id: 'dqn-deep-q',
      title: 'DQN: Scaling to Pixels',
      visualizationProps: {
        mode: 'dqn-viz',
      },
      content: {
        text: 'Simple Q-Learning uses a table. But what if we have a billion states (like pixels in a game)? We use a Neural Network to *predict* the Q-values. This is a Deep Q-Network (DQN).',
        goDeeper: {
          explanation: 'DQN was the first major breakthrough of modern RL, allowing agents to play Atari games at superhuman levels just by looking at the screen.',
        },
      },
    },
    {
      id: 'policy-gradients',
      title: 'Policy Gradients',
      visualizationProps: {
        mode: 'policy-viz',
      },
      content: {
        text: 'Instead of predicting "How good is this action?" (Q-value), we directly predict "What action should I take?". We use the reward to "dial up" the probability of actions that led to a win.',
        goDeeper: {
          math: '\\nabla J(\\theta) = E[\\nabla \\log \\pi(a|s) R]',
          explanation: 'This is much more natural for continuous actions (like moving a robot arm) where a discrete Q-table is impossible.',
        },
      },
    },
    {
      id: 'actor-critic',
      title: 'Actor-Critic: Two Heads',
      visualizationProps: {
        mode: 'actor-critic-viz',
      },
      content: {
        text: 'Why not both? The "Actor" decides what to do, and the "Critic" evaluates how good that choice was. The Actor learns from the Critic\'s feedback.',
        goDeeper: {
          explanation: 'The Critic reduces "variance" (the noise in the reward signal), making learning much more stable and efficient than pure policy gradients.',
        },
      },
    },
    {
      id: 'ppo-stability',
      title: 'PPO: The Safe Stepper',
      visualizationProps: {
        mode: 'ppo-viz',
      },
      content: {
        text: 'In RL, one "really bad" update can ruin the whole agent. PPO (Proximal Policy Optimization) ensures that the new policy doesn\'t drift too far from the old one in a single step.',
        goDeeper: {
          explanation: 'PPO is the current state-of-the-art for stability. It is the algorithm used by OpenAI to train their Dota 2 bots and for general LLM fine-tuning.',
        },
      },
    },
    {
      id: 'reward-shaping-depth',
      title: 'Reward Foundations',
      visualizationProps: {
        mode: 'reward-viz',
      },
      content: {
        text: 'If the goal is 1 mile away, a reward at the end is too "sparse". We use "Reward Shaping" to give tiny breadcrumbs along the path to guide the agent.',
        goDeeper: {
          explanation: 'Warning: If shaped poorly, the agent might "hack" the reward (e.g., spinning in circles to get breadcrumbs without reaching the goal). Alignment is key!',
        },
      },
    },
    {
      id: 'multi-agent-rl',
      title: 'MARL: Multi-Agent RL',
      visualizationProps: {
        mode: 'marl-viz',
      },
      content: {
        text: 'In the real world, agents aren\'t alone. Multi-Agent RL study how agents cooperate or compete, leading to complex behaviors like team sports or traffic flow.',
        goDeeper: {
          explanation: 'The environment becomes non-stationary because other agents are learning too! This makes MARL one of the most challenging and exciting frontiers of AI.',
        },
      },
    },
  ],
  playground: {
    description: 'Tune the hyperparameters of a Q-learning agent navigating a Gridworld.',
    parameters: [
      { id: 'epsilon', label: 'Epsilon (Exploration)', type: 'slider', min: 0, max: 1, step: 0.05, default: 0.2 },
      { id: 'learningRate', label: 'Learning Rate (α)', type: 'slider', min: 0, max: 1, step: 0.05, default: 0.1 },
      { id: 'discountFactor', label: 'Discount Factor (γ)', type: 'slider', min: 0, max: 1, step: 0.05, default: 0.9 },
    ],
    tryThis: [
      'Set Epsilon to 0. Notice how the agent might get stuck in a bad local optimum if it hasn\'t explored enough.',
      'Set Discount Factor to 0. What happens? (It only cares about immediate rewards, ignoring the future).',
    ],
  },
  challenges: [
    {
      id: 'train-the-agent',
      title: 'Train the Agent',
      description: 'Find hyperparameters that allow the agent to reliably find the goal in fewer than 20 steps per episode.',
      props: {
        mode: 'challenge',
        gridSize: 5,
        targetSteps: 20,
        showQValues: true,
      },
      completionCriteria: { type: 'threshold', target: 20, metric: 'avg_steps_to_goal' },
      hints: [
        'A higher learning rate helps it learn fast, but might be unstable.',
        'Make sure exploration (epsilon) isn\'t too high, otherwise it will just wander around randomly even when it knows the way.',
      ],
    },
  ],
};

export default rlAgentsModule;
