// --- Data & State ---

// Define all the visual elements we need to manipulate
const elements = {
    nodes: {
        i1: 'n-i1', i2: 'n-i2',
        h1: 'n-h1', h2: 'n-h2',
        o1: 'n-o1'
    },
    edges: {
        i_h: ['e-i1-h1', 'e-i1-h2', 'e-i2-h1', 'e-i2-h2'],
        h_o: ['e-h1-o1', 'e-h2-o1']
    }
};

// Definition of our interactive steps, including the new PyTorch step
const steps = [
    {
        title: "The Neural Network",
        type: "neutral",
        description: "This is a simple Neural Network. It has an <b>Input Layer</b> to receive data, a <b>Hidden Layer</b> to extract patterns, and an <b>Output Layer</b> to make a prediction. Currently, it is initialized with random weights (the connecting lines).",
        math: "",
        state: { activeNodes: [], forwardEdges: [], backwardEdges: [] }
    },
    {
        title: "Forward Propagation: Inputs",
        type: "forward",
        description: "<b>Forward propagation</b> begins! We feed our raw data features ($x_1, x_2$) into the input layer. The network's goal is to push this information forward to make a guess.",
        math: "X = \\begin{bmatrix} x_1 \\\\ x_2 \\end{bmatrix}",
        state: { activeNodes: ['n-i1', 'n-i2'], forwardEdges: [], backwardEdges: [] }
    },
    {
        title: "Forward Propagation: Hidden Layer",
        type: "forward",
        description: "The inputs travel across the connections (weights). Each hidden neuron multiplies the inputs by their weights, adds a bias, and passes the result through an <b>Activation Function</b> (like ReLU or Sigmoid) to introduce non-linearity.",
        math: "Z^{[1]} = W^{[1]}X + b^{[1]} \\newline A^{[1]} = \\sigma(Z^{[1]})",
        state: { activeNodes: ['n-i1', 'n-i2', 'n-h1', 'n-h2'], forwardEdges: elements.edges.i_h, backwardEdges: [] }
    },
    {
        title: "Forward Propagation: Output",
        type: "forward",
        description: "The activated signals from the hidden layer travel to the final output neuron. The same math applies, resulting in our final prediction, $\\hat{y}$ (y-hat).",
        math: "Z^{[2]} = W^{[2]}A^{[1]} + b^{[2]} \\newline \\hat{y} = A^{[2]} = \\sigma(Z^{[2]})",
        state: { activeNodes: ['n-h1', 'n-h2', 'n-o1'], forwardEdges: elements.edges.h_o, backwardEdges: [] }
    },
    {
        title: "Calculating the Loss",
        type: "neutral",
        description: "Now we compare our prediction ($\\hat{y}$) against the actual true target value ($y$). We calculate the <b>Loss</b> (error). If the guess is bad, the loss is high.",
        math: "Loss = \\mathcal{L}(\\hat{y}, y) = \\frac{1}{2}(\\hat{y} - y)^2",
        state: { activeNodes: ['n-o1'], forwardEdges: [], backwardEdges: [] }
    },
    {
        title: "Backward Propagation: Output Gradients",
        type: "backward",
        description: "<b>Backward propagation</b> begins! We need to figure out who is responsible for the error. We calculate the gradient of the Loss with respect to the output weights using calculus (the Chain Rule).",
        math: "\\frac{\\partial \\mathcal{L}}{\\partial W^{[2]}} = (A^{[2]} - y) \\cdot A^{[1]T}",
        state: { activeNodes: ['n-o1', 'n-h1', 'n-h2'], forwardEdges: [], backwardEdges: elements.edges.h_o }
    },
    {
        title: "Backward Propagation: Hidden Gradients",
        type: "backward",
        description: "We continue moving backwards. We pass the 'blame' through the hidden layer to calculate how much the first set of weights contributed to the final error. The Chain Rule links it all together.",
        math: "\\frac{\\partial \\mathcal{L}}{\\partial W^{[1]}} = (W^{[2]T} dZ^{[2]} * \\sigma'(Z^{[1]})) \\cdot X^T",
        state: { activeNodes: ['n-h1', 'n-h2', 'n-i1', 'n-i2'], forwardEdges: [], backwardEdges: elements.edges.i_h }
    },
    {
        title: "Weight Update (Optimization)",
        type: "neutral",
        description: "Now that we have all the gradients, we use an <b>Optimizer</b> (like Gradient Descent) to update the weights. We subtract a small fraction (Learning Rate, $\\alpha$) of the gradients from the original weights to improve the network for next time.",
        math: "W_{new} = W_{old} - \\alpha \\frac{\\partial \\mathcal{L}}{\\partial W}",
        state: { activeNodes: ['n-i1', 'n-i2', 'n-h1', 'n-h2', 'n-o1'], forwardEdges: [], backwardEdges: [] }
    },
    {
        title: "The Mathematical Blueprint",
        type: "equations",
        description: "Here are the complete equations that drive the Neural Network. <b>Forward Propagation</b> calculates the prediction. <b>Backward Propagation</b> calculates the error gradients. <b>Weight Update</b> adjusts the network to learn.",
        math: "",
        state: {
            activeNodes: ['n-i1', 'n-i2', 'n-h1', 'n-h2', 'n-o1'],
            forwardEdges: [...elements.edges.i_h, ...elements.edges.h_o],
            backwardEdges: []
        }
    },
    {
        title: "Applying it in PyTorch",
        type: "pytorch",
        description: "Writing complex calculus by hand is error-prone. Modern frameworks like <b>PyTorch</b> completely automate the math! We define our layers, and PyTorch's <b>Autograd</b> engine calculates all the complex derivatives behind the scenes when we simply call <code>loss.backward()</code>.",
        math: "",
        state: {
            activeNodes: ['n-i1', 'n-i2', 'n-h1', 'n-h2', 'n-o1'],
            forwardEdges: [...elements.edges.i_h, ...elements.edges.h_o],
            backwardEdges: []
        }
    }
];

