/* =========================================================
   LEARNHUB — SCRIPT
   Vanilla JS only. No frameworks/libraries.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. STICKY NAVBAR ---------- */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); // run once on load


  /* ---------- 2. MOBILE HAMBURGER MENU ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu whenever a nav link is clicked
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });


  /* ---------- 3. SMOOTH SCROLLING + ACTIVE LINK HIGHLIGHT ---------- */
  // Smooth scroll is mostly handled by CSS `scroll-behavior: smooth`,
  // but we also offset for the fixed navbar height when clicking links.
  const navAnchors = document.querySelectorAll('a.nav-link');

  navAnchors.forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.startsWith('#')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const offset = 80; // navbar height buffer
          const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    });
  });

  // Highlight the nav link matching the section currently in view
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    let currentSectionId = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navAnchors.forEach(function (link) {
      link.classList.remove('active-link');
      if (link.getAttribute('href') === '#' + currentSectionId) {
        link.classList.add('active-link');
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink);


  /* ---------- 4. SCROLL REVEAL ANIMATIONS ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });


  /* ---------- 5. ANIMATED STATISTICS COUNTERS ---------- */
  const counters = document.querySelectorAll('.counter');
  let countersStarted = false;

  function animateCounters() {
    counters.forEach(function (counter) {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 1500; // ms
      const frameRate = 16; // ~60fps
      const totalFrames = Math.round(duration / frameRate);
      let frame = 0;

      const counterInterval = setInterval(function () {
        frame++;
        // Ease-out progress for a smoother finish
        const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
        const currentValue = Math.round(target * progress);
        counter.textContent = currentValue.toLocaleString();

        if (frame >= totalFrames) {
          counter.textContent = target.toLocaleString();
          clearInterval(counterInterval);
        }
      }, frameRate);
    });
  }

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    statsObserver.observe(statsSection);
  }


  /* ---------- 6. HERO CODE TYPING ANIMATION ---------- */
  const typedCodeEl = document.getElementById('typedCode');
  const codeLines = [
    'const learner = {',
    '  name: "You",',
    '  goal: "Dream Job",',
    '  skills: [],',
    '};',
    '',
    'learnhub.enroll(learner);',
    '// → Welcome aboard! 🎓'
  ];
  const fullCodeText = codeLines.join('\n');
  let typeIndex = 0;

  function typeCode() {
    if (!typedCodeEl) return;
    if (typeIndex <= fullCodeText.length) {
      typedCodeEl.textContent = fullCodeText.slice(0, typeIndex);
      typeIndex++;
      setTimeout(typeCode, 35);
    } else {
      // Pause, then restart the loop for a continuous ambient effect
      setTimeout(function () {
        typeIndex = 0;
        typeCode();
      }, 2500);
    }
  }
  typeCode();


  /* ---------- 7. CONTACT FORM VALIDATION ---------- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  function setError(inputId, errorId, message) {
    const errorEl = document.getElementById(errorId);
    const groupEl = document.getElementById(inputId).closest('.form-group');
    errorEl.textContent = message;
    groupEl.classList.add('has-error');
  }

  function clearError(inputId, errorId) {
    const errorEl = document.getElementById(errorId);
    const groupEl = document.getElementById(inputId).closest('.form-group');
    errorEl.textContent = '';
    groupEl.classList.remove('has-error');
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      formSuccess.classList.remove('show');

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      let isValid = true;

      // Name validation
      if (name.length < 2) {
        setError('name', 'nameError', 'Please enter your full name.');
        isValid = false;
      } else {
        clearError('name', 'nameError');
      }

      // Email validation
      if (!isValidEmail(email)) {
        setError('email', 'emailError', 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearError('email', 'emailError');
      }

      // Subject validation
      if (subject.length < 3) {
        setError('subject', 'subjectError', 'Subject must be at least 3 characters.');
        isValid = false;
      } else {
        clearError('subject', 'subjectError');
      }

      // Message validation
      if (message.length < 10) {
        setError('message', 'messageError', 'Message should be at least 10 characters.');
        isValid = false;
      } else {
        clearError('message', 'messageError');
      }

      if (isValid) {
        formSuccess.classList.add('show');
        contactForm.reset();

        // Hide success message after a few seconds
        setTimeout(function () {
          formSuccess.classList.remove('show');
        }, 4000);
      }
    });

    // Clear individual field errors as the user types
    ['name', 'email', 'subject', 'message'].forEach(function (id) {
      document.getElementById(id).addEventListener('input', function () {
        clearError(id, id + 'Error');
      });
    });
  }


  /* ---------- 8. SCROLL TO TOP BUTTON ---------- */
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });

  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ---------- 9. FOOTER YEAR ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
