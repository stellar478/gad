// Birthday Playlist JavaScript
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
    
    document.body.appendChild(toast);
    
    // Remove after animation completes
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  }

  // Track maximize/minimize functionality
  function initTrackMaximize() {
    const trackItems = document.querySelectorAll('.track-item');
    
    trackItems.forEach(track => {
      // Add click handler for minimized tracks
      track.addEventListener('click', function(e) {
        // Don't trigger if clicking on play button
        if (e.target.closest('.play-btn')) return;
        
        // Only handle minimized tracks
        if (this.classList.contains('minimized')) {
          maximizeTrack(this);
        }
      });
    });
  }

  function maximizeTrack(selectedTrack) {
    const allTracks = document.querySelectorAll('.track-item');
    
    // Minimize all tracks first
    allTracks.forEach(track => {
      track.classList.remove('maximized');
      track.classList.add('minimized');
    });
    
    // Maximize the selected track
    selectedTrack.classList.remove('minimized');
    selectedTrack.classList.add('maximized');
    
    // Move to featured section
    const featuredTrack = document.querySelector('.featured-track');
    const tracksGrid = document.querySelector('.tracks-grid');
    
    // If it's not already in featured section, move it there
    if (!featuredTrack.contains(selectedTrack)) {
      const currentFeatured = featuredTrack.querySelector('.track-item');
      if (currentFeatured) {
        // Move current featured to grid
        currentFeatured.classList.remove('maximized');
        currentFeatured.classList.add('minimized');
        tracksGrid.appendChild(currentFeatured);
      }
      
      // Move selected to featured
      featuredTrack.appendChild(selectedTrack);
    }
    
    // Start progress animation
    startProgressAnimation(selectedTrack);
    
    // Show toast
    const songTitle = selectedTrack.querySelector('.song-title').textContent;
    showToast(`🎵 Now featuring: ${songTitle}`);
  }

  function startProgressAnimation(track) {
    const progressFill = track.querySelector('.progress-fill');
    const currentTimeSpan = track.querySelector('.current-time');
    const duration = track.getAttribute('data-duration') || '3:00';
    
    if (!progressFill || !currentTimeSpan) return;
    
    // Reset progress
    progressFill.style.width = '0%';
    currentTimeSpan.textContent = '0:00';
    
    // Convert duration to seconds
    const [minutes, seconds] = duration.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;
    
    let currentSeconds = 0;
    const interval = setInterval(() => {
      currentSeconds++;
      const progress = (currentSeconds / totalSeconds) * 100;
      
      progressFill.style.width = `${progress}%`;
      
      // Update current time display
      const mins = Math.floor(currentSeconds / 60);
      const secs = currentSeconds % 60;
      currentTimeSpan.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
      
      // Stop when complete
      if (currentSeconds >= totalSeconds) {
        clearInterval(interval);
        // Auto-play next song or reset
        setTimeout(() => {
          progressFill.style.width = '0%';
          currentTimeSpan.textContent = '0:00';
        }, 1000);
      }
    }, 1000);
    
    // Store interval for cleanup
    track.progressInterval = interval;
  }

  // Play button functionality
  function initPlayButtons() {
    const playButtons = document.querySelectorAll('.play-btn');
    
    playButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent track maximize
        
        const songName = this.getAttribute('data-song');
        const artistName = this.getAttribute('data-artist');
        const track = this.closest('.track-item');
        
        // Console log for debugging
        console.log(`Playing ${songName} by ${artistName}`);
        
        // Maximize this track if it's not already maximized
        if (track.classList.contains('minimized')) {
          maximizeTrack(track);
        } else {
          // If already maximized, just start/restart progress
          startProgressAnimation(track);
        }
        
        // Show toast notification
        showToast(`🎵 Playing "${songName}" by ${artistName}`);
        
        // Add visual feedback
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = '';
        }, 150);
        
        // Change button text temporarily
        const originalHTML = this.innerHTML;
        this.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
            <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
          </svg>
          <span>Playing...</span>
        `;
        
        // Revert button after 3 seconds
        setTimeout(() => {
          this.innerHTML = originalHTML;
        }, 3000);
      });
      
      // Add hover effects
      button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
      });
      
      button.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    });
  }

  // Header button functionality
  function initHeaderButtons() {
    // Celebrate button
    const celebrateBtn = document.getElementById('celebrate-btn');
    if (celebrateBtn) {
      celebrateBtn.addEventListener('click', function() {
        showToast('🎉 Happy Birthday! Let\'s celebrate! 🎂');
        createConfetti();
      });
    }

    // Share button
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', function() {
        // Try to use Web Share API if available
        if (navigator.share) {
          navigator.share({
            title: 'Birthday Playlist for Vasu Sree',
            text: 'Check out this amazing birthday playlist!',
            url: window.location.href
          }).then(() => {
            showToast('🔗 Playlist shared successfully!');
          }).catch(() => {
            fallbackShare();
          });
        } else {
          fallbackShare();
        }
      });
    }
  }

  // Fallback share functionality
  function fallbackShare() {
    // Copy URL to clipboard
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast('🔗 Playlist link copied to clipboard!');
    }).catch(() => {
      showToast('🔗 Ready to share this playlist!');
    });
  }

  // Enhanced confetti and balloon effect
  function createConfetti() {
    const colors = ['#ff8fb3', '#ffd3e3', '#ff9fbd', '#ffa9c6', '#ffc4d6'];
    const shapes = ['🌸', '🎀', '💖', '✨', '🌺', '🦋', '💫', '🌷'];
    const confettiCount = 80;
    
    // Create random petals/confetti
    for (let i = 0; i < confettiCount; i++) {
      const isEmoji = Math.random() > 0.6;
      const confetti = document.createElement('div');
      
      if (isEmoji) {
        confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        confetti.style.cssText = `
          position: fixed;
          font-size: ${12 + Math.random() * 8}px;
          top: -20px;
          left: ${Math.random() * 100}vw;
          z-index: 1000;
          pointer-events: none;
          animation: petalFall ${3 + Math.random() * 2}s linear forwards;
          --random-x: ${(Math.random() - 0.5) * 200}px;
          --random-rotation: ${Math.random() * 720}deg;
        `;
      } else {
        confetti.style.cssText = `
          position: fixed;
          width: ${6 + Math.random() * 8}px;
          height: ${6 + Math.random() * 8}px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
          top: -20px;
          left: ${Math.random() * 100}vw;
          z-index: 1000;
          pointer-events: none;
          animation: confettiFall ${3 + Math.random() * 2}s linear forwards;
          --random-x: ${(Math.random() - 0.5) * 150}px;
          --random-rotation: ${Math.random() * 720}deg;
        `;
      }
      
      document.body.appendChild(confetti);
      
      // Remove after animation
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 5000);
    }
    
    // Create floating balloons
    createCelebrationBalloons();
    
    // Add enhanced animation CSS if not already added
    if (!document.querySelector('#celebration-styles')) {
      const style = document.createElement('style');
      style.id = 'celebration-styles';
      style.textContent = `
        @keyframes confettiFall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translateY(50vh) translateX(var(--random-x)) rotate(calc(var(--random-rotation) * 0.5));
            opacity: 0.8;
          }
          100% {
            transform: translateY(100vh) translateX(var(--random-x)) rotate(var(--random-rotation));
            opacity: 0;
          }
        }
        @keyframes petalFall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          25% {
            transform: translateY(25vh) translateX(calc(var(--random-x) * 0.3)) rotate(90deg) scale(1.1);
            opacity: 0.9;
          }
          50% {
            transform: translateY(50vh) translateX(calc(var(--random-x) * 0.7)) rotate(180deg) scale(0.9);
            opacity: 0.7;
          }
          75% {
            transform: translateY(75vh) translateX(var(--random-x)) rotate(270deg) scale(1.05);
            opacity: 0.5;
          }
          100% {
            transform: translateY(100vh) translateX(var(--random-x)) rotate(var(--random-rotation)) scale(0.8);
            opacity: 0;
          }
        }
        @keyframes balloonRise {
          0% {
            transform: translateY(100vh) translateX(0) rotate(0deg);
            opacity: 0.8;
          }
          50% {
            transform: translateY(50vh) translateX(var(--drift-x)) rotate(var(--drift-rotation));
            opacity: 1;
          }
          100% {
            transform: translateY(-50px) translateX(var(--drift-x)) rotate(var(--drift-rotation));
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Create celebration balloons
  function createCelebrationBalloons() {
    const balloonColors = ['#ff8fb3', '#ffd3e3', '#ff9fbd', '#ffa9c6', '#ffc4d6'];
    const balloonCount = 15;
    
    for (let i = 0; i < balloonCount; i++) {
      const balloon = document.createElement('div');
      balloon.style.cssText = `
        position: fixed;
        width: ${20 + Math.random() * 15}px;
        height: ${25 + Math.random() * 18}px;
        background: ${balloonColors[Math.floor(Math.random() * balloonColors.length)]};
        border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
        bottom: -50px;
        left: ${Math.random() * 100}vw;
        z-index: 999;
        pointer-events: none;
        animation: balloonRise ${4 + Math.random() * 3}s ease-out forwards;
        --drift-x: ${(Math.random() - 0.5) * 100}px;
        --drift-rotation: ${(Math.random() - 0.5) * 30}deg;
        animation-delay: ${Math.random() * 2}s;
      `;
      
      // Add balloon string
      const string = document.createElement('div');
      string.style.cssText = `
        position: absolute;
        bottom: -15px;
        left: 50%;
        transform: translateX(-50%);
        width: 1px;
        height: 30px;
        background: rgba(0, 0, 0, 0.3);
      `;
      balloon.appendChild(string);
      
      document.body.appendChild(balloon);
      
      // Remove after animation
      setTimeout(() => {
        if (balloon.parentNode) {
          balloon.parentNode.removeChild(balloon);
        }
      }, 7000);
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

    // Wishes button
    const wishesBtn = document.getElementById('nav-wishes');
    if (wishesBtn) {
      wishesBtn.addEventListener('click', function() {
        showToast('Opening Birthday Wishes 🎈');
        setTimeout(() => {
          window.location.href = 'wishes.html';
        }, 500);
      });
    }

    // Message button
    const messageBtn = document.getElementById('nav-message');
    if (messageBtn) {
      messageBtn.addEventListener('click', function() {
        showToast('Opening Message 💌');
        setTimeout(() => {
          window.location.href = 'letter.html';
        }, 500);
      });
    }
  }

  // Add smooth scroll behavior
  function initSmoothScrolling() {
    document.documentElement.style.scrollBehavior = 'smooth';
  }

  // Add entrance animations
  function initEntranceAnimations() {
    const trackItems = document.querySelectorAll('.track-item');
    
    // Animate tracks on load
    trackItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        item.style.transition = 'all 0.6s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, index * 150);
    });
    
    // Animate balloons on load
    const balloons = document.querySelectorAll('.balloon');
    balloons.forEach((balloon, index) => {
      balloon.style.opacity = '0';
      balloon.style.animationDelay = `${index * 0.1}s`;
      setTimeout(() => {
        balloon.style.opacity = '0.6';
      }, index * 100);
    });
  }

  // Add keyboard navigation
  function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
      // Space bar to play/pause featured track
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        const featuredPlayBtn = document.querySelector('.featured-play');
        if (featuredPlayBtn) {
          featuredPlayBtn.click();
        }
      }
      
      // Number keys to play tracks (1-5)
      if (e.key >= '1' && e.key <= '5') {
        const trackIndex = parseInt(e.key) - 1;
        const playButtons = document.querySelectorAll('.play-btn');
        if (playButtons[trackIndex]) {
          playButtons[trackIndex].click();
        }
      }
    });
  }

  // Initialize all functionality when DOM is loaded
  function init() {
    initTrackMaximize();
    initPlayButtons();
    initHeaderButtons();
    initNavigation();
    initSmoothScrolling();
    initEntranceAnimations();
    initKeyboardNavigation();
    
    // Show welcome message
    setTimeout(() => {
      showToast('🎵 Welcome to your birthday playlist! 🎉');
    }, 1000);
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
