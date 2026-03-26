import type { ModuleData } from '@/core/types';

const linearRegressionModule: ModuleData = {
  id: 'linear-regression',
  tierId: 1,
  clusterId: 'ml-basics',
  title: 'Linear Regression',
  description:
    'Fitting lines to data points and understanding loss — the Hello World of Machine Learning.',
  tags: ['linear-regression', 'machine-learning', 'loss', 'optimization'],
  prerequisites: ['vectors', 'optimization'],
  difficulty: 'beginner',
  estimatedMinutes: 30,
  steps: [
    {
      id: 'what-is-a-model',
      title: 'What is a Model?',
      visualizationProps: {
        mode: 'static',
        points: [
          { x: 1, y: 2 },
          { x: 2, y: 3.5 },
          { x: 3, y: 4.5 },
          { x: 4, y: 6 },
        ],
        line: { m: 1.2, b: 0.8 },
      },
      content: {
        text: 'A model is just a simplification of reality. Here, we see points (data) and a line (our model). How well does the line describe the points?',
        goDeeper: {
          math: 'y = mx + b',
          explanation:
            'In machine learning, we often use $f(x) = wx + b$ where $w$ is the weight (slope) and $b$ is the bias (intercept).',
        },
      },
    },
    {
      id: 'the-residuals',
      title: 'The Residuals',
      visualizationProps: {
        mode: 'residuals',
        points: [
          { x: 1, y: 2 },
          { x: 2, y: 3.5 },
          { x: 3, y: 4.5 },
          { x: 4, y: 6 },
        ],
        line: { m: 1, b: 1 },
        showResiduals: true,
      },
      content: {
        text: 'The vertical distance from each point to the line is the error or "residual". A good model minimizes these distances.',
        goDeeper: {
          math: 'e_i = y_i - \\hat{y}_i',
          explanation:
            'The true value is $y_i$ and the predicted value is $\\hat{y}_i = mx_i + b$. The residual is their difference.',
        },
      },
      quiz: {
        question: 'If a point lies exactly on the line, what is its residual?',
        options: ['1', '0', '-1', 'Undefined'],
        correctIndex: 1,
        explanation: 'If the prediction is perfect ($y_i = \\hat{y}_i$), the residual is 0.',
      },
    },
    {
      id: 'drag-to-fit',
      title: 'Drag to Fit: Minimizing MSE',
      visualizationProps: {
        mode: 'interactive',
        points: [
          { x: 1, y: 1 },
          { x: 2, y: 3 },
          { x: 3, y: 2.5 },
          { x: 4, y: 5 },
          { x: 5, y: 4.5 },
        ],
        line: { m: 0.5, b: 1 },
        draggableLine: true,
        showResiduals: true,
        showMSE: true,
      },
      content: {
        text: 'Drag the line to fit the points. Watch the MSE (Mean Squared Error) drop. Can you find the perfect line?',
        goDeeper: {
          math: '\\text{MSE} = \\frac{1}{n} \\sum_{i=1}^{n} (y_i - (mx_i + b))^2',
          explanation: 'Squaring the errors penalizes large mistakes more heavily than small ones—this is why outliers can warp a linear regression model.',
        },
      },
      interactionHint: 'Drag the handles to change the slope and intercept',
    },
    {
      id: 'why-squared-error',
      title: 'Why Squared Error?',
      visualizationProps: {
        mode: 'squared-error',
        points: [
          { x: 2, y: 4 },
          { x: 4, y: 2 },
        ],
        line: { m: 0, b: 3 },
        draggableLine: true,
        showResiduals: true,
        showSquares: true,
        showMSE: true,
      },
      content: {
        text: 'Notice the literal squares drawn from the residuals! The MSE is the average area of these squares.',
        goDeeper: {
          explanation: 'Absolute error (L1) creates V-shaped loss landscapes. Squared error (L2) creates smooth, bowl-shaped landscapes, making it easy to find the minimum using calculus.',
        },
      },
      quiz: {
        question: 'Which of these models would the MSE penalize the most?',
        options: ['Two errors of 2', 'One error of 4', 'Four errors of 1', 'They are all penalized equally'],
        correctIndex: 1,
        explanation: 'Squaring an error of 4 gives 16. Two errors of 2 give $2^2 + 2^2 = 8$. Four errors of 1 give $1^2 \\times 4 = 4$. MSE strongly penalizes single large errors.',
      },
    },
    {
      id: 'gradient-descent-intuition',
      title: 'Gradient Descent: The Mountain Slide',
      visualizationProps: {
        mode: 'gradient-descent',
        showLandscape: true,
      },
      content: {
        text: 'How does the computer find the best line automatically? It uses Gradient Descent. Imagine being on a mountain in the fog—to reach the bottom, you just step in the direction where the ground slopes down most steeply.',
        goDeeper: {
          math: '\\theta_{next} = \\theta_{prev} - \\alpha \\nabla J(\\theta)',
          explanation: 'The "gradient" is the direction of steepest increase. By moving in the opposite direction (the negative gradient), we descend toward the minimum loss. $\\alpha$ is our step size, or Learning Rate.',
        },
      },
    },
    {
      id: 'learning-rate-effects',
      title: 'The Goldilocks Learning Rate',
      visualizationProps: {
        mode: 'learning-rate-sim',
        interactive: true,
      },
      content: {
        text: 'If your steps (Learning Rate) are too small, you take forever to reach the bottom. If they are too big, you might overshoot the minimum and bounce wildly out of the valley!',
        goDeeper: {
          explanation: 'Finding the right learning rate is one of the most important parts of training any ML model. Modern algorithms often start with a large rate and "decay" it over time as they get closer to the goal.',
        },
      },
      interactionHint: 'Toggle between "Too Small", "Too Large", and "Just Right" to see the optimizer in action.',
    },
    {
      id: 'matrix-form',
      title: 'Linear Regression in Matrix Form',
      visualizationProps: {
        mode: 'matrix-viz',
      },
      content: {
        text: 'Instead of loops, we use Linear Algebra to handle millions of data points at once. We bundle all our inputs into a matrix $X$ and our outputs into a vector $y$.',
        goDeeper: {
          math: '\\hat{y} = Xw',
          explanation: 'The "Normal Equation" gives us the optimal weights in one single calculation without any descent: $w = (X^T X)^{-1} X^T y$. While powerful, it becomes too slow when you have millions of features.',
        },
      },
    },
    {
      id: 'feature-scaling',
      title: 'The Danger of Different Scales',
      visualizationProps: {
        mode: 'scaling-comparison',
      },
      content: {
        text: 'If one feature is "House Price" (millions) and the other is "Number of Bedrooms" (1-5), the loss landscape becomes a very long, narrow tunnel. Gradient descent will struggle to navigate this.',
        goDeeper: {
          explanation: 'By "Standardizing" our data (subtracting the mean and dividing by the standard deviation), we turn the narrow tunnel into a perfect circular bowl, allowing the optimizer to move directly to the minimum.',
        },
      },
    },
    {
      id: 'r-squared',
      title: 'R-Squared: Measuring Quality',
      visualizationProps: {
        mode: 'residuals-comparison',
        showRSquared: true,
      },
      content: {
        text: 'How much better is our line than just predicting the average value for everyone? R-Squared tells us the percentage of variance in the data that our model successfully explains.',
        goDeeper: {
          math: 'R^2 = 1 - \\frac{SS_{res}}{SS_{tot}}',
          explanation: '$SS_{res}$ is the sum of squared residuals of our model. $SS_{tot}$ is the variance of the data itself. $R^2 = 1$ is a perfect fit, while $R^2 = 0$ means our model is no better than a flat line at the mean.',
        },
      },
    },
  ],
  playground: {
    description: 'Explore linear regression by adding points and fitting lines.',
    parameters: [
      { id: 'pointCount', label: 'Number of Points', type: 'stepper', min: 2, max: 20, step: 1, default: 5 },
      { id: 'noise', label: 'Noise Level', type: 'slider', min: 0, max: 5, step: 0.5, default: 1 },
      { id: 'showResiduals', label: 'Show Residuals', type: 'toggle', default: true },
      { id: 'showMSE', label: 'Show Mean Squared Error', type: 'toggle', default: true },
    ],
    tryThis: [
      'Try placing an outlier point far away from the others. Watch how the line of best fit changes.',
      'Can you set the points perfectly in a line to get an MSE of 0?',
    ],
  },
  challenges: [
    {
      id: 'fit-the-line',
      title: 'Beat the Baseline',
      description: 'Manually fit the line so the MSE is under 0.5.',
      props: {
        mode: 'interactive',
        points: [
          { x: 1, y: 2.1 },
          { x: 2, y: 3.9 },
          { x: 3, y: 6.2 },
          { x: 4, y: 7.8 },
        ],
        line: { m: 1, b: 0 },
        draggableLine: true,
        showMSE: true,
      },
      completionCriteria: { type: 'threshold', target: 0.5, metric: 'mse' },
      hints: [
        'Try increasing the slope (m) first to roughly match the trend.',
        'Then adjust the intercept (b) to center the line among points.',
      ],
    },
  ],
};

export default linearRegressionModule;
