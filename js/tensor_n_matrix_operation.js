// --- Data Definition ---
const matrixA = [[1, 2], [3, 4]];
const matrixB = [[5, 6], [7, 8]];

// Define the steps for each operation
const scenarios = {
    multiplication: [
        {
            title: "The General Equation",
            desc: "Matrix Multiplication requires taking the 'Dot Product' of rows from Matrix A and columns from Matrix B. The number of columns in A must equal the number of rows in B.",
            mathJax: "C_{i,j} = \\sum_{k=1}^{n} A_{i,k} \\cdot B_{k,j}",
            activeA: [], activeB: [], activeC: [],
            valC: [[null, null], [null, null]]
        },
        {
            title: "Step 1: Top-Left Element",
            desc: "Multiply the 1st row of A by the 1st column of B, then add the results together.",
            mathJax: "C_{1,1} = ({\\color{#3b82f6}1} \\times {\\color{#22c55e}5}) + ({\\color{#3b82f6}2} \\times {\\color{#22c55e}7}) = 5 + 14 = \\mathbf{19}",
            activeA: [[0, 0], [0, 1]], activeB: [[0, 0], [1, 0]], activeC: [[0, 0]],
            valC: [[19, null], [null, null]]
        },
        {
            title: "Step 2: Top-Right Element",
            desc: "Multiply the 1st row of A by the 2nd column of B.",
            mathJax: "C_{1,2} = ({\\color{#3b82f6}1} \\times {\\color{#22c55e}6}) + ({\\color{#3b82f6}2} \\times {\\color{#22c55e}8}) = 6 + 16 = \\mathbf{22}",
            activeA: [[0, 0], [0, 1]], activeB: [[0, 1], [1, 1]], activeC: [[0, 1]],
            valC: [[19, 22], [null, null]]
        },
        {
            title: "Step 3: Bottom-Left Element",
            desc: "Multiply the 2nd row of A by the 1st column of B.",
            mathJax: "C_{2,1} = ({\\color{#3b82f6}3} \\times {\\color{#22c55e}5}) + ({\\color{#3b82f6}4} \\times {\\color{#22c55e}7}) = 15 + 28 = \\mathbf{43}",
            activeA: [[1, 0], [1, 1]], activeB: [[0, 0], [1, 0]], activeC: [[1, 0]],
            valC: [[19, 22], [43, null]]
        },
        {
            title: "Step 4: Bottom-Right Element",
            desc: "Multiply the 2nd row of A by the 2nd column of B.",
            mathJax: "C_{2,2} = ({\\color{#3b82f6}3} \\times {\\color{#22c55e}6}) + ({\\color{#3b82f6}4} \\times {\\color{#22c55e}8}) = 18 + 32 = \\mathbf{50}",
            activeA: [[1, 0], [1, 1]], activeB: [[0, 1], [1, 1]], activeC: [[1, 1]],
            valC: [[19, 22], [43, 50]]
        },
        {
            title: "Multiplication Complete!",
            desc: "We have successfully calculated the Dot Product of Matrix A and Matrix B.",
            mathJax: "A \\times B = C",
            activeA: [], activeB: [], activeC: [[0, 0], [0, 1], [1, 0], [1, 1]],
            valC: [[19, 22], [43, 50]]
        }
    ],
    addition: [
        {
            title: "The General Equation",
            desc: "Matrix Addition is 'element-wise'. You simply add the corresponding elements of each matrix together. Both matrices must have the exact same dimensions.",
            mathJax: "C_{i,j} = A_{i,j} + B_{i,j}",
            activeA: [], activeB: [], activeC: [],
            valC: [[null, null], [null, null]]
        },
        {
            title: "Step 1: Top-Left Element",
            desc: "Add the element in row 1, column 1 of Matrix A to the corresponding element in Matrix B.",
            mathJax: "C_{1,1} = {\\color{#3b82f6}1} + {\\color{#22c55e}5} = \\mathbf{6}",
            activeA: [[0, 0]], activeB: [[0, 0]], activeC: [[0, 0]],
            valC: [[6, null], [null, null]]
        },
        {
            title: "Step 2: Top-Right Element",
            desc: "Add the elements in row 1, column 2.",
            mathJax: "C_{1,2} = {\\color{#3b82f6}2} + {\\color{#22c55e}6} = \\mathbf{8}",
            activeA: [[0, 1]], activeB: [[0, 1]], activeC: [[0, 1]],
            valC: [[6, 8], [null, null]]
        },
        {
            title: "Step 3: Bottom-Left Element",
            desc: "Add the elements in row 2, column 1.",
            mathJax: "C_{2,1} = {\\color{#3b82f6}3} + {\\color{#22c55e}7} = \\mathbf{10}",
            activeA: [[1, 0]], activeB: [[1, 0]], activeC: [[1, 0]],
            valC: [[6, 8], [10, null]]
        },
        {
            title: "Step 4: Bottom-Right Element",
            desc: "Add the elements in row 2, column 2.",
            mathJax: "C_{2,2} = {\\color{#3b82f6}4} + {\\color{#22c55e}8} = \\mathbf{12}",
            activeA: [[1, 1]], activeB: [[1, 1]], activeC: [[1, 1]],
            valC: [[6, 8], [10, 12]]
        },
        {
            title: "Addition Complete!",
            desc: "We have successfully performed element-wise addition.",
            mathJax: "A + B = C",
            activeA: [], activeB: [], activeC: [[0, 0], [0, 1], [1, 0], [1, 1]],
            valC: [[6, 8], [10, 12]]
        }
    ],
    subtraction: [
        {
            title: "The General Equation",
            desc: "Matrix Subtraction is 'element-wise'. You subtract the corresponding elements of the second matrix from the first matrix. Both matrices must have the exact same dimensions.",
            mathJax: "C_{i,j} = A_{i,j} - B_{i,j}",
            activeA: [], activeB: [], activeC: [],
            valC: [[null, null], [null, null]]
        },
        {
            title: "Step 1: Top-Left Element",
            desc: "Subtract the element in row 1, column 1 of Matrix B from the corresponding element in Matrix A.",
            mathJax: "C_{1,1} = {\\color{#3b82f6}1} - {\\color{#22c55e}5} = \\mathbf{-4}",
            activeA: [[0, 0]], activeB: [[0, 0]], activeC: [[0, 0]],
            valC: [[-4, null], [null, null]]
        },
        {
            title: "Step 2: Top-Right Element",
            desc: "Subtract the elements in row 1, column 2.",
            mathJax: "C_{1,2} = {\\color{#3b82f6}2} - {\\color{#22c55e}6} = \\mathbf{-4}",
            activeA: [[0, 1]], activeB: [[0, 1]], activeC: [[0, 1]],
            valC: [[-4, -4], [null, null]]
        },
        {
            title: "Step 3: Bottom-Left Element",
            desc: "Subtract the elements in row 2, column 1.",
            mathJax: "C_{2,1} = {\\color{#3b82f6}3} - {\\color{#22c55e}7} = \\mathbf{-4}",
            activeA: [[1, 0]], activeB: [[1, 0]], activeC: [[1, 0]],
            valC: [[-4, -4], [-4, null]]
        },
        {
            title: "Step 4: Bottom-Right Element",
            desc: "Subtract the elements in row 2, column 2.",
            mathJax: "C_{2,2} = {\\color{#3b82f6}4} - {\\color{#22c55e}8} = \\mathbf{-4}",
            activeA: [[1, 1]], activeB: [[1, 1]], activeC: [[1, 1]],
            valC: [[-4, -4], [-4, -4]]
        },
        {
            title: "Subtraction Complete!",
            desc: "We have successfully performed element-wise subtraction.",
            mathJax: "A - B = C",
            activeA: [], activeB: [], activeC: [[0, 0], [0, 1], [1, 0], [1, 1]],
            valC: [[-4, -4], [-4, -4]]
        }
    ]
};

