class CsmarinHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._handleOutsideClick = this._handleOutsideClick.bind(this);
    this._applyAdminBarOffset = this._applyAdminBarOffset.bind(this);
  }

  connectedCallback() {
    this.render();
    this.setupEvents();
    this.adjustForAdminBar();
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._handleOutsideClick);
    window.removeEventListener('resize', this._applyAdminBarOffset);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/createmarin/csmarin-header@main/csmarin-header.css">

      <div class="csmarin-header-wrapper">
        <div class="csmarin-cyan-accent"></div>

        <div class="csmarin-capsule-body">
          <button type="button" class="csmarin-gmo-menu-btn" id="csmarinMenuToggle" title="メニュー" aria-haspopup="true" aria-expanded="false">
            <svg viewBox="0 0 24 24">
              <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2ZM6 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>

          <div class="csmarin-ticker-container">
            <div class="csmarin-ticker-text">【お知らせ】クリエイティブスタジオ眞凛 公式ポータルサイト更新中！</div>
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
    this._toggleBtn = this.shadowRoot.getElementById('csmarinMenuToggle');
    this._dropdown = this.shadowRoot.getElementById('csmarinDropdown');

    if (this._toggleBtn && this._dropdown) {
      this._toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = this._dropdown.classList.toggle('is-open');
        this._toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      document.addEventListener('click', this._handleOutsideClick);
    }
  }

  _handleOutsideClick(e) {
    if (!this._dropdown || !this._toggleBtn) return;
    const path = e.composedPath();
    if (!path.includes(this._dropdown) && !path.includes(this._toggleBtn)) {
      this._dropdown.classList.remove('is-open');
      this._toggleBtn.setAttribute('aria-expanded', 'false');
    }
  }

  _applyAdminBarOffset() {
    const isAdminBar = document.body.classList.contains('admin-bar');
    if (!isAdminBar) {
      this.style.setProperty('--admin-bar-offset', '0px');
      return;
    }

    const isMobile = window.innerWidth <= 782;
    const adminBarHeight = isMobile ? 46 : 32;
    this.style.setProperty('--admin-bar-offset', `${adminBarHeight}px`);
  }

  adjustForAdminBar() {
    this._applyAdminBarOffset();
    window.addEventListener('resize', this._applyAdminBarOffset);
  }
}

if (!customElements.get('csmarin-header')) {
  customElements.define('csmarin-header', CsmarinHeader);
}
