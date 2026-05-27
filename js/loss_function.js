// <!-- Embedded Scripts -->
// --- State Management ---
let currentStep = 0;
let prediction = 5.0;
const trueValue = 10.0;
let animationId = null;

// --- Step Data Content ---
const steps = [
    {
        title: "1. The Concept of Error",
        desc: "Before an AI learns, it guesses. The <strong>Loss Function</strong> (also called a Cost Function) is a mathematical way to measure exactly how <em>wrong</em> the AI's guesses are. The ultimate goal of Deep Learning is to get this loss as close to zero as possible.",
        equation: "$$\\text{Goal: } Loss \\approx 0$$",
        showSlider: false,
        visId: 'vis-1'
    },
    {
        title: "2. True vs. Predicted",
        desc: "Imagine predicting a house price. The actual price is the <strong>True Value ($y$)</strong>. The AI's guess is the <strong>Predicted Value ($\\hat{y}$)</strong>. The simplest error is just the gap between them.<br><br><em>Use the slider below to change the AI's prediction.</em>",
        equation: "$$\\text{Raw Error} = y - \\hat{y}$$",
        showSlider: true,
        visId: 'vis-2',
        action: updateNumberLine
    },
    {
        title: "3. The MSE Equation",
        desc: "Raw error is problematic because negative and positive errors can cancel each other out. Instead, we use <strong>Mean Squared Error (MSE)</strong>. We square the gap! This makes all errors positive and creates a massive penalty for being very wrong.",
        equation: "$$Loss = (y - \\hat{y})^2$$",
        showSlider: true,
        visId: 'vis-2',
        action: updateSquareVisual
    },
    {
        title: "4. The Loss Landscape",
        desc: "If we plot the mathematical Loss for every possible prediction, it forms a curve shaped like a bowl (a parabola). Notice how the lowest point of the bowl is exactly where the prediction equals the true value.",
        equation: "$$L(\\hat{y}) = (10 - \\hat{y})^2$$",
        showSlider: true,
        visId: 'vis-4',
        action: drawCanvasLandscape
    },
    {
        title: "5. Gradient Descent (Learning)",
        desc: "How does the AI learn? It doesn't use a slider. It calculates the slope of the curve at its current position and takes a step downhill. It repeats this until it reaches the bottom. This downhill journey is called <strong>Gradient Descent</strong> (where lr = learning rate).",
        equation: "$$\\hat{y}_{new} = \\hat{y}_{old} - (\\text{lr} \\times \\text{slope})$$",
        showSlider: false,
        visId: 'vis-4',
        action: startGradientDescent
    },
    {
        title: "6. PyTorch Implementation",
        desc: "In the real world, we don't write complex math loops by hand. We use libraries like <strong>PyTorch</strong>. <br><br>Notice how the code in the right panel perfectly matches the 5 steps we just walked through visually. <code>nn.MSELoss()</code> handles the math automatically!",
        equation: "$$\\text{PyTorch: } \\texttt{nn.MSELoss()}$$",
        showSlider: false,
        visId: 'vis-6',
        action: null
    }
];

// --- DOM Elements ---
const titleEl = document.getElementById('step-title');
const descEl = document.getElementById('step-desc');
const mathEl = document.getElementById('math-display');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');
const dotsContainer = document.getElementById('progress-dots');
const stepCounter = document.getElementById('step-counter');

const sliderContainer = document.getElementById('slider-container');
const slider = document.getElementById('prediction-slider');
const sliderValDisplay = document.getElementById('slider-val-display');
const lossValDisplay = document.getElementById('loss-val-display');

const visElements = {
    'vis-1': document.getElementById('vis-1'),
    'vis-2': document.getElementById('vis-2'),
    'vis-4': document.getElementById('vis-4'),
    'vis-6': document.getElementById('vis-6')
};
const predMarker = document.getElementById('pred-marker');
const errorLine = document.getElementById('error-line');
const errorSquareContainer = document.getElementById('error-square-container');
const errorSquare = document.getElementById('error-square');
const canvas = document.getElementById('loss-canvas');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('restart-btn');

