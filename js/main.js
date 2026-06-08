(function() {
  // Filter stories on landing page
  const filterBtns = document.querySelectorAll('.filter-btn');
  const storyCards = document.querySelectorAll('.story-card');
  if (filterBtns.length) {
    function filterStories(category) {
      storyCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.closest('.story-card-link').style.display = '';
        } else {
          card.closest('.story-card-link').style.display = 'none';
        }
      });
    }
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterStories(btn.getAttribute('data-filter'));
      });
    });
  }
  // Smooth scroll to stories
  const exploreBtn = document.getElementById('exploreStoriesBtn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      document.getElementById('storiesSection').scrollIntoView({ behavior: 'smooth' });
    });
  }
  
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    for(let i=0;i<60;i++) {
      let particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = Math.random() * 3 + 1 + 'px';
      particle.style.height = particle.style.width;
      particle.style.background = i % 2 === 0 ? '#ff6b9d' : '#4a90e2';
      particle.style.opacity = Math.random() * 0.5;
      particle.style.borderRadius = '50%';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.pointerEvents = 'none';
      particle.style.animation = `float ${Math.random() * 20 + 10}s infinite ease-in-out`;
      heroBg.appendChild(particle);
    }
    
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }`;
    document.head.appendChild(styleSheet);
  }
  
  const progressBar = document.getElementById('readingProgress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    });
  }
  // IntersectionObserver for side images reveal
  const revealImages = document.querySelectorAll('.story-side img');
  if (revealImages.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    revealImages.forEach(img => observer.observe(img));
  }
})();