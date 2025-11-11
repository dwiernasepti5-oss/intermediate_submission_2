import Api from '../../data/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getAllStories, saveStoryLocal } from '../../utils/idb';
import { showFormattedDate } from '../../utils/index.js';

const HomePage = {
  async render() {
    const section = document.createElement('section');
    section.classList.add('home-section');
    section.innerHTML = `
      <h1 class="sr-only">Halaman Beranda MStory</h1>
      <h2 class="page-title">Story Map</h2>
      <div class="map-card"><div id="map" class="map-inner"></div></div>
      <h3 class="story-title">Story Update</h3>
      <ul id="storyList" class="story-list"></ul>
    `;
    return section;
  },

  async afterRender() {
    const map = L.map('map').setView([0, 0], 3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    const listContainer = document.getElementById('storyList');

    let stories;
    try {
      const res = await Api.getStories();
      stories = res.listStory || [];
      stories.forEach((s) => saveStoryLocal(s));
    } catch {
      stories = await getAllStories();
    }

    const markers = [];
    stories.forEach((s) => {
      if (!s.lat || !s.lon) return;
      const marker = L.marker([s.lat, s.lon]).addTo(map);
      marker.bindPopup(`<strong>${s.name}</strong><br>${s.description}<br><em>${showFormattedDate(s.createdAt)}</em>`);
      markers.push(marker);
      const li = document.createElement('li');
      li.classList.add('story-card');
      li.innerHTML = `
        <img src="${s.photoUrl}" alt="Foto ${s.name}">
        <div class="story-info">
          <h4>${s.name}</h4>
          <p class="story-date">${showFormattedDate(s.createdAt)}</p>
          <p>${s.description}</p>
        </div>`;
      li.addEventListener('click', () => {
        map.setView([s.lat, s.lon], 8);
        marker.openPopup();
      });
      listContainer.appendChild(li);
    });
    if (markers.length) map.fitBounds(L.featureGroup(markers).getBounds());
  },
};

export default HomePage;