// --- State Management ---
let currentOp = 'multiplication';
let currentStepIdx = 0;

// --- DOM Elements ---
const domElements = {
    selectOp: document.getElementById('operation-select'),
    btnNext: document.getElementById('btn-next'),
    btnBack: document.getElementById('btn-back'),
    stepCurrent: document.getElementById('step-current'),
    stepTotal: document.getElementById('step-total'),
    stepTitle: document.getElementById('step-title'),
    stepDesc: document.getElementById('step-desc'),
    equationDisplay: document.getElementById('equation-display'),
    matrixA: document.getElementById('matrix-a'),
    matrixB: document.getElementById('matrix-b'),
    matrixC: document.getElementById('matrix-c'),
    operatorSymbol: document.getElementById('operator-symbol')
};

// --- Helper Functions ---

// Check if an [i,j] coordinate exists in an array of coordinates
const isActive = (coordsArray, i, j) => {
    return coordsArray.some(coord => coord[0] === i && coord[1] === j);
};

// Generate HTML for a single cell
const createCell = (val, isActive, type) => {
    let baseClasses = "matrix-cell w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-lg md:text-xl font-medium border rounded-md ";

    if (isActive) {
        if (type === 'A') baseClasses += "bg-matA-200 border-matA-500 text-matA-800 scale-105 shadow-sm font-bold ring-2 ring-matA-500";
        if (type === 'B') baseClasses += "bg-matB-200 border-matB-500 text-matB-800 scale-105 shadow-sm font-bold ring-2 ring-matB-500";
        if (type === 'C') baseClasses += "bg-matC-200 border-matC-500 text-matC-800 scale-105 shadow-sm font-bold ring-2 ring-matC-500";
    } else {
        baseClasses += "bg-slate-50 border-slate-200 text-slate-400"; // Faded out when not active
    }

    // Display question mark if value is null
    const displayVal = val === null ? '?' : val;

    // If it's a completely inactive/faded step 0, style normally but grayed
    if (val !== null && !isActive) {
        baseClasses = baseClasses.replace('text-slate-400', 'text-slate-600');
    }

    return `<div class="${baseClasses}">${displayVal}</div>`;
};

