document.addEventListener('DOMContentLoaded', () => {

    const triggerOverlay = document.getElementById('triggerOverlay');
    const startButton = document.getElementById('startButton');
    const loadingBar = document.getElementById('loadingBar');
    const statusText = document.getElementById('statusText');
    const ambientLight = document.getElementById('ambientLight');
    const tulipWrapper = document.getElementById('tulipWrapper');
    const tulipHead = document.getElementById('tulipHead');
    const stem = document.getElementById('stem');
    const leafLeft = document.getElementById('leafLeft');
    const leafRight = document.getElementById('leafRight');
    const endText = document.getElementById('endText');
    const fallingPetalsEl = document.getElementById('fallingPetals');

    // Three rings: inner bud petals fold up tight, mid ring opens to a cup,
    // outer ring flares wide — gives a convincing open-bloom effect
    const PETAL_LAYERS = [
        { count: 3, w: 54, h: 82,  curl: 55,  delayBase: 0,    tz: 12, cls: 'petal-inner' },
        { count: 3, w: 68, h: 98,  curl: 32,  delayBase: 0.30, tz: 6,  cls: 'petal-mid'   },
        { count: 3, w: 76, h: 108, curl: 10,  delayBase: 0.65, tz: 2,  cls: 'petal-outer' },
    ];

    const FALLING_PETAL_COLORS = [
        ['#c060ff', '#6000cc'],
        ['#a830f0', '#500098'],
        ['#d480ff', '#8020d0'],
        ['#b050e8', '#5808a8'],
    ];


    function startCardLoader() {
        const duration = 2400;
        const steps = [
            { threshold: 20,  text: 'Loading Love.css...' },
            { threshold: 50,  text: 'Growing digital petals...' },
            { threshold: 80,  text: 'Adding silky textures...' },
            { threshold: 95,  text: 'Optimising 3D rendering...' },
            { threshold: 100, text: 'Ready to bloom!' }
        ];

        let startTimestamp = null;

        function animateLoader(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const percent = Math.floor(progress * 100);

            loadingBar.style.width = `${percent}%`;
            const activeStep = steps.find(s => percent <= s.threshold) || steps[steps.length - 1];
            statusText.textContent = activeStep.text;

            if (progress < 1) {
                requestAnimationFrame(animateLoader);
            } else {
                startButton.removeAttribute('disabled');
            }
        }

        requestAnimationFrame(animateLoader);
    }


    function createPetals() {
        PETAL_LAYERS.forEach((layer, li) => {
            // Offset outer ring by half a step so petals interleave
            const angleOffset = li * (360 / (layer.count * 2));
            const angleStep = 360 / layer.count;

            for (let i = 0; i < layer.count; i++) {
                const petal = document.createElement('div');
                petal.className = `petal ${layer.cls}`;

                const angle = angleOffset + i * angleStep + (Math.random() - 0.5) * 4;
                const delay = layer.delayBase + i * 0.08;
                const curlJitter = (Math.random() - 0.5) * 5;
                const scaleJitter = 0.95 + Math.random() * 0.1;
                const bloomDur = 1.8 + Math.random() * 0.4;

                petal.style.width  = `${layer.w}px`;
                petal.style.height = `${layer.h}px`;
                petal.style.setProperty('--angle',     `${angle}deg`);
                petal.style.setProperty('--curl',      `${layer.curl + curlJitter}deg`);
                petal.style.setProperty('--scale',     scaleJitter);
                petal.style.setProperty('--delay',     `${delay}s`);
                petal.style.setProperty('--tz',        `${layer.tz}px`);
                petal.style.setProperty('--bloom-dur', `${bloomDur}s`);

                tulipHead.appendChild(petal);
            }
        });
    }

    function growStem() {
        return new Promise(resolve => {
            stem.classList.add('grow');

            setTimeout(() => {
                leafLeft.classList.add('visible');
            }, 700);

            setTimeout(() => {
                leafRight.classList.add('visible');
            }, 1050);

            setTimeout(resolve, 2200);
        });
    }

    function bloom() {
        ambientLight.classList.add('visible');
        tulipHead.classList.add('blooming');
    }

    function spawnFallingPetal() {
        if (fallingPetalsEl.childElementCount > 10) return;

        const petal = document.createElement('div');
        petal.className = 'falling-petal';

        const w = 11 + Math.random() * 13;
        const h = w * (1.4 + Math.random() * 0.2);
        const x = 20 + Math.random() * 60;
        const y = 3  + Math.random() * 10;
        const dur   = 5.5 + Math.random() * 3.5;
        const dly   = Math.random() * 0.6;

        const colors = FALLING_PETAL_COLORS[Math.floor(Math.random() * FALLING_PETAL_COLORS.length)];

        const sign = () => (Math.random() > 0.5 ? 1 : -1);
        const s1 = sign() * (15 + Math.random() * 25);
        const s2 = sign() * (10 + Math.random() * 20);
        const s3 = sign() * (20 + Math.random() * 30);
        const s4 = sign() * (10 + Math.random() * 15);

        petal.style.left = `${x}vw`;
        petal.style.top  = `${y}vh`;
        petal.style.setProperty('--fp-w',    `${w}px`);
        petal.style.setProperty('--fp-h',    `${h}px`);
        petal.style.setProperty('--fp-c1',   colors[0]);
        petal.style.setProperty('--fp-c2',   colors[1]);
        petal.style.setProperty('--f-dur',   `${dur}s`);
        petal.style.setProperty('--f-delay', `${dly}s`);
        petal.style.setProperty('--s1',      `${s1}px`);
        petal.style.setProperty('--s2',      `${s2}px`);
        petal.style.setProperty('--s3',      `${s3}px`);
        petal.style.setProperty('--s4',      `${s4}px`);

        fallingPetalsEl.appendChild(petal);

        setTimeout(() => {
            if (petal.parentNode) petal.remove();
        }, (dur + dly) * 1000 + 300);
    }

    function startFallingPetals() {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => spawnFallingPetal(), i * 300);
        }
        setInterval(() => spawnFallingPetal(), 2200);
    }


    async function startAnimationSequence() {
        await growStem();
        await delay(100);
        bloom();

        setTimeout(() => {
            tulipWrapper.classList.add('rotating');
        }, 2200);

        setTimeout(() => startFallingPetals(), 3000);

        setTimeout(() => {
            endText.classList.add('visible');
        }, 4200);
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    startButton.addEventListener('click', () => {
        triggerOverlay.classList.add('fade-out');
        setTimeout(() => {
            startAnimationSequence();
        }, 800);
    });

    createPetals();

    setTimeout(() => {
        startCardLoader();
    }, 400);

});
