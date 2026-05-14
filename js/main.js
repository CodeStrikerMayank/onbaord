// State Management
let state = {
    progress: JSON.parse(localStorage.getItem('nexus_progress')) || [],
    xp: 0,
    level: 1,
    currentTab: 'dashboard'
};

const contentArea = document.querySelector('#content');
const cursorGlow = document.querySelector('.cursor-glow');
const bgText = document.querySelector('.bg-text');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initBackground();
    setupNavigation();
    setupCursor();
    calculateXP();
    renderTab(state.currentTab);
    
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.glass-nav');
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
});

// Cursor System
function setupCursor() {
    window.addEventListener('mousemove', (e) => {
        gsap.to(cursorGlow, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.6,
            ease: 'power2.out'
        });
        
        // Parallax background text
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        gsap.to(bgText, {
            x: moveX,
            y: moveY,
            duration: 1,
            ease: 'power1.out'
        });
    });
}

// XP & Level System
function calculateXP() {
    state.xp = state.progress.length * 100;
    state.level = Math.floor(state.xp / 1000) + 1;
}

function toggleTopic(id, event) {
    if (state.progress.includes(id)) {
        state.progress = state.progress.filter(i => i !== id);
    } else {
        state.progress.push(id);
        if (event) createParticlesAt(event.clientX, event.clientY);
    }
    localStorage.setItem('nexus_progress', JSON.stringify(state.progress));
    calculateXP();
    
    // Update UI elements if they exist
    const item = document.querySelector(`[data-topic-id="${id}"]`);
    if (item) {
        item.classList.toggle('completed');
        // Completion animation
        if (item.classList.contains('completed')) {
            gsap.fromTo(item.querySelector('.completion-indicator'), 
                { y: '100%' }, { y: '0%', duration: 0.4, ease: 'power2.out' });
        }
    }
    
    updateDashboardUI();
}

function updateDashboardUI() {
    const xpBar = document.querySelector('.xp-bar');
    const xpText = document.querySelector('#xp-display');
    const levelText = document.querySelector('#level-display');
    const countText = document.querySelector('#topic-count');

    if (xpBar) {
        const nextLevelXP = state.level * 1000;
        const currentLevelXP = (state.level - 1) * 1000;
        const progress = ((state.xp - currentLevelXP) / 1000) * 100;
        gsap.to(xpBar, { width: `${progress}%`, duration: 1, ease: 'power2.out' });
    }
    if (xpText) xpText.innerText = state.xp.toLocaleString();
    if (levelText) levelText.innerText = state.level.toString().padStart(2, '0');
    if (countText) countText.innerText = state.progress.length.toString().padStart(2, '0');
}

// Navigation System
function setupNavigation() {
    const allNavButtons = document.querySelectorAll('[data-tab]');
    
    allNavButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            if (tab === state.currentTab) return;
            
            // Update active states
            allNavButtons.forEach(b => b.classList.remove('active'));
            document.querySelectorAll(`[data-tab="${tab}"]`).forEach(b => b.classList.add('active'));
            
            state.currentTab = tab;
            
            // Transition Animation
            gsap.to(contentArea, {
                opacity: 0,
                y: 20,
                filter: 'blur(10px)',
                duration: 0.3,
                onComplete: () => {
                    renderTab(tab);
                    window.scrollTo(0, 0);
                    gsap.to(contentArea, {
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                }
            });
        });
    });
}

function renderTab(tab) {
    contentArea.innerHTML = '';
    bgText.innerText = tab.toUpperCase();
    
    switch(tab) {
        case 'dashboard': renderDashboard(); break;
        case 'roadmap': renderRoadmap(); break;
        case 'pathway': renderPathway(); break;
        case 'worksheet': renderWorksheet(); break;
        case 'offer': renderOffer(); break;
        case 'resources': renderResources(); break;
    }
    
    setupInteractions();
    animateEnter();
}

