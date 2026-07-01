document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Premium Loader ---
    window.addEventListener('load', () => {
        const loader = document.querySelector('.loader');
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.visibility = 'hidden';
                initPremiumAnimations();
            }, 1000);
        }, 800);
    });

    // --- 2. GSAP Animations & Parallax ---
    gsap.registerPlugin(ScrollTrigger);

    function initPremiumAnimations() {
        // Hero Content Entrance
        const heroTl = gsap.timeline();
        heroTl.fromTo(".fade-up", 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power4.out" }
        );

        // Hero Parallax Effect on Mouse Move
        const hero = document.querySelector('.hero');
        const bear = document.querySelector('.hero-bear-wrapper');
        const bg = document.querySelector('.hero-bg');

        hero.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            
            gsap.to(bear, { x: xAxis, y: yAxis, duration: 1, ease: "power1.out" });
            gsap.to(bg, { x: -xAxis/2, y: -yAxis/2, duration: 1, ease: "power1.out" });
        });
        
        hero.addEventListener('mouseleave', () => {
            gsap.to(bear, { x: 0, y: 0, duration: 1, ease: "power1.out" });
            gsap.to(bg, { x: 0, y: 0, duration: 1, ease: "power1.out" });
        });

        // Scroll Reveal for Sections
        const fadeSections = gsap.utils.toArray('.section-padding, .countdown-section');
        fadeSections.forEach(sec => {
            gsap.from(sec, {
                scrollTrigger: {
                    trigger: sec,
                    start: "top 85%",
                },
                y: 50,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out"
            });
        });

        // Staggered Cards Reveal
        gsap.from(".detail-card", {
            scrollTrigger: {
                trigger: ".details-grid",
                start: "top 80%"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.7)"
        });
    }

    // --- 3. Countdown Timer ---
    const targetDate = new Date("August 28, 2026 16:00:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            document.getElementById("countdown").innerHTML = "<div class='countdown-title script-font'>¡Llegó el día!</div>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days.toString().padStart(2, '0');
        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();
});
