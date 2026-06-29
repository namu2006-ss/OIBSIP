/* =====================================================
   NAMRATA ARBE — PORTFOLIO SCRIPT
   Theme toggle, typing animation, navbar behaviour,
   scroll reveal, modal, contact form validation.
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Dark / Light Mode Toggle ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const root = document.documentElement;

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    } else {
      root.removeAttribute('data-theme');
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
  };

  // Respect saved preference, otherwise fall back to system preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  themeToggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('portfolio-theme', next);
  });

  /* ---------- 2. Mobile Navigation Toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu after clicking a link
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 3. Sticky Navbar on Scroll ---------- */
  const navbar = document.getElementById('navbar');
  const handleNavbarScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll);

  /* ---------- 4. Typing Animation (Hero) ---------- */
  const typingText = document.getElementById('typingText');
  const phrases = [
    'B.Tech Computer Engineering Student',
    'Web Developer',
    'IoT Enthusiast'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typeLoop = () => {
    const current = phrases[phraseIndex];

    if (!isDeleting) {
      charIndex++;
      typingText.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(typeLoop, 1600); // pause at full word
        return;
      }
    } else {
      charIndex--;
      typingText.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    const speed = isDeleting ? 45 : 75;
    setTimeout(typeLoop, speed);
  };
  typeLoop();

  /* ---------- 5. Active Navigation Highlight (Scroll Spy) ---------- */
  const sections = document.querySelectorAll('main section[id], main#home');
  const navAnchors = document.querySelectorAll('.nav-link');

  const setActiveLink = (id) => {
    navAnchors.forEach((a) => {
      a.classList.toggle('active-link', a.dataset.section === id);
    });
  };

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
  );

  // Observe the hero (id="home") plus every other section
  document.querySelectorAll('section[id]').forEach((sec) => spyObserver.observe(sec));
  const heroEl = document.querySelector('main');
  if (heroEl) spyObserver.observe(heroEl);

  /* ---------- 6. Scroll Reveal Animations ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // small stagger for elements revealed together
          setTimeout(() => entry.target.classList.add('in-view'), i * 60);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- 7. Back to Top Button ---------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 500);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 8. Project Details Modal ---------- */
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloseButtons = document.querySelectorAll('[data-modal-close]');
  let lastFocusedElement = null;

  const openModal = (modal) => {
    if (!modal) return;
    lastFocusedElement = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('[data-modal-close]');
    if (closeBtn) closeBtn.focus();
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedElement) lastFocusedElement.focus();
  };

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const targetId = trigger.getAttribute('data-modal-target');
      openModal(document.getElementById(targetId));
    });
  });

  modalCloseButtons.forEach((btn) => {
    btn.addEventListener('click', () => closeModal(btn.closest('.modal-overlay')));
  });

  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openedModal = document.querySelector('.modal-overlay.open');
      if (openedModal) closeModal(openedModal);
    }
  });

  /* ---------- 9. Contact Form Validation ---------- */
  const contactForm = document.getElementById('contactForm');

  const fields = {
    name: { el: document.getElementById('name'), error: document.getElementById('nameError') },
    email: { el: document.getElementById('email'), error: document.getElementById('emailError') },
    subject: { el: document.getElementById('subject'), error: document.getElementById('subjectError') },
    message: { el: document.getElementById('message'), error: document.getElementById('messageError') }
  };

  const formSuccess = document.getElementById('formSuccess');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setFieldError = (field, message) => {
    field.el.classList.toggle('invalid', Boolean(message));
    field.error.textContent = message || '';
  };

  const validateField = (key) => {
    const field = fields[key];
    const value = field.el.value.trim();

    if (key === 'name') {
      if (!value) return setFieldError(field, 'Please enter your name.') && false;
      if (value.length < 2) return setFieldError(field, 'Name looks too short.') && false;
    }
    if (key === 'email') {
      if (!value) return setFieldError(field, 'Please enter your email.') && false;
      if (!emailPattern.test(value)) return setFieldError(field, 'Enter a valid email address.') && false;
    }
    if (key === 'subject') {
      if (!value) return setFieldError(field, 'Please add a subject.') && false;
    }
    if (key === 'message') {
      if (!value) return setFieldError(field, 'Please write a message.') && false;
      if (value.length < 10) return setFieldError(field, 'Message should be at least 10 characters.') && false;
    }
    setFieldError(field, '');
    return true;
  };

  // Live validation as the user types/leaves a field
  Object.keys(fields).forEach((key) => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    fields[key].el.addEventListener('input', () => {
      if (fields[key].el.classList.contains('invalid')) validateField(key);
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = Object.keys(fields).map((key) => validateField(key));
    const isValid = results.every(Boolean);

    if (!isValid) {
      formSuccess.style.color = '#EF4444';
      formSuccess.textContent = 'Please fix the highlighted fields before sending.';
      return;
    }

    // No backend connected — simulate a successful send.
    formSuccess.style.color = '#16A34A';
    formSuccess.textContent = `Thank you, ${fields.name.el.value.trim()}! Your message has been noted. I will get back to you soon.`;
    contactForm.reset();
    Object.values(fields).forEach((f) => setFieldError(f, ''));
  });

});
