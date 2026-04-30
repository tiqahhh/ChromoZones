// ============================================
// MEIOSIS LEARNING APP - JAVASCRIPT
// ============================================

// ============================================
// 3D VISUALIZATION USING THREE.JS
// ============================================

let scene, camera, renderer, cells = [];
let currentStage = 'prophase1';

function init3DVisualization() {
    const canvas = document.getElementById('canvas-3d');
    if (!canvas) return;

    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 3;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.shadowMap.enabled = true;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create initial cell visualization
    createCellVisualization('prophase1');

    // Handle window resize
    window.addEventListener('resize', () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            let deltaX = e.clientX - previousMousePosition.x;
            let deltaY = e.clientY - previousMousePosition.y;

            scene.rotation.y += deltaX * 0.005;
            scene.rotation.x += deltaY * 0.005;

            previousMousePosition = { x: e.clientX, y: e.clientY };
        }
    });

    canvas.addEventListener('mouseup', () => {
        isDragging = false;
    });

    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        camera.position.z += e.deltaY * 0.001;
        camera.position.z = Math.max(1, Math.min(8, camera.position.z));
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate cell for visual effect
        if (scene.children.length > 2) {
            scene.rotation.y += 0.001;
        }

        renderer.render(scene, camera);
    }

    animate();
}

function createCellVisualization(stage) {
    // Clear previous visualization
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }

    // Re-add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    currentStage = stage;

    switch(stage) {
        case 'prophase1':
            drawProphaseI();
            updateStageInfo('Prophase I', 'Chromosomes are condensing and homologous chromosomes are pairing up. Crossing over is occurring. The nuclear envelope is breaking down and spindle fibers are forming.');
            break;
        case 'metaphase1':
            drawMetaphaseI();
            updateStageInfo('Metaphase I', 'Homologous chromosome pairs (bivalents) are aligned at the metaphase plate in the middle of the cell. Spindle fibers are attached to kinetochores.');
            break;
        case 'anaphase1':
            drawAnaphasseI();
            updateStageInfo('Anaphase I', 'Homologous chromosomes are separating and moving toward opposite poles of the cell. This is the key difference from mitosis!');
            break;
        case 'prophase2':
            drawProphaseII();
            updateStageInfo('Prophase II', 'Chromosomes condense in each haploid cell. New spindle fibers form. This phase is similar to prophase in mitosis.');
            break;
        case 'metaphase2':
            drawMetaphaseII();
            updateStageInfo('Metaphase II', 'Individual chromosomes (still consisting of sister chromatids) are aligned at the metaphase plate. Similar to metaphase in mitosis.');
            break;
        case 'anaphase2':
            drawAnaphasseII();
            updateStageInfo('Anaphase II', 'Sister chromatids separate. This is similar to anaphase in mitosis but occurs in haploid cells.');
            break;
    }
}

function drawProphaseI() {
    // Draw cell membrane
    const cellGeometry = new THREE.CircleGeometry(1.5, 64);
    const cellMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.2 });
    const cellMesh = new THREE.Mesh(cellGeometry, cellMaterial);
    scene.add(cellMesh);

    // Draw condensing chromosomes
    const chromatinColor = 0x4CAF50;
    drawChromosome(-0.4, 0.3, 0.6, chromatinColor);
    drawChromosome(-0.3, -0.3, 0.5, chromatinColor);
    drawChromosome(0.3, 0.4, 0.55, chromatinColor);
    drawChromosome(0.4, -0.2, 0.65, chromatinColor);

    // Draw nuclear envelope breaking down
    const nuclearEnvelopeGeometry = new THREE.CircleGeometry(1.2, 32);
    const nuclearEnvelopeMaterial = new THREE.LineBasicMaterial({ color: 0xFF6B9D });
    const nuclearEnvelopeWireframe = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.CircleGeometry(1.2, 32)),
        nuclearEnvelopeMaterial
    );
    scene.add(nuclearEnvelopeWireframe);

    // Draw spindle poles
    drawSpindlePole(-1.0, 0);
    drawSpindlePole(1.0, 0);

    // Draw spindle fibers
    drawSpindleFiber(-1.0, -0.4, 0.3);
    drawSpindleFiber(-1.0, 0.3, -0.3);
    drawSpindleFiber(1.0, 0.4, -0.2);
    drawSpindleFiber(1.0, -0.3, 0.4);
}

