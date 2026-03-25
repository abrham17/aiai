import type { ModuleData } from '@/core/types';

const partialDerivativesModule: ModuleData = {
  id: 'partial-derivatives',
  tierId: 0,
  clusterId: 'calculus',
  title: 'Partial Derivatives',
  description:
    'Move from single-variable slopes to multivariable surfaces. Learn what partials measure, how slices create them, and how they combine into the gradient.',
  tags: ['calculus', 'partials', 'gradient', 'optimization'],
  prerequisites: ['vectors'],
  difficulty: 'intermediate',
  estimatedMinutes: 45,
  steps: [
    {
      id: 'surfaces-have-two-directions',
      title: 'A Surface Has Two Independent Directions',
      visualizationProps: {
        mode: 'surface',
        surface: 'bowl',
        showContours: true,
        showGradient: false,
        showField: false,
        showSlices: false,
        showTangent: false,
        point: { x: 1.2, y: 0.8 },
        interactive: true,
      },
      content: {
        text: 'For a function of one variable, there is only one way to move: left or right. For f(x, y), every point lives on a surface, and you can move in the x direction or the y direction independently. That means one slope is no longer enough.',
        goDeeper: {
          math: 'z = f(x, y)',
          explanation:
            'A multivariable function maps a pair of inputs to one output. Geometrically, that output becomes height over the x-y plane, creating a surface instead of a curve.',
        },
      },
      interactionHint: 'Drag the point around the contour map and watch the height and local slopes update.',
    },
    {
      id: 'partial-x',
      title: 'Partial Means: Hold the Other Variable Still',
      visualizationProps: {
        mode: 'slice-x',
        surface: 'bowl',
        showContours: true,
        showGradient: false,
        showField: false,
        showSlices: true,
        showTangent: true,
        point: { x: 1.1, y: 1.0 },
        interactive: true,
      },
      content: {
        text: 'The symbol partial means we freeze every variable except one. To compute partial f / partial x, we hold y fixed and only move in the x direction. That creates an ordinary 2D slice, and the slope of that slice is the x-partial.',
        goDeeper: {
          math: '\\frac{\\partial f}{\\partial x}(x_0, y_0) = \\lim_{h \\to 0} \\frac{f(x_0 + h, y_0) - f(x_0, y_0)}{h}',
          explanation:
            'Read the symbol as "partial f with respect to x." It is the usual derivative, except every other variable is treated as a constant while x changes.',
        },
      },
      interactionHint: 'Watch the x-slice chart: moving left or right changes the slice, but the highlighted y-value stays frozen.',
    },
    {
      id: 'partial-y',
      title: 'Now Freeze x and Vary y',
      visualizationProps: {
        mode: 'slice-y',
        surface: 'bowl',
        showContours: true,
        showGradient: false,
        showField: false,
        showSlices: true,
        showTangent: true,
        point: { x: 1.1, y: 1.0 },
        interactive: true,
      },
      content: {
        text: 'The y-partial is the same idea in the other direction. Hold x fixed, move only along y, and read the slope of that new slice. The exact same point on the surface can have one slope in x and a totally different slope in y.',
        goDeeper: {
          math: '\\frac{\\partial f}{\\partial y}(x_0, y_0) = \\lim_{h \\to 0} \\frac{f(x_0, y_0 + h) - f(x_0, y_0)}{h}',
          explanation:
            'Partial derivatives are directional bookkeeping. Each one measures how the surface changes if you move along one coordinate axis while every other axis stays fixed.',
        },
      },
      quiz: {
        question: 'When computing partial f / partial y at a point, what happens to x?',
        options: ['x changes together with y', 'x is frozen', 'x becomes zero', 'x is ignored completely'],
        correctIndex: 1,
        explanation:
          'For partial f / partial y, x is held constant while y changes. That is what makes it a partial derivative rather than a full directional derivative.',
      },
      interactionHint: 'Compare this y-slice to the previous x-slice at the same point.',
    },
    {
      id: 'same-point-different-slopes',
      title: 'One Point, Two Different Slopes',
      visualizationProps: {
        mode: 'gradient',
        surface: 'ripples',
        showContours: true,
        showGradient: true,
        showField: false,
        showSlices: true,
        showTangent: true,
        point: { x: 1.0, y: -0.9 },
        interactive: true,
      },
      content: {
        text: 'On a curved surface, the x-slice and y-slice usually disagree. At the same point, one direction might slope upward sharply while the other barely changes at all. Partial derivatives do not compete; they each describe one independent axis of change.',
        goDeeper: {
          explanation:
            'This is why multivariable calculus cannot collapse back to one number. A single slope loses the directional structure of the surface.',
        },
      },
      interactionHint: 'Drag to a new point on the rippled surface and compare the two slice charts side by side.',
    },
    {
      id: 'gradient-vector',
      title: 'The Gradient Packs the Partials Together',
      visualizationProps: {
        mode: 'gradient',
        surface: 'bowl',
        showContours: true,
        showGradient: true,
        showField: true,
        showSlices: true,
        showTangent: true,
        point: { x: 1.4, y: 1.1 },
        interactive: true,
      },
      content: {
        text: 'Once you know the x-partial and the y-partial, you can pack them into a vector. That vector is the gradient. It points in the direction of steepest increase and tells you how sensitive the surface is to each coordinate at once.',
        goDeeper: {
          math: '\\nabla f(x, y) = \\begin{bmatrix} \\frac{\\partial f}{\\partial x} \\\\ \\frac{\\partial f}{\\partial y} \\end{bmatrix}',
          explanation:
            'The gradient is not a new quantity hiding somewhere else. It is simply the list of all partial derivatives, organized into a vector.',
        },
      },
      quiz: {
        question: 'If partial f / partial x = 2 and partial f / partial y = -3, what is the gradient?',
        options: ['[2, -3]', '[-2, 3]', '[5]', '[2, 3]'],
        correctIndex: 0,
        explanation:
          'The gradient is the vector of partial derivatives in coordinate order: [partial f / partial x, partial f / partial y].',
      },
      interactionHint: 'Watch the red arrow rotate as the local partial derivatives change.',
    },
    {
      id: 'one-zero-is-not-flat',
      title: 'One Partial Can Be Zero Without the Surface Being Flat',
      visualizationProps: {
        mode: 'stationary',
        surface: 'saddle',
        showContours: true,
        showGradient: true,
        showField: false,
        showSlices: true,
        showTangent: true,
        point: { x: 0.0, y: 1.2 },
        interactive: true,
      },
      content: {
        text: 'If partial f / partial x is zero, that only means the surface is flat in the x direction. It says nothing about the y direction. You can still be sliding strongly uphill or downhill along y. Flat in one slice does not mean flat overall.',
        goDeeper: {
          explanation:
            'A point is only stationary when all partial derivatives are zero at the same time. Zero in one coordinate direction is only a partial fact.',
        },
      },
      interactionHint: 'Try moving along the vertical guide where the x-partial vanishes and watch the y-partial stay alive.',
    },
    {
      id: 'stationary-does-not-mean-minimum',
      title: 'Both Partials Zero Still Does Not Guarantee a Minimum',
      visualizationProps: {
        mode: 'stationary',
        surface: 'saddle',
        showContours: true,
        showGradient: true,
        showField: true,
        showSlices: true,
        showTangent: true,
        point: { x: 0.0, y: 0.0 },
        interactive: true,
      },
      content: {
        text: 'At the saddle center, both partial derivatives are zero, so the gradient vanishes. But the point is not a minimum. Move in one direction and height increases; move in another and height decreases. Stationary just means first-order flat, not automatically safe.',
        goDeeper: {
          explanation:
            'This is the first warning sign that optimization is subtle. A zero gradient can mean minimum, maximum, or saddle, depending on the surrounding curvature.',
        },
      },
      quiz: {
        question: 'If both partial derivatives are zero at a point, what must be true?',
        options: ['The point is definitely a minimum', 'The point is definitely a maximum', 'The point is stationary, but its type is still unknown', 'The function is constant nearby'],
        correctIndex: 2,
        explanation:
          'Zero partials tell you the first-order slope information is flat, but they do not classify the point. You still need the surrounding geometry.',
      },
    },
    {
      id: 'why-ml-cares',
      title: 'Why Machine Learning Cares',
      visualizationProps: {
        mode: 'gradient',
        surface: 'ripples',
        showContours: true,
        showGradient: true,
        showField: true,
        showSlices: true,
        showTangent: true,
        point: { x: 1.6, y: -1.0 },
        interactive: true,
      },
      content: {
        text: 'A neural network loss surface is just a far larger version of what you see here. Each parameter has its own partial derivative. Bundle all those partials together and you get the gradient that training uses to step downhill.',
        goDeeper: {
          explanation:
            'Backpropagation exists to compute partial derivatives efficiently across many parameters. Optimization then uses that gradient to decide how to update the model.',
        },
        authorNote:
          'If this module clicks, the gradient no longer feels like magic. It becomes a clean accounting trick: one local slope per parameter.',
      },
    },
  ],
  playground: {
    description:
      'Explore contour maps, live x/y slices, and gradient behavior across several surfaces.',
    parameters: [
      { id: 'mode', label: 'Mode', type: 'select', default: 'gradient', options: ['surface', 'slice-x', 'slice-y', 'gradient', 'stationary'] },
      { id: 'surface', label: 'Surface', type: 'select', default: 'bowl', options: ['bowl', 'saddle', 'ripples'] },
      { id: 'showContours', label: 'Show contours', type: 'toggle', default: true },
      { id: 'showGradient', label: 'Show gradient arrow', type: 'toggle', default: true },
      { id: 'showField', label: 'Show gradient field', type: 'toggle', default: false },
      { id: 'showSlices', label: 'Show slice charts', type: 'toggle', default: true },
      { id: 'showTangent', label: 'Show tangent lines', type: 'toggle', default: true },
      { id: 'pointX', label: 'Point x', type: 'slider', min: -2.8, max: 2.8, step: 0.1, default: 1.2 },
      { id: 'pointY', label: 'Point y', type: 'slider', min: -2.8, max: 2.8, step: 0.1, default: 0.8 },
    ],
    tryThis: [
      'On the saddle, drag onto the vertical guide. Why does one partial vanish while the other survives?',
      'Switch between slice-x and slice-y at the same point. Which slope changes faster?',
      'Turn on the gradient field and compare its arrows to the live red gradient vector.',
      'Find a stationary point on the bowl, then try the same on the rippled surface.',
    ],
  },
  challenges: [
    {
      id: 'freeze-x',
      title: 'Freeze x-Slope',
      description: 'Move to a point where partial f / partial x is almost zero, but partial f / partial y is still clearly nonzero.',
      props: {
        mode: 'slice-x',
        surface: 'saddle',
        showContours: true,
        showGradient: true,
        showSlices: true,
        showTangent: true,
        point: { x: 0.9, y: 1.2 },
      },
      completionCriteria: { type: 'threshold', target: 0.08, metric: 'partial_x_zero_but_partial_y_alive' },
      hints: [
        'You want the x-partial near zero, so think about where the x-slice becomes flat.',
        'The y-partial should still have visible magnitude, so do not drift toward the center.',
      ],
    },
    {
      id: 'find-stationary',
      title: 'Find the Stationary Point',
      description: 'Drag to a point where the whole gradient is nearly zero.',
      props: {
        mode: 'stationary',
        surface: 'bowl',
        showContours: true,
        showGradient: true,
        showField: true,
        showSlices: true,
        showTangent: true,
        point: { x: 1.8, y: -1.5 },
      },
      completionCriteria: { type: 'threshold', target: 0.08, metric: 'gradient_magnitude' },
      hints: [
        'A stationary point needs both partials close to zero at the same time.',
        'On the bowl surface, there is a single obvious candidate.',
      ],
    },
    {
      id: 'mixed-signs',
      title: 'Mixed Signs',
      description: 'Find a point where the x-partial is positive while the y-partial is negative.',
      props: {
        mode: 'gradient',
        surface: 'saddle',
        showContours: true,
        showGradient: true,
        showField: true,
        showSlices: true,
        showTangent: true,
        point: { x: -1.4, y: -1.2 },
      },
      completionCriteria: { type: 'threshold', target: 0.1, metric: 'partial_x_positive_partial_y_negative' },
      hints: [
        'Read the signs from the live panel instead of guessing from the picture alone.',
        'On this saddle, moving into the right region of the plane flips the signs the way you need.',
      ],
    },
  ],
};

export default partialDerivativesModule;
