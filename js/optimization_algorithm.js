// <!-- Embedded JavaScript to ensure a pure single-file application -->
// Data and Steps Configuration
const STEPS = [
    {
        id: 1,
        title: "1. The Loss Landscape",
        desc: "In deep learning, we want to minimize the error or 'Loss' of our model. Imagine this U-shaped curve is a valley, and we want to reach the very bottom. The horizontal axis represents our model's 'Weight' (w), and the vertical axis is the 'Loss' (L).",
        showPoint: false,
        showTangent: false,
        showEquation: false,
        showCode: false,
        metricsOpacity: '0'
    },
    {
        id: 2,
        title: "2. Initialization",
        desc: "We start by randomly picking an initial weight. Let's drop our point on the curve. As you can see, our initial guess gives us a very high Loss. We need to find a way to move it down.",
        showPoint: true,
        showTangent: false,
        showEquation: false,
        showCode: false,
        metricsOpacity: '1'
    },
    {
        id: 3,
        title: "3. Compute the Gradient",
        desc: "To figure out which way is 'down', we calculate the Gradient (derivative) at our current position. The <span class='text-green-600 font-semibold'>green tangent line</span> represents this slope. A positive slope means 'down is to the left'.",
        showPoint: true,
        showTangent: true,
        showEquation: false,
        showCode: false,
        metricsOpacity: '1'
    },
    {
        id: 4,
        title: "4. The Optimization Formula",
        desc: "Before we move, let's look at the actual math that powers Deep Learning. The Gradient Descent algorithm uses this elegant equation to update our weight.",
        showPoint: true,
        showTangent: true,
        showEquation: true,
        showCode: false,
        metricsOpacity: '1'
    },
    {
        id: 5,
        title: "5. The Update Step",
        desc: "Applying the equation, we subtract a fraction (Learning Rate) of the gradient from our weight. This causes our point to take a step downhill. Watch it slide down the curve!",
        showPoint: true,
        showTangent: false,
        showEquation: false,
        showCode: false,
        metricsOpacity: '1',
        triggerAnimation: true
    },
    {
        id: 6,
        title: "6. Iteration",
        desc: "Optimization is a loop! We compute the new gradient, apply the formula, and take another step. Click <b>Iterate</b> repeatedly to see the algorithm converge to the minimum.",
        showPoint: true,
        showTangent: true,
        showEquation: false,
        showCode: false,
        metricsOpacity: '1',
        showIterate: true,
        nextText: "Next"
    },
    {
        id: 7,
        title: "7. PyTorch Implementation",
        desc: "Here is the exact algorithm in <b>PyTorch</b>, the most popular AI library. Notice the parallels: we calculate loss, compute the gradient using <code>.backward()</code>, and update the weight.<br><br>The visual part is over. Now you can use this code to reproduce the logic!",
        showPoint: false,
        showTangent: false,
        showEquation: false,
        showCode: true,
        metricsOpacity: '0',
        hideGraph: true,
        isFinal: true
    }
];

// Application State
const state = {
    currentStepIndex: 0,
    w: 4.0,           // Starting weight
    startW: 4.0,      // Used for animation interpolation
    targetW: 4.0,     // Used for animation interpolation
    learningRate: 0.1,
    history: [],
    animating: false,
    animProgress: 0
};

// DOM Elements
const canvas = document.getElementById('lossCanvas');
const ctx = canvas.getContext('2d');
const titleEl = document.getElementById('stepTitle');
const descEl = document.getElementById('stepDescription');
const progBar = document.getElementById('progressBar');
const btnNext = document.getElementById('btnNext');
const btnIterate = document.getElementById('btnIterate');
const btnBack = document.getElementById('btnBack');
const btnReset = document.getElementById('btnReset');
const equationContainer = document.getElementById('equationContainer');
const codeContainer = document.getElementById('codeContainer');
const leftPanel = document.getElementById('leftPanel');
const rightPanel = document.getElementById('rightPanel');
const metricsEl = document.getElementById('metrics');
const metricW = document.getElementById('metric-w');
const metricLoss = document.getElementById('metric-loss');
const metricGrad = document.getElementById('metric-grad');

// Render KaTeX Equation
document.addEventListener("DOMContentLoaded", function () {
    const mathEl = document.getElementById('mathEquation');
    katex.render("w_{new} = w_{old} - \\alpha \\nabla L", mathEl, {
        throwOnError: false,
        displayMode: true
    });
    resizeCanvas();
    updateUI();
    requestAnimationFrame(renderLoop);
});

// Math Functions for L(w) = w^2
function getLoss(w) { return w * w; }
function getGradient(w) { return 2 * w; }

// Canvas Coordinate Mapping
const minW = -5, maxW = 5;
const minL = -2, maxL = 25;

function mapX(w) {
    const logicalWidth = canvas.width / 2;
    return ((w - minW) / (maxW - minW)) * logicalWidth;
}
function mapY(l) {
    const logicalHeight = canvas.height / 2;
    return logicalHeight - (((l - minL) / (maxL - minL)) * logicalHeight);
}

function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
}
window.addEventListener('resize', resizeCanvas);