// Render the UI based on current state
const render = () => {
    const steps = scenarios[currentOp];
    const step = steps[currentStepIdx];

    // 1. Update text & counters
    domElements.stepCurrent.innerText = currentStepIdx + 1;
    domElements.stepTotal.innerText = steps.length;
    domElements.stepTitle.innerText = step.title;
    domElements.stepDesc.innerText = step.desc;

    // Set dynamic operator symbol
    if (currentOp === 'multiplication') {
        domElements.operatorSymbol.innerHTML = '&times;';
    } else if (currentOp === 'addition') {
        domElements.operatorSymbol.innerHTML = '+';
    } else if (currentOp === 'subtraction') {
        domElements.operatorSymbol.innerHTML = '&minus;';
    }

    // 2. Render KaTeX Equation
    // Check if KaTeX is loaded, if not, wait and retry
    if (typeof katex !== 'undefined') {
        katex.render(step.mathJax, domElements.equationDisplay, {
            throwOnError: false,
            displayMode: true
        });
    } else {
        setTimeout(render, 100); // Retry after 100ms
        return;
    }

    // 3. Render Matrices
    let htmlA = '';
    let htmlB = '';
    let htmlC = '';

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            // Matrix A
            const activeA = isActive(step.activeA, i, j) || (step.activeA.length === 0 && currentStepIdx === 0);
            htmlA += createCell(matrixA[i][j], isActive(step.activeA, i, j), 'A');

            // Matrix B
            const activeB = isActive(step.activeB, i, j) || (step.activeB.length === 0 && currentStepIdx === 0);
            htmlB += createCell(matrixB[i][j], isActive(step.activeB, i, j), 'B');

            // Matrix C
            htmlC += createCell(step.valC[i][j], isActive(step.activeC, i, j), 'C');
        }
    }

    domElements.matrixA.innerHTML = htmlA;
    domElements.matrixB.innerHTML = htmlB;
    domElements.matrixC.innerHTML = htmlC;

    // 4. Update Button States
    domElements.btnBack.disabled = currentStepIdx === 0;
    domElements.btnNext.disabled = currentStepIdx === steps.length - 1;
};

// --- Event Listeners ---
domElements.btnNext.addEventListener('click', () => {
    if (currentStepIdx < scenarios[currentOp].length - 1) {
        currentStepIdx++;
        render();
    }
});

domElements.btnBack.addEventListener('click', () => {
    if (currentStepIdx > 0) {
        currentStepIdx--;
        render();
    }
});

domElements.selectOp.addEventListener('change', (e) => {
    currentOp = e.target.value;
    currentStepIdx = 0;
    render();
});

// Initialize on page load (Wait for KaTeX script to be ready)
window.addEventListener('DOMContentLoaded', () => {
    // Initial render
    render();
});