function drawMetaphaseI() {
    // Draw cell membrane
    const cellGeometry = new THREE.CircleGeometry(1.5, 64);
    const cellMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.2 });
    const cellMesh = new THREE.Mesh(cellGeometry, cellMaterial);
    scene.add(cellMesh);

    // Draw aligned chromosome pairs at metaphase plate
    const chromatinColor = 0x4CAF50;
    drawChromosome(-0.3, 0, 0.6, chromatinColor);
    drawChromosome(0.3, 0, 0.6, chromatinColor);
    drawChromosome(0, 0.3, 0.55, chromatinColor);
    drawChromosome(0, -0.3, 0.55, chromatinColor);

    // Draw metaphase plate line
    const plateGeometry = new THREE.BufferGeometry();
    const platePositions = new Float32Array([
        -1.2, 0, 0,
        1.2, 0, 0
    ]);
    plateGeometry.setAttribute('position', new THREE.BufferAttribute(platePositions, 3));
    const plateMaterial = new THREE.LineBasicMaterial({ color: 0xFFD700 });
    const plateLine = new THREE.Line(plateGeometry, plateMaterial);
    scene.add(plateLine);

    // Draw spindle poles
    drawSpindlePole(-1.2, 0);
    drawSpindlePole(1.2, 0);

    // Draw connected spindle fibers
    drawConnectedSpindleFiber(-1.2, -0.3, 0);
    drawConnectedSpindleFiber(-1.2, 0.3, 0);
    drawConnectedSpindleFiber(1.2, -0.3, 0);
    drawConnectedSpindleFiber(1.2, 0.3, 0);
    drawConnectedSpindleFiber(-1.2, 0, 0.25);
    drawConnectedSpindleFiber(1.2, 0, 0.25);
}

function drawAnaphasseI() {
    // Draw cell membrane
    const cellGeometry = new THREE.CircleGeometry(1.5, 64);
    const cellMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.2 });
    const cellMesh = new THREE.Mesh(cellGeometry, cellMaterial);
    scene.add(cellMesh);

    // Draw separating chromosomes moving to poles
    const chromatinColor = 0x4CAF50;
    drawChromosome(-0.8, 0.2, 0.6, chromatinColor);
    drawChromosome(-0.7, -0.2, 0.6, chromatinColor);
    drawChromosome(0.8, 0.2, 0.6, chromatinColor);
    drawChromosome(0.7, -0.2, 0.6, chromatinColor);

    // Draw spindle poles
    drawSpindlePole(-1.2, 0);
    drawSpindlePole(1.2, 0);

    // Draw stretched spindle fibers
    drawSpindleFiber(-1.2, -0.8, 0.2);
    drawSpindleFiber(-1.2, -0.7, -0.2);
    drawSpindleFiber(1.2, 0.8, 0.2);
    drawSpindleFiber(1.2, 0.7, -0.2);
}

function drawProphaseII() {
    // Draw two cells
    const cell1Geometry = new THREE.CircleGeometry(0.9, 32);
    const cellMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.2 });
    const cell1 = new THREE.Mesh(cell1Geometry, cellMaterial);
    cell1.position.x = -0.8;
    scene.add(cell1);

    const cell2 = new THREE.Mesh(cell1Geometry, cellMaterial);
    cell2.position.x = 0.8;
    scene.add(cell2);

    // Draw condensed chromosomes in each cell
    const chromatinColor = 0x4CAF50;
    drawChromosome(-0.8, 0.2, 0.5, chromatinColor);
    drawChromosome(-0.8, -0.2, 0.5, chromatinColor);
    drawChromosome(0.8, 0.2, 0.5, chromatinColor);
    drawChromosome(0.8, -0.2, 0.5, chromatinColor);

    // Draw spindle poles for each cell
    drawSpindlePole(-1.2, 0);
    drawSpindlePole(-0.4, 0);
    drawSpindlePole(0.4, 0);
    drawSpindlePole(1.2, 0);
}

function drawMetaphaseII() {
    // Draw two cells
    const cell1Geometry = new THREE.CircleGeometry(0.9, 32);
    const cellMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.2 });
    const cell1 = new THREE.Mesh(cell1Geometry, cellMaterial);
    cell1.position.x = -0.8;
    scene.add(cell1);

    const cell2 = new THREE.Mesh(cell1Geometry, cellMaterial);
    cell2.position.x = 0.8;
    scene.add(cell2);

    // Draw aligned chromosomes at metaphase plates
    const chromatinColor = 0x4CAF50;
    drawChromosome(-0.8, 0, 0.5, chromatinColor);
    drawChromosome(0.8, 0, 0.5, chromatinColor);

    // Draw metaphase plate lines
    const plateGeometry1 = new THREE.BufferGeometry();
    const platePositions1 = new Float32Array([
        -1.3, 0, 0,
        -0.3, 0, 0
    ]);
    plateGeometry1.setAttribute('position', new THREE.BufferAttribute(platePositions1, 3));
    const plateMaterial = new THREE.LineBasicMaterial({ color: 0xFFD700 });
    const plateLine1 = new THREE.Line(plateGeometry1, plateMaterial);
    scene.add(plateLine1);

    const plateGeometry2 = new THREE.BufferGeometry();
    const platePositions2 = new Float32Array([
        0.3, 0, 0,
        1.3, 0, 0
    ]);
    plateGeometry2.setAttribute('position', new THREE.BufferAttribute(platePositions2, 3));
    const plateLine2 = new THREE.Line(plateGeometry2, plateMaterial);
    scene.add(plateLine2);

    // Draw spindle poles
    drawSpindlePole(-1.2, 0);
    drawSpindlePole(-0.4, 0);
    drawSpindlePole(0.4, 0);
    drawSpindlePole(1.2, 0);
}