let currentStep = 0;

// --- Logic ---

// Helper to reset SVG classes
function resetSVG() {
    document.querySelectorAll('.node').forEach(el => { el.className.baseVal = 'node node-inactive'; });
    document.querySelectorAll('.edge').forEach(el => { el.className.baseVal = 'edge edge-inactive'; });
}

// Apply visual state to SVG based on the current step
function applyVisualState(step) {
    resetSVG();

    if (step.title === "Calculating the Loss") {
        document.getElementById('n-o1').className.baseVal = 'node node-target';
        return;
    }

    let nodeClass = 'node-active-forward';
    if (step.type === 'backward') nodeClass = 'node-active-backward';
    if (step.type === 'equations' || step.type === 'pytorch') {
        nodeClass = 'node-active-forward';
        document.querySelectorAll('.node').forEach(el => { el.className.baseVal = `node ${nodeClass}`; });
        document.querySelectorAll('.edge').forEach(el => { el.className.baseVal = 'edge edge-forward'; });
        return;
    }

    step.state.activeNodes.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.className.baseVal = `node ${nodeClass}`;
    });

    step.state.forwardEdges.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.className.baseVal = 'edge edge-forward';
    });

    step.state.backwardEdges.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.className.baseVal = 'edge edge-backward';
    });
}

// Render equations using KaTeX or Show PyTorch Code
function renderMath(step) {
    const mathContainer = document.getElementById('step-math');
    const summaryContainer = document.getElementById('summary-math');
    const pytorchContainer = document.getElementById('pytorch-code');

    // Hide all first
    mathContainer.classList.add('hidden');
    summaryContainer.classList.add('hidden');
    pytorchContainer.classList.add('hidden');

    if (step.type === 'equations') {
        summaryContainer.classList.remove('hidden');
        if (summaryContainer.getAttribute('data-rendered') !== 'true') {
            katex.render("Z^{[1]} = W^{[1]}X + b^{[1]} \\quad \\Rightarrow \\quad A^{[1]} = \\sigma(Z^{[1]}) \\newline Z^{[2]} = W^{[2]}A^{[1]} + b^{[2]} \\quad \\Rightarrow \\quad \\hat{y} = A^{[2]} = \\sigma(Z^{[2]})", document.getElementById('math-fwd-sum'), { displayMode: true });
            katex.render("dZ^{[2]} = A^{[2]} - Y \\newline dW^{[2]} = \\frac{1}{m} dZ^{[2]} A^{[1]T} \\newline dZ^{[1]} = W^{[2]T} dZ^{[2]} * \\sigma'(Z^{[1]}) \\newline dW^{[1]} = \\frac{1}{m} dZ^{[1]} X^T", document.getElementById('math-bwd-sum'), { displayMode: true });
            katex.render("W^{[1]} = W^{[1]} - \\alpha dW^{[1]} \\newline W^{[2]} = W^{[2]} - \\alpha dW^{[2]}", document.getElementById('math-upd-sum'), { displayMode: true });
            summaryContainer.setAttribute('data-rendered', 'true');
        }
    } else if (step.type === 'pytorch') {
        pytorchContainer.classList.remove('hidden');
        // Ensure highlighting applies if not already
        hljs.highlightAll();
    } else if (step.math) {
        mathContainer.classList.remove('hidden');
        katex.render(step.math, mathContainer, { displayMode: true });
    }

    // Render inline math in description
    const descEl = document.getElementById('step-description');
    descEl.innerHTML = step.description;
    const inlineMathRegex = /\$(.*?)\$/g;
    descEl.innerHTML = descEl.innerHTML.replace(inlineMathRegex, (match, mathContent) => {
        return katex.renderToString(mathContent, { displayMode: false });
    });
}

// Main UI Update Function
function updateUI() {
    const step = steps[currentStep];

    const badge = document.getElementById('step-badge');
    badge.innerText = `Step ${currentStep + 1} of ${steps.length}`;
    badge.className = "inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 transition-colors ";

    if (step.type === 'forward') badge.className += "bg-green-100 text-green-700";
    else if (step.type === 'backward') badge.className += "bg-red-100 text-red-700";
    else if (step.type === 'equations') badge.className += "bg-purple-100 text-purple-700";
    else if (step.type === 'pytorch') badge.className += "bg-orange-100 text-orange-700";
    else badge.className += "bg-slate-100 text-slate-700";

    document.getElementById('step-title').innerText = step.title;

    applyVisualState(step);
    renderMath(step);

    document.getElementById('btn-prev').disabled = currentStep === 0;
    document.getElementById('btn-next').disabled = currentStep === steps.length - 1;

    const dotsContainer = document.getElementById('progress-dots');
    dotsContainer.innerHTML = '';
    steps.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `w-2 h-2 rounded-full transition-colors duration-300 ${index === currentStep ? (step.type === 'pytorch' ? 'bg-orange-500' : 'bg-blue-600') : 'bg-slate-300'}`;
        dotsContainer.appendChild(dot);
    });
}

function nextStep() {
    if (currentStep < steps.length - 1) {
        currentStep++;
        updateUI();
    }
}

function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        updateUI();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // Check if KaTeX loaded properly, then render
    if (typeof katex !== 'undefined') {
        updateUI();
    } else {
        const checkInterval = setInterval(() => {
            if (typeof katex !== 'undefined') {
                clearInterval(checkInterval);
                updateUI();
            }
        }, 100);
    }
});