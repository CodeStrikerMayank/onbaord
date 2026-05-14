const contentArea = document.querySelector('#content');
const navButtons = document.querySelectorAll('.nav-links button');
const cursorGlow = document.querySelector('.cursor-glow');

// Initialize 3D Background
if (typeof initBackground === 'function') {
    try {
        initBackground();
    } catch (e) {
        console.error("Background init failed:", e);
    }
}

// Cursor Follow
window.addEventListener('mousemove', (e) => {
    if (typeof gsap !== 'undefined' && cursorGlow) {
        gsap.to(cursorGlow, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.5,
            ease: 'power2.out'
        });
    }
});

// Progress Tracking State
let progress = JSON.parse(localStorage.getItem('neural_nexus_progress')) || [];

function toggleTopic(id) {
    if (progress.includes(id)) {
        progress = progress.filter(i => i !== id);
    } else {
        progress.push(id);
    }
    localStorage.setItem('neural_nexus_progress', JSON.stringify(progress));
    
    const item = document.querySelector(`[data-topic-id="${id}"]`);
    if (item) {
        item.classList.toggle('completed');
    }
    updateDashboardStats();
}

function updateDashboardStats() {
    const topicCount = document.querySelector('#topic-progress-count');
    if (topicCount) {
        topicCount.innerText = progress.length.toString().padStart(2, '0');
    }
}