function drawAnaphasseII() {
    // Draw two cells
    const cell1Geometry = new THREE.CircleGeometry(0.9, 32);
    const cellMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.2 });
    const cell1 = new THREE.Mesh(cell1Geometry, cellMaterial);
    cell1.position.x = -0.8;
    scene.add(cell1);

    const cell2 = new THREE.Mesh(cell1Geometry, cellMaterial);
    cell2.position.x = 0.8;
    scene.add(cell2);

    // Draw separating chromatids in each cell
    const chromatinColor = 0x4CAF50;
    drawChromosome(-0.8, -0.3, 0.4, chromatinColor);
    drawChromosome(-0.8, 0.3, 0.4, chromatinColor);
    drawChromosome(0.8, -0.3, 0.4, chromatinColor);
    drawChromosome(0.8, 0.3, 0.4, chromatinColor);

    // Draw spindle poles
    drawSpindlePole(-1.2, 0);
    drawSpindlePole(-0.4, 0);
    drawSpindlePole(0.4, 0);
    drawSpindlePole(1.2, 0);
}

function drawChromosome(x, y, size, color) {
    const geometry = new THREE.BoxGeometry(0.15, size, 0.1);
    const material = new THREE.MeshPhongMaterial({ color: color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, 0);
    mesh.castShadow = true;
    scene.add(mesh);
}

function drawSpindlePole(x, y) {
    const geometry = new THREE.SphereGeometry(0.1, 16, 16);
    const material = new THREE.MeshPhongMaterial({ color: 0xFF6B9D });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, 0);
    mesh.castShadow = true;
    scene.add(mesh);
}

