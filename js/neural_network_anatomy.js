// --- DATA & CONTENT ---
const steps = [
    {
        title: "1. The Input Layer",
        description: "<p>Every Neural Network starts here. The <strong>Input Layer</strong> is where raw data enters the system.</p><p>Think of each node as a specific feature of your data. For example, if we are predicting house prices, these nodes might represent <em>Square Footage</em>, <em>Number of Bedrooms</em>, and <em>Age of the House</em>.</p>"
    },
    {
        title: "2. Hidden Layers",
        description: "<p>These layers do the \"deep\" learning. The <strong>Hidden Layers</strong> sit between input and output.</p><p>They take the data from the input layer and combine it to extract complex patterns. A network can have one hidden layer, or dozens (hence <em>Deep</em> Learning).</p>"
    },
    {
        title: "3. Weights & Biases",
        description: "<p>Notice the connecting lines? These are the <strong>Weights</strong> ($W$). They determine how much influence one node has on another.</p><p>Each receiving node also has a <strong>Bias</strong> ($b$), which shifts the output. <em>Training</em> a neural network simply means adjusting these Weights and Biases until it makes correct predictions!</p>"
    },
    {
        title: "4. Activation Functions",
        description: "<p>If we only multiplied weights and added biases, the network would just be a giant linear equation.</p><p>We apply an <strong>Activation Function</strong> $f(x)$ inside the hidden nodes. This introduces <em>non-linearity</em>, allowing the network to learn complex, curvy boundaries instead of just straight lines.</p>"
    },
    {
        title: "5. The Output Layer",
        description: "<p>Finally, the processed data reaches the <strong>Output Layer</strong>.</p><p>This layer provides the network's final prediction. If it's classifying an image, the output nodes might represent probabilities (e.g., 90% Dog, 10% Cat). For our house price example, it would be a single node outputting a dollar value.</p>"
    },
    {
        title: "6. The Underlying Math",
        description: "<p>Underneath the visual anatomy, a neural network is executing two fundamental mathematical steps at almost every single connection.</p><p>1. A linear transformation combining inputs, weights, and biases.<br>2. A non-linear activation to finalize the node's output.</p><p>This simple math, repeated millions of times, creates artificial intelligence.</p>"
    }
];

// --- SVG SETUP & GEOMETRY ---
const svg = document.getElementById('network-svg');

const layers = {
    input: { x: 150, nodes: [150, 250, 350], color: '#3b82f6', label: 'Inputs (X)' }, // Blue
    hidden: { x: 400, nodes: [100, 200, 300, 400], color: '#10b981', label: 'Hidden Logic' }, // Teal
    output: { x: 650, nodes: [200, 300], color: '#8b5cf6', label: 'Outputs (\u0176)' } // Purple
};

const elements = {
    nodes: [],
    links: [],
    labels: []
};

