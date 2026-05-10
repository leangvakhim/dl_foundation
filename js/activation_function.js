// Data defining each step of the interactive lesson
const stepsData = [
    {
        type: 'html',
        title: "What is an Activation Function?",
        text: "In Deep Learning, artificial neurons receive data, process it, and pass it on. An <strong>Activation Function</strong> acts like a gatekeeper for each neuron.<br><br>It decides whether a neuron should be 'activated' (fire a strong signal) or not, based on the input it receives. Without them, neural networks could only solve simple, straight-line problems.",
        equation: null,
        visualHtml: `
            <div class="relative w-full max-w-sm">
                <div class="flex items-center justify-between">
                    <div class="flex flex-col gap-4 text-indigo-600 font-bold">
                        <div>Inputs</div>
                        <div><span class="text-slate-400">⟶</span> x₁</div>
                        <div><span class="text-slate-400">⟶</span> x₂</div>
                    </div>
                    <div class="w-32 h-32 rounded-full border-4 border-indigo-500 bg-white shadow-xl flex items-center justify-center flex-col z-10 relative">
                        <span class="text-slate-800 font-bold mb-1">Neuron</span>
                        <div class="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-semibold">Activation</div>
                    </div>
                    <div class="text-indigo-600 font-bold">
                        <div>Output</div>
                        <div>⟶ a</div>
                    </div>
                </div>
                <div class="absolute inset-0 border-t-2 border-dashed border-slate-300 top-1/2 -z-10"></div>
            </div>
        `
    },
    {
        type: 'html',
        title: "The Core Equation",
        text: "Before we look at specific curves, let's look at the underlying math.<br><br>First, the neuron calculates a weighted sum of its inputs plus a bias. We call this raw value <strong>z</strong>.<br><br>Then, we pass <strong>z</strong> through our Activation Function <strong>f()</strong> to get the final output <strong>a</strong>.",
        equation: `
            <div class="flex flex-col gap-3 w-full">
                <div class="flex items-center justify-between w-full bg-white p-3 rounded shadow-sm border border-slate-100">
                    <span class="text-sm text-slate-500 font-sans">1. Raw Input:</span>
                    <span>z = (w · x) + b</span>
                </div>
                <div class="flex items-center justify-between w-full bg-indigo-50 border border-indigo-200 p-3 rounded shadow-sm">
                    <span class="text-sm text-indigo-500 font-sans font-bold">2. Activation:</span>
                    <span class="font-bold text-indigo-700">a = f(z)</span>
                </div>
            </div>
        `,
        visualHtml: `
            <div class="flex flex-col items-center justify-center gap-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md">
                <div class="px-6 py-3 bg-slate-100 rounded-lg text-slate-700 font-mono font-bold shadow-inner">z = 2.5</div>
                <div class="h-8 border-l-2 border-dashed border-slate-400"></div>
                <div class="px-8 py-4 bg-indigo-600 text-white rounded-xl shadow-lg font-bold text-xl transform hover:scale-105 transition-transform cursor-default">
                    f ( z )
                </div>
                <div class="h-8 border-l-2 border-dashed border-slate-400 relative">
                        <div class="absolute -bottom-2 -left-1.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-slate-400"></div>
                </div>
                <div class="px-6 py-3 bg-emerald-100 rounded-lg text-emerald-800 font-mono font-bold shadow-inner border border-emerald-200">Output: a</div>
            </div>
        `
    },
    {
        type: 'graph',
        title: "Linear (No Activation)",
        text: "The simplest function is $f(z) = z$. The output is exactly the same as the raw input.<br><br><strong>Why isn't it used much?</strong><br>If you use linear functions in a deep network, all layers collapse into a single linear equation. It cannot learn complex, curved boundaries. It's essentially just linear regression.<br><br><span class='text-indigo-600 font-medium'>Try moving the slider below to see how the input maps directly to the output.</span>",
        equation: `f(z) = z`,
        func: (z) => z,
        yRange: [-5, 5]
    },
    {
        type: 'graph',
        title: "Sigmoid Function",
        text: "The Sigmoid function squishes any input into a smooth range between <strong>0 and 1</strong>. Large negative numbers approach 0, and large positive numbers approach 1.<br><br><strong>Pros:</strong> Excellent for models where we need to predict a probability (like \"is this an image of a cat? 0=No, 1=Yes\").<br><strong>Cons:</strong> Suffers from the 'vanishing gradient' problem; for very high or low inputs, the curve is flat, meaning the network stops learning.",
        equation: `
            <span>f(z) =&nbsp;</span>
            <div class="fraction">
                <span class="numerator">1</span>
                <span class="denominator">1 + e<sup>-z</sup></span>
            </div>
        `,
        func: (z) => 1 / (1 + Math.exp(-z)),
        yRange: [-0.2, 1.2]
    },
    {
        type: 'graph',
        title: "Tanh (Hyperbolic Tangent)",
        text: "Similar to Sigmoid, but Tanh squishes values between <strong>-1 and 1</strong>, meaning the output is centered around zero.<br><br><strong>Why use it?</strong> Zero-centered data makes it easier for the next layer of the neural network to learn. It usually performs better than Sigmoid for hidden layers, though it still suffers from vanishing gradients at the extremes.",
        equation: `
            <span>f(z) =&nbsp;</span>
            <div class="fraction">
                <span class="numerator">e<sup>z</sup> - e<sup>-z</sup></span>
                <span class="denominator">e<sup>z</sup> + e<sup>-z</sup></span>
            </div>
        `,
        func: (z) => Math.tanh(z),
        yRange: [-1.5, 1.5]
    },
    {
        type: 'graph',
        title: "ReLU (Rectified Linear Unit)",
        text: "ReLU is the most popular activation function in modern Deep Learning. The rule is incredibly simple: <strong>if the input is negative, output 0. If positive, output the exact input.</strong><br><br><strong>Why is it so good?</strong> It's computationally very fast and it heavily reduces the vanishing gradient problem, allowing networks to be built very deep.",
        equation: `f(z) = max(0, z)`,
        func: (z) => Math.max(0, z),
        yRange: [-1, 5]
    }
];