function drawSpindleFiber(px, py, cy) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array([
        px, py, 0,
        cy * 3, cy * 2, 0
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.LineBasicMaterial({ color: 0x8fd3f4 });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
}

function drawConnectedSpindleFiber(px, py, cy) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array([
        px, py, 0,
        abs(py) * 0.3, cy, 0
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.LineBasicMaterial({ color: 0x8fd3f4, linewidth: 2 });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
}

function updateStageInfo(title, description) {
    const stageInfo = document.getElementById('stage-info');
    if (stageInfo) {
        stageInfo.innerHTML = `
            <div class="stage-explanation">
                <h3>${title}</h3>
                <p><strong>Key Features:</strong></p>
                <p>${description}</p>
            </div>
        `;
    }
}

function showStage(stage) {
    // Update active button
    document.querySelectorAll('.stage-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update visualization
    createCellVisualization(stage);
}

// ============================================
// MEIOSIS EVENTS FUNCTIONALITY
// ============================================

function meiosisData(stage,event) {
    // Hide all meiosis sections
    const sections = document.querySelectorAll('.meiosis-section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });

    // Show the selected section
    const sectionId = 'meiosis-' + stage.split(' ').join('-');
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.remove('hidden');
    }

 // Remove active class from all buttons
    const buttons = document.querySelectorAll('.meiosis-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Add active class to the button that was clicked
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
};

// ============================================
// FLASHCARD FUNCTIONALITY
// ============================================

const flashcardsData = {
    basic: [
         { 
            question: 'What is cell division?', 
            answer: 'Answer : <br> Cell division is the process by which a parent cell divides into two or more daughter cells.',
        },
         { 
            question: 'What is mitosis?', 
            answer: 'Answer : <br> Mitosis is a type of cell division that produces two identical daughter cells with the same number of chromosomes as the parent cell.',
        },
        { 
            question: 'What is meiosis?', 
            answer: 'Answer : <br> Meiosis is a type of cell division that produces four genetically different haploid cells (gametes).',
        },
        { 
            question: 'Where does mitosis occur in the body?', 
            answer: 'Answer : <br> Mitosis occurs in somatic (body) cells.',
        },
        { 
            question: 'Where does meiosis occur in the body?', 
            answer: 'Answer : <br> Meiosis occurs in reproductive organs to produce gametes (sperm and egg cells).',
        },
        { 
            question: 'How many daughter cells are produced in mitosis?', 
            answer: 'Answer : <br> Two daughter cells.',
            image: 'flashcard/MitosisEnd.png'
        },
        { 
            question: 'How many daughter cells are produced in meiosis?', 
            answer: 'Answer : <br> Four daughter cells.',
            image: 'flashcard/MeiosisEnd.png'
        },
        { 
            question: 'Are daughter cells in mitosis identical or different?', 
            answer: 'Answer : <br> Identical to each other and the parent cell.',
            image: 'flashcard/IdenticalMitosis.png'
        },
        { 
            question: 'Are daughter cells in meiosis identical or different?', 
            answer: 'Answer : <br> Genetically different from each other and the parent cell.',
            image: 'flashcard/UnidenticalMeiosis.png'
        },
        { 
            question: 'What is the chromosome number in mitosis daughter cells?', 
            answer: 'Answer : <br> Diploid (2n), same as the parent cell.',
        },
        { 
            question: 'What is the chromosome number in meiosis daughter cells?', 
            answer: 'Answer : <br> Haploid (n), half the number of the parent cell.',
        },
        { 
            question: 'What is the main purpose of mitosis?', 
            answer: 'Answer : <br> Growth, repair, and replacement of cells.',
        },
        { 
            question: 'What is the main purpose of meiosis?', 
            answer: 'Answer : <br> To produce gametes for sexual reproduction.',
        },
        { 
            question: 'What are the stages of mitosis?', 
            answer: 'Answer : <br> Prophase, Metaphase, Anaphase, Telophase (PMAT).',
        },
        { 
            question: 'What happens during prophase in mitosis?', 
            answer: 'Answer : <br> Chromosomes condense and become visible; nuclear membrane breaks down.'
        },
        { 
            question: 'What happens during metaphase in mitosis?', 
            answer: 'Answer : <br> Chromosomes line up at the equator of the cell.'
        },
        { 
            question: 'What happens during anaphase in mitosis?', 
            answer: 'Answer : <br> Sister chromatids are pulled apart to opposite poles.'
        },
        { 
            question: 'What happens during telophase in mitosis?', 
            answer: 'Answer : <br> Nuclear membranes reform and chromosomes uncoil.'
        },
        { 
            question: 'What is cytokinesis?', 
            answer: 'Answer : <br> Division of the cytoplasm to form separate daughter cells.',
        },
        { 
            question: 'How many divisions occur in meiosis?', 
            answer: 'Answer : <br> Two divisions: Meiosis I and Meiosis II.',
        },
        { 
            question: 'What happens in Meiosis I?', 
            answer: 'Answer : <br> Homologous chromosomes separate.',
            image: 'flashcard/HomologousChromosome.png'
        },
        { 
            question: 'What happens in Meiosis II?', 
            answer: 'Answer : <br> Sister chromatids separate (similar to mitosis).',
        },
        { 
            question: 'What is crossing over?', 
            answer: 'Answer : <br> Exchange of genetic material between homologous chromosomes in Prophase I of meiosis.',
        },
        { 
            question: 'Why is crossing over important?', 
            answer: 'Answer : <br> It increases genetic variation.',
        },
        { 
            question: 'What is independent assortment?', 
            answer: 'Answer : <br> Random arrangement of chromosomes during meiosis, leading to genetic variation.',
        },
        { 
            question: 'Give one similarity between mitosis and meiosis.', 
            answer: 'Answer : <br> Both involve cell division and stages like prophase, metaphase, anaphase, and telophase.',
        },
        { 
            question: 'Give one key difference between mitosis and meiosis.', 
            answer: 'Answer : <br> Mitosis produces identical cells while meiosis produces genetically different cells.',
        },
        { 
            question: 'Why is meiosis important for sexual reproduction?', 
            answer: 'Answer : <br> It reduces chromosome number by half so fertilization restores the diploid number.',
        },
        { 
            question: 'What would happen if meiosis did not reduce chromosome number?', 
            answer: 'Answer : <br> Chromosome number would double every generation.',
        },
        { 
            question: 'Which type of cell division is faster: mitosis or meiosis?', 
            answer: 'Answer : <br> Mitosis is faster than meiosis because it involves only one division and produces identical cells.'
        },
        { 
            question: 'What is a chromatid?', 
            answer: 'Answer : <br> One half of a duplicated chromosome.',
            image: 'flashcard/Chromatid.png'
        },
        { 
            question: 'What is a sister chromatid?', 
            answer: 'Answer : <br> Two identical chromatids joined at the centromere.',
            image: 'flashcard/SisterChromatids.png'
        },
        { 
            question: 'What is synapsis?', 
            answer: 'Answer : <br> The pairing of homologous chromosomes during Prophase I.',
            image: 'flashcard/Synapsis.png'
        },
        { 
            question: 'What is a tetrad?', 
            answer: 'Answer : <br> A structure formed by two homologous chromosomes (4 chromatids) during Prophase I.',
            image: 'flashcard/Tetrad.png'
        },
        { 
            question: 'What is centromere?', 
            answer: 'Answer : <br> The specialized DNA region of a chromosome where the two sister chromatids are most tightly attached.',
            image: 'flashcard/Centromere.png'
        },
        { 
            question: 'What are spindle fibers?', 
            answer: 'Answer : <br> Structures that help separate chromosomes during cell division.',
            image: 'flashcard/SpindleFibres.png'
        },
        { 
            question: 'What is the role of spindle fibers?', 
            answer: 'Answer : <br> To pull chromosomes or chromatids to opposite poles of the cell.'
        },
        { 
            question: 'What happens to the nuclear membrane during prophase?', 
            answer: 'Answer : <br> It breaks down to allow chromosomes to move freely.'
        },
        { 
            question: 'What is genetic variation?', 
            answer: 'Answer : <br> Differences in genetic makeup between individuals.'
        },
        { 
            question: 'Name two processes in meiosis that cause genetic variation.', 
            answer: 'Answer : <br> Crossing over and independent assortment.'
        },
        { 
            question: 'What is a gamete?', 
            answer: 'Answer : <br> A haploid sex cell (sperm or egg).',
            image: 'flashcard/SpermOvum.png'
        },
        { 
            question: 'In which phase do homologous chromosomes separate?', 
            answer: 'Answer : <br> Anaphase I of meiosis.',
            image: 'flashcard/Anaphase1.png'
        },
        { 
            question: 'In which phase do sister chromatids separate in meiosis?', 
            answer: 'Answer : <br> Anaphase II.',
            image: 'flashcard/Anaphase2.png'
        },
        { 
            question: 'In which phase do sister chromatids separate in mitosis?', 
            answer: 'Answer : <br> Anaphase.',
            image: 'flashcard/AnaphaseMitosis.png'
        },
        { 
            question: 'What would happen if chromosomes fail to separate properly?', 
            answer: 'Answer : <br> It can lead to genetic disorders due to abnormal chromosome numbers (nondisjunction).'
        },
        { 
            question: 'What is nondisjunction?', 
            answer: 'Answer : <br> Failure of chromosomes to separate properly during meiosis.'
        },
        { 
            question: 'Does crossing over occur in mitosis?', 
            answer: 'Answer : <br> No, crossing over only occurs in meiosis.'
        },
        { 
            question: 'Why mitosis does not create genetic variation?', 
            answer: 'Answer : <br> Because it produces identical daughter cells.'
        },
        { 
            question: 'Why is mitosis important for multicellular organisms?', 
            answer: 'Answer : <br> It allows growth and repair of tissues.'
        },
        { 
            question: 'Why is Meiosis I called reduction division?', 
            answer: 'Answer : <br> Because the chromosome number is reduced from diploid (2n) to haploid (n) when homologous chromosomes separate.'
        },
        { 
            question: 'Why is Meiosis II called equational division?', 
            answer: 'Answer : <br> Because the chromosome number remains the same (n to n) as sister chromatids separate, similar to mitosis.'
        }

    ]
};

function toggleSuggestion() {
    const content = document.getElementById("suggestion-content");
    const icon = document.getElementById("toggle-icon");

    content.classList.toggle("open");
    icon.classList.toggle("rotate");
}

function showFlashcards(category, clickedButton = null) {
    const container = document.getElementById('flashcard-container');
    if (!container) return;

    // Remove active from all buttons
    document.querySelectorAll('.stage-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Only set active if button exists
    if (clickedButton) {
        clickedButton.classList.add('active');
    }

    const flashcards = flashcardsData[category] || [];
    container.innerHTML = '';

    flashcards.forEach((card) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'flashcard';
        
        // Build the back content
        let backContent = card.answer;
        let backClass = 'flashcard-back';
        
        if (card.image) {
            backContent += `<br><br><img src="${card.image}" alt="Flashcard illustration" class="flashcard-image">`;
        } else {
            backClass += ' no-image';
        }
        
        cardElement.innerHTML = `
            <div class="flashcard-inner" onclick="flipCard(this)">
                <div class="flashcard-front">
                    ${card.question}
                </div>
                <div class="${backClass}">
                    ${backContent}
                </div>
            </div>
        `;
        container.appendChild(cardElement);
    });
}

function flipCard(element) {
    const card = element.closest('.flashcard');
    card.classList.toggle('flipped');
}

// ============================================
// QUIZ FUNCTIONALITY
// ============================================

const quizAnswers = {
    // Easy questions
    q1: 'd',
    q2: 'c',
    q3: 'a',
    q4: 'a',
    q5: 'd',
    q6: 'd',
    q7: 'c',
    q8: 'd',
    q9: 'a',
    q10: 'b',
    // Medium questions
    q11: 'd',
    q12: 'a',
    q13: 'b',
    q14: 'c',
    q15: 'c',
    q16: 'b',
    q17: 'a',
    q18: 'c',
    q19: 'b',
    q20: 'c',
    // Hard questions
    q21: 'd',
    q22: 'b',
    q23: 'b',
    q24: 'a',
    q25: 'a',
    q26: 'd',
    q27: 'd',
    q28: 'c',
    q29: 'a',
    q30: 'a'
};

let currentCategory = null;

function submitQuiz() {
    const form = document.getElementById('quiz-form');
    const resultsDiv = document.getElementById('results');

    if (!form || !resultsDiv) return;

    let score = 0;
    let answered = 0;

    // Check answers - all 30 questions
    for (let i = 1; i <= 30; i++) {
        const questionName = `q${i}`;
        const selectedOption = document.querySelector(`input[name="${questionName}"]:checked`);
        
        if (selectedOption) {
            answered++;
            if (selectedOption.value === quizAnswers[questionName]) {
                score++;
                selectedOption.closest('.option').classList.add('correct');
            } else {
                selectedOption.closest('.option').classList.add('incorrect');
            }
        }
    }

    // Display results
    const percentage = Math.round((score / 10) * 100);
    let message = '';
    
    if (percentage === 100) {
        message = 'Outstanding! Perfect score! You got this! 🌟';
    } else if (percentage >= 80) {
        message = 'Excellent work! You understand this topic very well! 🎉';
    } else if (percentage >= 60) {
        message = 'Good job! You understand the main concepts. Review the areas you missed for better understanding.';
    } else if (percentage >= 40) {
        message = 'You got some concepts right but need to review the material more carefully.';
    } else {
        message = 'Keep studying! Review the mitosis and meiosis stages and processes to improve your understanding.';
    }

    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = `
        <div class="results">
            <h3>Quiz Results - ${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)} Difficulty</h3>
            <div class="score">${score}/10</div>
            <p class="score-message">${percentage}% - ${message}</p>
            <p><strong>Questions Attempted:</strong> ${answered}/10</p>
            <button class="btn btn-secondary" onclick="resetQuiz()">Retake Quiz</button>
            <button class="btn btn-primary" onclick="changeCategory()">Try Another Difficulty</button>
        </div>
    `;

    // Show celebration if score is 7 or higher
    if (score >= 7) {
        showCelebration();
    }

    // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth' });

    // Update progress
    updateProgress(answered);
}

function selectCategory(category) {
    currentCategory = category;
    const categorySelector = document.getElementById('category-selector');
    const quizSection = document.getElementById('quiz-section');
    const levelName = document.getElementById('level-name');
    
    // Hide all questions first
    document.querySelectorAll('.question').forEach(q => q.style.display = 'none');
    
    // Show only questions for selected category
    document.querySelectorAll(`.question[data-difficulty="${category}"]`).forEach(q => q.style.display = 'block');
    
    // Update level name
    levelName.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    
    // Hide category selector and show quiz
    categorySelector.style.display = 'none';
    quizSection.style.display = 'block';
    
    // Reset form and progress
    document.getElementById('quiz-form').reset();
    document.getElementById('results').style.display = 'none';
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('correct', 'incorrect', 'selected');
    });
    updateProgress(0);
    
    // Scroll to quiz
    quizSection.scrollIntoView({ behavior: 'smooth' });
}

function changeCategory() {
    const categorySelector = document.getElementById('category-selector');
    const quizSection = document.getElementById('quiz-section');
    
    // Show category selector and hide quiz
    categorySelector.style.display = 'block';
    quizSection.style.display = 'none';
    
    // Reset form
    document.getElementById('quiz-form').reset();
    document.getElementById('results').style.display = 'none';
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('correct', 'incorrect', 'selected');
    });
    updateProgress(0);
    
    // Scroll to top
    categorySelector.scrollIntoView({ behavior: 'smooth' });
}

