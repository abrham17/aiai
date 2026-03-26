import type { ModuleData } from '@/core/types';

export const vaesModule: ModuleData = {
  id: 'vaes',
  tierId: 4,
  clusterId: 'frontiers',
  title: 'Variational Autoencoders (VAEs)',
  description: 'Learning the underlying math of Probabilistic Latent Spaces.',
  tags: ['Generative AI', 'VAEs', 'Latent Space', 'Probability'],
  prerequisites: ['mlps', 'backpropagation'],
  difficulty: 'advanced',
  estimatedMinutes: 50,
  steps: [
    {
      id: 'the-bottleneck',
      title: 'The Latent Bottleneck',
      visualizationProps: {
        mode: 'bottleneck-viz',
      },
      content: {
        text: 'An Autoencoder tries to compress data into a smaller "Bottleneck" representation and then reconstruct it. A VAE adds a twist: instead of a single point, it learns the parameters of a PROBABILITY DISTRIBUTION.',
        goDeeper: {
          explanation: 'By learning a distribution (Mean $\\mu$ and Variance $\\sigma$) rather than a fixed point, the latent space becomes continuous. This allows us to "sample" new points from the space to generate new data.',
        },
      },
    },
    {
      id: 'reparameterization-trick',
      title: 'The Reparameterization Trick',
      visualizationProps: {
        mode: 'reparam-viz',
      },
      content: {
        text: 'How do we backpropagate through a random sampling process? We can\'t. The Reparameterization Trick moves the randomness into an external noise variable ($\\epsilon$), allowing gradients to flow through the mean and variance.',
        goDeeper: {
          math: 'z = \\mu + \\sigma \\odot \\epsilon, \\quad \\epsilon \\sim \\mathcal{N}(0, I)',
          explanation: 'By expressing $z$ as a deterministic function of $\\mu, \\sigma$ and the random $\\epsilon$, we make the network differentiable. This is one of the most elegant "hacks" in deep learning.',
        },
      },
    },
    {
      id: 'latent-interpolation',
      title: 'Latent Space Exploration',
      visualizationProps: {
        mode: 'latent-explorer',
        interactive: true,
      },
      content: {
        text: 'The power of VAEs is that their latent spaces are structured. If you move slowly between two points in the latent space, the generated output will slowly "morph" from one object into another.',
        goDeeper: {
          explanation: 'This "smoothness" is enforced by the KL-Divergence term in the loss function, which penalizes the model if its latent distribution stays too far from a standard normal distribution.',
        },
      },
    },
  ],
  playground: {
    description: 'Explore the latent space of the VAE. See how small movements change the output.',
    parameters: [],
    tryThis: [
      'Drag the crosshair in the latent space (left) to see the decoded reconstruction (right).',
    ],
  },
  challenges: [],
};

export default vaesModule;