let currentStep = 0;
let currentZ = 0.0;

// DOM Elements
const titleEl = document.getElementById('step-title');
const textEl = document.getElementById('step-text');
const eqBox = document.getElementById('equation-box');
const eqEl = document.getElementById('step-equation');
const indicatorEl = document.getElementById('step-indicator');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const contentContainer = document.getElementById('content-container');

const canvas = document.getElementById('graph-canvas');
const ctx = canvas.getContext('2d');
const htmlVisual = document.getElementById('html-visual');
const sliderContainer = document.getElementById('slider-container');
const zSlider = document.getElementById('z-slider');
const zValueDisplay = document.getElementById('z-value-display');

function updateUI() {
    const step = stepsData[currentStep];

    // Animation reset
    contentContainer.classList.remove('fade-enter-active');
    contentContainer.classList.add('fade-enter');

    setTimeout(() => {
        // Texts
        titleEl.innerHTML = step.title;
        textEl.innerHTML = step.text;
        indicatorEl.innerText = `Step ${currentStep + 1} of ${stepsData.length}`;

        // Equation
        if (step.equation) {
            eqBox.classList.remove('hidden');
            eqEl.innerHTML = step.equation;
        } else {
            eqBox.classList.add('hidden');
        }

        // Visual Switcher
        if (step.type === 'html') {
            canvas.classList.add('hidden');
            sliderContainer.classList.add('hidden');
            htmlVisual.classList.remove('hidden');
            htmlVisual.innerHTML = step.visualHtml;
        } else if (step.type === 'graph') {
            htmlVisual.classList.add('hidden');
            canvas.classList.remove('hidden');
            sliderContainer.classList.remove('hidden');

            // Reset slider for new graph
            if (currentStep !== window.lastGraphStep) {
                zSlider.value = 0;
                currentZ = 0;
                zValueDisplay.innerText = "0.0";
                window.lastGraphStep = currentStep;
            }
            drawGraph();
        }

        contentContainer.classList.remove('fade-enter');
        contentContainer.classList.add('fade-enter-active');
    }, 50);

    // Button states
    btnPrev.disabled = currentStep === 0;
    btnNext.disabled = currentStep === stepsData.length - 1;

    if (currentStep === stepsData.length - 1) {
        btnNext.innerHTML = `Finish <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>`;
    } else {
        btnNext.innerHTML = `Next Step <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>`;
    }
}