function resetQuiz() {
    document.getElementById('quiz-form').reset();
    document.getElementById('results').style.display = 'none';
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('correct', 'incorrect', 'selected');
    });
    updateProgress(0);
    document.querySelector('html, body').scrollTop = 0;
}

function updateProgress(count) {
    const attemptedSpan = document.getElementById('attempted');
    if (attemptedSpan) {
        attemptedSpan.textContent = count;
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = ((count / 10) * 100) + '%';
        }
    }
}

function showCelebration() {
    // Create celebration overlay
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    celebration.innerHTML = `
        <div class="celebration-content">
            <div class="applause-text">🎉Congratulations!🎉</div>
            <div class="confetti"></div>
        </div>
    `;
    
    document.body.appendChild(celebration);
    
    // Create confetti pieces
    const confettiContainer = celebration.querySelector('.confetti');
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e'];
    
    for (let i = 0; i < 150; i++) {
        const confettiPiece = document.createElement('div');
        confettiPiece.className = 'confetti-piece';
        confettiPiece.style.left = Math.random() * 100 + '%';
        confettiPiece.style.animationDelay = Math.random() * 3 + 's';
        confettiPiece.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confettiPiece.style.background = colors[Math.floor(Math.random() * colors.length)];
        confettiPiece.style.transform = `rotate(${Math.random() * 360}deg)`;
        confettiContainer.appendChild(confettiPiece);
    }
    
    // Remove celebration after 6 seconds
    setTimeout(() => {
        if (celebration.parentNode) {
            celebration.parentNode.removeChild(celebration);
        }
    }, 6000);
}

