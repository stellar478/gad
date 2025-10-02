// Letter Page JavaScript
(function() {
  'use strict';

  // Toast notification system
  function showToast(message) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // Add toast styles
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #2a1b23;
      color: #fff;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      font-size: 14px;
      font-weight: 500;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  // Navigation functionality
  function initNavigation() {
    // Back button - go to dashboard
    const backBtn = document.getElementById('nav-back');
    if (backBtn) {
      backBtn.addEventListener('click', function() {
        showToast('Going back to dashboard ⬅️');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 500);
      });
    }

    // Gallery button
    const galleryBtn = document.getElementById('nav-gallery');
    if (galleryBtn) {
      galleryBtn.addEventListener('click', function() {
        showToast('Opening Gallery 🖼️');
        // Add your gallery page URL here when ready
        // window.location.href = 'gallery.html';
      });
    }

    // Wishes button -> wishes page
    const wishesBtn = document.getElementById('nav-wishes');
    if (wishesBtn) {
      wishesBtn.addEventListener('click', function() {
        showToast('Opening Birthday Wishes 🎈');
        setTimeout(() => {
          window.location.href = 'wishes.html';
        }, 500);
      });
    }

    // Music button
    const musicBtn = document.getElementById('nav-music');
    if (musicBtn) {
      musicBtn.addEventListener('click', function() {
        showToast('Opening Playlist 🎵');
        setTimeout(() => {
          window.location.href = 'playlist.html';
        }, 500);
      });
    }
  }

  // Background Music functionality
  function initMusicControl() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    
    if (!backgroundMusic) return;

    let musicStarted = false;

    // Try to play music when user interacts with the page
    function startMusic() {
      if (musicStarted) return;
      
      const playPromise = backgroundMusic.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          musicStarted = true;
          showToast('Happy Birthday Music! 🎵🎉');
        }).catch((error) => {
          console.log('Music play failed:', error);
          showToast('Click anywhere to start music! 🎵');
        });
      }
    }

    // Add multiple event listeners to ensure music starts
    document.addEventListener('click', startMusic, { once: true });
    document.addEventListener('touchstart', startMusic, { once: true });
    document.addEventListener('keydown', startMusic, { once: true });
    
    // Also try to start music when page loads (might work in some browsers)
    setTimeout(() => {
      if (!musicStarted) {
        startMusic();
      }
    }, 1000);
  }

  // Add subtle parallax effect to balloons
  function initParallaxEffect() {
    let ticking = false;
    
    function updateParallax() {
      const scrolled = window.pageYOffset;
      const balloons = document.querySelectorAll('.balloon');
      
      balloons.forEach((balloon, index) => {
        const speed = 0.5 + (index % 3) * 0.2;
        const yPos = -(scrolled * speed);
        balloon.style.transform = `translateY(${yPos}px)`;
      });
      
      ticking = false;
    }
    
    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }
    
    window.addEventListener('scroll', requestTick);
  }

  // Add hover effects to navigation buttons
  function initButtonEffects() {
    const navButtons = document.querySelectorAll('.nav-icon');
    
    navButtons.forEach(button => {
      button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.transition = 'transform 0.2s ease';
      });
      
      button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
      });
      
      // Add click animation
      button.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = 'scale(1)';
        }, 150);
      });
    });
  }

  // Initialize all functionality when DOM is loaded
  function init() {
    initNavigation();
    initMusicControl();
    initParallaxEffect();
    initButtonEffects();
    
    // Add entrance animation to balloons
    const balloons = document.querySelectorAll('.balloon');
    balloons.forEach((balloon, index) => {
      balloon.style.opacity = '0';
      balloon.style.animationDelay = `${index * 0.1}s`;
      setTimeout(() => {
        balloon.style.opacity = '0.6';
      }, index * 100);
    });
    
    // Show welcome message
    setTimeout(() => {
      showToast('Welcome to the birthday letter! 💌');
    }, 1000);
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();