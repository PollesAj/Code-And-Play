let phaseIdx = 0, tierIdx = 0, health = 100, xp = 0;

function updateUI() {
    if (typeof phases === 'undefined') return;
    if (phaseIdx >= phases.length) return showEnd(true);
    
    const p = phases[phaseIdx];
    const t = p.tiers[tierIdx];

    // UPDATED: Now pulls code from the individual question (t)
    document.getElementById('phase-label').textContent = p.label.toUpperCase();
    document.getElementById('code-display').textContent = t.code; 
    document.getElementById('question-text').textContent = t.q;
    
    document.getElementById('health-fill').style.width = health + '%';
    document.getElementById('health-val').textContent = health + '%';
    document.getElementById('xp-val').textContent = xp;
    
    // Progress Tiers (The 3 little squares)
    for(let i=0; i<3; i++) {
        const step = document.getElementById(`step-${i}`);
        if(step) {
            step.className = i <= tierIdx ? 'step active' : 'step';
        }
    }

    // Health color feedback
    const fill = document.getElementById('health-fill');
    if (health > 50) fill.style.background = "var(--accent-gold)";
    else fill.style.background = "#ff4d4d";

    const grid = document.getElementById('options-grid');
    grid.innerHTML = '';
    t.opts.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.onclick = () => handleAnswer(idx);
        grid.appendChild(btn);
    });
}

function handleAnswer(idx) {
    const p = phases[phaseIdx];
    const t = p.tiers[tierIdx];

    if (idx === t.correct) {
        xp += t.xp;
        tierIdx++;
        // If finished all questions in this phase, move to next phase
        if (tierIdx >= p.tiers.length) {
            tierIdx = 0;
            phaseIdx++;
        }
    } else {
        health -= 15;
    }

    if (health <= 0) {
        health = 0;
        showEnd(false);
    } else {
        updateUI();
    }
}

function showEnd(win) {
    document.getElementById('main-panel').style.display = 'none';
    const screen = document.getElementById('end-screen');
    screen.classList.add('show');
    document.getElementById('end-title').textContent = win ? "QUEST COMPLETE" : "SYSTEM FAILURE";
    document.getElementById('end-sub').textContent = win ? "The C++ Christmas Cipher has been decoded." : "The code became too unstable.";
    document.getElementById('end-health').textContent = health + '%';
    document.getElementById('end-xp').textContent = xp;
}

window.onload = updateUI;