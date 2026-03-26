import type { ModuleData } from '@/core/types';

const kMeansModule: ModuleData = {
  id: 'k-means',
  tierId: 1,
  clusterId: 'ml-fundamentals',
  title: 'K-Means Clustering',
  description:
    'Unsupervised learning: organizing unlabelled data into distinct groups using Lloyd\'s Algorithm.',
  tags: ['clustering', 'unsupervised', 'k-means', 'centroids'],
  prerequisites: ['norms-distance'],
  difficulty: 'beginner',
  estimatedMinutes: 45,
  steps: [
    {
      id: 'unsupervised-learning',
      title: 'Unsupervised Learning',
      visualizationProps: {
        mode: 'scatter-only',
        points: [
          { x: 2, y: 7 }, { x: 3, y: 8 }, { x: 2, y: 9 }, 
          { x: 8, y: 2 }, { x: 9, y: 3 }, { x: 8, y: 1 },
          { x: 7, y: 8 }, { x: 8, y: 9 }, { x: 9, y: 8 }
        ],
      },
      content: {
        text: 'Unlike classification where we have labeled data (e.g., spam vs not spam), in unsupervised learning, we just have raw data. Our goal is to find hidden structure—like groupings (clusters).',
        goDeeper: {
          explanation:
            'Looking at the data, you can probably see 3 distinct groups. K-Means is an algorithm that mathematically discovers these groups without human intuition.',
        },
      },
    },
    {
      id: 'initializing-centroids',
      title: 'Step 1: Initialize Centroids',
      visualizationProps: {
        mode: 'centroids',
        points: [
          { x: 2, y: 7 }, { x: 3, y: 8 }, { x: 2, y: 9 }, 
          { x: 8, y: 2 }, { x: 9, y: 3 }, { x: 8, y: 1 },
          { x: 7, y: 8 }, { x: 8, y: 9 }, { x: 9, y: 8 }
        ],
        centroids: [{ x: 5, y: 5 }, { x: 4, y: 6 }, { x: 6, y: 4 }],
        k: 3,
        draggableCentroids: true,
      },
      content: {
        text: 'First, we pick K. Let\'s set K=3. Then we place 3 "Centroids" randomly in space. Drag the centroids around to see them.',
        goDeeper: {
          explanation: 'Random initialization can sometimes lead to poor clustering (local optima). Advanced techniques like "K-Means++" place the initial centroids far away from each other to ensure better, faster convergence.',
        },
      },
      interactionHint: 'Drag the 3 star-shaped centroids anywhere on the canvas.',
    },
    {
      id: 'assignment-step',
      title: 'Step 2: The Assignment Step',
      visualizationProps: {
        mode: 'assignment',
        points: [
          { x: 2, y: 7 }, { x: 3, y: 8 }, { x: 2, y: 9 }, 
          { x: 8, y: 2 }, { x: 9, y: 3 }, { x: 8, y: 1 },
          { x: 7, y: 8 }, { x: 8, y: 9 }, { x: 9, y: 8 }
        ],
        centroids: [{ x: 3, y: 4 }, { x: 5, y: 7 }, { x: 7, y: 3 }],
        k: 3,
        draggableCentroids: true,
        showAssignments: true,
        showVoronoi: true,
      },
      content: {
        text: 'Every point looks at the centroids and assigns itself to the closest one. This mathematically divides the space into regions called a "Voronoi Tessellation".',
        goDeeper: {
          math: 'C(i) = \\text{argmin}_k || x_i - \\mu_k ||^2',
          explanation: 'We usually use Euclidean distance. The points change color to match their closest centroid. Drag the centroids and watch the boundaries and color assignments shift in real-time!',
        },
      },
      interactionHint: 'Drag the centroids to see how the Voronoi boundaries perfectly split the space.',
    },
    {
      id: 'update-step',
      title: 'Step 3: The Update Step',
      visualizationProps: {
        mode: 'update',
        points: [
          { x: 2, y: 7 }, { x: 3, y: 8 }, { x: 2, y: 9 }, 
          { x: 8, y: 2 }, { x: 9, y: 3 }, { x: 8, y: 1 }
        ],
        centroids: [{ x: 2, y: 5 }, { x: 8, y: 5 }],
        k: 2,
        draggableCentroids: false,
        showAssignments: true,
        showUpdateAnimation: true,
      },
      content: {
        text: 'Once all points are assigned, we move each centroid to the exact center (the mean) of all the points assigned to it.',
        goDeeper: {
          math: '\\mu_k = \\frac{1}{|C_k|} \\sum_{x_i \\in C_k} x_i',
          explanation: 'This step guarantees that the total within-cluster variance decreases. We then repeat Step 2 and Step 3 until the centroids stop moving (convergence).',
        },
      },
      interactionHint: 'Click the "Step" button to bounce back and forth between Assignment and Update until the algorithm converges.',
    },
    {
      id: 'distance-metrics-depth',
      title: 'Measuring "Closeness"',
      visualizationProps: {
        mode: 'dist-viz',
      },
      content: {
        text: 'While we usually use "Straight Line" (Euclidean) distance, K-Means can technically work with others. However, the update step (calculating the mean) is mathematically tied to Euclidean distance.',
        goDeeper: {
          explanation: 'If you want to use Manhattan distance, you should use "K-Medoids" instead, which updates the center to be the median point of the cluster rather than the mean.',
        },
      },
    },
    {
      id: 'elbow-method',
      title: 'The Elbow Method',
      visualizationProps: {
        mode: 'elbow-plot',
      },
      content: {
        text: 'How do we choose K? We can track the "Inertia" (total distance from points to centroids). Inertia always drops as K increases, but we look for the "Elbow"—the point where adding more clusters gives diminishing returns.',
        goDeeper: {
          explanation: 'Imagine having 100 points. If K=100, inertia is 0 (every point is its own centroid), but we haven\'t really simplified the data. We want the smallest K that captures the main structure.',
        },
      },
    },
    {
      id: 'silhouette-score',
      title: 'Silhouette: Are we well separated?',
      visualizationProps: {
        mode: 'silhouette-viz',
      },
      content: {
        text: 'The Silhouette Score measures how similar a point is to its own cluster compared to other clusters. It ranges from +1 (perfectly clustered) to -1 (wrongly assigned).',
        goDeeper: {
          math: 's(i) = \\frac{b(i) - a(i)}{\\max(a(i), b(i))}',
          explanation: 'Here $a(i)$ is the mean distance to points in the same cluster, and $b(i)$ is the mean distance to the next closest cluster. High scores indicate dense, well-separated clusters.',
        },
      },
    },
    {
      id: 'initialization-sensitivity',
      title: 'Local Optima & K-Means++',
      visualizationProps: {
        mode: 'init-failure-viz',
      },
      content: {
        text: 'Basic K-Means is sensitive to its starting position. If you start centroids in the wrong place, they can get "trapped" in local optima that don\'t represent the best possible groupings.',
        goDeeper: {
          explanation: 'K-Means++ solves this by spreading out the initial centroids. The first centroid is random, but the next ones are placed with a probability proportional to their distance from existing centroids.',
        },
      },
    },
    {
      id: 'convergence-math',
      title: 'Does it always stop?',
      visualizationProps: {
        mode: 'convergence-viz',
      },
      content: {
        text: 'Yes! K-Means is guaranteed to converge because there are only a finite number of ways to assign points to clusters, and each step strictly decreases the total variance.',
        goDeeper: {
          explanation: 'However, it is NOT guaranteed to find the global minimum. This is why most implementations run the algorithm multiple times (with different random starts) and pick the result with the lowest overall inertia.',
        },
      },
    },
  ],
  playground: {
    description: 'Experiment with K-Means. Add your own points, change K, and run the algorithm.',
    parameters: [
      { id: 'k', label: 'Number of Clusters (K)', type: 'slider', min: 2, max: 5, step: 1, default: 3 },
    ],
    tryThis: [
      'Set K to 2 when there are clearly 3 groups. Watch how the algorithm is forced to merge two groups.',
      'Place centroids very poorly and see if it gets stuck in a local minimum.',
    ],
  },
  challenges: [
    {
      id: 'cluster-bullseye',
      title: 'Minimize the Variance',
      description: 'Drag the 3 centroids to optimal positions so the total distance from points to their centroids is below 15.0.',
      props: {
        mode: 'challenge',
        points: [
          { x: 2, y: 2 }, { x: 2.5, y: 2.5 }, { x: 1.5, y: 1.5 },
          { x: 8, y: 8 }, { x: 8.5, y: 8.5 }, { x: 7.5, y: 7.5 },
          { x: 2, y: 8 }, { x: 2.5, y: 8.5 }, { x: 1.5, y: 7.5 },
        ],
        centroids: [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 6, y: 5 }], // Deliberately bad
        k: 3,
        draggableCentroids: true,
        showAssignments: true,
      },
      completionCriteria: { type: 'threshold', target: 20, metric: 'inertia' },
      hints: [
        'Place one centroid right in the middle of each of the 3 dense groups of points.',
        'The total distance (inertia) drops drastically when a centroid snaps into the center of a dense cluster.',
      ],
    },
  ],
};

export default kMeansModule;