// Navigation Logic
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (typeof gsap !== 'undefined') {
            gsap.to(contentArea, {
                opacity: 0,
                y: 10,
                duration: 0.2,
                onComplete: () => {
                    renderTab(tab);
                    gsap.to(contentArea, {
                        opacity: 1,
                        y: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        } else {
            renderTab(tab);
        }
    });
});

function renderTab(tab) {
    contentArea.innerHTML = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    switch(tab) {
        case 'dashboard': renderDashboard(); break;
        case 'roadmap': renderRoadmap(); break;
        case 'pathway': renderPathway(); break;
        case 'worksheet': renderWorksheet(); break;
        case 'offer': renderOffer(); break;
        case 'resources': renderResources(); break;
    }
}

function renderDashboard() {
    contentArea.innerHTML = `
        <div class="reveal">
            <h1 class="cyan" style="font-size: clamp(2rem, 5vw, 3.5rem); margin-bottom: 20px;">SYSTEM STATUS: ONLINE</h1>
            <p style="color: var(--text-dim); margin-bottom: 40px; letter-spacing: 1px; text-transform: uppercase; font-size: 0.8rem;">Neural Nexus OS v2.0 • AI/ML Placement Sprint</p>
            
            <div class="grid">
                <div class="card glass-hover">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div>
                            <h3 class="cyan" style="font-size: 0.8rem; margin-bottom: 10px;">TOPICS</h3>
                            <p style="font-size: 3rem; font-weight: 900; font-family: 'Orbitron';"><span id="topic-progress-count">${progress.length.toString().padStart(2, '0')}</span><span style="font-size: 1rem; color: var(--text-dim);"> / 54</span></p>
                        </div>
                        <i class="ph ph-cpu cyan" style="font-size: 2rem;"></i>
                    </div>
                    <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.05); margin: 15px 0; border-radius: 2px; overflow: hidden;">
                        <div style="width: ${(progress.length / 54) * 100}%; height: 100%; background: var(--cyan); box-shadow: var(--cyan-glow);"></div>
                    </div>
                    <p style="font-size: 0.7rem; color: var(--text-dim);">PATHWAY COVERAGE</p>
                </div>
                <div class="card glass-hover">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div>
                            <h3 class="cyan" style="font-size: 0.8rem; margin-bottom: 10px;">PHASES</h3>
                            <p style="font-size: 3rem; font-weight: 900; font-family: 'Orbitron';">03</p>
                        </div>
                        <i class="ph ph-stack cyan" style="font-size: 2rem;"></i>
                    </div>
                    <div style="width: 100%; height: 1px; background: rgba(0,242,255,0.2); margin: 15px 0;"></div>
                    <p style="font-size: 0.7rem; color: var(--text-dim);">MODULE ARCHITECTURE</p>
                </div>
                <div class="card glass-hover">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div>
                            <h3 class="cyan" style="font-size: 0.8rem; margin-bottom: 10px;">PROTOCOL</h3>
                            <p style="font-size: 3rem; font-weight: 900; font-family: 'Orbitron';">13</p>
                        </div>
                        <i class="ph ph-shield-check cyan" style="font-size: 2rem;"></i>
                    </div>
                    <div style="width: 100%; height: 1px; background: rgba(0,242,255,0.2); margin: 15px 0;"></div>
                    <p style="font-size: 0.7rem; color: var(--text-dim);">OFFER EXERCISES</p>
                </div>
            </div>

            <div class="card" style="margin-top: 30px;">
                <h2 class="cyan" style="margin-bottom: 30px; font-size: 1.5rem;">THE FIVE LAWS OF LEARNING</h2>
                <div style="display: grid; gap: 15px;">
                    ${[
                        "Prediction Before Explanation",
                        "Failure Modes Over Features",
                        "Compression Beats Coverage",
                        "Emotion Creates Judgment",
                        "AI Accelerates, Humans Judge"
                    ].map((law, i) => `
                        <div class="roadmap-item" style="display: flex; gap: 25px; align-items: center; padding: 20px;">
                            <span class="cyan" style="font-weight: 900; font-family: 'Orbitron'; font-size: 1.2rem;">0${i+1}</span>
                            <div>
                                <h4 style="font-weight: 700; color: white;">${law}</h4>
                                <p style="font-size: 0.75rem; color: var(--text-dim); margin-top: 5px;">CORE PROTOCOL ${i+1}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    animateReveal();
}

function renderRoadmap() {
    let html = `
        <div class="reveal">
            <div style="display: flex; justify-content: space-between; align-items: end; margin-bottom: 40px; flex-wrap: wrap; gap: 20px;">
                <div>
                    <h1 class="cyan" style="font-size: 2.5rem; margin-bottom: 10px;">NEURAL PATHWAY MAP</h1>
                    <p style="color: var(--text-dim); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px;">54 Topics • Sequential Mastery Progression</p>
                </div>
                <div style="display: flex; gap: 10px; background: rgba(255,255,255,0.05); padding: 5px; border-radius: 12px; border: 1px solid var(--glass-border);">
                    <button class="phase-btn active" data-phase="1">PHASE 1</button>
                    <button class="phase-btn" data-phase="2">PHASE 2</button>
                    <button class="phase-btn" data-phase="3">PHASE 3</button>
                </div>
            </div>
            <div id="roadmap-grid" class="grid">
                ${renderRoadmapItems(1)}
            </div>
        </div>
    `;
    contentArea.innerHTML = html;
    
    document.querySelectorAll('.phase-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.phase-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const phase = parseInt(btn.dataset.phase);
            const grid = document.querySelector('#roadmap-grid');
            
            if (typeof gsap !== 'undefined') {
                gsap.to(grid, {
                    opacity: 0,
                    duration: 0.2,
                    onComplete: () => {
                        grid.innerHTML = renderRoadmapItems(phase);
                        gsap.to(grid, { opacity: 1, duration: 0.3 });
                        setupTopicInteractions();
                        animateReveal();
                    }
                });
            } else {
                grid.innerHTML = renderRoadmapItems(phase);
                setupTopicInteractions();
                animateReveal();
            }
        });
    });

    setupTopicInteractions();
    animateReveal();
}

function setupTopicInteractions() {
    document.querySelectorAll('.roadmap-item[data-topic-id]').forEach(item => {
        item.addEventListener('click', () => {
            const id = parseInt(item.dataset.topicId);
            toggleTopic(id);
        });
    });
}

