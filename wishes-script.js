// Birthday Wishes Page JavaScript
(function() {
  'use strict';

  // Photo placeholder is now fixed - no upload functionality needed

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

  // Add floating animation to gift icon
  function initGiftIconAnimation() {
    const giftIcon = document.querySelector('.gift-icon');
    if (giftIcon) {
      giftIcon.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(5deg)';
        this.style.transition = 'transform 0.3s ease';
      });
      
      giftIcon.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
      });
    }
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

  // Add click effect to main heading
  function initHeadingEffects() {
    const heading = document.querySelector('.main-heading');
    if (heading) {
      heading.addEventListener('click', function() {
        // Create confetti effect
        createConfetti();
        showToast('Happy Birthday! 🎉');
      });
    }
  }

  // Simple confetti effect
  function createConfetti() {
    const colors = ['#ff8fb3', '#ffd3e3', '#ff9fbd', '#ffa9c6', '#ffc4d6'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        top: -10px;
        left: ${Math.random() * 100}vw;
        z-index: 1000;
        pointer-events: none;
        animation: confettiFall 3s linear forwards;
      `;
      
      document.body.appendChild(confetti);
      
      // Remove after animation
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 3000);
    }
    
    // Add confetti animation CSS if not already added
    if (!document.querySelector('#confetti-styles')) {
      const style = document.createElement('style');
      style.id = 'confetti-styles';
      style.textContent = `
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Add mobile-specific interactions
  function initMobileInteractions() {
    // Add interaction for fixed photo placeholder
    const photoPlaceholderFixed = document.querySelector('.photo-placeholder-fixed');
    if (photoPlaceholderFixed) {
      photoPlaceholderFixed.addEventListener('click', function() {
        // Add a fun pulse animation
        this.style.animation = 'pulse 0.6s ease-in-out';
        setTimeout(() => {
          this.style.animation = '';
        }, 600);
        
        showToast('Photo coming soon! 📸');
      });
    }
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

    // Message button -> letter page
    const messageBtn = document.getElementById('nav-message');
    if (messageBtn) {
      messageBtn.addEventListener('click', function() {
        showToast('Opening Message 💌');
        setTimeout(() => {
          window.location.href = 'letter.html';
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

  // Initialize all functionality when DOM is loaded
  function init() {
    initGiftIconAnimation();
    initParallaxEffect();
    initHeadingEffects();
    initMobileInteractions();
    initNavigation();
    initMusicControl();
    
    // Add entrance animation to balloons
    const balloons = document.querySelectorAll('.balloon');
    balloons.forEach((balloon, index) => {
      balloon.style.opacity = '0';
      balloon.style.animationDelay = `${index * 0.1}s`;
      setTimeout(() => {
        balloon.style.opacity = '0.6';
      }, index * 100);
    });
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