// Core Rendering Logic
function renderLoop() {
    if (state.animating) {
        state.animProgress += 0.04;
        if (state.animProgress >= 1) {
            state.animProgress = 1;
            state.w = state.targetW;
            state.animating = false;
        } else {
            const ease = 1 - (1 - state.animProgress) * (1 - state.animProgress);
            state.w = state.startW + (state.targetW - state.startW) * ease;
        }
        updateMetricsUI();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cw = canvas.width / 2;
    const ch = canvas.height / 2;

    // Draw Axes
    ctx.beginPath();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    const yZero = mapY(0);
    ctx.moveTo(0, yZero);
    ctx.lineTo(cw, yZero);
    const xZero = mapX(0);
    ctx.moveTo(xZero, 0);
    ctx.lineTo(xZero, ch);
    ctx.stroke();

    // Draw the Loss Curve: L = w^2
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    for (let w = minW; w <= maxW; w += 0.1) {
        const x = mapX(w);
        const y = mapY(getLoss(w));
        if (w === minW) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw specific step elements
    const stepConfig = STEPS[state.currentStepIndex];

    if (stepConfig.showPoint) {
        // Draw path history
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        state.history.forEach((oldW, index) => {
            const x = mapX(oldW);
            const y = mapY(getLoss(oldW));
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        if (state.history.length > 0) {
            ctx.lineTo(mapX(state.w), mapY(getLoss(state.w)));
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Gradient Tangent Line
        if (stepConfig.showTangent && !state.animating) {
            const grad = getGradient(state.w);
            const lineLengthX = 1.5;

            const px = state.w;
            const py = getLoss(state.w);

            const x1 = px - lineLengthX;
            const y1 = py - grad * lineLengthX;
            const x2 = px + lineLengthX;
            const y2 = py + grad * lineLengthX;

            ctx.beginPath();
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 3;
            ctx.moveTo(mapX(x1), mapY(y1));
            ctx.lineTo(mapX(x2), mapY(y2));
            ctx.stroke();
        }

        // Draw Current Position Point
        const px = mapX(state.w);
        const py = mapY(getLoss(state.w));

        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        // Draw drop line to X-axis
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
        ctx.setLineDash([4, 4]);
        ctx.moveTo(px, py);
        ctx.lineTo(px, yZero);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    requestAnimationFrame(renderLoop);
}

// UI & Logic Updates
function updateUI() {
    const step = STEPS[state.currentStepIndex];

    // Text Content
    titleEl.innerHTML = step.title;
    descEl.innerHTML = step.desc;

    // Container Visibility
    equationContainer.style.display = step.showEquation ? 'flex' : 'none';
    codeContainer.style.display = step.showCode ? 'flex' : 'none';

    // Layout adjustments for Step 7 (Full width code)
    if (step.hideGraph) {
        leftPanel.classList.add('hidden');
        rightPanel.classList.remove('md:w-2/5');
        rightPanel.classList.add('w-full', 'md:w-full');
        codeContainer.classList.add('max-w-3xl', 'mx-auto', 'w-full', 'text-[15px]');
    } else {
        leftPanel.classList.remove('hidden');
        rightPanel.classList.add('md:w-2/5');
        rightPanel.classList.remove('w-full', 'md:w-full');
        codeContainer.classList.remove('max-w-3xl', 'mx-auto', 'w-full', 'text-[15px]');

        // Small delay to ensure flex layout is calculated before resizing canvas
        setTimeout(resizeCanvas, 10);
    }

    // Progress Bar
    const progressPercentage = ((state.currentStepIndex + 1) / STEPS.length) * 100;
    progBar.style.width = `${progressPercentage}%`;

    // Button States
    btnBack.disabled = state.currentStepIndex === 0;

    // Iterate Button
    if (step.showIterate) {
        btnIterate.classList.remove('hidden');
    } else {
        btnIterate.classList.add('hidden');
    }

    // Next Button & Reset
    if (step.isFinal) {
        btnNext.classList.add('hidden');
        btnReset.classList.remove('hidden');
    } else {
        btnNext.classList.remove('hidden');
        btnNext.innerHTML = `${step.nextText || 'Next Step'} <svg class="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>`;
        btnReset.classList.add('hidden');
    }

    metricsEl.style.opacity = step.metricsOpacity;
    updateMetricsUI();
}

function updateMetricsUI() {
    metricW.textContent = state.w.toFixed(2);
    metricLoss.textContent = getLoss(state.w).toFixed(2);
    metricGrad.textContent = getGradient(state.w).toFixed(2);
}

function triggerOptimizationStep() {
    const grad = getGradient(state.w);
    state.startW = state.w;
    state.targetW = state.w - (state.learningRate * grad);

    if (state.history[state.history.length - 1] !== state.startW) {
        state.history.push(state.startW);
    }

    state.animProgress = 0;
    state.animating = true;
}

// Event Listeners
btnIterate.addEventListener('click', () => {
    if (state.animating) return;
    triggerOptimizationStep();
});

btnNext.addEventListener('click', () => {
    if (state.animating) return;

    const currentStepConfig = STEPS[state.currentStepIndex];

    if (STEPS[state.currentStepIndex + 1]?.triggerAnimation) {
        triggerOptimizationStep();
        state.currentStepIndex++;
        updateUI();
    }
    else if (state.currentStepIndex < STEPS.length - 1) {
        state.currentStepIndex++;
        updateUI();
    }
});

btnBack.addEventListener('click', () => {
    if (state.animating) return;
    if (state.currentStepIndex > 0) {

        if (STEPS[state.currentStepIndex].triggerAnimation) {
            state.w = state.startW;
            state.history.pop();
        }

        state.currentStepIndex--;
        updateUI();
    }
});

btnReset.addEventListener('click', resetSimulation);

function resetSimulation() {
    if (state.animating) return;
    state.currentStepIndex = 0;
    state.w = 4.0;
    state.startW = 4.0;
    state.targetW = 4.0;
    state.history = [];
    updateUI();
}