// --- Utility: KaTeX Renderer ---
function renderKaTex(element) {
    if (window.renderMathInElement) {
        renderMathInElement(element, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
                { left: '\\(', right: '\\)', display: false },
                { left: '\\[', right: '\\]', display: true }
            ],
            throwOnError: false
        });
    }
}

// --- Initialization ---
function init() {
    // Create dots
    steps.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `w-2 h-2 rounded-full transition-colors duration-300 ${i === 0 ? 'bg-blue-600' : 'bg-slate-200'}`;
        dot.id = `dot-${i}`;
        dotsContainer.appendChild(dot);
    });

    // Event Listeners
    btnNext.addEventListener('click', () => changeStep(1));
    btnPrev.addEventListener('click', () => changeStep(-1));
    slider.addEventListener('input', handleSliderChange);
    restartBtn.addEventListener('click', startGradientDescent);

    // Handle Canvas Resizing dynamically
    window.addEventListener('resize', () => {
        if (canvas.clientWidth) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            if (currentStep === 3 || currentStep === 4) drawCanvasLandscape();
        }
    });

    // Make sure the static equations in the visual elements are rendered once
    renderKaTex(document.getElementById('visual-area'));
    renderKaTex(document.getElementById('slider-container'));

    // Load first step
    renderStep(currentStep);
}

// --- Logic & Rendering ---
function changeStep(dir) {
    cancelAnimationFrame(animationId); // Stop any running animations
    restartBtn.classList.add('hidden');

    currentStep += dir;
    if (currentStep < 0) currentStep = 0;
    if (currentStep >= steps.length) currentStep = steps.length - 1;

    renderStep(currentStep);
}

function renderStep(index) {
    const step = steps[index];

    // Update Text
    titleEl.innerHTML = step.title;
    descEl.innerHTML = step.desc;
    stepCounter.innerText = `Step ${index + 1} of ${steps.length}`;
    mathEl.innerHTML = step.equation;

    // Update Buttons & Dots
    btnPrev.disabled = index === 0;
    btnNext.disabled = index === steps.length - 1;

    steps.forEach((_, i) => {
        const dot = document.getElementById(`dot-${i}`);
        if (dot) {
            dot.className = `w-2 h-2 rounded-full transition-colors duration-300 ${i === index ? 'bg-blue-600' : 'bg-slate-200'}`;
        }
    });

    // Manage Visual Visibility with transitions
    Object.keys(visElements).forEach(key => {
        const el = visElements[key];
        if (!el) return;

        if (key === step.visId) {
            el.classList.remove('hidden-view');
            el.style.opacity = '1';
        } else {
            el.classList.add('hidden-view');
            el.style.opacity = '0';
        }
    });

    // Manage Slider
    if (step.showSlider) {
        sliderContainer.classList.remove('hidden-view');
    } else {
        sliderContainer.classList.add('hidden-view');
    }

    // Execute specific step visual logic
    if (index !== 2) errorSquareContainer.classList.add('hidden-view');
    if (step.action) {
        step.action();
    }

    // Execute dynamic formula updates (if step 1 or 2). This will also render KaTeX.
    if (index === 1 || index === 2) {
        updateDynamicMathValues();
    } else {
        renderKaTex(mathEl);
    }

    renderKaTex(descEl);
}

function handleSliderChange(e) {
    prediction = parseFloat(e.target.value);
    updateDisplays();

    // Re-trigger current step action to update visuals
    if (steps[currentStep].action) {
        steps[currentStep].action();
    }
}

function updateDisplays() {
    sliderValDisplay.innerText = prediction.toFixed(1);
    const loss = Math.pow(trueValue - prediction, 2);
    lossValDisplay.innerText = loss.toFixed(1);
    updateDynamicMathValues();
}