// Tab Renderers
function renderDashboard() {
    const completionRate = Math.round((state.progress.length / 54) * 100);
    
    contentArea.innerHTML = `
        <div class="stagger-reveal">
            <div style="margin-bottom: 60px;">
                <h4 class="glow-text" style="font-size: 0.8rem; margin-bottom: 10px;">SYSTEM STATUS: ACTIVE</h4>
                <h1 style="font-size: clamp(2.5rem, 6vw, 4rem); line-height: 1;">OPERATOR <span class="cyan-text">INTERFACE</span></h1>
            </div>

            <div class="grid">
                <!-- XP Card -->
                <div class="card pulse-glow" style="grid-column: span 1;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px;">
                        <div>
                            <h3 class="cyan-text" style="font-size: 0.8rem;">LEVEL</h3>
                            <p id="level-display" style="font-size: 3.5rem; font-weight: 900;" class="orbitron">${state.level.toString().padStart(2, '0')}</p>
                        </div>
                        <i class="ph ph-unlocked cyan-text" style="font-size: 2.5rem;"></i>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.7rem;">
                        <span class="orbitron">XP: <span id="xp-display">${state.xp.toLocaleString()}</span></span>
                        <span class="orbitron">NEXT: ${(state.level * 1000).toLocaleString()}</span>
                    </div>
                    <div class="xp-container">
                        <div class="xp-bar"></div>
                    </div>
                </div>

                <!-- Progress Card -->
                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px;">
                        <div>
                            <h3 class="cyan-text" style="font-size: 0.8rem;">SYNC_RATE</h3>
                            <p style="font-size: 3.5rem; font-weight: 900;" class="orbitron">${completionRate}%</p>
                        </div>
                        <i class="ph ph-waves cyan-text" style="font-size: 2.5rem;"></i>
                    </div>
                    <p style="font-size: 0.7rem; color: var(--text-dim);" class="orbitron"><span id="topic-count">${state.progress.length.toString().padStart(2, '0')}</span> / 54 NEURAL NODES MAPPED</p>
                </div>

                <!-- Rank Card -->
                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px;">
                        <div>
                            <h3 class="cyan-text" style="font-size: 0.8rem;">CURRENT_RANK</h3>
                            <p style="font-size: 1.8rem; font-weight: 900; margin-top: 10px;" class="orbitron">${getRank()}</p>
                        </div>
                        <i class="ph ph-shield-chevron cyan-text" style="font-size: 2.5rem;"></i>
                    </div>
                    <p style="font-size: 0.7rem; color: var(--text-dim);" class="orbitron">TOP 5% OF OPERATORS</p>
                </div>
            </div>

            <div class="card" style="margin-top: 30px;">
                <h2 class="cyan-text" style="margin-bottom: 40px; font-size: 1.5rem;">CORE_PROTOCOLS</h2>
                <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
                    ${[
                        { name: "Prediction Before Explanation", desc: "Always guess the result before seeing the logic." },
                        { name: "Failure Modes Over Features", desc: "Study how things break, not just how they work." },
                        { name: "Compression Beats Coverage", desc: "Master the 20% that yields 80% of results." },
                        { name: "Emotion Creates Judgment", desc: "Build projects you actually care about." },
                        { name: "AI Accelerates, Humans Judge", desc: "Use AI to move fast, use your brain to stay right." }
                    ].map((law, i) => `
                        <div class="roadmap-item glass-panel" style="padding: 25px;">
                            <span class="cyan-text orbitron" style="font-weight: 900; font-size: 1.2rem;">0${i+1}</span>
                            <h4 style="margin: 15px 0; font-size: 0.9rem; color: white;">${law.name}</h4>
                            <p style="font-size: 0.75rem; color: var(--text-dim); line-height: 1.6;">${law.desc}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    updateDashboardUI();
}

function renderRoadmap() {
    contentArea.innerHTML = `
        <div class="stagger-reveal">
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 50px; flex-wrap: wrap; gap: 30px;">
                <div>
                    <h4 class="cyan-text orbitron" style="font-size: 0.8rem; margin-bottom: 10px;">NEURAL_MAP_V2.0</h4>
                    <h1 style="font-size: clamp(2rem, 5vw, 3rem);">KNOWLEDGE <span class="cyan-text">PATHWAY</span></h1>
                </div>
                <div class="tab-container">
                    <button class="tab-btn active" data-phase="1">PHASE 01</button>
                    <button class="tab-btn" data-phase="2">PHASE 02</button>
                    <button class="tab-btn" data-phase="3">PHASE 03</button>
                </div>
            </div>
            <div id="roadmap-grid" class="grid">
                ${renderRoadmapItems(1)}
            </div>
        </div>
    `;

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const phase = parseInt(btn.dataset.phase);
            const grid = document.querySelector('#roadmap-grid');
            
            gsap.to(grid, {
                opacity: 0,
                x: -20,
                duration: 0.3,
                onComplete: () => {
                    grid.innerHTML = renderRoadmapItems(phase);
                    setupInteractions();
                    gsap.fromTo(grid, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4 });
                }
            });
        });
    });
}