const backgroundAudioStorageKey = 'chromoZoneAudioEnabled';
let backgroundAudio = null;

function updateAudioButton(button, isPlaying) {
    if (!button) return;
    button.textContent = isPlaying ? 'Sound: On' : 'Sound: Off';
    button.classList.toggle('audio-on', isPlaying);
    button.classList.toggle('audio-off', !isPlaying);
}

function toggleBackgroundAudio() {
    if (!backgroundAudio) return;
    const isEnabled = !backgroundAudio.muted && backgroundAudio.volume > 0;
    const newEnabled = !isEnabled;
    backgroundAudio.muted = !newEnabled;
    backgroundAudio.volume = newEnabled ? 0.35 : 0;
    localStorage.setItem(backgroundAudioStorageKey, String(newEnabled));

    const audioButton = document.getElementById('audio-toggle-button');
    updateAudioButton(audioButton, newEnabled);

    if (newEnabled) {
        backgroundAudio.play().catch(() => {
            // Autoplay may be blocked; user can manually click the button.
        });
    }
}

function initBackgroundAudio() {
    const savedValue = localStorage.getItem(backgroundAudioStorageKey);
    const audioEnabled = savedValue === null ? true : savedValue === 'true';

    backgroundAudio = document.createElement('audio');
    backgroundAudio.id = 'background-sound';
    backgroundAudio.src = 'respiratory/backgroundsound.mp3';
    backgroundAudio.loop = true;
    backgroundAudio.preload = 'auto';
    backgroundAudio.volume = audioEnabled ? 0.35 : 0;
    backgroundAudio.muted = !audioEnabled;
    backgroundAudio.style.display = 'none';
    document.body.appendChild(backgroundAudio);

    const audioButton = document.createElement('button');
    audioButton.id = 'audio-toggle-button';
    audioButton.type = 'button';
    audioButton.className = 'btn btn-secondary audio-toggle-button';
    audioButton.addEventListener('click', toggleBackgroundAudio);
    document.body.appendChild(audioButton);

    updateAudioButton(audioButton, audioEnabled);

    if (audioEnabled) {
        backgroundAudio.play().catch(() => {
            // Autoplay may be blocked in some browsers.
        });
    }
}

