import type { ModuleData } from '@/core/types';

const decisionTreesModule: ModuleData = {
  id: 'decision-trees',
  tierId: 1,
  clusterId: 'classical-ml',
  title: 'Decision Trees & Entropy',
  description:
    'Learn how AI makes decisions by splitting data. Master Entropy, Gini Impurity, and Information Gain.',
  tags: ['ml-fundamentals', 'decision-trees', 'entropy', 'information-gain'],
  prerequisites: ['probability-basics'],
  difficulty: 'intermediate',
  estimatedMinutes: 45,
  steps: [
    {
      id: 'recursive-partitioning',
      title: 'Recursive Partitioning',
      visualizationProps: {
        mode: 'partition',
        dataset: 'simple-split',
        showTree: true,
      },
      content: {
        text: 'A Decision Tree works by asking a series of yes/no questions to partition the data into pure groups. We start with a messy mix and look for the "best split"—the one that separates the classes most cleanly.',
        goDeeper: {
          explanation: 'Every split creates two new regions. The goal is to reach "pure" leaf nodes where every point belongs to the same class. This process is recursive: we split, then split the resulting regions again, until we reach a stopping criterion.',
        },
      },
      interactionHint: 'Click on the data plot to suggest a horizontal or vertical split line.',
    },
    {
      id: 'understanding-entropy',
      title: 'Measuring Messiness: Entropy',
      visualizationProps: {
        mode: 'entropy-viz',
        initialP: 0.5,
      },
      content: {
        text: 'How do we mathematically define "messiness"? In Information Theory, we use Entropy. If a bag has an equal mix of red and blue balls, Entropy is at its maximum (1.0). If it has only red balls, Entropy is 0.0.',
        goDeeper: {
          math: 'H(S) = -\\sum_{i=1}^c p_i \\log_2 p_i',
          explanation: 'Entropy measures the uncertainty or randomness. In classification, $p_i$ is the probability of a point belonging to class $i$. When one $p_i=1$, then $\\log_2(1)=0$, resulting in 0 entropy—perfect order.',
        },
      },
      interactionHint: 'Drag the slider to change the class distribution and watch the Entropy curve react.',
    },
    {
      id: 'information-gain',
      title: 'Information Gain: The Splitting Criteria',
      visualizationProps: {
        mode: 'infogain-viz',
        splitX: 5,
      },
      content: {
        text: 'Information Gain (IG) is the reduction in entropy achieved by a split. We calculate the entropy before the split and subtract the weighted average entropy of the two new regions. The split with the highest IG is the winner.',
        goDeeper: {
          math: 'IG(S, A) = H(S) - \\sum_{v \\in Values(A)} \\frac{|S_v|}{|S|} H(S_v)',
          explanation: 'ID3 and C4.5 algorithms use Information Gain. CART (Classification and Regression Trees) uses a similar metric called Gini Impurity. Both aim to minimize the impurity of the resulting subsets.',
        },
      },
      interactionHint: 'Drag the vertical split line and observe how the Information Gain changes based on how "pure" the resulting boxes become.',
    },
    {
      id: 'overfit-viz',
      title: 'Overfitting: The Deep Tree',
      visualizationProps: {
        mode: 'overfit-viz',
        maxDepth: 10,
      },
      content: {
        text: 'A tree that grows too deep starts memorizing noise. It creates tiny, jagged boxes around every single data point. This model will fail when it sees new, unseen data.',
        goDeeper: {
          explanation: 'A "Perfect" training accuracy often means your model has zero generalization power. We control this by setting a "Max Depth" or requiring a minimum number of points per leaf node.',
        },
      },
      interactionHint: 'Watch how the boundary becomes incredibly complex as the tree grows deeper.',
    },
    {
      id: 'gini-impurity',
      title: 'Gini vs Entropy',
      visualizationProps: {
        mode: 'gini-viz',
      },
      content: {
        text: 'While we used Entropy, many libraries (like Scikit-Learn) use "Gini Impurity" by default. It is mathematically similar but faster to calculate because it doesn\'t use logarithms.',
        goDeeper: {
          math: 'G = 1 - \\sum (p_i)^2',
          explanation: 'Like Entropy, Gini is 0 when a node is 100% pure. It peaks at 0.5 for a 50/50 split. Computationally, it only requires squaring—much easier for a processor than a Log2 function.',
        },
      },
    },
    {
      id: 'regression-trees',
      title: 'Trees for Numbers (Regression)',
      visualizationProps: {
        mode: 'regression-tree-viz',
      },
      content: {
        text: 'Can trees predict prices instead of classes? Yes! Instead of picking the "most common" class, a leaf node predicts the "Average" of all its points.',
        goDeeper: {
          math: '\\text{Loss} = \\sum (y_i - \\bar{y})_{left}^2 + \\sum (y_i - \\bar{y})_{right}^2',
          explanation: 'We split by finding the point that minimizes the total Variance (Mean Squared Error) of the children. This creates a "staircase" approximation of the data.',
        },
      },
    },
    {
      id: 'pruning-intuition',
      title: 'Pruning: Cutting the Branches',
      visualizationProps: {
        mode: 'pruning-viz',
      },
      content: {
        text: 'Pruning is the process of removing branches that provide little predictive power. It turns an overly complex tree into a simpler, more robust one.',
        goDeeper: {
          explanation: 'In "Post-Pruning", we grow the tree to its full depth and then walk backward, removing nodes that don\'t improve accuracy on a validation set. This is a form of Regularization.',
        },
      },
    },
    {
      id: 'feature-importance',
      title: 'Feature Importance',
      visualizationProps: {
        mode: 'importance-viz',
      },
      content: {
        text: 'Trees naturally tell us which features are most important. A feature that is used at the very top of the tree to make large splits is much more significant than one dangling at the bottom.',
        goDeeper: {
          explanation: 'Calculated as the total reduction in Gini/Entropy provided by a given feature across the entire tree. This makes Decision Trees one of the most "Explainable" AI models.',
        },
      },
    },
  ],
  playground: {
    description: 'Grow your own decision tree. Select split points manually or let the algorithm find the best ones.',
    parameters: [
      { id: 'dataset', label: 'Dataset Type', type: 'select', options: ['boxes', 'overlapping', 'moons'], default: 'boxes' },
      { id: 'maxDepth', label: 'Max Depth', type: 'slider', min: 1, max: 8, step: 1, default: 3 },
      { id: 'criterion', label: 'Impurity Criterion', type: 'select', options: ['entropy', 'gini'], default: 'entropy' },
    ],
    tryThis: [
      'Try splitting the "Moons" dataset with depth 2 vs depth 8. Notice the "staircase" boundaries.',
      'Can you reach 0 entropy with 3 splits on the Boxes dataset?',
    ],
  },
  challenges: [
    {
      id: 'calculate-entropy',
      title: 'The Entropy Master',
      description: 'Find a split that achieves an Information Gain of at least 0.40.',
      props: {
        mode: 'infogain-viz',
        dataset: 'challenge-dist',
        interactive: true,
      },
      completionCriteria: { type: 'threshold', target: 0.4, metric: 'infogain' },
      hints: [
        'Look for the point on the X-axis where the separation between red and blue points is most distinct.',
        'Information gain is maximized when the resulting children are as "pure" as possible.',
      ],
    },
  ],
};

export default decisionTreesModule;
