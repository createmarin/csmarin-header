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
          display: block;
          position: fixed;
          top: 0;
          right: 0;
          left: 0;
          height: 0;
          z-index: 99999;
          box-sizing: border-box;
          transition: top 0.2s ease;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        /* 右上固定のコンテナ */
        .csmarin-header-wrapper {
          position: absolute;
          top: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          pointer-events: auto;
        }

        /* 水色のアクセントライン（背面に配置） */
        .csmarin-cyan-accent {
          position: absolute;
          top: 0;
          right: 0;
          height: 48px;
          width: 260px;
          background-color: #00bcd4;
          border-bottom-left-radius: 28px;
          z-index: 1;
        }

        /* 白色カプセル本体 */
        .csmarin-capsule-body {
          position: relative;
          z-index: 2;
          background-color: #ffffff;
          height: 42px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 16px 0 20px;
          border-bottom-left-radius: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        /* 9つの点ボタン */
        .csmarin-gmo-menu-btn {
          background: none;
          border: none;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .csmarin-gmo-menu-btn:hover {
          background-color: #f0f0f0;
        }

        .csmarin-gmo-menu-btn svg {
          width: 18px;
          height: 18px;
          fill: #00bcd4;
        }

        /* ドロップダウンパネル */
        .csmarin-gmo-dropdown {
          display: none;
          position: absolute;
          top: 48px;
          right: 10px;
          width: 280px;
          background-color: #ffffff;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
          padding: 15px;
          z-index: 100000;
          box-sizing: border-box;
          text-align: left;
        }

        .csmarin-gmo-dropdown.is-open {
          display: block;
        }

        .csmarin-menu-section {
          margin-bottom: 12px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }

        .csmarin-menu-section:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .csmarin-menu-title {
          font-size: 11px;
          font-weight: bold;
          color: #888888;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .csmarin-menu-link {
          display: block;
          font-size: 13px;
          color: #333333;
          text-decoration: none;
          padding: 4px 6px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .csmarin-menu-link:hover {
          background-color: #f5f5f5;
          color: #00bcd4;
        }

        /* CSM-IDエリア */
        .csmarin-id-section {
          background-color: #f9f9f9;
          padding: 10px;
          border-radius: 6px;
        }

        .csmarin-id-header {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }

        .csmarin-id-logo {
          height: 20px;
          width: auto;
          display: block;
        }

        .csmarin-id-buttons {
          display: flex;
          gap: 8px;
        }

        .csmarin-id-btn {
          flex: 1;
          text-align: center;
          font-size: 12px;
          padding: 6px 0;
          border-radius: 4px;
          text-decoration: none;
          font-weight: bold;
          transition: opacity 0.2s;
        }

        .csmarin-id-btn-register {
          background-color: #00bcd4;
          color: #ffffff;
        }

        .csmarin-id-btn-login {
          background-color: #e0e0e0;
          color: #333333;
        }

        .csmarin-id-btn:hover {
          opacity: 0.85;
        }

        /* ロゴ画像 */
        .csmarin-gmo-logo-link {
          display: flex;
          align-items: center;
          text-decoration: none;
        }

        .csmarin-gmo-logo-img {
          height: 22px;
          width: auto;
          display: block;
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

          <div class="csmarin-gmo-dropdown" id="csmarinDropdown">
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

customElements.define('csmarin-header', CsmarinHeader);
