import type { ModuleData } from '@/core/types';

export const diffusionModule: ModuleData = {
  id: 'diffusion',
  tierId: 4,
  clusterId: 'frontiers',
  title: 'Diffusion Models',
  description:
    'Learn how AI dreams by un-making and re-making noise. The engine behind Midjourney and Stable Diffusion.',
  tags: ['diffusion', 'generative-ai', 'image-generation', 'deep-learning'],
  prerequisites: ['cnn-foundations', 'backpropagation'],
  difficulty: 'advanced',
  estimatedMinutes: 60,
  steps: [
    {
      id: 'denoising-mechanics',
      title: 'The Denoising Step: Predicted Noise',
      visualizationProps: {
        mode: 'denoising-simulator',
        interactive: true,
      },
      content: {
        text: 'The model doesn\'t actually predict the "clean image" directly. Instead, it predicts the tiny amount of NOISE added at step $t$. By subtracting this noise, we move one tiny step closer to the clean image.',
        goDeeper: {
          math: '\\epsilon_\\theta(x_t, t) \\approx \\epsilon',
          explanation: 'Subtracting a fraction of the predicted noise $\\epsilon_\\theta$ from the noisy image $x_t$ is equivalent to taking a step towards the high-density data region in the score function.',
        },
      },
    },
    {
      id: 'u-net-skip-connections',
      title: 'U-Net: The Workhorse',
      visualizationProps: {
        mode: 'u-net-flow',
      },
      content: {
        text: 'The U-Net architecture is perfect for diffusion because it uses "Skip Connections" to pass high-resolution texture information directly from the encoder to the decoder.',
        goDeeper: {
          explanation: 'As the spatial resolution decreases in the "U" bottleneck, the model learns semantic abstract features. The skip connections then help the model re-apply the correct textures during the reconstruction phase.',
        },
      },
    },
    {
      id: 'classifier-free-guidance',
      title: 'Classifier-Free Guidance (CFG)',
      visualizationProps: {
        mode: 'cfg-viz',
        interactive: true,
      },
      content: {
        text: 'CFG is the magic that makes models follow your prompt precisely. We mix the prompt-conditioned noise prediction with an unconditioned one, pushing the generation away from "random" and towards your specific intent.',
        goDeeper: {
          math: '\\hat{\\epsilon}_\\theta = \\epsilon_\\theta(x_t, \\emptyset) + w(\\epsilon_\\theta(x_t, y) - \\epsilon_\\theta(x_t, \\emptyset))',
          explanation: '$w$ is the guidance scale. High $w$ leads to images that follow the prompt strictly but may look "over-saturated" or artificial.',
        },
      },
    },
    {
      id: 'the-noise-gradient',
      title: 'The Noise Gradient',
      visualizationProps: {
        mode: 'diffusion-overview',
      },
      content: {
        text: 'Diffusion works in two directions: Forward (adding noise) and Reverse (removing noise). It is like watching a painting dissolve into static, and then learning to run the movie backwards.',
        goDeeper: {
          explanation: 'The model never actually sees "the cat". It only learns the "Score Function"—the direction to nudge pixels to make them *slightly* less noisy.',
        },
      },
    },
    {
      id: 'forward-diffusion',
      title: 'Forward: Adding Chaos',
      visualizationProps: {
        mode: 'forward-noise-viz',
        interactive: true,
      },
      content: {
        text: 'We take a clear image and slowly add Gaussian noise over T steps (e.g., 1000). By the end, the image is pure un-identifiable static.',
        goDeeper: {
          math: 'q(x_t | x_{t-1}) = \\mathcal{N}(x_t; \\sqrt{1-\\beta_t}x_{t-1}, \\beta_t I)',
          explanation: 'We don\'t actually need to step 1000 times to get to the end! The "Diffusion Trick" allows us to calculate any noisy image $x_t$ directly from the original $x_0$ using a single closed-form equation.',
        },
      },
    },
    {
      id: 'the-epsilon-task',
      title: 'The Task: Predict the Noise',
      visualizationProps: {
        mode: 'predict-noise-viz',
      },
      content: {
        text: 'During training, we give the model a noisy image and ask it: "How much noise did we just add?". If the model can predict the noise ($\epsilon$), we can subtract it to get a cleaner image.',
        goDeeper: {
          math: 'L = || \\epsilon - \\epsilon_\\theta(x_t, t) ||^2',
          explanation: 'It sounds simple, but this simple objective allows the model to learn the entire probability distribution of all images in its training set.',
        },
      },
    },
    {
      id: 'reverse-diffusion',
      title: 'Reverse: Sculpting Static',
      visualizationProps: {
        mode: 'reverse-denoise-viz',
      },
      content: {
        text: 'To generate a NEW image, we start with a block of random noise and ask the model to remove a tiny bit of noise. We repeat this 50-100 times until a clear image emerges from the void.',
        goDeeper: {
          explanation: 'This is an "Iterative Refinement" process. Just like a sculptor chipping away at marble, the model chips away at the noise until the hidden structure is revealed.',
        },
      },
    },
    {
      id: 'unet-architecture',
      title: 'The U-Net Backbone',
      visualizationProps: {
        mode: 'unet-viz',
      },
      content: {
        text: 'The "Brain" inside most diffusion models is a U-Net. It takes the image down into small, abstract representations (Encoder) and then reconstructs it back up (Decoder), using "Skip Connections" to preserve fine detail.',
        goDeeper: {
          explanation: 'The U-shape allows the model to understand global composition (at the bottom) while still being able to fix individual pixels (at the top).',
        },
      },
    },
    {
      id: 'conditioning',
      title: 'Conditioning: Guiding the Dream',
      visualizationProps: {
        mode: 'conditioning-viz',
      },
      content: {
        text: 'How do we tell it to make a "Cat" vs a "Dog"? We provide "Conditioning"—a vector representing our text prompt. The model uses Cross-Attention to let the text guide the denoising process.',
        goDeeper: {
          explanation: 'The text prompt (e.g., "A neon cyberpunk cat") is turned into embeddings by a language model (like CLIP) before being fed into the U-Net.',
        },
      },
    },
    {
      id: 'classifier-free-guidance',
      title: 'CFG: Powering the Prompt',
      visualizationProps: {
        mode: 'cfg-viz',
        interactive: true,
      },
      content: {
        text: 'Sometimes the model ignores the prompt. "Classifier-Free Guidance" (CFG) is a knob we turn to force the model to follow the prompt more strictly, often making results more vibrant and surreal.',
        goDeeper: {
          explanation: 'We calculate two noise predictions: one with the prompt and one without. We then move in the direction of the prompt *away* from the unconditioned silence.',
        },
      },
    },
    {
      id: 'latent-diffusion',
      title: 'Latent Diffusion (SDXL)',
      visualizationProps: {
        mode: 'latent-viz',
      },
      content: {
        text: 'Working with big pixels is slow. "Latent Diffusion" (Stable Diffusion) does all the math in a smaller, compressed mathematically space (Latents) and only turns it back into pixels at the very end.',
        goDeeper: {
          explanation: 'This allows the model to run on consumer GPUs! A 512x512 image is compressed into a 64x64 latent grid, making the diffusion process 64x faster.',
        },
      },
    },
    {
      id: 'beyond-images',
      title: 'Beyond Images: Audio & Video',
      visualizationProps: {
        mode: 'multimodal-viz',
      },
      content: {
        text: 'Diffusion isn\'t just for art! The same math is being used to generate speech (Suno), music, and even realistic video (Sora). If it exists as a signal, we can diffuse it.',
        goDeeper: {
          explanation: 'Video diffusion adds a "Temporal" dimension, where the model must ensure that noise is removed consistently across a sequence of frames to maintain smooth motion.',
        },
      },
    },
  ],
  playground: {
    description: 'Experiment with noise levels and guidance scales to see how images form.',
    parameters: [
      { id: 'steps', label: 'Denoising Steps', type: 'slider', min: 1, max: 100, step: 1, default: 50 },
      { id: 'cfg', label: 'Guidance Scale (CFG)', type: 'slider', min: 1, max: 20, step: 0.5, default: 7.5 },
    ],
    tryThis: [
      'Set CFG to 1. Notice how the "dream" becomes more random and less focused.',
      'Set Denoising Steps to 5. Notice the grainy, unfinished look—the "uncanny valley" of diffusion.',
    ],
  },
  challenges: [],
};

export default diffusionModule;