// Track option selection
// this listener updates progress for whichever category is active
// counting only questions that are currently visible

document.addEventListener('change', function(e) {
    if (e.target.type === 'radio') {
        // Update attempted count based on visible questions
        let attemptedCount = 0;

        // if a category is set, count radios inside visible .question elements
        // otherwise fallback to all radios (shouldn't happen after selection)
        const selector = currentCategory
            ? `.question[data-difficulty="${currentCategory}"] input[type=radio]:checked`
            : 'input[type=radio]:checked';

        attemptedCount = document.querySelectorAll(selector).length;
        updateProgress(attemptedCount);

        // Visual feedback for selection
        const option = e.target.closest('.option');
        document.querySelectorAll('.option').forEach(opt => {
            if (opt !== option) opt.classList.remove('selected');
        });
        if (option) option.classList.add('selected');
    }
});

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initBackgroundAudio();

    // Initialize 3D visualization if we're on the intro page
    if (document.getElementById('canvas-3d')) {
        init3DVisualization();
        showFlashcards('basic');
    }
    
    // Initialize flashcards if we're on the exercise page
    if (document.getElementById('flashcard-container')) {
        showFlashcards('basic');
    }

    // Initialize mitosis scroll animation if this page contains the canvas
    if (document.getElementById('canvas')) {
        initMitosisAnimation();
    }

    // Initialize meiosis scroll animation if this page contains meiosis canvases
    if (document.getElementById('meiosis-canvas')) {
        initMeiosisAnimation('meiosis-canvas');
    }
    if (document.getElementById('meiosis-canvas-ii')) {
        initMeiosisAnimation('meiosis-canvas-ii');
    }

    // Set active nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href.includes(currentPage) && currentPage !== '') {
            link.classList.add('active');
        } else if (currentPage === '' && href === 'index.html') {
            link.classList.add('active');
        }
    });
});

//Summary//
// Mitosis canvas animation

function initMitosisAnimation() {
  const canvas = document.getElementById("canvas");
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext("2d");
  const frameCount = 14;
  const animationArea = document.querySelector('.animation-area');
  const images = [];
  let currentIndex = 0;
  let rafId = null;
  let firstDrawn = false;
  const animationStartOffset = 0;

  const getFramePath = (i) =>
    `canvas/frame_${String(i).padStart(3, "0")}.png`;

  function setCanvasSize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    if (images[currentIndex] && images[currentIndex].complete) {
      draw(images[currentIndex]);
    }
  }

  function draw(img) {
    if (!img || !img.naturalWidth) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  const stageRanges = [
    { start: 1, end: 4 },  // Prophase
    { start: 5, end: 6 },  // Metaphase
    { start: 7, end: 9 }, // Anaphase
    { start: 10, end: 11 } // Telophase
  ];

  const stages = Array.from(document.querySelectorAll('.stage'));

  function getActiveStageIndex() {
    const viewportCenter = window.innerHeight / 2;
    let bestIndex = 0;
    let bestDistance = Infinity;

    stages.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const centerDistance = Math.abs(rect.top + rect.height / 2 - viewportCenter);
      if (centerDistance < bestDistance) {
        bestDistance = centerDistance;
        bestIndex = index;
      }
    });

    return bestIndex;
  }

  function updateFrame() {
    if (animationArea) {
      const rect = animationArea.getBoundingClientRect();
      if (rect.top > animationStartOffset) {
        animationStarted = false;
        const img = images[0];
        if (img && img.complete) {
          draw(img);
          firstDrawn = true;
        }
        return;
      } else {
        animationStarted = true;
      }
    }

    const stageIndex = getActiveStageIndex();
    const range = stageRanges[stageIndex] || stageRanges[0];
    const section = stages[stageIndex];
    let progress = 0;

    if (section) {
      const rect = section.getBoundingClientRect();
      progress = (window.innerHeight / 2 - rect.top) / rect.height;
      progress = Math.min(1, Math.max(0, progress));
    }

    const frameOffset = Math.round(progress * (range.end - range.start));
    const frameNumber = Math.min(range.end, Math.max(range.start, range.start + frameOffset));
    const index = frameNumber - 1;
    currentIndex = index;

    const img = images[index];
    if (img && img.complete) {
      draw(img);
      firstDrawn = true;
    }
  }

  for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = getFramePath(i);
    img.onload = () => {
      if (!firstDrawn) {
        draw(img);
        firstDrawn = true;
      }
    };
    img.onerror = () => {
      console.error("ERROR loading:", img.src);
    };
    images.push(img);
  }

  window.addEventListener('resize', () => {
    setCanvasSize();
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(updateFrame);
  });

  window.addEventListener('scroll', () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(updateFrame);
  });

  setCanvasSize();
  updateFrame();
}

