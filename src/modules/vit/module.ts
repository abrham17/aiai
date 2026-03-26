import type { ModuleData } from '@/core/types';

export const vitModule: ModuleData = {
  id: 'vit',
  tierId: 3,
  clusterId: 'advanced-architectures',
  title: 'Vision Transformers (ViT)',
  description:
    'An Image is worth 16x16 words. Discover how Transformers are taking over the world of Computer Vision.',
  tags: ['vit', 'transformers', 'computer-vision', 'deep-learning'],
  prerequisites: ['transformers', 'cnn-foundations'],
  difficulty: 'advanced',
  estimatedMinutes: 60,
  steps: [
    {
      id: 'images-as-words',
      title: 'Images as Words',
      visualizationProps: {
        mode: 'patch-viz',
      },
      content: {
        text: 'Transformers were built for text. To use them for images, we cut the image into a grid of small squares called "Patches". Each patch is treated like a "Word" in a sentence.',
        goDeeper: {
          explanation: 'In the original ViT paper, images were cut into 16x16 pixel patches. For a 224x224 image, this resulting in a "sentence" of 196 patches.',
        },
      },
    },
    {
      id: 'linear-projections',
      title: 'Linear Projections',
      visualizationProps: {
        mode: 'projection-viz',
      },
      content: {
        text: 'A patch of pixels is just a raw grid of numbers. We use a single linear layer to flatten it and project it into a high-dimensional vector space (embedding), just like a word embedding.',
        goDeeper: {
          explanation: 'This mapping is learned during training. The model discovers which pixel patterns in a patch are most important for creating a useful "visual word".',
        },
      },
    },
    {
      id: 'patch-merging',
      title: 'Patch Merging: Hierarchical Vision',
      visualizationProps: {
        mode: 'merging-viz',
        interactive: true,
      },
      content: {
        text: 'In models like the Swin Transformer, we don\'t just keep the same number of patches. We merge neighboring patches to reduce the sequence length and increase the "receptive field".',
        goDeeper: {
          explanation: 'This creates a hierarchical structure similar to CNNs, where early layers focus on fine details and later layers focus on global structures.',
        },
      },
    },
    {
      id: 'masked-image-modeling',
      title: 'Masked Image Modeling (MAE)',
      visualizationProps: {
        mode: 'mae-viz',
      },
      content: {
        text: 'How do we train ViTs without labels? We mask out 75% of the patches and ask the model to reconstruct the missing parts. This is called Masked Autoencoding.',
        goDeeper: {
          explanation: 'By forcing the model to reconstruct the image from very little information, it learns a deep understanding of spatial relationships and object parts.',
        },
      },
    },
    {
      id: 'cls-token-depth',
      title: 'The CLS Token: Global Information Collector',
      visualizationProps: {
        mode: 'cls-depth-viz',
      },
      content: {
        text: 'Since an image has no inherent "start", we add a dummy token called [CLS] at the beginning. This token "attends" to every single patch, collecting the global representation of the entire image.',
        goDeeper: {
          explanation: 'At the end of the Transformer layers, only the [CLS] token is sent to the classifier head. It effectively summarizes the entire image into one vector.',
        },
      },
    },
    {
      id: 'the-cls-token',
      title: 'The CLS (Class) Token',
      visualizationProps: {
        mode: 'cls-token-viz',
      },
      content: {
        text: 'How do we get a single classification (e.g., "Dog") from a sentence of patches? We add an extra, blank token called the [CLS] token at the very beginning.',
        goDeeper: {
          explanation: 'After passing through the transformer, the [CLS] token has "attended" to all other visual patches. Its final state is a global summary of the entire image, used as the input to the classifier.',
        },
      },
    },
    {
      id: 'positional-embeddings-2d',
      title: '2D Positional Embeddings',
      visualizationProps: {
        mode: 'pos-2d-viz',
      },
      content: {
        text: 'Just like in text, the transformer doesn\'t know the spatial layout of patches. We add 2D positional embeddings so the model knows that Patch A is next to Patch B and above Patch C.',
        goDeeper: {
          explanation: 'Without these embeddings, the transformer would see the image as a random pile of puzzles pieces. With them, it can reconstruct the global geometry of the scene.',
        },
      },
    },
    {
      id: 'global-receptive-field',
      title: 'Global Receptive Field',
      visualizationProps: {
        mode: 'rf-viz',
      },
      content: {
        text: 'Unlike CNNs (which only see local neighbors in early layers), every patch in a ViT can "talk" to every other patch in the very first layer. This gives ViTs a "Global" view of the image immediately.',
        goDeeper: {
          explanation: 'This allows ViTs to understand long-range relationships (like the connection between a tail and a head) much more easily than traditional CNNs.',
        },
      },
    },
    {
      id: 'no-inductive-bias',
      title: 'The "No Bias" Tradeoff',
      visualizationProps: {
        mode: 'bias-viz',
      },
      content: {
        text: 'CNNs have "Inductive Bias"—they are built specifically for images. ViTs have almost none. This means ViTs need MUCH more data to learn, but once they have it, they often surpass CNNs.',
        goDeeper: {
          explanation: 'A CNN "knows" that pixels near each other are related. A ViT has to learn this from scratch. This is why ViTs are usually pre-trained on massive datasets like ImageNet-21k or JFT-300M.',
        },
      },
    },
    {
      id: 'attention-maps',
      title: 'Visualizing Attention',
      visualizationProps: {
        mode: 'heatmaps-viz',
      },
      content: {
        text: 'We can see exactly what the model is "looking" at. By plotting the attention weights, we often find the model focusing on the most semantic parts of an object, like eyes, wheels, or edges.',
        goDeeper: {
          explanation: 'This "Interpretability" is a major advantage. If a model misclassifies an image, we can look at the attention map to see if it was looking at a misleading part of the background.',
        },
      },
    },
    {
      id: 'vit-variants',
      title: 'The Future: DeiT, Swin, and MAE',
      visualizationProps: {
        mode: 'variants-viz',
      },
      content: {
        text: 'The original ViT was just the beginning. Now we have "Swin Transformers" that use hierarchical windows and "MAE" (Masked Autoencoders) that learn by reconstructing missing patches.',
        goDeeper: {
          explanation: 'These modern variants solve many of the data-efficiency problems of the original ViT, making transformers the dominant architecture in vision, text, and even audio.',
        },
      },
    },
  ],
  playground: {
    description: 'Experiment with patch sizes and attention focus in a Vision Transformer.',
    parameters: [
      { id: 'patchSize', label: 'Patch Size', type: 'select', options: ['8', '16', '32'], default: '16' },
    ],
    tryThis: [
      'Use a small patch size (8x8). Notice how the model has many more "words" to process.',
      'Check the attention maps for different layers. Compare the first layer to the last.',
    ],
  },
  challenges: [],
};

export default vitModule;
