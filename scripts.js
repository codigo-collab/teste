async function enviarEmail(dados) {
  try {
    // ✅ URL CORRETA do seu Render
    const BASE_URL = 'https://teste-2-7aq1.onrender.com/health';

    console.log('Enviando para:', `${BASE_URL}/send`);
    
    // Adicionar timeout de 10 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${BASE_URL}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: dados.nome,
        email: dados.email,
        message: dados.mensagem
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    const result = await response.json();
    console.log('Resposta do servidor:', result);
    
    if (response.ok) {
      alert('✅ Email enviado com sucesso!');
      document.getElementById('contactForm').reset();
    } else {
      alert('❌ Erro ao enviar email: ' + (result.error || 'Erro desconhecido'));
    }
  } catch (error) {
    console.error('Erro completo:', error);
    if (error.name === 'AbortError') {
      alert('❌ Timeout: Servidor não respondeu em 10 segundos');
    } else {
      alert('❌ Erro de conexão com o servidor.');
    }
  }
}
// Inicialização do Particles.js
document.addEventListener('DOMContentLoaded', function() {

    // Configuração do Particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ['#3498db', '#e74c3c', '#2ecc71']
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 1,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 4,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 10,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#3498db',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
    // Menu hamburger para mobile
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Fechar menu ao clicar em um link
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }

    // Efeito de digitação
    initTypingEffect();

    // Animação das barras de habilidades
    initSkillBars();

    // Animação dos círculos de progresso
    initProgressCircles();

    // Scroll suave
    initSmoothScroll();

    // Animação ao scroll
    initScrollAnimations();

    // Formulário de contato
    initContactForm();

    // Efeito parallax
    initParallax();

    // Contador animado
    initCounters();

    // Lightbox para imagens
    initLightbox();

    // Preloader
    initPreloader();
});

// Efeito de digitação
function initTypingEffect() {
    const typedTextSpan = document.querySelector('.typed-text');
    const cursorSpan = document.querySelector('.cursor');

    if (typedTextSpan && cursorSpan) {
        const textArray = ['Engenheira Civil', 'Especialista em Projetos', 'Gestora de Obras'];
        const typingDelay = 100;
        const erasingDelay = 50;
        const newTextDelay = 2000;
        let textArrayIndex = 0;
        let charIndex = 0;

        function type() {
            if (charIndex < textArray[textArrayIndex].length) {
                if (!cursorSpan.classList.contains('typing')) {
                    cursorSpan.classList.add('typing');
                }
                typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingDelay);
            } else {
                cursorSpan.classList.remove('typing');
                setTimeout(erase, newTextDelay);
            }
        }

        function erase() {
            if (charIndex > 0) {
                if (!cursorSpan.classList.contains('typing')) {
                    cursorSpan.classList.add('typing');
                }
                typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, erasingDelay);
            } else {
                cursorSpan.classList.remove('typing');
                textArrayIndex++;
                if (textArrayIndex >= textArray.length) textArrayIndex = 0;
                setTimeout(type, typingDelay + 1100);
            }
        }

        // Iniciar efeito quando a página carregar
        if (textArray.length) setTimeout(type, newTextDelay + 250);
    }
}

// Animação das barras de habilidades
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        });
    };

    // Observador de interseção para animar quando a seção fica visível
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(skillsSection);
    }
}

// Animação dos círculos de progresso
function initProgressCircles() {
    const progressCircles = document.querySelectorAll('.progress-ring-circle');

    const animateProgressCircles = () => {
        progressCircles.forEach(circle => {
            const card = circle.closest('.stat-card');
            const value = card ? card.querySelector('.stat-progress').getAttribute('data-value') : 0;
            const radius = circle.r.baseVal.value;
            const circumference = radius * 2 * Math.PI;
            const offset = circumference - (value / 100) * circumference;

            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = circumference;

            // Animar após um pequeno delay
            setTimeout(() => {
                circle.style.transition = 'stroke-dashoffset 1.5s ease-in-out';
                circle.style.strokeDashoffset = offset;
            }, 200);
        });
    };

    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateProgressCircles();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(aboutSection);
    }
}
// SCROLL SUAVE CORRIGIDO - substitua a função atual por esta
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            console.log('Clicado no link:', targetId); // Para debug
            
            const target = document.querySelector(targetId);
            
            if (target) {
                console.log('Alvo encontrado:', target); // Para debug
                
                // Calcula a posição exata
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                
                // Posição final considerando a navbar
                const offsetPosition = targetPosition - navbarHeight - 20;
                
                console.log('Posição calculada:', offsetPosition); // Para debug
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Atualiza a URL sem recarregar a página
                history.pushState(null, null, targetId);
            } else {
                console.log('Alvo NÃO encontrado:', targetId); // Para debug
            }
        });
    });
}

// Animação ao scroll
function initScrollAnimations() {
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.education-card, .skill-category, .timeline-content, .feature, .contact-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('fade-in-up');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Executar uma vez ao carregar
}

// Formulário de contato
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Mostrar loading
            submitBtn.innerHTML = '<div class="loading-spinner"></div>Enviando...';
            submitBtn.disabled = true;

            try {
                // Coletar dados do formulário
                const formData = {
                    nome: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    mensagem: `
Assunto: ${document.getElementById('subject').value}
Nome: ${document.getElementById('name').value}
Email: ${document.getElementById('email').value}
Mensagem: ${document.getElementById('message').value}
                    `.trim()
                };

                console.log('Enviando dados:', formData); // Para debug

                // Chamar a função de enviar email
                await enviarEmail(formData);
                
            } catch (error) {
                console.error('Erro no formulário:', error);
                alert('Erro ao enviar formulário: ' + error.message);
            } finally {
                // Restaurar botão
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Efeito parallax
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.float-element');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

// Contadores animados
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / 100;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(() => animateCounters(), 20);
            } else {
                counter.innerText = target;
            }
        });
    };

    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }
}

// Lightbox para imagens
function initLightbox() {
    // Adicionar funcionalidade de lightbox se houver imagens clicáveis
    const images = document.querySelectorAll('.profile-photo, .project-image');
    
    images.forEach(image => {
        image.addEventListener('click', () => {
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img src="${image.src}" alt="${image.alt}">
                    <button class="lightbox-close">&times;</button>
                </div>
            `;
            
            document.body.appendChild(lightbox);
            
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                    lightbox.remove();
                }
            });
        });
    });
}

// Preloader
function initPreloader() {
    window.addEventListener('load', () => {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });
}

// Notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animação de entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remover após 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Efeito de mudança de cor na navbar ao rolar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        }
    }
});

// Atualizar ano no footer
document.addEventListener('DOMContentLoaded', () => {
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2024', currentYear);
    }
});

// Efeito de tilt nos cards
function initTiltEffect() {
    const cards = document.querySelectorAll('.profile-card, .education-card, .skill-category');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// Inicializar efeito tilt após o carregamento
setTimeout(initTiltEffect, 1000);

