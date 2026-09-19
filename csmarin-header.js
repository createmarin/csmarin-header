class CsmarinHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEvents();
    this.adjustForAdminBar() {
  const applyOffset = () => {
    const isAdminBar = document.body.classList.contains('admin-bar');
    let offset = 0;

    if (isAdminBar) {
      const isMobile = window.innerWidth <= 782;
      offset = isMobile ? 46 : 32;
    }

    // 共通ヘッダー自体の位置調整
    this.style.setProperty('--admin-bar-offset', `${offset}px`);

    // 既存サイトのbodyおよびfixedヘッダーを共通ヘッダー分(42px)押し下げる
    const totalTopMargin = offset + 42;
    document.body.style.paddingTop = `${totalTopMargin}px`;

    // 固定表示されている主要なヘッダー要素を探して位置補正
    const siteHeaders = document.querySelectorAll('header, .site-header, #masthead, .nav-container');
    siteHeaders.forEach(header => {
      const style = window.getComputedStyle(header);
      if (style.position === 'fixed' || style.position === 'sticky') {
        header.style.top = `${totalTopMargin}px`;
      }
    });
  };

  applyOffset();
  window.addEventListener('resize', applyOffset);
}
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          all: initial;
          display: block !important;
          position: fixed !important;
          top: var(--admin-bar-offset, 0px) !important;
          right: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 42px !important;
          z-index: 999999 !important;
          box-sizing: border-box !important;
          transition: top 0.2s ease !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        }

        *, *::before, *::after {
          box-sizing: border-box !important;
        }

        .csmarin-header-wrapper {
          width: 100% !important;
          height: 42px !important;
          background-color: #00bcd4 !important; /* 全幅の水色背景 */
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding-left: 16px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
          pointer-events: auto !important;
          position: relative !important;
        }

        /* 左側：テキストエリア（スクロールなし全文表示） */
        .csmarin-notice-area {
          display: flex !important;
          align-items: center !important;
          overflow: hidden !important;
          padding-right: 12px !important;
        }

        .csmarin-notice-text {
          font-size: 12px !important;
          font-weight: 500 !important;
          color: #ffffff !important;
          text-decoration: none !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          transition: opacity 0.2s !important;
        }

        .csmarin-notice-text:hover {
          opacity: 0.85 !important;
        }

        /* 右側：白カプセル本体（ロゴ・9ドットボタン） */
        .csmarin-capsule-body {
          position: relative !important;
          z-index: 2 !important;
          background-color: #ffffff !important;
          height: 42px !important;
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          padding: 0 16px !important;
          border-bottom-left-radius: 20px !important;
          flex-shrink: 0 !important;
        }

        /* 9点ドットメニューボタン */
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

        /* ロゴ並列エリア */
        .csmarin-logos-group {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }

        .csmarin-gmo-logo-link {
          display: flex !important;
          align-items: center !important;
          text-decoration: none !important;
          flex-shrink: 0 !important;
        }

        .csmarin-csmgroup-logo-img {
          height: 20px !important;
          width: auto !important;
          display: block !important;
        }

        .csmarin-studio-logo-img {
          height: 20px !important;
          width: auto !important;
          display: block !important;
        }

        /* ロゴ間の仕切り線 */
        .csmarin-logo-divider {
          width: 1px !important;
          height: 14px !important;
          background-color: #d0d0d0 !important;
          flex-shrink: 0 !important;
        }

        /* ドロップダウンメニュー */
        .csmarin-gmo-dropdown {
          position: absolute !important;
          top: 46px !important;
          right: 10px !important;
          width: 280px !important;
          background-color: #ffffff !important;
          border: 1px solid #e0e0e0 !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.18) !important;
          padding: 16px !important;
          z-index: 100000 !important;
          text-align: left !important;
          overflow: hidden !important;
          opacity: 0 !important;
          visibility: hidden !important;
          transform: translateY(-15px) scaleY(0.9) !important;
          transform-origin: top right !important;
          transition: transform 0.25s ease, opacity 0.2s ease, visibility 0.25s !important;
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

        /* スマホ対応 */
        @media (max-width: 640px) {
          .csmarin-studio-logo-img {
            display: none !important;
          }
          .csmarin-logo-divider {
            display: none !important;
          }
        }

        @media (max-width: 480px) {
          .csmarin-notice-area {
            display: none !important;
          }
          .csmarin-header-wrapper {
            justify-content: flex-end !important;
            padding-left: 0 !important;
          }
        }
      </style>

      <div class="csmarin-header-wrapper">
        <!-- 左側：全文表示テキスト -->
        <div class="csmarin-notice-area">
          <a href="http://id.csmarin.com/register?subscription_plan=10" class="csmarin-notice-text" target="_blank" rel="noopener">
            CSM-ID会員募集中！ 無料登録で全サービスを快適に利用できます
          </a>
        </div>

        <!-- 右側：白カプセル（9ドットボタン + 併設ロゴ） -->
        <div class="csmarin-capsule-body">
          <button type="button" class="csmarin-gmo-menu-btn" id="csmarinMenuToggle" title="メニュー">
            <svg viewBox="0 0 24 24">
              <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2ZM6 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>

          <div class="csmarin-logos-group">
            <!-- CSMGROUP ロゴ -->
            <a href="https://csmarin.com" class="csmarin-gmo-logo-link" target="_blank" rel="noopener">
              <img src="https://res.cloudinary.com/oq5ci33v/image/upload/f_auto,q_auto/CSMGROUP%E3%83%AD%E3%82%B3%E3%82%99" alt="CSMGROUP" class="csmarin-csmgroup-logo-img">
            </a>

            <div class="csmarin-logo-divider"></div>

            <!-- クリエイティブスタジオ眞凛 ロゴ -->
            <a href="https://csmarin.com" class="csmarin-gmo-logo-link" target="_blank" rel="noopener">
              <img src="https://res.cloudinary.com/oq5ci33v/image/upload/v1789803772/CS%E7%9C%9E%E5%87%9B%E6%96%B0%E3%83%AD%E3%82%B3%E3%82%99%E5%92%8C%E6%96%87%E9%9D%92%E8%B5%A4%E9%80%8F%E9%81%8E.png" alt="クリエイティブスタジオ眞凛" class="csmarin-studio-logo-img">
            </a>
          </div>
        </div>

        <!-- ドロップダウンメニュー -->
        <div class="csmarin-gmo-dropdown" id="csmarinDropdown">
          <div class="csmarin-menu-cyan-shape"></div>
          
          <div class="csmarin-dropdown-content">
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
                <img src="https://res.cloudinary.com/oq5ci33v/image/upload/v1789803771/CSM-ID_%E9%80%8F%E9%81%8E%E3%83%AD%E3%82%B3%E3%82%99.png" alt="CSM-ID" class="csmarin-id-logo">
              </div>
              <div class="csmarin-id-buttons">
                <a href="http://id.csmarin.com/register?subscription_plan=10" class="csmarin-id-btn csmarin-id-btn-register" target="_blank" rel="noopener">会員登録</a>
                <a href="http://id.csmarin.com/login?subscription_plan=10" class="csmarin-id-btn csmarin-id-btn-login" target="_blank" rel="noopener">ログイン</a>
              </div>
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
        this.style.setProperty('--admin-bar-offset', '0px');
        return;
      }

      const isMobile = window.innerWidth <= 782;
      const adminBarHeight = isMobile ? 46 : 32;

      this.style.setProperty('--admin-bar-offset', `${adminBarHeight}px`);
    };

    applyOffset();
    window.addEventListener('resize', applyOffset);
  }
}

customElements.define('csmarin-header', CsmarinHeader);
