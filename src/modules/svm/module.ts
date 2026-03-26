import type { ModuleData } from '@/core/types';

const svmModule: ModuleData = {
  id: 'svm',
  tierId: 1,
  clusterId: 'classical-ml',
  title: 'Support Vector Machines (SVM)',
  description:
    'Master the geometry of classification. Learn how to find the "Maximum Margin" and use the "Kernel Trick" to solve non-linear problems.',
  tags: ['ml-fundamentals', 'svm', 'margins', 'kernel-trick', 'optimization'],
  prerequisites: ['linear-algebra-basics', 'optimization'],
  difficulty: 'intermediate',
  estimatedMinutes: 50,
  steps: [
    {
      id: 'maximum-margin',
      title: 'The Maximum Margin Classifier',
      visualizationProps: {
        mode: 'margin-viz',
        dataset: 'linearly-separable',
        showMargin: true,
      },
      content: {
        text: 'While many lines can separate two classes, SVM looks for the one that is the "farthest" from both. This is the line that maximizes the margin—the distance between the boundary and the closest points (Support Vectors).',
        goDeeper: {
          math: 'w \\cdot x - b = 0',
          explanation: 'The decision boundary is a hyperplane defined by the vector $w$. The goal is to maximize the margin $\frac{2}{||w||}$ subject to the constraint that all points are correctly classified outside the margin.',
        },
      },
      interactionHint: 'Drag the separator line. Notice how the margin (the shaded gutter) changes. Your goal is to make it as wide as possible.',
    },
    {
      id: 'support-vectors',
      title: 'The Support Vectors',
      visualizationProps: {
        mode: 'margin-viz',
        dataset: 'linearly-separable',
        highlightVectors: true,
      },
      content: {
        text: 'Not all data points matter equally. The "Support Vectors" are the points that lie exactly on the edge of the margin. If you move any other point, the boundary stays the same. If you move a support vector, the boundary must move.',
        goDeeper: {
          explanation: 'This property makes SVM surprisingly robust to outliers that are far from the decision boundary. The entire model is defined by only a small subset of the training data.',
        },
      },
      interactionHint: 'Click on different points. Only those on the "gutter" lines are true support vectors.',
    },
    {
      id: 'kernel-trick',
      title: 'The Kernel Trick',
      visualizationProps: {
        mode: 'kernel-3d-viz',
        dataset: 'circles',
      },
      content: {
        text: 'What if data isn\'t linearly separable? In 2D, you can\'t draw a straight line to separate concentric circles. But if we "lift" the points into 3D (e.g., $z = x^2 + y^2$), a flat plane can slice through them perfectly.',
        goDeeper: {
          math: 'K(x, y) = \\phi(x) \\cdot \\phi(y)',
          explanation: 'A Kernel is a function that calculates the dot product of two points in a higher-dimensional space WITHOUT actually transforming them. This is the "Kernel Trick"—it gives us the power of high dimensions with the computational cost of low dimensions. Popular kernels include Polynomial and RBF (Radial Basis Function).',
        },
      },
      interactionHint: 'Toggle the "Lift to 3D" button to see the 2D circles become linearly separable in 3D.',
    },
    {
      id: 'soft-margin',
      title: 'C-Parameter: Handling Noise',
      visualizationProps: {
        mode: 'margin-viz',
        dataset: 'noisy',
        cValue: 1.0,
      },
      content: {
        text: 'Real-world data is messy. If we demand a "Hard Margin" (zero errors), even one outlier can ruin the model. SVM uses a penalty parameter "C" to allow some points to cross the margin in exchange for a wider, more general boundary.',
        goDeeper: {
          math: 'L = ||w||^2 + C \\sum \\xi_i',
          explanation: 'The variable $\\xi_i$ (Slack Variable) represents the distance a point is from the correct side of its margin. $C$ controls the tradeoff: large $C$ means zero tolerance for errors (Hard Margin), small $C$ means a smoother, wider boundary (Soft Margin).',
        },
      },
      interactionHint: 'Adjust the C-Parameter slider and watch the boundary ignore or obsess over outliers.',
    },
    {
      id: 'primal-vs-dual',
      title: 'Primal vs Dual Form',
      visualizationProps: {
        mode: 'dual-viz',
      },
      content: {
        text: 'The math for SVM can be written in two ways. The "Primal" form is intuitive (finding the line), but the "Dual" form is where the magic happens—it reveals that the weights are just a weighted sum of the Support Vectors.',
        goDeeper: {
          math: 'w = \\sum \\alpha_i y_i x_i',
          explanation: 'The Dual Problem uses Lagrange multipliers $\\alpha_i$. If a point is NOT a support vector, its $\\alpha_i = 0$. This confirms that the entire model only "remembers" the most difficult cases at the boundary.',
        },
      },
    },
    {
      id: 'rbf-gamma',
      title: 'The RBF Kernel & Gamma',
      visualizationProps: {
        mode: 'gamma-viz',
        interactive: true,
      },
      content: {
        text: 'The RBF (Radial Basis Function) is the most popular kernel. It has a hidden param: Gamma. It controls how "far" the influence of a single point reaches.',
        goDeeper: {
          math: 'K(x, y) = e^{-\\gamma ||x - y||^2}',
          explanation: 'Low Gamma means a single support vector influences a large area (smooth boundary). High Gamma means the influence is very local (jagged, complex boundary that can overfit).',
        },
      },
      interactionHint: 'Tweak the Gamma slider to see the boundary "shrinkwrap" around individual points.',
    },
    {
      id: 'sv-math',
      title: 'What makes a Support Vector?',
      visualizationProps: {
        mode: 'margin-viz',
        highlightVectors: true,
      },
      content: {
        text: 'Mathematically, a Support Vector is any point where its Lagrange multiplier $\\alpha_i$ is greater than zero. These points are literally "supporting" the decision wall.',
        goDeeper: {
          explanation: 'If you remove all points that are NOT support vectors, the boundary won\'t move a millimeter. This sparse representation makes SVM incredibly efficient for inference compared to KNN.',
        },
      },
    },
    {
      id: 'multiclass-svm',
      title: 'Multi-class: One-vs-Rest',
      visualizationProps: {
        mode: 'multiclass-viz',
      },
      content: {
        text: 'SVM is naturally a binary (yes/no) classifier. To handle 3 or more classes, we use the "One-vs-Rest" strategy: we train one SVM for "Class A vs Everything Else", one for "Class B vs Everything Else", and so on.',
        goDeeper: {
          explanation: 'For a new point, we run it through all the SVMs. The one that predicts the "highest confidence" (largest distance from the boundary) wins the classification.',
        },
      },
    },
  ],
  playground: {
    description: 'Experiment with SVM boundaries. Change datasets, adjust the margin width (C), and test different kernels.',
    parameters: [
      { id: 'dataset', label: 'Dataset', type: 'select', options: ['separable', 'noisy', 'moons', 'circles'], default: 'separable' },
      { id: 'c', label: 'C (Penalty)', type: 'slider', min: 0.1, max: 10, step: 0.1, default: 1.0 },
      { id: 'kernel', label: 'Kernel', type: 'select', options: ['linear', 'polynomial', 'rbf'], default: 'linear' },
    ],
    tryThis: [
      'Use the RBF kernel on the Moons dataset. See how the boundary "wraps" around the points.',
      'On the Noisy dataset, lower C to 0.1. Does the boundary become more stable?',
    ],
  },
  challenges: [
    {
      id: 'maximize-margin',
      title: 'The Margin Optimizer',
      description: 'Adjust the boundary to achieve a margin width of at least 1.5 units on this dataset.',
      props: {
        mode: 'margin-viz',
        dataset: 'challenge-sep',
        interactive: true,
      },
      completionCriteria: { type: 'threshold', target: 1.5, metric: 'marginWidth' },
      hints: [
        'The margin is the distance between the two parallel "gutter" lines.',
        'Rotate and translate the line until it is perfectly centered between the two closest groups of points.',
      ],
    },
  ],
};

export default svmModule;
