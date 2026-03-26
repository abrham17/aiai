import type { ModuleData } from '@/core/types';

const cnnFoundationsModule: ModuleData = {
  id: 'cnn-foundations',
  tierId: 2,
  clusterId: 'neural-networks',
  title: 'CNN Foundations: The Convolutional Layer',
  description:
    'Learn how AI "sees". Master Kernels, Stride, and Feature Maps using a 2D interactive sliding window.',
  tags: ['deep-learning', 'cnn', 'convolution', 'kernels', 'computer-vision'],
  prerequisites: ['mlps'],
  difficulty: 'intermediate',
  estimatedMinutes: 45,
  steps: [
    {
      id: 'what-is-convolution',
      title: 'What is a Convolution?',
      visualizationProps: {
        mode: 'conv-interactive',
        kernelType: 'identity',
        showCalculation: true,
      },
      content: {
        text: 'A convolution is a mathematical operation where a small matrix (the **Kernel**) slides over an image to extract features. Instead of looking at every pixel independently, the network looks at local patterns.',
        goDeeper: {
          explanation: 'Each output pixel is a weighted sum: $O_{i,j} = \sum_{m,n} I_{i+m, j+n} \cdot K_{m,n}$. This local connectivity is biologically inspired by the primary visual cortex (V1) in the human brain.',
        },
      },
      interactionHint: 'Hover over the input grid (left) to see the convolution window slide and calculate the feature map (right).',
    },
    {
      id: 'feature-extraction',
      title: 'Feature Extraction: Sobel & Blur',
      visualizationProps: {
        mode: 'conv-interactive',
        kernelType: 'sobel-v',
      },
      content: {
        text: 'By changing the numbers in the kernel, we can detect different things. A "Sobel" kernel detects vertical or horizontal edges. A "Blur" kernel averages nearby pixels to smooth the image.',
        goDeeper: {
          explanation: 'In a real CNN, we don\'t hand-design these kernels. The network *learns* the best weights for these kernels through backpropagation to minimize the classification error.',
        },
      },
      interactionHint: 'Switch between different kernels (Edge, Sharpen, Blur) and watch how the output feature map changes.',
    },
    {
      id: 'stride-padding',
      title: 'Dimensions: Stride & Padding',
      visualizationProps: {
        mode: 'conv-params',
        stride: 2,
        padding: 1,
      },
      content: {
        text: '**Stride** is how many pixels the window jumps at each step. **Padding** adds extra zero-pixels around the border. These parameters control the size of the output feature map.',
        goDeeper: {
          math: 'O = \\lfloor \\frac{I - K + 2P}{S} \\rfloor + 1',
          explanation: 'Where $I$ is input size, $K$ is kernel size, $P$ is padding, and $S$ is stride. Padding is often used to ensure the output has the same spatial dimensions as the input ("Same" padding).',
        },
      },
      interactionHint: 'Adjust the Stride and Padding sliders to see how the output grid shrinks or grows.',
    },
    {
      id: 'convolution-math',
      title: 'The Math of the Slide',
      visualizationProps: {
        mode: 'conv-interactive',
        kernelSize: 3,
        stride: 1,
        padding: 0,
      },
      content: {
        text: 'Convolution is a "Weighted Sum." We multiply each pixel in the patch by its corresponding weight in the kernel, then add them all together. This one number becomes a single pixel in our output "Feature Map".',
        goDeeper: {
          math: 'y_{i,j} = \\sum_{m,n} w_{m,n} x_{i+m, j+n} + b',
          explanation: 'It looks complex, but it is just a Dot Product. The kernel (filter) acts as a pattern finder. If the filter looks like an edge, the resulting feature map will have bright spots wherever an edge exists in the image.',
        },
      },
      interactionHint: 'Tweak the kernel weights (e.g., set the middle column to 1 and the others to -1) and see how it highlights vertical edges.',
    },
    {
      id: 'rgb-channels',
      title: 'Color: The Third Dimension',
      visualizationProps: {
        mode: 'rgb-viz',
      },
      content: {
        text: 'Real images aren\'t just flat grids; they have depth (Red, Green, Blue). A single filter isn\'t a 3×3 square, but a 3×3×3 cube that looks at all three colors simultaneously.',
        goDeeper: {
          explanation: 'Despite having 3 channels of input, the sum still results in a single output number per position. This means the filter can learn to look for "a blue horizontal edge" or "a red circular glow".',
        },
      },
    },
    {
      id: 'multiple-filters',
      title: 'Depth: Multiple Filters',
      visualizationProps: {
        mode: 'filter-stack-viz',
      },
      content: {
        text: 'One filter finds edges. Another finds corners. A third finds spots. In a real CNN layer, we might use 64 or 128 different filters at once, creating a "stack" of 128 feature maps.',
        goDeeper: {
          explanation: 'This is why the output of a convolution layer has more "channels" than the input. We are transforming a 3-channel (RGB) image into a 64-channel "semantic" representation of its features.',
        },
      },
    },
    {
      id: 'pooling-layers',
      title: 'Pooling: Shrinking the Image',
      visualizationProps: {
        mode: 'pooling-viz',
        type: 'max',
        interactive: true,
      },
      content: {
        text: 'After convolution, we use "Pooling" to shrink the image. Max-Pooling looks at a 2×2 block and only keeps the single brightest pixel. This reduces computation and makes the model more robust.',
        goDeeper: {
          explanation: 'Pooling provides "Spatial Invariance." If a feature (like an eye) moves by just 1 pixel, the result of Max-Pooling remains exactly the same. This helps the network ignore tiny, irrelevant shifts in the input.',
        },
      },
    },
    {
      id: 'receptive-fields',
      title: 'The Receptive Field',
      visualizationProps: {
        mode: 'receptive-field-viz',
      },
      content: {
        text: 'In the first layer, a neuron only sees 3×3 pixels. But in the next layer, a neuron sees 3×3 pixels *of the previous feature map*—which themselves represent a larger area of the original image. As we go deeper, neurons "see" more of the world.',
        goDeeper: {
          explanation: 'By the 10th layer, a single neuron might have a "receptive field" that covers the entire image. This is how the network goes from seeing "curves" to seeing "ears" to seeing "a whole golden retriever".',
        },
      },
    },
    {
      id: 'translation-invariance',
      title: 'Translation Invariance',
      visualizationProps: {
        mode: 'invariance-viz',
      },
      content: {
        text: 'A good AI should know a cat is a cat, whether it is in the top-left or bottom-right corner. CNNs achieve this naturally because the SAME weights (the kernel) are used across every single part of the image.',
        goDeeper: {
          explanation: 'This is called "Weight Sharing." It makes CNNs incredibly efficient compared to MLPs. An MLP would need new weights for every possible location, while a CNN uses one small set of weights to scan the entire world.',
        },
      },
    },
  ],
  playground: {
    description: 'Design your own 3x3 kernel and apply it to a test image in real-time.',
    parameters: [
      { id: 'kernelType', label: 'Preset Kernel', type: 'select', options: ['custom', 'edge', 'blur', 'sharpen', 'emboss'], default: 'edge' },
      { id: 'stride', label: 'Stride', type: 'slider', min: 1, max: 3, step: 1, default: 1 },
      { id: 'padding', label: 'Padding', type: 'slider', min: 0, max: 2, step: 1, default: 0 },
    ],
    tryThis: [
      'Can you create a kernel that detects 45-degree diagonal edges?',
      'Set Stride to 2 and Padding to 1. Notice how many "zeros" are added at the edges.',
    ],
  },
  challenges: [
    {
      id: 'detect-edges',
      title: 'The Edge Detective',
      description: 'Your goal is to construct a kernel that extracts only the vertical edges of the input pattern. The output should have high values (> 1.0) only at edge transitions.',
      props: {
        mode: 'conv-interactive',
        kernelType: 'custom',
        interactive: true,
      },
      completionCriteria: { type: 'threshold', target: 0.9, metric: 'edgeDetectionAccuracy' },
      hints: [
        'Try putting negative numbers on the left column and positive numbers on the right column of the 3x3 kernel.',
        'A[-1, 0, 1] pattern is a classic vertical edge detector.',
      ],
    },
  ],
};

export default cnnFoundationsModule;