// Initialize SVG Elements
function buildSVG() {
    // Draw Links first (so they are behind nodes)
    // Input to Hidden
    layers.input.nodes.forEach((inY, i) => {
        layers.hidden.nodes.forEach((hidY, j) => {
            let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", layers.input.x);
            line.setAttribute("y1", inY);
            line.setAttribute("x2", layers.hidden.x);
            line.setAttribute("y2", hidY);
            line.setAttribute("stroke", "#cbd5e1");
            line.setAttribute("stroke-width", "2");
            line.setAttribute("opacity", "0");
            line.dataset.type = "in-hid";
            svg.appendChild(line);
            elements.links.push({ el: line, type: "in-hid", source: `in${i}`, target: `hid${j}` });
        });
    });

    // Hidden to Output
    layers.hidden.nodes.forEach((hidY, i) => {
        layers.output.nodes.forEach((outY, j) => {
            let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", layers.hidden.x);
            line.setAttribute("y1", hidY);
            line.setAttribute("x2", layers.output.x);
            line.setAttribute("y2", outY);
            line.setAttribute("stroke", "#cbd5e1");
            line.setAttribute("stroke-width", "2");
            line.setAttribute("opacity", "0");
            line.dataset.type = "hid-out";
            svg.appendChild(line);
            elements.links.push({ el: line, type: "hid-out" });
        });
    });

    // Draw Nodes
    Object.entries(layers).forEach(([layerName, layerData]) => {
        layerData.nodes.forEach((y, i) => {
            // Group for node
            let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.dataset.layer = layerName;
            g.setAttribute("opacity", "0");
            g.style.transformOrigin = `${layerData.x}px ${y}px`;

            // Circle
            let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", layerData.x);
            circle.setAttribute("cy", y);
            circle.setAttribute("r", "24");
            circle.setAttribute("fill", "white");
            circle.setAttribute("stroke", layerData.color);
            circle.setAttribute("stroke-width", "4");

            // Text inside (Activation / Bias icons)
            let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", layerData.x);
            text.setAttribute("y", y + 5);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("font-size", "14");
            text.setAttribute("font-weight", "bold");
            text.setAttribute("fill", layerData.color);
            text.setAttribute("opacity", "0");
            text.classList.add("node-label");

            g.appendChild(circle);
            g.appendChild(text);
            svg.appendChild(g);

            elements.nodes.push({ el: g, circle: circle, text: text, layer: layerName });
        });

        // Layer Column Labels
        let label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", layerData.x);
        label.setAttribute("y", 40);
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("font-size", "16");
        label.setAttribute("font-weight", "600");
        label.setAttribute("fill", "#64748b");
        label.setAttribute("opacity", "0");
        label.textContent = layerData.label;
        svg.appendChild(label);
        elements.labels.push({ el: label, layer: layerName });
    });

    // Add Weight/Bias floating labels for Step 3
    let wLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    wLabel.setAttribute("x", 260);
    wLabel.setAttribute("y", 140);
    wLabel.setAttribute("font-size", "20");
    wLabel.setAttribute("font-weight", "bold");
    wLabel.setAttribute("fill", "#f59e0b"); // Amber
    wLabel.setAttribute("opacity", "0");
    wLabel.textContent = "W";
    wLabel.id = "svg-w-label";
    svg.appendChild(wLabel);
}

// --- STATE & RENDER LOGIC ---
let currentStep = 0;

const titleEl = document.getElementById('step-title');
const descEl = document.getElementById('step-description');
const btnNext = document.getElementById('btn-next');
const btnBack = document.getElementById('btn-back');
const progressDots = document.getElementById('progress-dots');
const equationOverlay = document.getElementById('equation-overlay');

function init() {
    buildSVG();

    // Build progress dots
    steps.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `h-2 rounded-full transition-all duration-300 ${i === 0 ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'}`;
        dot.id = `dot-${i}`;
        progressDots.appendChild(dot);
    });

    btnNext.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
            currentStep++;
            updateView();
        }
    });

    btnBack.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateView();
        }
    });

    updateView();
}

function updateView() {
    // Update Text
    titleEl.textContent = steps[currentStep].title;
    descEl.innerHTML = steps[currentStep].description;

    // Update Buttons
    btnBack.disabled = currentStep === 0;
    btnNext.disabled = currentStep === steps.length - 1;

    // Update Dots
    steps.forEach((_, i) => {
        const dot = document.getElementById(`dot-${i}`);
        if (i === currentStep) {
            dot.className = 'h-2 rounded-full transition-all duration-300 w-8 bg-blue-600';
        } else if (i < currentStep) {
            dot.className = 'h-2 rounded-full transition-all duration-300 w-2 bg-blue-400';
        } else {
            dot.className = 'h-2 rounded-full transition-all duration-300 w-2 bg-slate-200';
        }
    });

    // Render MathJax if needed (and only if fully loaded)
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
        MathJax.typesetPromise([descEl]).catch((err) => console.log(err.message));
    }

    // Handle Visuals
    applyVisualState(currentStep);
}

