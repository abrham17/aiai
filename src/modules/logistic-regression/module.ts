import type { ModuleData } from '@/core/types';

const logisticRegressionModule: ModuleData = {
  id: 'logistic-regression',
  tierId: 1,
  clusterId: 'ml-fundamentals',
  title: 'Logistic Regression',
  description:
    'Classification, probabilities, and the sigmoid function. How machines learn to separate data into categories.',
  tags: ['classification', 'sigmoid', 'cross-entropy', 'logistic-regression'],
  prerequisites: ['linear-regression'],
  difficulty: 'beginner',
  estimatedMinutes: 45,
  steps: [
    {
      id: 'why-not-linear',
      title: 'Why Not Linear Regression?',
      visualizationProps: {
        mode: '1d-linear',
        points: [
          { x: 1, y: 0, class: 0 }, { x: 2, y: 0, class: 0 }, { x: 3, y: 0, class: 0 },
          { x: 5, y: 1, class: 1 }, { x: 6, y: 1, class: 1 }, { x: 7, y: 1, class: 1 },
          { x: 15, y: 1, class: 1 } // Outlier
        ],
        line: { m: 0.1, b: 0.2 },
      },
      content: {
        text: 'Imagine classifying emails as Spam (1) or Not Spam (0). If we use a straight line (Linear Regression), an outlier heavily skews the line, completely changing our predictions for normal emails!',
        goDeeper: {
          explanation:
            'A straight line also predicts values < 0 and > 1. But probabilities must be exactly between 0 and 1. We need a function that "squashes" any number into that range without being overly sensitive to extreme outliers.',
        },
      },
    },
    {
      id: 'the-sigmoid-function',
      title: 'The Sigmoid Function',
      visualizationProps: {
        mode: '1d-sigmoid',
        interactive: true,
        points: [
          { x: 1, y: 0, class: 0 }, { x: 2, y: 0, class: 0 }, { x: 3, y: 0, class: 0 },
          { x: 5, y: 1, class: 1 }, { x: 6, y: 1, class: 1 }, { x: 7, y: 1, class: 1 },
          { x: 15, y: 1, class: 1 }
        ],
        weights: { w1: 1.5, b: -6 },
      },
      content: {
        text: 'Enter the Sigmoid function (an S-shaped curve). It maps any real number to a probability between 0 and 1. Adjust the weight and bias to see how it stretches and shifts.',
        goDeeper: {
          math: '\\sigma(z) = \\frac{1}{1 + e^{-z}}',
          explanation: 'Here, `z` is the linear equation `wx + b`. The sigmoid function transforms the linear output into a valid probability. If z is very positive, e^{-z} approaches 0, so the output approaches 1.',
        },
      },
      interactionHint: 'Drag the sliders to change the weight (steepness) and bias (position) of the sigmoid curve.',
    },
    {
      id: 'decision-boundary',
      title: 'The Decision Boundary',
      visualizationProps: {
        mode: '2d-boundary',
        interactive: true,
        points: [
          { x: 2, y: 2, class: 0 }, { x: 3, y: 1, class: 0 }, { x: 1, y: 3, class: 0 },
          { x: 6, y: 5, class: 1 }, { x: 7, y: 7, class: 1 }, { x: 5, y: 8, class: 1 },
        ],
        weights: { w1: 1, w2: 1, b: -8 },
      },
      content: {
        text: 'In 2D, Logistic Regression learns a line (decision boundary) that separates the two classes. Everywhere on one side has > 50% probability, and the other side has < 50%.',
        goDeeper: {
          math: 'w_1 x_1 + w_2 x_2 + b = 0',
          explanation: 'The decision boundary occurs exactly where the probability is 0.5. For the sigmoid function, this happens when the inner linear equation `z` equals 0.',
        },
      },
      interactionHint: 'Adjust the weights w1, w2, and b to rotate and move the 2D decision boundary line.',
    },
    {
      id: 'log-loss',
      title: 'Cross-Entropy Loss (Log Loss)',
      visualizationProps: {
        mode: 'log-loss',
        interactive: true,
        points: [{ x: 5, y: 1, class: 1 }],
        weights: { w1: 1, w2: 0, b: -3 },
      },
      content: {
        text: 'We can\'t use MSE for classification. Instead, we use Log Loss. It heavily penalizes the model if it is absolutely confident but completely wrong.',
        goDeeper: {
          math: 'L = -[y \\log(p) + (1-y)\\log(1-p)]',
          explanation: 'If the true class is 1 (y=1), we want probability p to be near 1. If p=0.01, -log(0.01) is a massive penalty. Log Loss creates a smooth, convex bowl for optimization, whereas MSE on a sigmoid curve creates a bumpy, non-convex surface.',
        },
      },
    },
    {
      id: 'odds-and-log-odds',
      title: 'Odds and Log-Odds',
      visualizationProps: {
        mode: 'odds-viz',
      },
      content: {
        text: 'If the probability of winning is 0.8, the "Odds" are 4 to 1 (0.8 / 0.2). Logistic regression actually predicts the "Log of the Odds".',
        goDeeper: {
          math: '\\ln(\\frac{P}{1-P}) = wx + b',
          explanation: 'The Logit function maps probabilities (0, 1) to all real numbers (-∞, +∞). This is why a straight line can predict log-odds perfectly, which we then squash back into probabilities using the sigmoid function.',
        },
      },
    },
    {
      id: 'thresholding',
      title: 'Thresholds: The Decision Point',
      visualizationProps: {
        mode: 'threshold-sim',
        interactive: true,
      },
      content: {
        text: 'By default, we say "Class 1" if the probability is > 0.5. But for a cancer test, we might choose 0.1 to be extremely cautious. For a Spam filter, we might choose 0.9 to avoid deleting important emails.',
        goDeeper: {
          explanation: 'Changing the threshold doesn\'t change the model\'s learned weights, only how we interpret the probabilities. This is a business decision based on the cost of "False Positives" vs "False Negatives".',
        },
      },
      interactionHint: 'Slide the threshold bar and watch how many points change color from 0 to 1.',
    },
    {
      id: 'precision-recall',
      title: 'Precision vs Recall',
      visualizationProps: {
        mode: 'p-r-tradeoff',
      },
      content: {
        text: 'Precision asks: "Of those I called Spam, how many really were?" Recall asks: "Of all the real Spam, how many did I find?" You usually can\'t have both at 100%.',
        goDeeper: {
          math: 'F1 = 2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}',
          explanation: 'The F1-Score is the harmonic mean of Precision and Recall. It is a single number that balances both metrics, especially useful when your classes are imbalanced.',
        },
      },
    },
    {
      id: 'roc-curve',
      title: 'The ROC Curve & AUC',
      visualizationProps: {
        mode: 'roc-viz',
      },
      content: {
        text: 'The ROC curve plots our performance across ALL possible thresholds. The area under this curve (AUC) is a single number that reveals how good our model is at distinguishing between the two classes.',
        goDeeper: {
          explanation: 'An AUC of 1.0 is a perfect classifier. An AUC of 0.5 is no better than flipping a coin. AUC is unique because it is threshold-invariant—it measures the model\'s core "ranking" ability.',
        },
      },
    },
    {
      id: 'softmax-multiclass',
      title: 'Softmax: Beyond Binary',
      visualizationProps: {
        mode: 'softmax-viz',
      },
      content: {
        text: 'What if we have 3 classes (Cat, Dog, Bird)? We use the Softmax function. It ensures that all predicted probabilities for all classes sum up exactly to 1.0.',
        goDeeper: {
          math: '\\sigma(z)_i = \\frac{e^{z_i}}{\\sum_{j=1}^{K} e^{z_j}}',
          explanation: 'Softmax is the multi-class generalization of the Sigmoid function. In deep learning, almost every classification network ends with a Softmax layer.',
        },
      },
    },
  ],
  playground: {
    description: 'Experiment with logistic regression in a 2D space. Can you separate the data points perfectly?',
    parameters: [
      { id: 'w1', label: 'Weight 1 (X-axis)', type: 'slider', min: -5, max: 5, step: 0.1, default: 1 },
      { id: 'w2', label: 'Weight 2 (Y-axis)', type: 'slider', min: -5, max: 5, step: 0.1, default: 1 },
      { id: 'b', label: 'Bias', type: 'slider', min: -20, max: 20, step: 0.5, default: -8 },
    ],
    tryThis: [
      'Make w1 and w2 highly positive. What happens to the decision boundary?',
      'Sweep the bias back and forth. Watch the line sweep across the screen.',
    ],
  },
  challenges: [
    {
      id: 'classify-data',
      title: 'Separate the Classes',
      description: 'Adjust the weights and bias to perfectly separate the blue points from the orange points, achieving a loss below 0.2.',
      props: {
        mode: 'challenge',
        points: [
          { x: 2, y: 8, class: 0 }, { x: 3, y: 7, class: 0 }, { x: 4, y: 9, class: 0 }, { x: 1, y: 6, class: 0 },
          { x: 6, y: 2, class: 1 }, { x: 8, y: 3, class: 1 }, { x: 7, y: 4, class: 1 }, { x: 9, y: 1, class: 1 },
        ],
      },
      completionCriteria: { type: 'threshold', target: 0.2, metric: 'log_loss' },
      hints: [
        'Pay attention to the slope. Should w1 and w2 have the same sign?',
        'If the colors are flipped, multiply all your weights and your bias by -1.',
      ],
    },
  ],
};

export default logisticRegressionModule;