function updateDynamicMathValues() {
    let updated = false;
    if (currentStep === 1) {
        mathEl.innerHTML = `$$\\text{Error} = 10 - ${prediction.toFixed(1)} = ${(10 - prediction).toFixed(1)}$$`;
        updated = true;
    } else if (currentStep === 2) {
        mathEl.innerHTML = `$$Loss = (10 - ${prediction.toFixed(1)})^2 = ${Math.pow(10 - prediction, 2).toFixed(1)}$$`;
        updated = true;
    }

    // Re-render KaTeX immediately upon string change
    if (updated) {
        renderKaTex(mathEl);
    }
}

// --- Visual Actions ---

// Step 2 & 3: Number Line Update
function updateNumberLine() {
    // Map 0-20 to 0%-100% width
    const leftPercent = (prediction / 20) * 100;
    predMarker.style.left = `${leftPercent}%`;

    const truePercent = 50; // (10/20) * 100

    const start = Math.min(leftPercent, truePercent);
    const width = Math.abs(truePercent - leftPercent);

    errorLine.style.left = `${start}%`;
    errorLine.style.width = `${width}%`;
}

// Step 3: Square Area Update
function updateSquareVisual() {
    updateNumberLine(); // Ensure line is correct
    errorSquareContainer.classList.remove('hidden-view');

    const errorAbs = Math.abs(trueValue - prediction);
    // Scale the size visually (max error is 10, max square size ~ 150px)
    const sizePx = errorAbs * 15;

    errorSquare.style.width = `${Math.max(sizePx, 20)}px`;
    errorSquare.style.height = `${Math.max(sizePx, 20)}px`;

    if (errorAbs < 1) {
        errorSquare.innerHTML = "";
    } else {
        errorSquare.innerHTML = `<span class="text-sm shadow-white drop-shadow-md">Loss=${Math.pow(errorAbs, 2).toFixed(0)}</span>`;
    }
}

// Step 4: Canvas Parabola
function drawCanvasLandscape() {
    // Ensure internal resolution matches display resolution
    if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth || 400;
        canvas.height = canvas.clientHeight || 300;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mapping functions
    const mapX = (val) => (val / 20) * canvas.width;
    // Max loss is (10-0)^2 = 100. We map 0-100 to canvas height.
    const mapY = (val) => canvas.height - 20 - (val / 100) * (canvas.height - 40);

    // Draw Axes
    ctx.strokeStyle = '#cbd5e1'; // slate-300
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, mapY(0)); ctx.lineTo(canvas.width, mapY(0)); // X axis
    ctx.stroke();

    // Draw Curve L = (10 - y)^2
    ctx.strokeStyle = '#3b82f6'; // blue-500
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x <= 20; x += 0.5) {
        let loss = Math.pow(trueValue - x, 2);
        let cx = mapX(x);
        let cy = mapY(loss);
        if (x === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
    }
    ctx.stroke();

    // Draw Current Prediction Point
    let currentLoss = Math.pow(trueValue - prediction, 2);
    let px = mapX(prediction);
    let py = mapY(currentLoss);

    // Draw dashed line to point
    ctx.strokeStyle = '#94a3b8'; // slate-400
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(px, mapY(0));
    ctx.lineTo(px, py);
    ctx.moveTo(0, py);
    ctx.lineTo(px, py);
    ctx.stroke();
    ctx.setLineDash([]); // reset

    // Draw Point
    ctx.fillStyle = '#ef4444'; // red-500
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Step 5: Animation (Gradient Descent)
function startGradientDescent() {
    restartBtn.classList.remove('hidden');
    prediction = 1.0; // Start far away
    slider.value = prediction;
    updateDisplays();

    const learningRate = 0.05;

    function animate() {
        // Derivative of (10 - p)^2 is -2(10 - p)
        // We want to step in opposite direction of gradient.
        // Simplified step: distance to target * learning rate
        const error = trueValue - prediction;

        // If close enough, stop
        if (Math.abs(error) < 0.05) {
            prediction = trueValue;
            drawCanvasLandscape();
            return;
        }

        prediction += error * learningRate;
        slider.value = prediction;
        updateDisplays();
        drawCanvasLandscape();

        animationId = requestAnimationFrame(animate);
    }

    animate();
}

// Boot
// Ensure KaTeX is loaded before initializing
window.onload = init;