// Meiosis scroll-driven animation using animationCanvas assets
// Meiosis scroll-driven animation using animationCanvas assets
function initMeiosisAnimation(canvasId) {
  const animationCanvas = document.getElementById(canvasId);
  if (!animationCanvas || !animationCanvas.getContext) return;

  const ctx = animationCanvas.getContext("2d");
  const frameCount = 24;
  const animationArea = animationCanvas.closest('.animation-area');
  const images = [];
  let currentIndex = 0;
  let rafId = null;
  let firstDrawn = false;

  function getFramePath(i) {
    return `animationCanvas/frame_${String(i).padStart(3, "0")}.png`;
  }

  function setCanvasSize() {
    animationCanvas.width = animationCanvas.clientWidth;
    animationCanvas.height = animationCanvas.clientHeight;
    if (images[currentIndex] && images[currentIndex].complete) {
      draw(images[currentIndex]);
    }
  }

  function draw(img) {
    if (!img || !img.naturalWidth) return;
    ctx.clearRect(0, 0, animationCanvas.width, animationCanvas.height);
    ctx.drawImage(img, 0, 0, animationCanvas.width, animationCanvas.height);
  }

  const container = animationCanvas.closest('.container');
  const stages = container ? Array.from(container.querySelectorAll('.stage')) : Array.from(document.querySelectorAll('.stage'));
  const stageRanges = animationCanvas.id === 'meiosis-canvas-ii'
    ? [
        { start: 16, end: 18 }, // Prophase II
        { start: 19, end: 21 }, // Metaphase II
        { start: 22, end: 23 }, // Anaphase II
        { start: 24, end: 24 }  // Telophase II
      ]
    : [
        { start: 1, end: 4 },   // Prophase I
        { start: 5, end: 9 },   // Metaphase I
        { start: 10, end: 13 }, // Anaphase I
        { start: 14, end: 15 }  // Telophase I
      ];
  const animationStartOffset = 0;
  let animationStarted = false;

  function getActiveStageIndex() {
    const viewportCenter = window.innerHeight / 2;
    let bestIndex = 0;
    let bestDistance = Infinity;

    stages.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const centerDistance = Math.abs(rect.top + rect.height / 2 - viewportCenter);
      if (centerDistance < bestDistance) {
        bestDistance = centerDistance;
        bestIndex = index;
      }
    });

    return bestIndex;
  }

  function updateFrame() {
    if (animationArea) {
      const rect = animationArea.getBoundingClientRect();
      if (rect.top > animationStartOffset) {
        animationStarted = false;

        // Check if any stage is still below (i.e., we haven't scrolled past all stages)
        const hasStagesBelow = stages.some(stage => stage.getBoundingClientRect().top > 0);
        if (!hasStagesBelow) {
          // Show the last frame of the last stage range instead of resetting to first frame
          const lastRange = stageRanges[stageRanges.length - 1];
          const lastIndex = lastRange.end - 1;
          const img = images[lastIndex];
          if (img && img.complete) {
            draw(img);
            firstDrawn = true;
          }
          return;
        }

        const img = images[0];
        if (img && img.complete) {
          draw(img);
          firstDrawn = true;
        }
        return;
      } else {
        animationStarted = true;
      }
    }

    const stageIndex = getActiveStageIndex();
    const range = stageRanges[stageIndex] || stageRanges[0];
    const section = stages[stageIndex];
    let progress = 0;

    if (section) {
      const rect = section.getBoundingClientRect();
      progress = (window.innerHeight / 2 - rect.top) / rect.height;
      progress = Math.min(1, Math.max(0, progress));
    }

    const frameOffset = Math.round(progress * (range.end - range.start));
    const frameNumber = Math.min(range.end, Math.max(range.start, range.start + frameOffset));
    const index = frameNumber - 1;
    currentIndex = index;

    const img = images[index];
    if (img && img.complete) {
      draw(img);
      firstDrawn = true;
    }
  }

  for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = getFramePath(i);
    img.onload = () => {
      if (!firstDrawn) {
        draw(img);
        firstDrawn = true;
      }
    };
    img.onerror = () => {
      console.error("ERROR loading:", img.src);
    };
    images.push(img);
  }

  window.addEventListener('resize', () => {
    setCanvasSize();
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(updateFrame);
  });

  window.addEventListener('scroll', () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(updateFrame);
  });

  setCanvasSize();
  updateFrame();
}
