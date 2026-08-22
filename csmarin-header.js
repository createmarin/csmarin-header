class CsmarinHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEvents();
    this.adjustForAdminBar();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          all: initial;
          display: block !important;
          position: fixed !important;
          top: 0 !important;
          right: 0 !important;
          left: 0 !important;
          height: 0 !important;
          z-index: 999999 !important;
          box-sizing: border-box !important;
          transition: top 0.2s ease !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        }

        .csmarin-header-wrapper {
          position: absolute !important;
          top: 0 !important;
          right: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: flex-end !important;
          pointer-events: auto !important;
          box-sizing: border-box !important;
        }

        .csmarin-cyan-accent {
          position: absolute !important;
          top: 0 !important;
          right: 0 !important;
          height: 48px !important;
          width: 460px !important;
          background-color: #00bcd4 !important;
          border-bottom-left-radius: 28px !important;
          z-index: 1 !important;
        }

        .csmarin-capsule-body {
          position: relative !important;
          z-index: 2 !important;
          background-color: #ffffff !important;
          height: 42px !important;
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          padding: 0 14px !important;
          border-bottom-left-radius: 24px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
          box-sizing: border-box !important;
        }

        .csmarin-gmo-menu-btn {
          background: none !important;
          border: none !important;
          padding: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 24px !important;
          height: 24px !important;
          border-radius: 4px !important;
          cursor: pointer !important;
          flex-shrink: 0 !important;
          transition: background-color 0.2s !important;
        }

        .csmarin-gmo-menu-btn:hover {
          background-color: #f0f0f0 !important;
        }

        .csmarin-gmo-menu-btn svg {
          width: 18px !important;
          height: 18px !important;
          fill: #00bcd4 !important;
          display: block !important;
        }

        /* テロップ枠（強制サイズ & 表示固定） */
        .csmarin-ticker-container {
          width: 180px !important;
          min-width: 180px !important;
          max-width: 180px !important;
          height: 24px !important;
          overflow: hidden !important;
          position: relative !important;
          display: flex !important;
          align-items: center !important;
          background-color: #f0f0f0 !important;
          border: 1px solid #e0e0e0 !important;
          border-radius: 12px !important;
          padding: 0 6px !important;
          box-sizing: border-box !important;
          flex-shrink: 0 !important;
        }

        .csmarin-ticker-text {
          display: inline-block !important;
          white-space: nowrap !important;
          font-size: 11px !important;
          line-height: 24px !important;
          font-weight: 500 !important;
          color: #333333 !important;
          padding-left: 100% !important;
          animation: csmarin-scroll-text 12s linear infinite !important;
        }

        .csmarin-ticker-container:hover .csmarin-ticker-text {
          animation-play-state: paused !important;
        }

        @keyframes csmarin-scroll-text {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-100%, 0, 0);
          }
        }

        /* ドロップダウンメニュー */
        .csmarin-gmo-dropdown {
          position: absolute !important;
          top: 44px !important;
          right: 10px !important;
          width: 280px !important;
          background-color: #ffffff !important;
          border: 1px solid #e0e0e0 !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.18) !important;
          padding: 16px !important;
          z-index: 100000 !important;
          box-sizing: border-box !important;
          text-align: left !important;
          overflow: hidden !important;
          opacity: 0 !important;
          visibility: hidden !important;
          transform: translateY(-20px) scaleY(0.85) !important;
          transform-origin: top right !important;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), 
                      opacity 0.25s ease, 
                      visibility 0.35s !important;
        }

        .csmarin-gmo-dropdown.is-open {
          opacity: 1 !important;
          visibility: visible !important;
          transform: translateY(0) scaleY(1) !important;
        }

        .csmarin-menu-cyan-shape {
          position: absolute !important;
          top: -15px !important;
          right: -20px !important;
          width: 120px !important;
          height: 50px !important;
          background-color: #00bcd4 !important;
          border-bottom-left-radius: 50px !important;
          opacity: 0.85 !important;
          pointer-events: none !important;
          z-index: 0 !important;
        }

        .csmarin-dropdown-content {
          position: relative !important;
          z-index: 1 !important;
        }

        .csmarin-menu-section {
          margin-bottom: 12px !important;
          padding-bottom: 10px !important;
          border-bottom: 1px solid #eee !important;
        }

        .csmarin-menu-section:last-child {
          margin-bottom: 0 !important;
          padding-bottom: 0 !important;
          border-bottom: none !important;
        }

        .csmarin-menu-title {
          font-size: 11px !important;
          font-weight: bold !important;
          color: #888888 !important;
          margin-bottom: 6px !important;
          text-transform: uppercase !important;
        }

        .csmarin-menu-link {
          display: block !important;
          font-size: 13px !important;
          color: #333333 !important;
          text-decoration: none !important;
          padding: 5px 8px !important;
          border-radius: 4px !important;
          transition: background-color 0.2s, color 0.2s !important;
        }

        .csmarin-menu-link:hover {
          background-color: rgba(0, 188, 212, 0.08) !important;
          color: #00bcd4 !important;
        }

        .csmarin-id-section {
          background-color: #f9f9f9 !important;
          padding: 10px !important;
          border-radius: 6px !important;
        }

        .csmarin-id-header {
          display: flex !important;
          align-items: center !important;
          margin-bottom: 8px !important;
        }

        .csmarin-id-logo {
          height: 20px !important;
          width: auto !important;
          display: block !important;
        }

        .csmarin-id-buttons {
          display: flex !important;
          gap: 8px !important;
        }

        .csmarin-id-btn {
          flex: 1 !important;
          text-align: center !important;
          font-size: 12px !important;
          padding: 6px 0 !important;
          border-radius: 4px !important;
          text-decoration: none !important;
          font-weight: bold !important;
          transition: opacity 0.2s !important;
        }

        .csmarin-id-btn-register {
          background-color: #00bcd4 !important;
          color: #ffffff !important;
        }

        .csmarin-id-btn-login {
          background-color: #e0e0e0 !important;
          color: #333333 !important;
        }

        .csmarin-id-btn:hover {
          opacity: 0.85 !important;
        }

        .csmarin-gmo-logo-link {
          display: flex !important;
          align-items: center !important;
          text-decoration: none !important;
          flex-shrink: 0 !important;
        }

        .csmarin-gmo-logo-img {
          height: 22px !important;
          width: auto !important;
          display: block !important;
        }

        @media (max-width: 480px) {
          .csmarin-ticker-container {
            display: none !important;
          }
          .csmarin-cyan-accent {
            width: 260px !important;
          }
        }
      </style>

      <div class="csmarin-header-wrapper">
        <div class="csmarin-cyan-accent"></div>

        <div class="csmarin-capsule-body">
          <button type="button" class="csmarin-gmo-menu-btn" id="csmarinMenuToggle" title="メニュー">
            <svg viewBox="0 0 24 24">
              <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2ZM6 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>

          <div class="csmarin-ticker-container">
            <span class="csmarin-ticker-text">【お知らせ】クリエイティブスタジオ眞凛 公式ポータルサイト更新中！</span>
          </div>

          <div class="csmarin-gmo-dropdown" id="csmarinDropdown">
            <div class="csmarin-menu-cyan-shape"></div>

            <div class="csmarin-dropdown-content">
              <div class="csmarin-menu-section">
                <div class="csmarin-menu-title">メディア</div>
                <a href="https://www.csmarin.shop" class="csmarin-menu-link" target="_blank" rel="noopener">×ブログ</a>
                <a href="https://www.youtube.com/@csmarin_kosiki" class="csmarin-menu-link" target="_blank" rel="noopener">公式YouTube</a>
                <a href="https://x.com/csmarin_kosiki" class="csmarin-menu-link" target="_blank" rel="noopener">公式Twitter</a>
                <a href="https://www.youtube.com/channel/UCrN8T2picalcO4oajrPcUkg" class="csmarin-menu-link" target="_blank" rel="noopener">眞凛CREATECHANNEL</a>
              </div>

              <div class="csmarin-menu-section">
                <div class="csmarin-menu-title">ストア</div>
                <a href="https://csmarin.stores.jp" class="csmarin-menu-link" target="_blank" rel="noopener">×ストア</a>
              </div>

              <div class="csmarin-menu-section csmarin-id-section">
                <div class="csmarin-id-header">
                  <img src="http://id.csmarin.com/wp-content/uploads/2026/07/CSM-ID-%E9%80%8F%E9%81%8E%E3%83%AD%E3%82%B4.png" alt="CSM-ID" class="csmarin-id-logo">
                </div>
                <div class="csmarin-id-buttons">
                  <a href="http://id.csmarin.com/register?subscription_plan=10" class="csmarin-id-btn csmarin-id-btn-register" target="_blank" rel="noopener">会員登録</a>
                  <a href="http://id.csmarin.com/login?subscription_plan=10" class="csmarin-id-btn csmarin-id-btn-login" target="_blank" rel="noopener">ログイン</a>
                </div>
              </div>
            </div>
          </div>

          <a href="https://csmarin.com" class="csmarin-gmo-logo-link" target="_blank" rel="noopener">
            <img src="https://www.csmarin.com/wp-content/uploads/2026/07/2e829f0c8f9b320a47abad92cf59bc56.png" alt="クリエイティブスタジオ眞凛" class="csmarin-gmo-logo-img">
          </a>
        </div>
      </div>
    `;
  }

  setupEvents() {
    const toggleBtn = this.shadowRoot.getElementById('csmarinMenuToggle');
    const dropdown = this.shadowRoot.getElementById('csmarinDropdown');

    if (toggleBtn && dropdown) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('is-open');
      });

      document.addEventListener('click', (e) => {
        if (!e.composedPath().includes(dropdown) && !e.composedPath().includes(toggleBtn)) {
          dropdown.classList.remove('is-open');
        }
      });
    }
  }

  adjustForAdminBar() {
    const applyOffset = () => {
      const isAdminBar = document.body.classList.contains('admin-bar');
      if (!isAdminBar) {
        this.style.top = '0px';
        return;
      }

      const isMobile = window.innerWidth <= 782;
      const adminBarHeight = isMobile ? 46 : 32;

      this.style.top = `${adminBarHeight}px`;
    };

    applyOffset();
    window.addEventListener('resize', applyOffset);
  }
}

if (!customElements.get('csmarin-header')) {
  customElements.define('csmarin-header', CsmarinHeader);
}
