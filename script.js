// Intersection Observer for fade-up animations
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));

// Toast auto-dismiss
const toast = document.getElementById('success-toast');
if (toast) {
    const mo = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
            if (m.target.classList.contains('show')) {
                setTimeout(() => toast.classList.remove('show'), 5000);
            }
        });
    });
    mo.observe(toast, { attributes: true, attributeFilter: ['class'] });
}

// Section Nav — Scroll Spy & Smooth Scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar__link');

// Smooth scroll on tab click
document.querySelectorAll('.navbar__link, .navbar__cta').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href.startsWith('#')) return;
        
        const targetId = href.slice(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            e.preventDefault();
            const offset = window.innerWidth <= 768 ? 72 : 100; // navbar height
            const top = targetSection.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// Highlight active tab on scroll
const highlightActiveTab = () => {
    let current = '';
    const offset = window.innerWidth <= 768 ? 74 : 102;
    sections.forEach(section => {
        const sectionTop = section.offsetTop - offset;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
};

window.addEventListener('scroll', highlightActiveTab, { passive: true });
highlightActiveTab();

// Scribble Intersection Observer
const scribbleWrappers = document.querySelectorAll('.scribble-wrapper');
if (scribbleWrappers.length > 0) {
    const scribbleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.5 });
    
    scribbleWrappers.forEach(wrapper => {
        scribbleObserver.observe(wrapper);
    });
}

// 3D Tilt Effect for cards
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate rotation (max 8 degrees to keep it subtle)
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
});

// Google Apps Script Web App URL (Paste URL here)
const APPS_SCRIPT_URL = "YOUR_WEB_APP_URL_HERE";

// Handle Form Submission
const form = document.getElementById('registration-form');
const submitBtn = document.querySelector('#registration-form .btn');

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Change button state
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Đang xử lý...";
        submitBtn.disabled = true;

        const formData = {
            parentName: document.getElementById('parent-name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            childName: document.getElementById('child-name').value,
            school: document.getElementById('school').value,
            birthYear: document.getElementById('birth-year').value,
            workshopSelect: document.getElementById('workshop-select').value
        };

        fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(() => {
            // Success
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
            form.reset();
            const toast = document.getElementById('success-toast');
            if (toast) toast.classList.add('show');
        })
        .catch(error => {
            console.error("Error submitting form:", error);
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
            alert("Có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ Hotline.");
        });
    });
}
