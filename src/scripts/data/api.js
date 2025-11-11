import { CONFIG } from '../config.js';

const BASE_URL = CONFIG.BASE_URL;

const Api = {
  async login({ email, password }) {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!data.error) localStorage.setItem('user', JSON.stringify(data.loginResult));
    return data;
  },

  async register({ name, email, password }) {
    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return res.json();
  },

  logout() {
    localStorage.removeItem('user');
  },

  getUser() {
    return JSON.parse(localStorage.getItem('user'));
  },

  async getStories() {
    const user = this.getUser();
    const res = await fetch(`${BASE_URL}/stories?location=1`, {
      headers: { Authorization: `Bearer ${user?.token || ''}` },
    });
    return res.json();
  },

  async addStory({ description, photo, lat, lon }) {
    const user = this.getUser();
    const token = user?.token || '';
    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);
    if (lat && lon) {
      formData.append('lat', lat);
      formData.append('lon', lon);
    }
    const res = await fetch(`${BASE_URL}/stories`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return res.json();
  },

  async registerSubscription(subscription) {
    const endpoint = '/push/subscribe';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });
      return res.json();
    } catch {
      return null;
    }
  },
};

export default Api;
