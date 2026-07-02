// ============================================================
//  CINEMATIC INTRO — Star Canvas + GSAP Sequence
// ============================================================
gsap.registerPlugin(ScrollTrigger);

// Block body scroll while intro is visible
document.body.style.overflow = 'hidden';

/* ── Scroll Progress Bar ── */
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress  = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    const bar = document.getElementById('scroll-progress');
    if (bar) bar.style.width = progress + '%';
});

/* ── Confetti Burst ── */
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const colors = ['#D4AF37','#9BAEC8','#BF953F','#FCF6BA','#f9c8d4','#c5dff8','#ffffff'];
    const pieces = Array.from({ length: 120 }, () => ({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 100,
        w: 8 + Math.random() * 8,
        h: 5 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.15,
        vy: 2 + Math.random() * 3,
        vx: (Math.random() - 0.5) * 2,
        alpha: 1
    }));
    let frame;
    const startTime = Date.now();
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const elapsed = (Date.now() - startTime) / 1000;
        let alive = 0;
        pieces.forEach(p => {
            p.y += p.vy;
            p.x += p.vx;
            p.rot += p.rotSpeed;
            p.alpha = elapsed < 2 ? 1 : Math.max(0, 1 - (elapsed - 2) / 1.5);
            if (p.y < canvas.height + 20) alive++;
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });
        if (elapsed < 4 && alive > 0) {
            frame = requestAnimationFrame(draw);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationFrame(frame);
        }
    }
    draw();
}

/* ── Star canvas particles ── */
(function initStarCanvas() {
    const canvas = document.getElementById('intro-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    const COUNT = 60;

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < COUNT; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 3 + 1,
            alpha: Math.random(),
            speed: Math.random() * 0.3 + 0.1,
            drift: (Math.random() - 0.5) * 0.4,
            color: Math.random() > 0.5 ? '#D4AF37' : '#9BAEC8'
        });
    }

    function drawStar(x, y, r, color, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        // draw a simple 4-point sparkle
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const len = i % 2 === 0 ? r * 2 : r * 0.8;
            ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function tick() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => {
            s.y -= s.speed;
            s.x += s.drift;
            s.alpha = 0.4 + 0.6 * Math.abs(Math.sin(Date.now() * 0.001 + s.x));
            if (s.y < -10) { s.y = canvas.height + 10; s.x = Math.random() * canvas.width; }
            drawStar(s.x, s.y, s.r, s.color, s.alpha);
        });
        requestAnimationFrame(tick);
    }
    tick();
})();

/* ── GSAP Intro Reveal Sequence ── */
window.addEventListener('load', () => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. Pre-title fades up
    tl.to('#intro-pre', { opacity: 1, y: 0, duration: 0.8 }, 0.3);

    // 2. Bear swoops in from right, overshoots slightly
    tl.fromTo('#intro-bear',
        { x: 300, rotation: 15, opacity: 0 },
        { x: 0, rotation: 0, opacity: 1, duration: 1.2, ease: 'back.out(1.4)' },
        0.7
    );

    // 3. Name rises from below the bear
    tl.to('#intro-name', { opacity: 1, y: 0, duration: 1, ease: 'power4.out' }, 1.4);

    // 4. Tagline
    tl.to('#intro-tagline', { opacity: 1, duration: 0.7 }, 1.9);

    // 5. Gold divider expands from center
    tl.fromTo('#intro-divider .spark-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.6, transformOrigin: 'center', ease: 'power2.inOut' },
        2.2
    );
    tl.to('#intro-divider', { opacity: 1, duration: 0 }, 2.2);

    // 6. Button bounces in
    tl.to('#intro-btn', { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }, 2.6);

    // Idle bear pulse
    gsap.set('#intro-name', { y: 20 });
});