function renderRoadmapItems(phase) {
    if (typeof roadmapData === 'undefined') return '<p>Data Sync Error</p>';
    return roadmapData.filter(t => t.phase === phase).map(topic => `
        <div class="roadmap-item ${progress.includes(topic.id) ? 'completed' : ''}" data-topic-id="${topic.id}" style="display: flex; flex-direction: column; justify-content: space-between; min-height: 220px;">
            <div>
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                    <span class="phase-tag phase-${topic.phase}">MONTH ${topic.month}</span>
                    <span style="font-size: 0.6rem; color: var(--text-dim); font-weight: 800;">#${topic.id.toString().padStart(2, '0')}</span>
                </div>
                <h3 style="font-size: 1.1rem; margin-bottom: 10px; color: white;">${topic.name}</h3>
                <p style="color: var(--cyan); font-size: 0.65rem; font-weight: 900; text-transform: uppercase; margin-bottom: 15px; letter-spacing: 1px;">${topic.section}</p>
                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                    ${topic.subtopics.map(sub => `<span style="font-size: 0.65rem; background: rgba(0,242,255,0.05); color: var(--text-main); padding: 4px 10px; border-radius: 6px; border: 1px solid rgba(0,242,255,0.1);">${sub}</span>`).join('')}
                </div>
            </div>
            <div class="completion-indicator">
                <i class="ph ph-check-circle"></i>
                <span>COMPLETED</span>
            </div>
        </div>
    `).join('');
}

