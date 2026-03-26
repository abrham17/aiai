import type { ModuleData } from '@/core/types';

export const gansModule: ModuleData = {
  id: 'gans',
  tierId: 4,
  clusterId: 'frontiers',
  title: 'Generative Adversarial Nets (GANs)',
  description: 'The creative duel between a Generator and a Discriminator.',
  tags: ['Generative AI', 'GANs', 'StyleGAN', 'Adversarial Training'],
  prerequisites: ['cnn-foundations', 'backpropagation'],
  difficulty: 'advanced',
  estimatedMinutes: 60,
  steps: [
    {
      id: 'the-duel',
      title: 'The Mini-max Game',
      visualizationProps: {
        mode: 'duel-viz',
        interactive: true,
      },
      content: {
        text: 'A GAN consists of two neural networks. The Generator tries to create fake data, while the Discriminator tries to distinguish fake data from real data. They are locked in a "duel" where each one pushes the other to improve.',
        goDeeper: {
          math: '\\min_G \\max_D V(D, G) = \\mathbb{E}_{x \\sim p_{data}(x)}[\\log D(x)] + \\mathbb{E}_{z \\sim p_z(z)}[\\log(1 - D(G(z)))]',
          explanation: 'The Generator wants the Discriminator to fail (minimize loss), while the Discriminator wants to succeed (maximize classification accuracy). This is a Zero-Sum game.',
        },
      },
    },
    {
      id: 'mode-collapse',
      title: 'Mode Collapse: The Achilles Heel',
      visualizationProps: {
        mode: 'mode-collapse-viz',
      },
      content: {
        text: 'Sometimes the Generator finds one single "trick" that fools the Discriminator perfectly (e.g., always generating the same number 7). This is called Mode Collapse, and it prevents the model from learning the full diversity of the dataset.',
        goDeeper: {
          explanation: 'Modern GANs (like StyleGAN) use specialized loss functions and normalization techniques to prevent the model from getting stuck in these degenerate states.',
        },
      },
    },
    {
      id: 'stylegan-architecture',
      title: 'StyleGAN: Fine-grained Control',
      visualizationProps: {
        mode: 'style-transfer-viz',
      },
      content: {
        text: 'StyleGAN separates the "content" of an image from its "style". By injecting style at different resolutions, we can control high-level features (face shape) independently from low-level features (skin texture).',
        goDeeper: {
          explanation: 'This is achieved using "Adaptive Instance Normalization" (AdaIN), where the style vector $w$ controls the scaling and shifting of the feature maps at every layer.',
        },
      },
    },
  ],
  playground: {
    description: 'Experiment with the GAN duel. Balance the Generator and Discriminator.',
    parameters: [],
    tryThis: [
      'Move the slider to see how the equilibrium shifts between the two networks.',
    ],
  },
  challenges: [],
};

export default gansModule;
