// Add background particles dynamically
document.addEventListener('DOMContentLoaded', () => {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Randomize size, position, and animation duration
        const size = Math.random() * 200 + 50; // 50px to 250px
        const x = Math.random() * 100; // 0% to 100%
        const y = Math.random() * 100; // 0% to 100%
        const duration = Math.random() * 20 + 10; // 10s to 30s
        const delay = Math.random() * 5; // 0s to 5s
        
        // Randomize color slightly (more purple vs more blue)
        const isPurple = Math.random() > 0.5;
        const color = isPurple ? 'rgba(108, 59, 255, 0.4)' : 'rgba(47, 128, 255, 0.4)';

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}vw`;
        particle.style.top = `${y}vh`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.background = color;

        particlesContainer.appendChild(particle);
    }

    // Scroll Animations (Intersection Observer)
    const fadeElements = document.querySelectorAll('.glass, .section-title, .hero-content, .placeholder-box');
    
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
    });

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    fadeElements.forEach(el => {
        appearOnScroll.observe(el);
    });

    // Form submission mock
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.submit-btn');
            const originalText = btn.textContent;
            
            btn.textContent = 'Sending...';
            btn.style.opacity = '0.7';
            
            setTimeout(() => {
                btn.textContent = 'Message Sent!';
                btn.style.background = '#28a745';
                btn.style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.4)';
                btn.style.opacity = '1';
                contactForm.reset();
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.style.boxShadow = '';
                }, 3000);
            }, 1500);
        });
    }

    // Add glowing effect that follows cursor on cards
    const cards = document.querySelectorAll('.glass');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Testimonial Deck Logic
    const testimonialsData = [
        {
            id: 1,
            testimonial: "The streaming quality is flawless. I've completely replaced my old setup and the 4K playback is butter smooth.",
            author: "Marcus T."
        },
        {
            id: 2,
            testimonial: "Setting this up took less than two minutes. The retro gaming feature alone makes it worth every penny.",
            author: "Sarah W."
        },
        {
            id: 3,
            testimonial: "I can't believe how fast the UI is. Zero lag when switching between apps, and the connectivity is rock solid.",
            author: "David L."
        }
    ];

    const deck = document.getElementById('testimonial-deck');
    if (deck) {
        let positions = ["front", "middle", "back"];

        const renderCards = () => {
            deck.innerHTML = '';
            testimonialsData.forEach((data, index) => {
                const card = document.createElement('div');
                card.className = 'testimonial-card';
                card.setAttribute('data-pos', positions[index]);
                
                card.innerHTML = `
                    <img src="https://i.pravatar.cc/128?img=${data.id + 10}" alt="Avatar of ${data.author}">
                    <p class="quote">"${data.testimonial}"</p>
                    <p class="author">${data.author}</p>
                `;

                if (positions[index] === "front") {
                    let startX = 0;
                    
                    card.addEventListener('mousedown', (e) => {
                        startX = e.clientX;
                    });
                    
                    card.addEventListener('mouseup', (e) => {
                        if (startX - e.clientX > 50 || e.clientX - startX > 50 || startX === e.clientX) {
                            handleShuffle();
                        }
                    });

                    card.addEventListener('touchstart', (e) => {
                        startX = e.touches[0].clientX;
                    });
                    
                    card.addEventListener('touchend', (e) => {
                        let endX = e.changedTouches[0].clientX;
                        if (startX - endX > 50 || endX - startX > 50 || startX === endX) {
                            handleShuffle();
                        }
                    });
                }

                deck.appendChild(card);
            });
        };

        const handleShuffle = () => {
            positions.unshift(positions.pop());
            renderCards();
        };

        renderCards();
    }
});