function applyVisualState(step) {
    const wLabel = document.getElementById('svg-w-label');

    // Default Resets
    equationOverlay.style.opacity = "0";
    equationOverlay.style.pointerEvents = "none";
    svg.style.opacity = "1";
    wLabel.setAttribute("opacity", "0");

    elements.nodes.forEach(n => {
        n.text.setAttribute("opacity", "0");
        n.text.textContent = "";
        n.circle.setAttribute("fill", "white");
    });

    elements.links.forEach(l => {
        l.el.setAttribute("stroke", "#cbd5e1");
        l.el.setAttribute("stroke-width", "2");
    });

    // State Machine for SVG
    if (step === 0) {
        // Input only
        showLayer("input");
        hideLayer("hidden");
        hideLayer("output");
        showLinks("none");
    }
    else if (step === 1) {
        // Input + Hidden
        showLayer("input");
        showLayer("hidden");
        hideLayer("output");
        showLinks("in-hid");
    }
    else if (step === 2) {
        // Weights and Biases
        showLayer("input");
        showLayer("hidden");
        hideLayer("output");
        showLinks("in-hid");

        // Highlight links (Weights)
        elements.links.forEach(l => {
            if (l.type === "in-hid") {
                l.el.setAttribute("stroke", "#fcd34d"); // Amber highlight
                l.el.setAttribute("stroke-width", "3");
            }
        });
        wLabel.setAttribute("opacity", "1");

        // Highlight Nodes (Biases)
        elements.nodes.forEach(n => {
            if (n.layer === "hidden") {
                n.text.textContent = "+b";
                n.text.setAttribute("opacity", "1");
                n.circle.setAttribute("fill", "#f8fafc");
            }
        });
    }
    else if (step === 3) {
        // Activation functions
        showLayer("input");
        showLayer("hidden");
        hideLayer("output");
        showLinks("in-hid");

        elements.nodes.forEach(n => {
            if (n.layer === "hidden") {
                n.text.textContent = "f(x)";
                n.text.setAttribute("opacity", "1");
                n.circle.setAttribute("fill", "#ecfdf5"); // light teal
            }
        });
    }
    else if (step === 4) {
        // Output layer
        showLayer("input");
        showLayer("hidden");
        showLayer("output");
        showLinks("all");

        // Show flow
        elements.links.forEach(l => {
            l.el.setAttribute("stroke", "#94a3b8");
        });
    }
    else if (step === 5) {
        // Equations Step
        svg.style.opacity = "0.15"; // Fade background network
        equationOverlay.style.opacity = "1";
        equationOverlay.style.pointerEvents = "auto";

        // Ensure mathjax renders the overlay formulas (and only if fully loaded)
        if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
            MathJax.typesetPromise([equationOverlay]).catch((err) => console.log(err.message));
        }
    }
}

// Helpers
function showLayer(layerName) {
    elements.nodes.filter(n => n.layer === layerName).forEach(n => {
        n.el.setAttribute("opacity", "1");
        // pop effect
        n.el.style.transform = "scale(1)";
    });
    elements.labels.filter(l => l.layer === layerName).forEach(l => {
        l.el.setAttribute("opacity", "1");
    });
}

function hideLayer(layerName) {
    elements.nodes.filter(n => n.layer === layerName).forEach(n => {
        n.el.setAttribute("opacity", "0");
        n.el.style.transform = "scale(0.8)";
    });
    elements.labels.filter(l => l.layer === layerName).forEach(l => {
        l.el.setAttribute("opacity", "0");
    });
}

function showLinks(type) {
    elements.links.forEach(l => {
        if (type === "all" || l.type === type) {
            l.el.setAttribute("opacity", "1");
        } else {
            l.el.setAttribute("opacity", "0");
        }
    });
}

// Start
window.addEventListener('DOMContentLoaded', init);