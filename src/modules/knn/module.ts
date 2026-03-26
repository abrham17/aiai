import type { ModuleData } from '@/core/types';

const knnModule: ModuleData = {
  id: 'knn',
  tierId: 1,
  clusterId: 'ml-fundamentals',
  title: 'K-Nearest Neighbors',
  description:
    'A simple, non-parametric approach to classification and regression testing finding the closest training examples.',
  tags: ['classification', 'knn', 'lazy-learning', 'distance-metrics'],
  prerequisites: ['norms-distance'],
  difficulty: 'beginner',
  estimatedMinutes: 45,
  steps: [
    {
      id: 'the-lazy-learner',
      title: 'The Lazy Learner',
      visualizationProps: {
        mode: 'intro',
        points: [
          { x: 2, y: 7, class: 0 }, { x: 3, y: 8, class: 0 }, { x: 2, y: 9, class: 0 },
          { x: 8, y: 2, class: 1 }, { x: 9, y: 3, class: 1 }, { x: 8, y: 1, class: 1 },
        ],
        testPoint: { x: 5, y: 5 },
        k: 1,
      },
      content: {
        text: 'K-Nearest Neighbors (KNN) is called a "lazy" learner because it doesn\'t actually learn a mathematical function like y=mx+b during training. It simply memorizes the entire dataset!',
        goDeeper: {
          explanation:
            'When it\'s time to make a prediction for a new, unknown point, it just looks at the K closest points in its memory and takes a majority vote.',
        },
      },
      interactionHint: 'Drag the grey "test point". With K=1, it will be classified as whatever the single nearest neighbor is.',
    },
    {
      id: 'choosing-k',
      title: 'Choosing K: The Bias-Variance Tradeoff',
      visualizationProps: {
        mode: 'interactive-k',
        points: [
          // Red group (0)
          { x: 2, y: 7, class: 0 }, { x: 3, y: 8, class: 0 }, { x: 2, y: 9, class: 0 }, { x: 4, y: 6, class: 0 },
          // Blue group (1)
          { x: 8, y: 2, class: 1 }, { x: 9, y: 3, class: 1 }, { x: 8, y: 1, class: 1 }, { x: 7, y: 4, class: 1 },
          // A noisy blue point in the red group
          { x: 3, y: 7, class: 1 },
        ],
        testPoint: { x: 3.5, y: 6.5 },
        k: 1,
      },
      content: {
        text: 'If K=1, the model is highly sensitive to noise. A single misplaced point (like the blue dot in the red group) will completely flip the prediction in that local area.',
        goDeeper: {
          explanation: 'This is called "High Variance" (overfitting). As you increase K to 3 or 5, the model becomes more stable, "smoothing" over the noise by requiring a broader consensus.',
        },
      },
      interactionHint: 'Move the slider to increase K and watch how the voting changes!',
    },
    {
      id: 'distance-metrics',
      title: 'Measuring Distance',
      visualizationProps: {
        mode: 'distance-metric',
        points: [
          { x: 5, y: 5, class: 0 }
        ],
        testPoint: { x: 8, y: 9 },
        k: 1,
        metric: 'euclidean',
      },
      content: {
        text: 'How do we define "Nearest"? Usually, we use Euclidean distance (straight line). But in some cases, Manhattan distance (moving only in grid steps) is better.',
        goDeeper: {
          math: 'L_1 = |x_1 - x_2| + |y_1 - y_2| \\quad \\text{vs} \\quad L_2 = \\sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}',
          explanation: 'This is why the Norms & Distances mathematical foundations module was required before this one!',
        },
      },
      interactionHint: 'Toggle between Euclidean and Manhattan to see the mathematical difference in how distance is calculated.',
    },
    {
      id: 'curse-of-dimensionality',
      title: 'The Curse of Dimensionality',
      visualizationProps: {
        mode: 'curse',
      },
      content: {
        text: 'As the number of dimensions (features) grows, the volume of space expands exponentially. In very high-dimensional space (like images with thousands of pixels), EVERYTHING is far away.',
        goDeeper: {
          explanation: 'In 1000-dimensional space, the distance from a point to its "nearest" neighbor is almost the same as the distance to its farthest neighbor. KNN breaks down and becomes useless without dimensionality reduction (like PCA).',
        },
      },
    },
    {
      id: 'distance-weighting',
      title: 'Distance Weighting (1/d)',
      visualizationProps: {
        mode: 'weighting-viz',
        interactive: true,
      },
      content: {
        text: 'Should a neighbor that is far away have the same vote as one that is right next to our test point? We can weight votes by the inverse of their distance.',
        goDeeper: {
          math: 'w_i = \\frac{1}{d(x, x_i)}',
          explanation: 'This effectively allows closer neighbors to "shout louder" than distant ones, helping the model become more robust to noise at the boundaries.',
        },
      },
    },
    {
      id: 'feature-scaling-knn',
      title: 'Scaling: The Silent Killer',
      visualizationProps: {
        mode: 'scaling-impact',
      },
      content: {
        text: 'If "Salary" is in thousands and "Age" is in double digits, the Euclidean distance will be dominated entirely by Salary. Age will be ignored!',
        goDeeper: {
          explanation: 'KNN relies entirely on distances. If features aren\'t on the same scale, distances are meaningless. Always use Min-Max scaling or Z-score normalization before running KNN.',
        },
      },
    },
    {
      id: 'kd-trees',
      title: 'The Search: KD-Trees vs Exhaustive',
      visualizationProps: {
        mode: 'kd-tree-viz',
      },
      content: {
        text: 'Calculating the distance to EVERY point in a billion-row dataset is too slow. Instead, we use smart data structures like KD-Trees or Ball-Trees to quickly narrow down the search.',
        goDeeper: {
          explanation: 'A KD-Tree recursively splits the space into regions. Instead of checking 1,000,000 points, we only check the branch of the tree where our test point resides—drastically speeding up prediction time.',
        },
      },
    },
    {
      id: 'tie-breaking',
      title: 'Ties and Odd K',
      visualizationProps: {
        mode: 'tie-viz',
      },
      content: {
        text: 'What if K=4 and the vote is 2 against 2? We have a tie! This is why, for binary classification, we almost always pick an ODD number for K (3, 5, 7...).',
        goDeeper: {
          explanation: 'In multi-class problems (where odd K doesn\'t prevent all ties), we can break ties by looking at which class has the lower "total distance" among its neighbors, or by picking one randomly.',
        },
      },
    },
    {
      id: 'imbalanced-knn',
      title: 'The Majority Bias',
      visualizationProps: {
        mode: 'imbalance-viz',
      },
      content: {
        text: 'If 90% of your data is "Class A", a large K will almost always predict "Class A" just because there are more of them nearby.',
        goDeeper: {
          explanation: 'For imbalanced datasets, standard KNN fails. Solutions include downsampling the majority class, upsampling the minority class (SMOTE), or using distance-weighting to give minority neighbors more power.',
        },
      },
    },
  ],
  playground: {
    description: 'Experiment with KNN. Drag the test point and see how different values of K change the decision boundary.',
    parameters: [
      { id: 'k', label: 'Value of K', type: 'slider', min: 1, max: 9, step: 2, default: 3 },
      { id: 'metric', label: 'Distance Metric', type: 'select', options: ['euclidean', 'manhattan'], default: 'euclidean' },
    ],
    tryThis: [
      'Set K to 9. Notice how the predominant class tends to win the vote more easily.',
      'Always pick an odd number for K in a 2-class problem to prevent ties!',
    ],
  },
  challenges: [
    {
      id: 'noisy-boundary',
      title: 'Smooth the Boundary',
      description: 'Find a value for K that successfully classifies the test point as Red (Class 0) despite the nearby noisy Blue (Class 1) points.',
      props: {
        mode: 'challenge',
        points: [
          // Red group (0)
          { x: 3, y: 7, class: 0 }, { x: 2, y: 8, class: 0 }, { x: 4, y: 8, class: 0 }, { x: 2, y: 6, class: 0 },
          // Noisy Blue points right next to the test area
          { x: 5, y: 6, class: 1 }, { x: 4, y: 5, class: 1 },
          // Main Blue group (1)
          { x: 8, y: 2, class: 1 }, { x: 9, y: 3, class: 1 }, { x: 7, y: 1, class: 1 },
        ],
        testPoint: { x: 4.5, y: 6.5 }, // closer to the noisy blue points, but arguably in red territory
        k: 1,
      },
      completionCriteria: { type: 'threshold', target: 0, metric: 'class_0_wins' },
      hints: [
        'If K=1, the nearest neighbor is clearly Blue.',
        'If you expand the circle enough by increasing K, the vote will eventually capture more of the dense Red cluster.',
      ],
    },
  ],
};

export default knnModule;
