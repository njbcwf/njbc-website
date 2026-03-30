/**
 * js/layout.js
 * Injects shared nav and footer into every page automatically.
 * Include this script at the bottom of every HTML page's <body>.
 *
 * Usage: <script src="js/layout.js"></script>
 * Then add <div id="site-nav"></div> at top of body
 * and <div id="site-footer"></div> at bottom of body.
 */

(function () {
  // ── Determine active page for nav highlight ──
  const path = window.location.pathname.split('/').pop() || 'index.html';

  function isActive(href) {
    return path === href ? 'class="active"' : '';
  }

  // ── NAV ──
  const navEl = document.getElementById('site-nav');
  if (navEl) {
    navEl.innerHTML = `
<nav>
  <a href="index.html" class="nav-logo">
    <img src="images/NJBC_Logo_3-26-26.png" alt="New Jerusalem Baptist Church" style="height:48px;width:auto;display:block;" />
    <div class="nav-logo-text">New Jerusalem<span class="nav-logo-sub">Baptist Church</span></div>
  </a>
  <ul class="nav-links">
    <li><a href="index.html" ${isActive('index.html')}>Home</a></li>
    <li><a href="about.html" ${isActive('about.html')}>About</a></li>
    <li><a href="ministries.html" ${isActive('ministries.html')}>Ministries</a></li>
    <li><a href="sermons.html" ${isActive('sermons.html')}>Sermons</a></li>
    <li><a href="events.html" ${isActive('events.html')}>Events</a></li>
    <li><a href="contact.html" ${isActive('contact.html')}>Contact</a></li>
    <li><a href="give.html" class="nav-give">Give</a></li>
  </ul>
  <button class="nav-hamburger" aria-label="Menu" id="hamburger">
    <span></span><span></span><span></span>
  </button>
</nav>
<div class="mobile-menu" id="mobileMenu">
  <a href="index.html">Home</a>
  <a href="about.html">About</a>
  <a href="history.html">History</a>
  <a href="pastor.html">Our Pastor</a>
  <a href="ministries.html">Ministries</a>
  <a href="sermons.html">Sermons</a>
  <a href="events.html">Events</a>
  <a href="gallery.html">Gallery</a>
  <a href="contact.html">Contact</a>
  <a href="join.html">Join Us</a>
  <a href="give.html" style="color:var(--gold);font-weight:600;">Give →</a>
</div>`;

    document.getElementById('hamburger').addEventListener('click', () => {
      document.getElementById('mobileMenu').classList.toggle('open');
    });
  }

  // ── FOOTER ──
  const footerEl = document.getElementById('site-footer');
  if (footerEl) {
    footerEl.innerHTML = `
<footer>
  <div class="footer-inner">
    <div class="footer-brand">
      <img src="images/NJBC_Logo_3-26-26.png" alt="New Jerusalem Baptist Church" style="height:70px;width:auto;display:block;margin-bottom:14px;opacity:0.9;" />
      <strong>New Jerusalem Baptist Church</strong>
      <p>
        1420 Borton St, Wichita Falls, TX 76306<br>
        <a href="tel:9407672067">(940) 767-2067</a> &nbsp;·&nbsp;
        <a href="mailto:NJBCWF@gmail.com">NJBCWF@gmail.com</a>
      </p>
      <div class="social-row">
        <a href="http://www.youtube.com/@NJBCWF" target="_blank" class="social-btn">▶ YouTube</a>
        <a href="https://www.facebook.com/newjerusalembcwftx/" target="_blank" class="social-btn">f Facebook</a>
        <a href="https://twitter.com/njbcyouthwf" target="_blank" class="social-btn">𝕏 Twitter</a>
        <a href="https://www.instagram.com/njbcwfyouth/" target="_blank" class="social-btn">◎ Instagram</a>
      </div>
    </div>
    <div class="footer-col">
      <h4>Explore</h4>
      <ul>
        <li><a href="about.html">About Us</a></li>
        <li><a href="history.html">Our History</a></li>
        <li><a href="pastor.html">Our Pastor</a></li>
        <li><a href="associates.html">Associates</a></li>
        <li><a href="gallery.html">Gallery</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Get Involved</h4>
      <ul>
        <li><a href="ministries.html">Ministries</a></li>
        <li><a href="events.html">Events</a></li>
        <li><a href="sermons.html">Sermons</a></li>
        <li><a href="join.html">Join Us</a></li>
        <li><a href="give.html">Give</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    © 2025 New Jerusalem Baptist Church. All Rights Reserved. &nbsp;·&nbsp;
    9:30 AM Sunday School &nbsp;·&nbsp; 11:00 AM Morning Worship &nbsp;·&nbsp; 7:00 PM Wednesday Bible Study
  </div>
</footer>`;
  }

  // ── Scroll reveal ──
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

})();