function renderRoadmapItems(phase) {
    return roadmapData.filter(t => t.phase === phase).map(topic => `
        <div class="roadmap-item ${state.progress.includes(topic.id) ? 'completed' : ''}" data-topic-id="${topic.id}" data-tilt>
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
                <span class="phase-tag phase-${topic.phase}" style="font-size: 0.6rem; background: rgba(0,242,255,0.1); color: var(--cyan); padding: 4px 10px; border-radius: 8px;">MONTH ${topic.month}</span>
                <span class="orbitron" style="font-size: 0.7rem; color: var(--text-dim); opacity: 0.5;">#${topic.id.toString().padStart(2, '0')}</span>
            </div>
            <h3 style="font-size: 1.1rem; margin-bottom: 10px; color: white;">${topic.name}</h3>
            <p class="cyan-text orbitron" style="font-size: 0.6rem; font-weight: 800; margin-bottom: 20px; letter-spacing: 1px;">${topic.section}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
                ${topic.subtopics.map(sub => `<span style="font-size: 0.65rem; background: rgba(255,255,255,0.03); color: var(--text-dim); padding: 4px 10px; border-radius: 6px; border: 1px solid var(--glass-border);">${sub}</span>`).join('')}
            </div>
            <div class="completion-indicator">
                <i class="ph ph-check-circle" style="font-size: 1rem;"></i>
                <span class="orbitron">NODE_SYNC_COMPLETE</span>
            </div>
        </div>
    `).join('');
}

