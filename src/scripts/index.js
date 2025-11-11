import App from './pages/app.js';
import '../styles/styles.css';
import Api from './data/api.js';
import { registerServiceWorkerAndSetupPush } from './utils/sw-registration.js';

document.addEventListener('DOMContentLoaded', () => {
  registerServiceWorkerAndSetupPush();
});

const app = new App({
  content: document.querySelector('#mainContent'),
});

window.addEventListener('hashchange', () => {
  app.renderPage();
  updateUserUI();
});

window.addEventListener('load', () => {
  app.renderPage();
  updateUserUI();
});

function updateUserUI() {
  const user = Api.getUser();
  const login = document.getElementById('login-link');
  const register = document.getElementById('register-link');
  const logout = document.getElementById('logout-item');
  const userInfo = document.getElementById('user-info');

  if (user) {
    if (userInfo) {
      userInfo.textContent = `Halo, ${user.name}!`;
      userInfo.style.display = 'inline-block';
    }
    if (login) login.style.display = 'none';
    if (register) register.style.display = 'none';
    if (logout) logout.style.display = 'inline-block';
  } else {
    if (userInfo) userInfo.style.display = 'none';
    if (logout) logout.style.display = 'none';
    if (login) login.style.display = 'inline-block';
    if (register) register.style.display = 'inline-block';
  }

  const btn = document.getElementById('logout-btn');
  if (btn) {
    btn.onclick = () => {
      Api.logout();
      location.hash = '/login';
      updateUserUI();
    };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const drawerButton = document.getElementById('drawer-button');
  const navigationDrawer = document.getElementById('navigation-drawer');

  if (!drawerButton || !navigationDrawer) return;

  drawerButton.addEventListener('click', () => {
    const isOpen = navigationDrawer.classList.toggle('open');
    drawerButton.setAttribute('aria-expanded', isOpen);
  });

  navigationDrawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navigationDrawer.classList.remove('open');
      drawerButton.setAttribute('aria-expanded', 'false');
    });
  });
});

let deferredPrompt;
const installBtn = document.getElementById('installAppBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  if (installBtn) installBtn.style.display = 'inline-block';
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;

    installBtn.style.display = 'none';
    deferredPrompt.prompt();

    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      console.log('Pengguna menerima instalasi aplikasi');
    } else {
      console.log('Pengguna menolak instalasi');
      installBtn.style.display = 'inline-block';
    }
    deferredPrompt = null;
  });
}

window.addEventListener('appinstalled', () => {
  console.log('Aplikasi MStory berhasil diinstal');
  if (installBtn) installBtn.style.display = 'none';
});
