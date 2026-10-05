document.addEventListener('DOMContentLoaded', () => {
    // 1. Core Loader Simulation (matches main site)
    const loader = document.getElementById('loader');
    const loaderPercent = document.getElementById('loader-percent');
    const loaderStatus = document.getElementById('loader-status');
    const loaderConsole = document.getElementById('loader-console');

    if (loader) {
        let count = 0;
        const logs = [
            'CONNECTING SECURE REGISTRATION GATEWAY...',
            'SYNCING TO MPSC IT CLUB SUPABASE INSTANCE...',
            'VERIFYING AUTH PROTOCOLS...',
            'INITIALIZING RECRUITMENT INTERFACE...'
        ];

        const logInterval = setInterval(() => {
            if (logs.length > 0) {
                const logEntry = document.createElement('div');
                logEntry.textContent = '> ' + logs.shift();
                loaderConsole.appendChild(logEntry);
                loaderConsole.scrollTop = loaderConsole.scrollHeight;
            }
        }, 200);

        const counterInterval = setInterval(() => {
            count += Math.floor(Math.random() * 8) + 3;
            if (count > 100) count = 100;
            if (loaderPercent) loaderPercent.textContent = (count < 10 ? '0' : '') + count + '%';

            if (count >= 100) {
                clearInterval(counterInterval);
                clearInterval(logInterval);
                if (loaderStatus) loaderStatus.textContent = 'SYSTEM ACTIVE';
                setTimeout(() => {
                    loader.style.opacity = '0';
                    loader.style.pointerEvents = 'none';
                    setTimeout(() => {
                        loader.style.display = 'none';
                    }, 500);
                }, 400);
            }
        }, 30);
    }

    // 2. Cursor Glow Follower
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.transform = `translate(${e.clientX - 175}px, ${e.clientY - 175}px)`;
        });
    }

    // 3. Floating Particles Background
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 24; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 4 + 2;
            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: var(--emerald-green);
                border-radius: 50%;
                opacity: ${Math.random() * 0.4 + 0.1};
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                pointer-events: none;
                z-index: 0;
                box-shadow: 0 0 8px var(--emerald-green);
                animation: floatParticle ${Math.random() * 12 + 8}s ease-in-out infinite alternate;
            `;
            particlesContainer.appendChild(particle);
        }
    }

    // 4. Form Submission & Validation
    const form = document.getElementById('reg-form');
    const submitBtn = document.getElementById('btn-submit');
    const errorMsg = document.getElementById('error-msg');
    const modal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('btn-close-modal');

    function showError(text) {
        errorMsg.textContent = text;
        errorMsg.style.display = 'block';
        errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function clearError() {
        errorMsg.textContent = '';
        errorMsg.style.display = 'none';
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearError();

            const className = document.getElementById('class-name').value;
            const section = document.getElementById('section').value;
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const whatsapp = document.getElementById('whatsapp').value.trim();
            const previousClubEl = document.querySelector('input[name="previous_club"]:checked');

            if (!className) return showError('Please select your class.');
            if (!section) return showError('Please select your section.');
            if (!name) return showError('Please enter your full name.');
            if (!email) return showError('Please enter your email address.');
            if (!whatsapp) return showError('Please enter your WhatsApp number.');
            if (!previousClubEl) return showError('Please specify if you were in an IT club before.');

            const payload = {
                class_name: className,
                section: section,
                full_name: name,
                email: email,
                whatsapp_number: whatsapp,
                previous_it_club: previousClubEl.value
            };

            // Loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    form.reset();
                    // Uncheck radio buttons visually
                    document.querySelectorAll('input[name="previous_club"]').forEach(r => r.checked = false);
                    modal.classList.add('active');
                } else {
                    showError(data.error || 'Registration failed. Please check your information and try again.');
                }
            } catch (err) {
                console.error(err);
                showError('Network connection error. Please try again in a few moments.');
            } finally {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }

    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
});