function drawGraph() {
    const step = stepsData[currentStep];
    if (step.type !== 'graph') return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    const minX = -5;
    const maxX = 5;
    const [minY, maxY] = step.yRange;

    // Mapping functions from math coordinates to canvas pixels
    const mapX = (x) => padding + ((x - minX) / (maxX - minX)) * graphWidth;
    const mapY = (y) => height - padding - ((y - minY) / (maxY - minY)) * graphHeight;

    ctx.clearRect(0, 0, width, height);

    // Draw Grid
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#e2e8f0'; // slate-200
    ctx.beginPath();

    // Vertical grid lines
    for (let x = Math.ceil(minX); x <= Math.floor(maxX); x++) {
        const px = mapX(x);
        ctx.moveTo(px, padding);
        ctx.lineTo(px, height - padding);
    }
    // Horizontal grid lines
    for (let y = Math.ceil(minY); y <= Math.floor(maxY); y++) {
        const py = mapY(y);
        ctx.moveTo(padding, py);
        ctx.lineTo(width - padding, py);
    }
    ctx.stroke();

    // Draw Axes
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#64748b'; // slate-500
    ctx.beginPath();

    // X Axis
    const yZero = mapY(0);
    if (yZero >= padding && yZero <= height - padding) {
        ctx.moveTo(padding, yZero);
        ctx.lineTo(width - padding, yZero);
    }

    // Y Axis
    const xZero = mapX(0);
    if (xZero >= padding && xZero <= width - padding) {
        ctx.moveTo(xZero, padding);
        ctx.lineTo(xZero, height - padding);
    }
    ctx.stroke();

    // Draw Axis Labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Input (z)', width - padding, yZero + 15 > height - padding ? yZero - 10 : yZero + 15);
    ctx.textAlign = 'right';
    ctx.fillText('Output (a)', xZero - 10, padding + 10);

    // Draw The Function Curve
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#4f46e5'; // indigo-600
    ctx.beginPath();
    let started = false;

    for (let px = padding; px <= width - padding; px++) {
        const x = minX + ((px - padding) / graphWidth) * (maxX - minX);
        const y = step.func(x);
        const py = mapY(y);

        // Clip rendering strictly within graph area
        if (py >= padding && py <= height - padding) {
            if (!started) {
                ctx.moveTo(px, py);
                started = true;
            } else {
                ctx.lineTo(px, py);
            }
        } else {
            started = false;
        }
    }
    ctx.stroke();

    // Draw Dynamic Interaction Dot based on slider
    const a = step.func(currentZ);
    const pxZ = mapX(currentZ);
    const pyA = mapY(a);

    // Draw connecting lines to axes
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#f43f5e'; // rose-500

    ctx.beginPath();
    // Line down to X axis
    ctx.moveTo(pxZ, pyA);
    ctx.lineTo(pxZ, yZero);
    // Line across to Y axis
    ctx.moveTo(pxZ, pyA);
    ctx.lineTo(xZero, pyA);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // Draw the point
    ctx.beginPath();
    ctx.arc(pxZ, pyA, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#f43f5e';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Draw coordinate text near the point
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = currentZ > 0 ? 'right' : 'left';
    const textOffset = currentZ > 0 ? -10 : 10;

    // Format output to 2 decimal places for neatness
    const formattedA = Math.abs(a) < 0.01 && a !== 0 ? a.toExponential(2) : a.toFixed(2);
    ctx.fillText(`f(${currentZ.toFixed(1)}) = ${formattedA}`, pxZ + textOffset, pyA - 15);
}

// Event Listeners
btnNext.addEventListener('click', () => {
    if (currentStep < stepsData.length - 1) {
        currentStep++;
        updateUI();
    }
});

btnPrev.addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        updateUI();
    }
});

zSlider.addEventListener('input', (e) => {
    currentZ = parseFloat(e.target.value);

    // Format to 1 decimal place with explicit positive sign for aesthetics
    let displayZ = currentZ.toFixed(1);
    if (currentZ > 0) displayZ = "+" + displayZ;
    zValueDisplay.innerText = displayZ;

    drawGraph();
});

// Initialize
updateUI();