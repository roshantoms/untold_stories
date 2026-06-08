(function() {
  // Helper: show temporary toast message
  function showToast(message) {
    let toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }

  // Build full story URL from story slug
  function getStoryUrl(storySlug) {
    if (storySlug) {
      // Ensure we use the current origin and correct path
      return `${window.location.origin}/stories/${storySlug}.html`;
    }
    return window.location.href;
  }

  // Copy text to clipboard
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast('📋 Link copied to clipboard');
      return true;
    } catch {
      showToast('❌ Could not copy. Press Ctrl+C');
      return false;
    }
  }

  // Share via WhatsApp
  function shareViaWhatsApp(url, title) {
    const text = encodeURIComponent(`📖 "${title}"\n${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  // Share via Instagram (copy link + instruction)
  function shareViaInstagram(url) {
    copyToClipboard(url);
    setTimeout(() => {
      alert('📸 Link copied! Now open Instagram and paste it in your chat.');
    }, 300);
  }

  // Create and show custom share menu near the clicked button
  function showShareMenu(button, storySlug) {
    // Remove any existing menu
    const existingMenu = document.querySelector('.custom-share-menu');
    if (existingMenu) existingMenu.remove();

    const url = getStoryUrl(storySlug);
    const title = document.querySelector('.story-title')?.innerText || 'Untold Stories';

    const menu = document.createElement('div');
    menu.className = 'custom-share-menu';
    menu.innerHTML = `
      <button class="share-option" data-action="copy">📋 Copy Link</button>
      <button class="share-option" data-action="whatsapp">💬 WhatsApp</button>
      <button class="share-option" data-action="instagram">📸 Instagram DM</button>
    `;

    // Position menu near button
    const rect = button.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = `${rect.bottom + window.scrollY + 5}px`;
    menu.style.left = `${rect.left + window.scrollX}px`;
    menu.style.zIndex = '10000';

    document.body.appendChild(menu);

    // Handle option clicks
    const handleClick = (e) => {
      const action = e.currentTarget.getAttribute('data-action');
      if (action === 'copy') {
        copyToClipboard(url);
      } else if (action === 'whatsapp') {
        shareViaWhatsApp(url, title);
      } else if (action === 'instagram') {
        shareViaInstagram(url);
      }
      menu.remove();
      document.removeEventListener('click', outsideClickListener);
    };

    const options = menu.querySelectorAll('.share-option');
    options.forEach(opt => opt.addEventListener('click', handleClick));

    // Click outside to close
    const outsideClickListener = (e) => {
      if (!menu.contains(e.target) && e.target !== button) {
        menu.remove();
        document.removeEventListener('click', outsideClickListener);
      }
    };
    setTimeout(() => {
      document.addEventListener('click', outsideClickListener);
    }, 10);
  }

  // Attach to all share buttons (both on cards and story pages)
  function initShareButtons() {
    document.querySelectorAll('.share-btn, .share-story-btn').forEach(btn => {
      // Remove existing listener to avoid duplicates (for dynamic content)
      btn.removeEventListener('click', shareHandler);
      btn.addEventListener('click', shareHandler);
    });
  }

  function shareHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    const storySlug = this.getAttribute('data-story');
    showShareMenu(this, storySlug);
  }

  // Re-run after DOM changes (for filters etc.)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShareButtons);
  } else {
    initShareButtons();
  }

  // Optional: watch for dynamically added cards (filters don't recreate buttons, but safe)
  const observer = new MutationObserver(() => initShareButtons());
  observer.observe(document.body, { childList: true, subtree: true });
})();