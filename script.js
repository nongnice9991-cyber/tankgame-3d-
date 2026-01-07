window.addEventListener('DOMContentLoaded', () => {
    console.log("System Initializing...");

    // --- 1. SETUP YEAR ---
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // --- 2. CANVAS ANIMATION: TACTICAL GRID ---
    const canvas = document.getElementById('canvas-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let w, h;
        const particles = [];
        const connectionDistance = 150;
        
        function resize() {
            w = canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            h = canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        }
        
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.vx = (Math.random() - 0.5) * 1;
                this.vy = (Math.random() - 0.5) * 1;
                this.size = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > w) this.vx *= -1;
                if (this.y < 0 || this.y > h) this.vy *= -1;
            }
            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = '#00ff41';
                ctx.fill();
            }
        }

        // สร้าง Particle
        for (let i = 0; i < 80; i++) {
            particles.push(new Particle());
        }

        function animate() {
            if (!ctx) return;
            ctx.clearRect(0, 0, w, h);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);

                    if (dist < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 255, 65, ${1 - dist/connectionDistance})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Radar Line
            const time = Date.now() * 0.002;
            const scanY = (Math.sin(time) * 0.5 + 0.5) * h;
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)';
            ctx.lineWidth = 2;
            ctx.moveTo(0, scanY);
            ctx.lineTo(w, scanY);
            ctx.stroke();

            requestAnimationFrame(animate);
        }
        animate();
    }

    // --- 3. CURSOR & TOUCH LOGIC ---
    const cursor = document.getElementById('cursor');
    
    // Mouse Movement for PC
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        const hoverTriggers = document.querySelectorAll('.hover-trigger');
        hoverTriggers.forEach(trigger => {
            trigger.addEventListener('mouseenter', () => document.body.classList.add('hover-active'));
            trigger.addEventListener('mouseleave', () => document.body.classList.remove('hover-active'));
        });
    }

    // Touch Ripple Effect for Mobile
    document.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        createRipple(touch.clientX, touch.clientY);
    });
    
    // Click Ripple for PC (just for extra cool effect)
    document.addEventListener('click', (e) => {
        createRipple(e.clientX, e.clientY);
    });

    function createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.classList.add('touch-ripple');
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        document.body.appendChild(ripple);
        
        // ลบ Element เมื่อเล่น Animation จบ
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // --- 4. TYPEWRITER ---
    const typeWriterElement = document.getElementById('typewriter-text');
    if (typeWriterElement) {
        const textToType = "เกมรถถังประจัญบาน... เลือกสีคู่ใจ ดวลเดือดหรือลุยบอท!";
        let typeIndex = 0;

        function typeWriter() {
            if (typeIndex < textToType.length) {
                typeWriterElement.innerHTML += textToType.charAt(typeIndex);
                typeIndex++;
                setTimeout(typeWriter, 40);
            }
        }
        typeWriter();
    }

    console.log("System: Advanced Ops Online.");
});