function renderPathway() {
    contentArea.innerHTML = `
        <div class="stagger-reveal">
            <h4 class="cyan-text orbitron" style="font-size: 0.8rem; margin-bottom: 10px;">TEMPORAL_SEQUENCE</h4>
            <h1 style="font-size: 3rem; margin-bottom: 60px;">THE <span class="cyan-text">JOURNEY</span></h1>
            
            <div class="pathway-container" style="max-width: 900px; margin: 0 auto;">
                ${[1, 2, 3].map(p => {
                    const phaseTopics = roadmapData.filter(t => t.phase === p);
                    const completedInPhase = phaseTopics.filter(t => state.progress.includes(t.id)).length;
                    const percent = (completedInPhase / phaseTopics.length) * 100;
                    
                    return `
                        <div class="card" style="margin-bottom: 40px; border-left: 2px solid var(--cyan);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                                <div>
                                    <h2 class="cyan-text orbitron">PHASE 0${p}</h2>
                                    <p style="font-size: 0.7rem; color: var(--text-dim); margin-top: 5px;">${phaseTopics.length} NEURAL NODES • ${Math.round(percent)}% MAPPED</p>
                                </div>
                                <div class="orbitron" style="font-size: 2rem; font-weight: 900; opacity: 0.1;">0${p}</div>
                            </div>
                            
                            <div style="display: flex; flex-direction: column; gap: 0; position: relative; padding-left: 30px;">
                                <div class="timeline-line"></div>
                                ${phaseTopics.map(t => `
                                    <div class="timeline-item ${state.progress.includes(t.id) ? 'active' : ''}" 
                                         onclick="window.nexusToggle(${t.id})" 
                                         style="display: flex; align-items: center; gap: 20px; padding: 15px 0; cursor: pointer; transition: all 0.3s ease;">
                                        <div class="timeline-dot"></div>
                                        <span class="orbitron" style="font-size: 0.6rem; color: var(--text-dim); width: 40px;">MO ${t.month}</span>
                                        <span style="font-size: 0.9rem; color: ${state.progress.includes(t.id) ? 'white' : 'var(--text-dim)'}; font-weight: ${state.progress.includes(t.id) ? '700' : '400'}">${t.name}</span>
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
}

function renderResources() {
    contentArea.innerHTML = `
        <div class="stagger-reveal">
            <h4 class="cyan-text orbitron" style="font-size: 0.8rem; margin-bottom: 10px;">EXTERNAL_DATABASES</h4>
            <h1 style="font-size: 3rem; margin-bottom: 50px;">ELITE <span class="cyan-text">ASSETS</span></h1>
            
            <div class="grid">
                ${resourcesData.map(res => `
                    <a href="${res.url}" target="_blank" class="card resource-card">
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: start;">
                                <div class="resource-icon">
                                    <i class="ph ph-${getResourceIcon(res.type)} cyan-text" style="font-size: 1.8rem;"></i>
                                </div>
                                <i class="ph ph-arrow-up-right cyan-text" style="font-size: 1.2rem;"></i>
                            </div>
                            <h3 style="font-size: 1.2rem; color: white; margin-bottom: 15px;">${res.name}</h3>
                            <p style="color: var(--text-dim); font-size: 0.85rem; line-height: 1.6; margin-bottom: 30px;">${res.description}</p>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span class="orbitron" style="font-size: 0.6rem; color: var(--cyan); letter-spacing: 2px;">ACCESS_GRANTED</span>
                            <span class="orbitron" style="font-size: 0.5rem; color: var(--text-dim);">${res.type.toUpperCase()}</span>
                        </div>
                    </a>
                `).join('')}
            </div>
        </div>
    `;
}

function renderWorksheet() {
    const parts = [...new Set(worksheetData.map(q => q.part))];
    contentArea.innerHTML = `
        <div class="stagger-reveal">
            <h4 class="cyan-text orbitron" style="font-size: 0.8rem; margin-bottom: 10px;">PERSONALIZATION_PROTOCOL</h4>
            <h1 style="font-size: 3rem; margin-bottom: 50px;">SYSTEM <span class="cyan-text">INIT</span></h1>
            
            <div id="ws-container" style="max-width: 800px; margin: 0 auto;">
                ${renderWSStep(0)}
            </div>
        </div>
    `;
    setupWSLogic();
}

let currentWSPart = 0;
function renderWSStep(index) {
    const parts = [...new Set(worksheetData.map(q => q.part))];
    const currentPart = parts[index];
    const questions = worksheetData.filter(q => q.part === currentPart);
    
    return `
        <div class="card stagger-reveal" style="padding: 50px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
                <h2 class="cyan-text orbitron" style="font-size: 1rem;">${currentPart}</h2>
                <span class="orbitron" style="font-size: 0.7rem; color: var(--text-dim);">STEP 0${index + 1} / 0${parts.length}</span>
            </div>
            
            <div style="display: grid; gap: 50px;">
                ${questions.map(q => `
                    <div>
                        <p style="font-weight: 600; margin-bottom: 25px; color: white; font-size: 1.1rem;">${q.text}</p>
                        ${renderWSInput(q)}
                    </div>
                `).join('')}
            </div>

            <div style="margin-top: 60px; display: flex; gap: 20px;">
                ${index > 0 ? `<button id="ws-prev" class="roadmap-item orbitron" style="flex: 1; padding: 18px; font-size: 0.8rem; text-align: center;">PREVIOUS</button>` : ''}
                <button id="ws-next" class="card orbitron pulse-glow" style="flex: 2; margin-bottom: 0; background: var(--cyan); color: black; font-weight: 900; padding: 18px; text-align: center; border: none; cursor: pointer;">
                    ${index === parts.length - 1 ? 'COMPLETE_PROTOCOL' : 'CONTINUE_SEQUENCE'}
                </button>
            </div>
        </div>
    `;
}

function renderWSInput(q) {
    if (q.type === 'choice' || q.type === 'multi') {
        return `<div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px;">
            ${q.options.map(opt => `<button class="roadmap-item" style="font-size: 0.8rem; padding: 15px; text-align: left; background: rgba(255,255,255,0.03);">${opt}</button>`).join('')}
        </div>`;
    }
    if (q.type === 'rating') {
        return `
            <div style="display: grid; gap: 20px;">
                ${q.options.map(opt => `
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                        <span style="font-size: 0.85rem; color: var(--text-dim);">${opt}</span>
                        <div style="display: flex; gap: 8px;">
                            ${[1,2,3,4,5].map(n => `<button class="roadmap-item orbitron" style="width: 40px; height: 40px; padding: 0; display: flex; align-items: center; justify-content: center; font-size: 0.8rem;">${n}</button>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    return `<textarea class="roadmap-item" style="width: 100%; min-height: 120px; color: white; resize: none; background: rgba(0,0,0,0.4); padding: 20px;" placeholder="AWAITING_INPUT..."></textarea>`;
}

function renderOffer() {
    contentArea.innerHTML = `
        <div class="stagger-reveal">
            <h4 class="cyan-text orbitron" style="font-size: 0.8rem; margin-bottom: 10px;">MARKET_POSITIONING</h4>
            <h1 style="font-size: 3rem; margin-bottom: 50px;">OFFER <span class="cyan-text">ENGINE</span></h1>
            
            <div class="grid">
                ${offerFrameworkData.map(ex => `
                    <div class="card" style="border-left: 3px solid var(--cyan);">
                        <div style="position: absolute; right: -20px; top: -20px; font-size: 6rem; font-weight: 900; opacity: 0.03;" class="orbitron">${ex.id}</div>
                        <span class="cyan-text orbitron" style="font-weight: 800; font-size: 0.6rem; letter-spacing: 2px;">PHASE 0${ex.phase} • TASK ${ex.id.toString().padStart(2, '0')}</span>
                        <h3 style="margin: 20px 0; font-size: 1.3rem; color: white;">${ex.name}</h3>
                        <p style="color: var(--text-dim); font-size: 0.9rem; line-height: 1.7;">${ex.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Helpers
function getResourceIcon(type) {
    switch(type) {
        case 'spreadsheet': return 'table';
        case 'document': return 'file-text';
        case 'video': return 'play-circle';
        case 'website': return 'globe';
        default: return 'link';
    }
}

function getRank() {
    if (state.level < 2) return "INITIATE";
    if (state.level < 4) return "NEURAL_ACOLYTE";
    if (state.level < 6) return "CYBER_ENGINEER";
    return "NEXUS_ARCHITECT";
}

function setupInteractions() {
    // Topic Toggles
    document.querySelectorAll('[data-topic-id]').forEach(el => {
        el.addEventListener('click', (e) => {
            toggleTopic(parseInt(el.dataset.topicId), e);
        });
    });

    // 3D Tilt
    document.querySelectorAll('[data-tilt]').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = -(x - centerX) / 10;
            
            gsap.to(el, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                rotateX: 0,
                rotateY: 0,
                duration: 1,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

function setupWSLogic() {
    const parts = [...new Set(worksheetData.map(q => q.part))];
    const container = document.querySelector('#ws-container');
    
    document.addEventListener('click', (e) => {
        if (e.target.id === 'ws-next') {
            if (currentWSPart < parts.length - 1) {
                currentWSPart++;
                updateWS(container);
            } else {
                alert("PROTOCOL_COMPLETE: ENCRYPTED DATA TRANSMITTED TO CENTRAL NODE.");
            }
        }
        if (e.target.id === 'ws-prev') {
            if (currentWSPart > 0) {
                currentWSPart--;
                updateWS(container);
            }
        }
    });
}

function updateWS(container) {
    gsap.to(container, {
        opacity: 0,
        x: -30,
        duration: 0.3,
        onComplete: () => {
            container.innerHTML = renderWSStep(currentWSPart);
            window.scrollTo(0, 0);
            gsap.fromTo(container, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.5 });
            animateEnter();
        }
    });
}

function animateEnter() {
    gsap.from('.stagger-reveal > *', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
    });
}

function createParticlesAt(x, y) {
    for (let i = 0; i < 10; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        p.style.position = 'fixed';
        p.style.width = '4px';
        p.style.height = '4px';
        p.style.background = 'var(--cyan)';
        p.style.borderRadius = '50%';
        p.style.pointerEvents = 'none';
        p.style.zIndex = '9999';
        document.body.appendChild(p);
        
        gsap.to(p, {
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            opacity: 0,
            duration: 1 + Math.random(),
            ease: 'power2.out',
            onComplete: () => p.remove()
        });
    }
}
