// Lightweight confetti + heart particles + interactions
(function () {
  const $ = (sel) => document.querySelector(sel);
  const toastTemplate = $('#toast-template');

  function showToast(message) {
    if (!toastTemplate) return;
    const node = toastTemplate.content.firstElementChild.cloneNode(true);
    node.textContent = message;
    document.body.appendChild(node);
    setTimeout(() => node.remove(), 2800);
  }

  // Removed cross-page return notice; toasts are shown before navigation on source pages

  // Confetti
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  const colors = ['#ff8fb3', '#ffd3e3', '#ff9fbd', '#ffa9c6', '#ffc4d6'];
  let particles = [];
  let animationId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function createParticles(count) {
    const twoPi = Math.PI * 2;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20,
        r: 4 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: 2 + Math.random() * 3.5,
        vx: -1 + Math.random() * 2,
        rot: Math.random() * twoPi,
        vr: -0.1 + Math.random() * 0.2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(-p.r, 0);
      ctx.lineTo(0, -p.r * 0.6);
      ctx.lineTo(p.r, 0);
      ctx.lineTo(0, p.r * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
    particles = particles.filter((p) => p.y < canvas.height + 30);
    if (particles.length > 0) {
      animationId = requestAnimationFrame(draw);
    } else {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  function launchConfetti() {
    createParticles(150);
    if (!animationId) draw();
  }

  // Heart particles
  function createHeartParticles(buttonElement) {
    const rect = buttonElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const heartCount = 8;
    const heartColors = ['#ff69b4', '#ff1493', '#ff6b9d', '#ff8fb3', '#ffb3d1'];
    
    for (let i = 0; i < heartCount; i++) {
      const heart = document.createElement('div');
      heart.className = 'heart-particle';
      heart.innerHTML = '❤️';
      
      // Random direction and speed
      const angle = (i / heartCount) * Math.PI * 2;
      const speed = 80 + Math.random() * 40;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed - 30; // slight upward bias
      
      heart.style.cssText = `
        position: fixed;
        left: ${centerX}px;
        top: ${centerY}px;
        font-size: 16px;
        pointer-events: none;
        z-index: 200;
        animation: heartFloat 1.5s ease-out forwards;
        --vx: ${vx}px;
        --vy: ${vy}px;
      `;
      
      document.body.appendChild(heart);
      
      // Remove after animation
      setTimeout(() => heart.remove(), 1500);
    }
  }

  // Add heart animation CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes heartFloat {
      0% {
        transform: translate(0, 0) scale(0) rotate(0deg);
        opacity: 1;
      }
      50% {
        transform: translate(var(--vx), var(--vy)) scale(1) rotate(180deg);
        opacity: 0.8;
      }
      100% {
        transform: translate(calc(var(--vx) * 1.5), calc(var(--vy) * 1.5)) scale(0.3) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Button bindings with heart particles
  const actions = [
    ['#btn-gallery', 'Opening Memories Gallery 🖼️'],
    ['#btn-message', 'Opening Message 💌'],
    ['#btn-music', 'Opening Playlist 🎵']
  ];
  
  actions.forEach(([sel, msg]) => {
    const el = $(sel);
    if (el) {
      el.addEventListener('click', (e) => {
        createHeartParticles(e.target);
        showToast(msg);
      });
    }
  });

  // Special handling for Birthday Wishes button - redirect to wishes page
  const wishesBtn = $('#btn-wishes');
  if (wishesBtn) {
    wishesBtn.addEventListener('click', (e) => {
      createHeartParticles(e.target);
      showToast('Opening Birthday Wishes ✨');
      
      // Add a small delay for the animation to show, then redirect
      setTimeout(() => {
        window.location.href = 'wishes.html';
      }, 800);
    });
  }

  // Message button - redirect to letter page
  const messageBtn = $('#btn-message');
  if (messageBtn) {
    messageBtn.addEventListener('click', (e) => {
      createHeartParticles(e.target);
      showToast('Opening Message 💌');
      setTimeout(() => {
        window.location.href = 'letter.html';
      }, 800);
    });
  }

  // Music button - redirect to playlist page
  const musicBtn = $('#btn-music');
  if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
      createHeartParticles(e.target);
      showToast('Opening Playlist 🎵');
      setTimeout(() => {
        window.location.href = 'playlist.html';
      }, 800);
    });
  }

  // Surprise buttons (confetti + balloons + hearts)
  ['#btn-surprise-bottom'].forEach((sel) => {
    const el = $(sel);
    if (el) el.addEventListener('click', (e) => {
      launchConfetti();
      createHeartParticles(e.target);
      showToast('Surprise launched! 🎉🎈❤️');
    });
  });

})();
