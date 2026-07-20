document.addEventListener('DOMContentLoaded', () => {
  function handleViewportChange() {
    const isDesktop = window.innerWidth >= 769;
    document.documentElement.style.setProperty('--viewport-width', `${window.innerWidth}px`);
    if (isDesktop) {
      document.body.style.width = '100%';
      document.body.style.overflowX = 'hidden';
    }
  }

  let resizeTimeout;
  function debounceViewportChange() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleViewportChange, 100);
  }

  window.addEventListener('resize', debounceViewportChange);
  window.addEventListener('orientationchange', handleViewportChange);
  window.addEventListener('load', handleViewportChange);

  const preloader = document.getElementById('preloader');
  const hidePreloader = () => {
    if (preloader) {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
        document.body.style.overflow = 'auto';
      }, 600);
    }
  };
  const preloaderTimeout = setTimeout(hidePreloader, 3000);

  window.addEventListener('load', () => {
    clearTimeout(preloaderTimeout);
    hidePreloader();
  });

  const themeToggle = document.querySelector('.theme-toggle');
  const themeDropdown = document.querySelector('.theme-dropdown');
  const themeOptions = document.querySelectorAll('.theme-option');
  if (themeToggle && themeDropdown && themeOptions.length) {
    const savedTheme = localStorage.getItem('theme') || (
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    );
    document.body.setAttribute('data-theme', savedTheme);
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    themeIcon.className = `fas ${savedTheme === 'dark' ? 'fa-moon' : 'fa-sun'} theme-icon`;

    themeToggle.addEventListener('click', () => {
      const isExpanded = themeToggle.getAttribute('aria-expanded') === 'true';
      themeToggle.setAttribute('aria-expanded', !isExpanded);
      themeDropdown.classList.toggle('active', !isExpanded);
    });

    themeOptions.forEach(option => {
      option.addEventListener('click', () => {
        const theme = option.getAttribute('data-theme');
        document.body.setAttribute('data-theme', theme);
        document.body.classList.toggle('dark-mode', theme === 'dark');
        localStorage.setItem('theme', theme);
        themeIcon.className = `fas ${theme === 'dark' ? 'fa-moon' : 'fa-sun'} theme-icon`;
        themeDropdown.classList.remove('active');
        themeToggle.setAttribute('aria-expanded', 'false');
      });

      option.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          option.click();
        }
      });
    });

    document.addEventListener('click', e => {
      if (!themeToggle.contains(e.target) && !themeDropdown.contains(e.target)) {
        themeDropdown.classList.remove('active');
        themeToggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && themeDropdown.classList.contains('active')) {
        themeDropdown.classList.remove('active');
        themeToggle.setAttribute('aria-expanded', 'false');
        themeToggle.focus();
      }
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (localStorage.getItem('theme') === 'system') {
        const theme = e.matches ? 'dark' : 'light';
        document.body.setAttribute('data-theme', theme);
        document.body.classList.toggle('dark-mode', theme === 'dark');
        themeIcon.className = `fas ${theme === 'dark' ? 'fa-moon' : 'fa-sun'} theme-icon`;
      }
    });
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        const isActive = navLinks.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isActive.toString());
        menuToggle.querySelector('i').className = `fas ${isActive ? 'fa-times' : 'fa-bars'}`;
        if (isActive) {
          const focusableElements = navLinks.querySelectorAll('a, button');
          focusableElements[0].focus();
          document.addEventListener('keydown', trapFocus);
        } else {
          document.removeEventListener('keydown', trapFocus);
        }
      }
    });

    function trapFocus(e) {
      const focusableElements = navLinks.querySelectorAll('a, button');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.querySelector('i').className = 'fas fa-bars';
        document.removeEventListener('keydown', trapFocus);
      }
    });
  }

  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const typewriterElement = document.querySelector('.typewriter-text');
  if (typewriterElement) {
    const text = typewriterElement.dataset.text || 'Building Digital Solutions That Empower';
    let i = 0;
    typewriterElement.innerHTML = '<span class="typed-text"></span><span class="typewriter-pen">✍️</span>';
    const typedTextElement = typewriterElement.querySelector('.typed-text');
    const penElement = typewriterElement.querySelector('.typewriter-pen');

    function type() {
      if (i < text.length) {
        typedTextElement.textContent += text.charAt(i++);
        setTimeout(type, 100);
      } else {
        if (penElement) {
          penElement.style.opacity = 0;
        }
      }
    }
    type();
  }

  const calculateBtn = document.getElementById('calculate-btn');
  const resultDisplay = document.getElementById('result');
  if (calculateBtn && resultDisplay) {
    calculateBtn.addEventListener('click', () => {
      const revenue = parseFloat(document.getElementById('revenue').value);
      const expenses = parseFloat(document.getElementById('expenses').value);
      calculateBtn.disabled = true;
      calculateBtn.textContent = 'Calculating...';
      setTimeout(() => {
        if (isNaN(revenue) || isNaN(expenses) || revenue < 0 || expenses < 0) {
          resultDisplay.textContent = 'Error: Please enter valid positive numbers.';
          resultDisplay.style.color = '#ef4444';
        } else {
          const profit = revenue - expenses;
          if (profit >= 0) {
            resultDisplay.textContent = `Success: Your estimated monthly profit is: ₦${profit.toLocaleString()}`;
            resultDisplay.style.color = '#2563EB';
          } else {
            resultDisplay.textContent = `Error: You incurred a loss of: ₦${Math.abs(profit).toLocaleString()}`;
            resultDisplay.style.color = '#ef4444';
          }
        }
        calculateBtn.textContent = 'Calculate';
        calculateBtn.disabled = false;
      }, 500);
    });
  }

  const openCheckerBtn = document.getElementById('open-checker-btn');
  const deviceModal = document.getElementById('device-modal');
  const closeModal = document.getElementById('close-modal');
  const deviceButtons = document.querySelectorAll('.device-btn');
  const siteUrlInput = document.getElementById('site-url');
  const devicePreviewContainer = document.getElementById('device-preview-container');
  let toastTimeout;

  if (openCheckerBtn && deviceModal && closeModal && deviceButtons.length && siteUrlInput && devicePreviewContainer) {

    function showToast(message, isError = false) {
      clearTimeout(toastTimeout);
      const toast = document.getElementById('toast');
      if (toast) {
        toast.textContent = message;
        toast.style.backgroundColor = isError ? '#ef4444' : 'var(--primary)';
        toast.classList.add('show');
        toastTimeout = setTimeout(() => {
          toast.classList.remove('show');
          toast.textContent = '';
        }, 2500);
      }
    }

    openCheckerBtn.addEventListener('click', () => {
      deviceModal.style.display = 'flex';
      siteUrlInput.focus();
    });

    closeModal.addEventListener('click', () => {
      deviceModal.style.display = 'none';
      devicePreviewContainer.innerHTML = '';
    });

    window.addEventListener('click', e => {
      if (e.target === deviceModal) {
        deviceModal.style.display = 'none';
        devicePreviewContainer.innerHTML = '';
      }
    });

    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && deviceModal.style.display === 'flex') {
        deviceModal.style.display = 'none';
        devicePreviewContainer.innerHTML = '';
      }
    });

    deviceButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const device = btn.getAttribute('data-device');
        let url = siteUrlInput.value.trim();

        if (url === '' || !/^https?:\/\//i.test(url)) {
          showToast('Error: Please enter a valid URL (e.g., https://example.com)', true);
          return;
        }

        const dimensions = {
          mobile: { width: 375, height: 812, frameClass: 'device-frame' },
          tablet: { width: 768, height: 1024, frameClass: 'device-frame tablet' },
          desktop: { width: 1280, height: 720, frameClass: 'device-frame desktop' }
        }[device];

        if (!dimensions) return;

        const frameHTML = `
            <div class="${dimensions.frameClass}" style="width: ${dimensions.width / 10}rem; height: ${dimensions.height / 10}rem;">
                <div class="device-screen">
                    <iframe
                        src="${url}"
                        sandbox="allow-same-origin allow-scripts allow-forms"
                        aria-label="Preview of ${url} on ${device}"
                        width="100%"
                        height="100%"
                        style="border: none; display: block;"
                    ></iframe>
                </div>
                ${device !== 'desktop' ? '<div class="device-header"><h3>Live Preview</h3><i class="fas fa-signal device-header-icon"></i></div>' : ''}
            </div>
        `;

        devicePreviewContainer.innerHTML = frameHTML;
      });
    });
  }

  const footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  const tabSectionIds = ['about', 'projects', 'connect'];
  const tabLinkMap = new Map();
  tabSectionIds.forEach(id => {
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) tabLinkMap.set(id, link);
  });
  if (tabLinkMap.size && 'IntersectionObserver' in window) {
    const tabObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const link = tabLinkMap.get(entry.target.id);
        if (!link) return;
        tabLinkMap.forEach(l => l.classList.remove('tab-active'));
        link.classList.add('tab-active');
      });
    }, { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' });
    tabSectionIds.forEach(id => {
      const section = document.getElementById(id);
      if (section) tabObserver.observe(section);
    });
  }

  function revealAllNow() {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('reveal-visible'));
  }

  try {
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length) {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('reveal-visible');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
        revealEls.forEach(el => observer.observe(el));
      } else {
        revealAllNow();
      }
    }
  } catch (err) {
    revealAllNow();
  }

  setTimeout(revealAllNow, 3500);
});
