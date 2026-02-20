/* ════════════════════════════════════════════════════════════════
   CASHPOINT CUSTOM MODAL SYSTEM
   Drop-in replacement for SweetAlert2 with native Cashpoint styling
   ════════════════════════════════════════════════════════════════

   USAGE — Replace this line:
     <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

   With this:
     <script src="cashpoint-modal.js"></script>

   Then all your Swal.fire() calls work exactly the same!

   ════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  /* ── Inject CSS into page ── */
  const style = document.createElement('style');
  style.textContent = `
    /* Modal Overlay */
    .cp-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(13, 27, 62, 0.65);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      padding: 1rem;
    }
    .cp-modal-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    /* Modal Box */
    .cp-modal {
      background: white;
      border-radius: 24px;
      padding: 36px;
      max-width: 440px;
      width: 100%;
      box-shadow: 0 30px 90px rgba(13, 27, 62, 0.25);
      transform: scale(0.92) translateY(20px);
      transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      text-align: center;
      position: relative;
    }
    .cp-modal-overlay.active .cp-modal {
      transform: scale(1) translateY(0);
    }

    /* Close Button */
    .cp-modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: #F0F4FF;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: #6B7A99;
      transition: all 0.2s;
    }
    .cp-modal-close:hover {
      background: #D8E0F0;
      color: #0D1B3E;
    }

    /* Icon */
    .cp-modal-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      margin: 0 auto 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      animation: bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .cp-modal-icon.success {
      background: linear-gradient(135deg, #E8FFF6, #D0F5E8);
      color: #00C48C;
    }
    .cp-modal-icon.error {
      background: linear-gradient(135deg, #FFF0F3, #FFE0E6);
      color: #FF4D6D;
    }
    .cp-modal-icon.warning {
      background: linear-gradient(135deg, #FFF8E8, #FFEDD0);
      color: #FFB800;
    }
    .cp-modal-icon.info {
      background: linear-gradient(135deg, #E8F0FF, #D0E0FF);
      color: #0052FF;
    }
    .cp-modal-icon.question {
      background: linear-gradient(135deg, #F3EFFF, #E6DDFF);
      color: #7C3AED;
    }

    @keyframes bounceIn {
      0% { opacity: 0; transform: scale(0.3); }
      50% { transform: scale(1.05); }
      70% { transform: scale(0.9); }
      100% { opacity: 1; transform: scale(1); }
    }

    /* Title */
    .cp-modal-title {
      font-family: 'Sora', 'DM Sans', sans-serif;
      font-size: 22px;
      font-weight: 800;
      color: #0D1B3E;
      margin-bottom: 12px;
      line-height: 1.3;
    }

    /* Text */
    .cp-modal-text {
      font-size: 14px;
      color: #6B7A99;
      line-height: 1.6;
      margin-bottom: 24px;
    }

    /* HTML content */
    .cp-modal-html {
      margin-bottom: 24px;
    }

    /* Input */
    .cp-modal-input {
      width: 100%;
      padding: 12px 16px;
      background: #F0F4FF;
      border: 2px solid #D8E0F0;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      font-family: inherit;
      color: #0D1B3E;
      margin-bottom: 24px;
      transition: border-color 0.3s;
      outline: none;
    }
    .cp-modal-input:focus {
      border-color: #0052FF;
      background: white;
    }
    .cp-modal-input::placeholder {
      color: #9CA8C0;
    }

    /* Textarea */
    .cp-modal-textarea {
      width: 100%;
      padding: 12px 16px;
      background: #F0F4FF;
      border: 2px solid #D8E0F0;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      color: #0D1B3E;
      margin-bottom: 24px;
      transition: border-color 0.3s;
      outline: none;
      resize: vertical;
      min-height: 80px;
    }
    .cp-modal-textarea:focus {
      border-color: #0052FF;
      background: white;
    }

    /* Buttons */
    .cp-modal-buttons {
      display: flex;
      gap: 12px;
    }
    .cp-modal-btn {
      flex: 1;
      padding: 13px 20px;
      border-radius: 12px;
      border: none;
      font-size: 14px;
      font-weight: 700;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s;
    }
    .cp-modal-btn-cancel {
      background: #F0F4FF;
      color: #6B7A99;
      border: 1.5px solid #D8E0F0;
    }
    .cp-modal-btn-cancel:hover {
      background: #D8E0F0;
    }
    .cp-modal-btn-confirm {
      background: #0052FF;
      color: white;
    }
    .cp-modal-btn-confirm:hover {
      background: #0038B8;
      transform: translateY(-2px);
      box-shadow: 0 5px 18px rgba(0, 82, 255, 0.4);
    }
    .cp-modal-btn-confirm:active {
      transform: translateY(0);
    }

    /* Loading spinner */
    .cp-modal-loading {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-right: 8px;
      vertical-align: middle;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Timer progress bar */
    .cp-modal-timer {
      height: 4px;
      background: #F0F4FF;
      border-radius: 99px;
      overflow: hidden;
      margin-top: 20px;
    }
    .cp-modal-timer-fill {
      height: 100%;
      background: linear-gradient(90deg, #0052FF, #00D4A0);
      border-radius: 99px;
      width: 100%;
      transition: width linear;
    }

    /* Responsive */
    @media (max-width: 480px) {
      .cp-modal {
        padding: 28px 24px;
        border-radius: 20px;
      }
      .cp-modal-title {
        font-size: 19px;
      }
      .cp-modal-buttons {
        flex-direction: column;
      }
    }
  `;
  document.head.appendChild(style);

  /* ══════════════════════════════════════════════════════════════
     MODAL MANAGER
     ══════════════════════════════════════════════════════════════ */

  let activeModal = null;
  let modalResolve = null;

  const iconMap = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    question: '❓'
  };

  function closeModal(result = { isConfirmed: false, isDismissed: true, value: null }) {
    if (!activeModal) return;
    activeModal.classList.remove('active');
    setTimeout(() => {
      if (activeModal) activeModal.remove();
      activeModal = null;
    }, 300);
    if (modalResolve) {
      modalResolve(result);
      modalResolve = null;
    }
  }

  function fire(options = {}) {
    return new Promise((resolve) => {
      /* Close any existing modal */
      if (activeModal) closeModal();

      modalResolve = resolve;

      const {
        icon,
        title = '',
        text = '',
        html = '',
        input,
        inputPlaceholder = '',
        inputValue = '',
        showCancelButton = false,
        showConfirmButton = true,
        confirmButtonText = 'OK',
        cancelButtonText = 'Cancel',
        confirmButtonColor = '#0052FF',
        allowOutsideClick = true,
        timer = null,
        timerProgressBar = false,
        didOpen,
        showCloseButton = false
      } = options;

      /* Build modal */
      const overlay = document.createElement('div');
      overlay.className = 'cp-modal-overlay';

      const modal = document.createElement('div');
      modal.className = 'cp-modal';

      let modalHTML = '';

      /* Close button */
      if (showCloseButton) {
        modalHTML += `<button class="cp-modal-close" onclick="window.Swal._closeCurrent()">×</button>`;
      }

      /* Icon */
      if (icon) {
        modalHTML += `<div class="cp-modal-icon ${icon}">${iconMap[icon] || icon}</div>`;
      }

      /* Title */
      if (title) {
        modalHTML += `<div class="cp-modal-title">${title}</div>`;
      }

      /* Text or HTML */
      if (html) {
        modalHTML += `<div class="cp-modal-html">${html}</div>`;
      } else if (text) {
        modalHTML += `<div class="cp-modal-text">${text}</div>`;
      }

      /* Input */
      if (input === 'text') {
        modalHTML += `<input type="text" class="cp-modal-input" placeholder="${inputPlaceholder}" value="${inputValue}"/>`;
      } else if (input === 'textarea') {
        modalHTML += `<textarea class="cp-modal-textarea" placeholder="${inputPlaceholder}">${inputValue}</textarea>`;
      }

      /* Buttons */
      if (showConfirmButton || showCancelButton) {
        modalHTML += '<div class="cp-modal-buttons">';
        if (showCancelButton) {
          modalHTML += `<button class="cp-modal-btn cp-modal-btn-cancel" data-action="cancel">${cancelButtonText}</button>`;
        }
        if (showConfirmButton) {
          modalHTML += `<button class="cp-modal-btn cp-modal-btn-confirm" data-action="confirm" style="background:${confirmButtonColor}">${confirmButtonText}</button>`;
        }
        modalHTML += '</div>';
      }

      /* Timer progress bar */
      if (timer && timerProgressBar) {
        modalHTML += '<div class="cp-modal-timer"><div class="cp-modal-timer-fill"></div></div>';
      }

      modal.innerHTML = modalHTML;
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
      activeModal = overlay;

      /* Show modal */
      setTimeout(() => overlay.classList.add('active'), 10);

      /* Handle button clicks */
      const confirmBtn = modal.querySelector('[data-action="confirm"]');
      const cancelBtn = modal.querySelector('[data-action="cancel"]');
      const inputEl = modal.querySelector('.cp-modal-input, .cp-modal-textarea');

      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
          const value = inputEl ? inputEl.value : null;
          closeModal({ isConfirmed: true, isDismissed: false, isDenied: false, value });
        });
      }

      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          closeModal({ isConfirmed: false, isDismissed: true, isDenied: true, value: null });
        });
      }

      /* Allow outside click to close */
      if (allowOutsideClick) {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) {
            closeModal({ isConfirmed: false, isDismissed: true, value: null });
          }
        });
      }

      /* Auto-close timer */
      if (timer) {
        const timerFill = modal.querySelector('.cp-modal-timer-fill');
        if (timerFill) {
          timerFill.style.transition = `width ${timer}ms linear`;
          setTimeout(() => timerFill.style.width = '0%', 10);
        }
        setTimeout(() => {
          closeModal({ isConfirmed: false, isDismissed: true, value: null });
        }, timer);
      }

      /* didOpen callback */
      if (typeof didOpen === 'function') {
        didOpen();
      }

      /* Focus input if present */
      if (inputEl) {
        setTimeout(() => inputEl.focus(), 350);
      }
    });
  }

  function showLoading() {
    const confirmBtn = activeModal?.querySelector('[data-action="confirm"]');
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = `<span class="cp-modal-loading"></span>${confirmBtn.textContent}`;
    }
  }

  function close() {
    closeModal({ isConfirmed: false, isDismissed: true, value: null });
  }

  /* ══════════════════════════════════════════════════════════════
     EXPOSE AS window.Swal
     ══════════════════════════════════════════════════════════════ */

  window.Swal = {
    fire,
    showLoading,
    close,
    _closeCurrent: () => closeModal()
  };

})();