/* ── Curtain Exit ── */
window.enterInvitation = function() {
    const splash = document.getElementById('intro-splash');

    // Restore body scroll
    document.body.style.overflow = '';

    // Create curtain panels
    const top = document.createElement('div');
    top.className = 'intro-curtain-top';
    const bot = document.createElement('div');
    bot.className = 'intro-curtain-bottom';
    document.body.appendChild(top);
    document.body.appendChild(bot);

    const tl = gsap.timeline({
        onComplete: () => {
            splash.remove();
            gsap.to([top, bot], {
                duration: 0.8,
                opacity: 0,
                ease: 'power2.in',
                onComplete: () => { top.remove(); bot.remove(); initPremiumAnimations(); }
            });
        }
    });

    // Fade + scale intro content out
    tl.to('#intro-splash .intro-content', { opacity: 0, scale: 0.95, duration: 0.4 }, 0);

    // Curtains sweep in
    tl.to(top, { y: 0, duration: 0.7, ease: 'power3.inOut' }, 0.2);
    tl.to(bot, { y: 0, duration: 0.7, ease: 'power3.inOut' }, 0.2);

    // Start music on enter
    const bgMusic = document.getElementById('bg-music');
    if (bgMusic) {
        bgMusic.play().then(() => {
            const musicToggle = document.getElementById('music-toggle');
            if (musicToggle) musicToggle.classList.add('playing');
            window._musicPlaying = true;
        }).catch(() => {});
    }

    // Confetti burst after curtains open
    setTimeout(launchConfetti, 1200);
};

/* ── Main Site Animations (called after intro) ── */
function initPremiumAnimations() {
    const heroTl = gsap.timeline();
    heroTl.fromTo(".fade-up",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power4.out" }
    );

    const hero = document.querySelector('.hero');
    const bear = document.querySelector('.hero-bear-wrapper');
    const bg   = document.querySelector('.hero-bg');

    hero.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth  / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        gsap.to(bear, { x: xAxis, y: yAxis, duration: 1, ease: "power1.out" });
        gsap.to(bg,   { x: -xAxis/2, y: -yAxis/2, duration: 1, ease: "power1.out" });
    });
    hero.addEventListener('mouseleave', () => {
        gsap.to(bear, { x: 0, y: 0, duration: 1, ease: "power1.out" });
        gsap.to(bg,   { x: 0, y: 0, duration: 1, ease: "power1.out" });
    });

    const fadeSections = gsap.utils.toArray('.section-padding, .countdown-section');
    fadeSections.forEach(sec => {
        gsap.from(sec, {
            scrollTrigger: { trigger: sec, start: "top 85%" },
            y: 50, opacity: 0, duration: 1.2, ease: "power3.out"
        });
    });

    gsap.from(".detail-card", {
        scrollTrigger: { trigger: ".details-grid", start: "top 80%" },
        y: 50, opacity: 0, duration: 0.8, stagger: 0.2, ease: "back.out(1.7)"
    });
}

/* ── Countdown Timer ── */
document.addEventListener("DOMContentLoaded", () => {
    const targetDate = new Date("August 28, 2026 16:00:00").getTime();

    // Helper: update a number element with flip animation only when value changes
    function setNum(id, val) {
        const el = document.getElementById(id);
        if (!el) return;
        const str = val.toString().padStart(2, '0');
        if (el.innerText !== str) {
            el.classList.remove('flip');
            void el.offsetWidth; // reflow to restart animation
            el.classList.add('flip');
            el.innerText = str;
        }
    }

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        if (distance < 0) {
            document.getElementById("countdown").innerHTML = "<div class='countdown-title script-font'>¡Llegó el día!</div>";
            return;
        }
        setNum("days",    Math.floor(distance / (1000 * 60 * 60 * 24)));
        setNum("hours",   Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        setNum("minutes", Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
        setNum("seconds", Math.floor((distance % (1000 * 60)) / 1000));
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();

    /* ── Music Toggle ── */
    const bgMusic     = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');

    musicToggle.addEventListener('click', () => {
        if (window._musicPlaying) {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            window._musicPlaying = false;
        } else {
            bgMusic.play().catch(() => {});
            musicToggle.classList.add('playing');
            window._musicPlaying = true;
        }
    });
});
