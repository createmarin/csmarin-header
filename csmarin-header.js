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
          left: 0;
          width: 100%;
          height: 40px;
          z-index: 99999;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          box-sizing: border-box;
          transition: top 0.2s ease;
        }

        /* ヘッダー全体（左：シアン背景） */
        .csmarin-gmo-bar {
          width: 100%;
          height: 100%;
          background-color: #00bcd4;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        /* 左側：CSM-ID案内エリア */
        .csmarin-left-promo {
          display: flex;
          align-items: center;
          padding-left: 16px;
          color: #ffffff;
          font-weight: bold;
          font-size: 14px;
          letter-spacing: 0.5px;
          white-space: nowrap;
          z-index: 1;
        }

        .csmarin-promo-link {
          color: #ffffff;
          text-decoration: none;
          display: flex;
          align-items: center;
        }

        .csmarin-promo-link:hover {
          opacity: 0.9;
        }

        /* 右側：白い斜めカットエリア */
        .csmarin-right-capsule {
          position: relative;
          height: 100%;
          background-color: #ffffff;
          display: flex;
          align-items: center;
          gap: 12px;
          padding-left: 35px;
          padding-right: 16px;
          /* 左側を斜めにカット */
          clip-path: polygon(25px 0, 100% 0, 100% 100%, 0 100%);
          z-index: 2;
        }

        /* 9つの点ボタン */
        .csmarin-gmo-menu-btn {
          background: none;
          border: none;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 4px;
          cursor: pointer;
          flex-shrink: 0;
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

        /* ロゴ画像 */
        .csmarin-gmo-logo-link {
          display: flex;
          align-items: center;
          text-decoration: none;
          flex-shrink: 0;
        }

        .csmarin-gmo-logo-img {
          height: 22px;
          width: auto;
          display: block;
        }

        /* ドロップダウンメニュー */
        .csmarin-gmo-dropdown {
          position: absolute;
          top: 44px;
          right: 10px;
          width: 280px;
          background-color: #ffffff;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.18);
          padding: 16px;
          z-index: 100000;
          box-sizing: border-box;
          text-align: left;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: transform 0.25s ease, opacity 0.25s ease, visibility 0.25s;
        }

        .csmarin-gmo-dropdown.is-open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
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
          padding: 5px 8px;
          border-radius: 4px;
          transition: background-color 0.2s, color 0.2s;
        }

        .csmarin-menu-link:hover {
          background-color: rgba(0, 188, 212, 0.08);
          color: #00bcd4;
        }

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

        /* スマホ対応 */
        @media (max-width: 520px) {
          .csmarin-left-promo {
            font-size: 12px;
            padding-left: 10px;
          }
          .csmarin-right-capsule {
            padding-left: 25px;
            padding-right: 10px;
            clip-path: polygon(18px 0, 100% 0, 100% 100%, 0 100%);
          }
        }
      </style>

      <div class="csmarin-gmo-bar">
        <!-- 左側：告知エリア -->
        <div class="csmarin-left-promo">
          <a href="http://id.csmarin.com/register?subscription_plan=10" class="csmarin-promo-link" target="_blank" rel="noopener">
            CSM-ID会員募集中！
          </a>
        </div>

        <!-- 右側：切り欠き白い背景＆メニュー・ロゴ -->
        <div class="csmarin-right-capsule">
          <button type="button" class="csmarin-gmo-menu-btn" id="csmarinMenuToggle" title="メニュー">
            <svg viewBox="0 0 24 24">
              <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2ZM6 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>

          <a href="https://csmarin.com" class="csmarin-gmo-logo-link" target="_blank" rel="noopener">
            <img src="https://www.csmarin.com/wp-content/uploads/2026/07/2e829f0c8f9b320a47abad92cf59bc56.png" alt="クリエイティブスタジオ眞凛" class="csmarin-gmo-logo-img">
          </a>
        </div>

        <!-- ドロップダウンメニュー -->
        <div class="csmarin-gmo-dropdown" id="csmarinDropdown">
          <div class="csmarin-menu-section">
            <div class="csmarin-menu-title">メディア</div>
            <a href="https://bilog.csmarin.com" class="csmarin-menu-link" target="_blank" rel="noopener">Bilog</a>
            <a href="https://www.youtube.com/@csmarin_kosiki" class="csmarin-menu-link" target="_blank" rel="noopener">公式YouTube</a>
            <a href="https://x.com/csmarin_kosiki" class="csmarin-menu-link" target="_blank" rel="noopener">公式X (@csmarin_kosiki)</a>
            <a href="https://www.youtube.com/channel/UCrN8T2picalcO4oajrPcUkg" class="csmarin-menu-link" target="_blank" rel="noopener">眞凛CREATECHANNEL</a>
          </div>

          <div class="csmarin-menu-section">
            <div class="csmarin-menu-title">ストア</div>
            <a href="https://csmarin.stores.jp" class="csmarin-menu-link" target="_blank" rel="noopener">ストア</a>
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
