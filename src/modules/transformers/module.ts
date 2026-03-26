import type { ModuleData } from '@/core/types';

export const transformersModule: ModuleData = {
  id: 'transformers',
  tierId: 3,
  clusterId: 'advanced-architectures',
  title: 'The Transformer Block',
  description:
    'Combine attention, feed-forward networks, and normalization into the engine that powers modern AI.',
  tags: ['transformers', 'llm', 'deep-learning', 'nlp'],
  prerequisites: ['attention', 'mlps'],
  difficulty: 'advanced',
  estimatedMinutes: 60,
  steps: [
    {
      id: 'the-transformer-sandwich',
      title: 'The Transformer Sandwich',
      visualizationProps: {
        mode: 'block-overview',
      },
      content: {
        text: 'A Transformer is not just attention. It is a "Block" repeated many times. Each block has a specific sequence: Attention -> Add & Norm -> Feed Forward -> Add & Norm.',
        goDeeper: {
          explanation: 'Think of Attention as the "Gathering" step (where words talk to each other) and the Feed-Forward Network as the "Thinking" step (where each word processed its gathered information individually).',
        },
      },
    },
    {
      id: 'positional-encoding',
      title: 'Positional Encoding: Where am I?',
      visualizationProps: {
        mode: 'position-viz',
      },
      content: {
        text: 'Attention has no concept of order. To a Transformer, "Dog bites man" and "Man bites dog" look identical. We add special "Positional Encodings" to the inputs to give the model a sense of relative position.',
        goDeeper: {
          math: 'PE_{(pos, 2i)} = \\sin(pos/10000^{2i/d_{model}})',
          explanation: 'Instead of just numbering words 1, 2, 3... we use sine and cosine waves of different frequencies. This allows the model to easily calculate the distance between any two words using simple linear transformations.',
        },
      },
    },
    {
      id: 'layer-normalization',
      title: 'Layer Normalization',
      visualizationProps: {
        mode: 'layernorm-viz',
        interactive: true,
      },
      content: {
        text: 'To keep training stable, we "normalize" the activations within each layer to have a mean of 0 and a variance of 1. This prevents values from exploding or vanishing as they traverse the deep stack.',
        goDeeper: {
          explanation: 'Unlike Batch Norm (which normalizes across samples), Layer Norm normalizes across features for a single sample. This makes it ideal for sequences of varying lengths.',
        },
      },
    },
    {
      id: 'residual-connections',
      title: 'Residual (Skip) Connections',
      visualizationProps: {
        mode: 'residual-viz',
      },
      content: {
        text: 'In deep models, information can get lost. We use "Skip Connections"—we add the input of a layer directly to its output. This creates a "Highway" for gradients to flow backwards during training.',
        goDeeper: {
          math: '\\text{Output} = \\text{Layer}(x) + x',
          explanation: 'This allows the network to learn "residuals"—the difference between input and output—rather than a completely new representation. It is the secret to training models with hundreds of layers.',
        },
      },
    },
    {
      id: 'feed-forward-networks',
      title: 'Feed-Forward Networks (FFN)',
      visualizationProps: {
        mode: 'ffn-viz',
      },
      content: {
        text: 'After talking to other words via attention, each word passes through a shared MLP. This is where most of the "Knowledge" of the model is stored—it is the local processing unit.',
        goDeeper: {
          explanation: 'The FFN typically uses two linear layers and a non-linear activation (like ReLU or GeLU). It transforms the high-context embeddings into a more refined semantic space.',
        },
      },
    },
    {
      id: 'encoder-vs-decoder',
      title: 'Encoder vs Decoder',
      visualizationProps: {
        mode: 'enc-dec-viz',
      },
      content: {
        text: 'Some Transformers just read (BERT - Encoder), some just write (GPT - Decoder), and some do both (T5 - Encoder-Decoder).',
        goDeeper: {
          explanation: 'Encoders see the whole sentence at once (Bi-directional). Decoders only see the past (Uni-directional) so they can generate text token-by-token.',
        },
      },
    },
    {
      id: 'embedding-space',
      title: 'Embedding Space',
      visualizationProps: {
        mode: 'embedding-viz',
      },
      content: {
        text: 'Words aren\'t strings to a Transformer; they are high-dimensional vectors. In this "Embedding Space", similar words (like "King" and "Queen") are mathematically close to each other.',
        goDeeper: {
          explanation: 'The model learns these embeddings during training. It discovers that subtractings "Man" from "King" and adding "Woman" results in a vector very close to "Queen"—capturing human semantic relationships in cold geometry.',
        },
      },
    },
    {
      id: 'tokenization',
      title: 'Tokenization: Cutting up Language',
      visualizationProps: {
        mode: 'tokens-viz',
      },
      content: {
        text: 'Models don\'t read words; they read "Tokens". Sometimes a token is a whole word, sometimes it is just a piece of a word (like "un-" or "-ing").',
        goDeeper: {
          explanation: 'Modern tokenizers use algorithms like BPE (Byte Pair Encoding) to efficiently handle any word in any language using a fixed vocabulary of ~50,000 sub-word pieces.',
        },
      },
    },
    {
      id: 'the-final-projection',
      title: 'The Final Head',
      visualizationProps: {
        mode: 'softmax-output-viz',
      },
      content: {
        text: 'At the very end, we take the final vector and project it back to the size of our vocabulary. A Softmax then tells us the probability of every possible next token.',
        goDeeper: {
          explanation: 'The model "predicts" by picking the most likely token, appending it to the input, and running the whole Transformer stack again for the next token. This is Autoregressive Generation.',
        },
      },
    },
    {
      id: 'softmax-temperature',
      title: 'Softmax Temperature: Controling Creativity',
      visualizationProps: {
        mode: 'temperature-viz',
        interactive: true,
      },
      content: {
        text: 'We can control how "creative" or "random" the model is using Temperature ($T$). High temperature makes the probability distribution flatter (more random), while low temperature makes it peakier (more confident).',
        goDeeper: {
          math: 'P_i = \\frac{e^{z_i / T}}{\\sum_j e^{z_j / T}}',
          explanation: 'By dividing logits by $T$, we alter the variance. As $T \\to 0$, the model becomes deterministic (greedy search). As $T \\to \\infty$, the model becomes a uniform random sampler.',
        },
      },
    },
    {
      id: 'weight-tying',
      title: 'Weight Tying',
      visualizationProps: {
        mode: 'weight-tying-viz',
      },
      content: {
        text: 'Modern models often use the same weights for the Input Embeddings and the Final Output Projection. This reduces the number of parameters and forces the model to learn a consistent representation of language.',
        goDeeper: {
          explanation: 'If a word vector is good for input semantics, it should also be good for predicting that word as an output. This "Tying" can save billions of parameters in large vocabularies.',
        },
      },
    },
    {
      id: 'scaling-laws',
      title: 'Scaling Laws: bigger is better?',
      visualizationProps: {
        mode: 'scaling-laws-viz',
      },
      content: {
        text: 'Why do we keep making models bigger? Research shows that as we increase Compute, Data, and Parameters, the model\'s loss drops predictably according to a Power Law.',
        goDeeper: {
          explanation: 'The "Chinchilla Scaling Laws" suggest that for every double in model size, we should also double the training data to remain compute-optimal.',
        },
      },
    },
  ],
  playground: {
    description: 'Experiment with the Transformer architecture. Tweak the number of heads, layers, and embedding size.',
    parameters: [
      { id: 'layers', label: 'Layers', type: 'select', options: ['1', '2', '4', '8'], default: '2' },
      { id: 'heads', label: 'Heads', type: 'select', options: ['1', '2', '4', '8'], default: '4' },
    ],
    tryThis: [
      'Increase the number of layers. Watch how the "Receptive Field" of the model expands.',
      'Change the number of heads and see how the attention patterns become more complex.',
    ],
  },
  challenges: [],
};

export default transformersModule;