function renderPathway() {
    const phases = [1, 2, 3];
    contentArea.innerHTML = `
        <div class="reveal">
            <h1 class="cyan" style="font-size: 2.5rem; margin-bottom: 15px;">TEMPORAL SEQUENCE</h1>
            <p style="color: var(--text-dim); margin-bottom: 60px;">The chronological evolution of your expertise across 8 months.</p>
            
            <div class="pathway-container">
                ${phases.map(p => {
                    if (typeof roadmapData === 'undefined') return '';
                    const phaseTopics = roadmapData.filter(t => t.phase === p);
                    const completedInPhase = phaseTopics.filter(t => progress.includes(t.id)).length;
                    const percent = (completedInPhase / (phaseTopics.length || 1)) * 100;
                    
                    return `
                        <div class="pathway-phase">
                            <div class="phase-info">
                                <h2 class="cyan">PHASE 0${p}</h2>
                                <p style="font-size: 0.8rem; color: var(--text-dim); margin-top: 5px;">${phaseTopics.length} TOPICS • ${Math.round(percent)}% SYNCED</p>
                                <div style="width: 100%; height: 2px; background: rgba(255,255,255,0.05); margin-top: 15px;">
                                    <div style="width: ${percent}%; height: 100%; background: var(--cyan);"></div>
                                </div>
                            </div>
                            <div class="topics-timeline">
                                ${phaseTopics.map(t => `
                                    <div class="timeline-item ${progress.includes(t.id) ? 'active' : ''}" onclick="window.nexusToggle(${t.id})">
                                        <div class="dot"></div>
                                        <div class="time-label">MO ${t.month}</div>
                                        <div class="topic-label">${t.name}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    window.nexusToggle = (id) => {
        toggleTopic(id);
        renderPathway();
    };
    animateReveal();
}

function renderWorksheet() {
    contentArea.innerHTML = `
        <div class="reveal">
            <h1 class="cyan" style="font-size: 2.5rem; margin-bottom: 15px;">PERSONALIZATION PROTOCOL</h1>
            <p style="color: var(--text-dim); margin-bottom: 40px; max-width: 700px;">Capture your skills, constraints, and goals to build a roadmap tailored to your reality. Honesty increases optimization power.</p>
            
            <div id="worksheet-flow">
                ${renderWorksheetStep(0)}
            </div>
        </div>
    `;
    setupWorksheetLogic();
    animateReveal();
}

function renderWorksheetStep(partIndex) {
    if (typeof worksheetData === 'undefined') return '';
    const parts = [...new Set(worksheetData.map(q => q.part))];
    const currentPart = parts[partIndex];
    const questions = worksheetData.filter(q => q.part === currentPart);
    
    return `
        <div class="card reveal" style="padding: 50px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <h2 class="cyan" style="font-size: 1.2rem;">${currentPart}</h2>
                <span style="font-family: 'Orbitron'; font-size: 0.8rem; color: var(--text-dim);">STEP 0${partIndex + 1} / 0${parts.length}</span>
            </div>
            
            <div style="display: grid; gap: 40px;">
                ${questions.map(q => `
                    <div style="border-left: 2px solid var(--cyan); padding-left: 25px;">
                        <p style="font-weight: 600; margin-bottom: 20px; font-size: 1rem; color: white;">${q.text}</p>
                        ${renderInput(q)}
                    </div>
                `).join('')}
            </div>

            <div style="margin-top: 50px; display: flex; gap: 20px;">
                ${partIndex > 0 ? `<button id="ws-prev" class="roadmap-item" style="flex: 1; padding: 15px; font-weight: 900; font-family: 'Orbitron'; cursor: pointer;">PREVIOUS PHASE</button>` : ''}
                <button id="ws-next" class="card" style="flex: 2; margin-bottom: 0; background: var(--cyan); color: black; font-weight: 900; font-family: 'Orbitron'; padding: 15px; cursor: pointer; text-align: center;">
                    ${partIndex === parts.length - 1 ? 'TRANSMIT FINAL DATA' : 'CONTINUE SEQUENCE'}
                </button>
            </div>
        </div>
    `;
}

function renderInput(q) {
    if (q.type === 'choice' || q.type === 'multi') {
        return `<div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));">
            ${q.options.map(opt => `<button class="roadmap-item glass-hover" style="font-size: 0.75rem; padding: 12px; text-align: left; background: rgba(255,255,255,0.02);">${opt}</button>`).join('')}
        </div>`;
    }
    if (q.type === 'rating') {
        return `
            <div style="display: grid; gap: 15px;">
                ${q.options.map(opt => `
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                        <span style="font-size: 0.8rem; color: var(--text-dim);">${opt}</span>
                        <div style="display: flex; gap: 5px;">
                            ${[1,2,3,4,5].map(n => `<button class="roadmap-item glass-hover" style="width: 35px; height: 35px; padding: 0; display: flex; items-center; justify-content: center; font-size: 0.7rem;">${n}</button>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    return `<textarea class="roadmap-item" style="width: 100%; min-height: 100px; color: white; resize: none; background: rgba(0,0,0,0.3);" placeholder="AWAITING INPUT..."></textarea>`;
}

let currentWsPart = 0;
function setupWorksheetLogic() {
    if (typeof worksheetData === 'undefined') return;
    const parts = [...new Set(worksheetData.map(q => q.part))];
    
    const clickHandler = (e) => {
        if (e.target.id === 'ws-next') {
            if (currentWsPart < parts.length - 1) {
                currentWsPart++;
                updateWorksheet();
            } else {
                alert("PROTOCOL COMPLETE: Data transmitted to Neural Nexus.");
            }
        }
        if (e.target.id === 'ws-prev') {
            if (currentWsPart > 0) {
                currentWsPart--;
                updateWorksheet();
            }
        }
    };
    
    document.removeEventListener('click', clickHandler);
    document.addEventListener('click', clickHandler);
}

function updateWorksheet() {
    const container = document.querySelector('#worksheet-flow');
    if (typeof gsap !== 'undefined') {
        gsap.to(container, {
            opacity: 0,
            x: -20,
            duration: 0.3,
            onComplete: () => {
                container.innerHTML = renderWorksheetStep(currentWsPart);
                gsap.fromTo(container, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4 });
                animateReveal();
            }
        });
    } else {
        container.innerHTML = renderWorksheetStep(currentWsPart);
        animateReveal();
    }
}

function renderOffer() {
    if (typeof offerFrameworkData === 'undefined') return;
    contentArea.innerHTML = `
        <div class="reveal">
            <h1 class="cyan" style="font-size: 2.5rem; margin-bottom: 15px;">OFFER ARCHITECTURE</h1>
            <p style="color: var(--text-dim); margin-bottom: 40px; max-width: 700px;">Package yourself for US-funded startups. Move from "another applicant" to "the obvious choice" through 13 high-impact exercises.</p>
            
            <div class="grid">
                ${offerFrameworkData.map(ex => `
                    <div class="card glass-hover" style="padding: 30px; border-left: 4px solid var(--cyan); position: relative; overflow: hidden;">
                        <div style="position: absolute; right: -10px; top: -10px; font-size: 4rem; font-weight: 900; opacity: 0.03; font-family: 'Orbitron';">${ex.id}</div>
                        <span class="cyan" style="font-weight: 900; font-size: 0.7rem; font-family: 'Orbitron'; letter-spacing: 2px;">PHASE 0${ex.phase} • EX 0${ex.id}</span>
                        <h3 style="margin: 15px 0; font-size: 1.2rem; color: white;">${ex.name}</h3>
                        <p style="color: var(--text-dim); font-size: 0.85rem; line-height: 1.6;">${ex.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    animateReveal();
}

function renderResources() {
    if (typeof resourcesData === 'undefined') return;
    contentArea.innerHTML = `
        <div class="reveal">
            <h1 class="cyan" style="font-size: 2.5rem; margin-bottom: 15px;">EXTERNAL DATABASES</h1>
            <p style="color: var(--text-dim); margin-bottom: 40px;">Direct uplink to essential spreadsheets, documents, and video playbooks.</p>
            
            <div class="grid">
                ${resourcesData.map(res => `
                    <a href="${res.url}" target="_blank" class="roadmap-item glass-hover" style="text-decoration: none; color: inherit; display: flex; flex-direction: column; justify-content: space-between; padding: 35px;">
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 25px;">
                                <div style="width: 50px; height: 50px; background: rgba(0,242,255,0.1); border-radius: 12px; display: flex; items-center; justify-content: center;">
                                    <i class="ph ph-link cyan" style="font-size: 1.8rem; margin: auto;"></i>
                                </div>
                                <i class="ph ph-arrow-up-right cyan" style="font-size: 1.2rem;"></i>
                            </div>
                            <h3 style="font-size: 1.2rem; color: white; margin-bottom: 12px;">${res.name}</h3>
                            <p style="color: var(--text-dim); font-size: 0.85rem; line-height: 1.6; margin-bottom: 30px;">${res.description}</p>
                        </div>
                        <div style="font-size: 0.65rem; font-weight: 900; font-family: 'Orbitron'; letter-spacing: 2px; color: var(--cyan);">ACCESS_RESOURCE.EXE</div>
                    </a>
                `).join('')}
            </div>
        </div>
    `;
    animateReveal();
}

function animateReveal() {
    const reveals = document.querySelectorAll('.reveal > *');
    if (typeof gsap !== 'undefined') {
        gsap.from(reveals, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            clearProps: 'all'
        });
    } else {
        reveals.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }
}

// Global Styles for interactive components
const style = document.createElement('style');
style.textContent = `
    .phase-btn {
        background: transparent;
        border: none;
        color: var(--text-dim);
        font-family: 'Orbitron';
        font-size: 0.7rem;
        font-weight: 800;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    .phase-btn.active {
        background: var(--cyan);
        color: black;
        box-shadow: var(--cyan-glow);
    }
    .roadmap-item:active {
        transform: scale(0.98);
    }
`;
document.head.appendChild(style);

// Initial Render
renderTab('dashboard');
