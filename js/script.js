// ============================================================
// Spa en Casa — interacciones: menú móvil + reproductor de videos
// ============================================================

// ---------- Menú móvil ----------
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------- Miniaturas de YouTube ----------
// Genera automáticamente la miniatura a partir del ID del video.
document.querySelectorAll('.video-card').forEach(card => {
  const id = card.dataset.youtubeId;
  const img = card.querySelector('.thumb-img');
  if (id && img) {
    img.src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
});

// ---------- Modal / lightbox para reproducir el video ----------
const modal = document.getElementById('videoModal');
const modalFrame = document.getElementById('videoModalFrame');
const modalClose = document.getElementById('videoModalClose');

function openVideo(youtubeId) {
  modalFrame.innerHTML = `<iframe
      src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0"
      title="Video de Spa en Casa"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen></iframe>`;
  modal.classList.add('open');
}

function closeVideo() {
  modal.classList.remove('open');
  modalFrame.innerHTML = ''; // detiene la reproducción al cerrar
}

document.querySelectorAll('.video-card').forEach(card => {
  card.querySelector('.video-thumb').addEventListener('click', () => {
    openVideo(card.dataset.youtubeId);
  });
});

modalClose.addEventListener('click', closeVideo);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeVideo();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeVideo();
});

// ---------- Ver más videos ----------
// Al hacer clic, muestra todas las tarjetas marcadas con .video-hidden
// (ya tienen su miniatura y su listener del modal puestos arriba, aunque
// estuvieran ocultas con display:none, así que no hace falta nada más).
const verMasVideosBtn = document.getElementById('verMasVideosBtn');
if (verMasVideosBtn) {
  verMasVideosBtn.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.video-card.video-hidden').forEach(card => {
      card.classList.remove('video-hidden');
    });
    verMasVideosBtn.remove(); // ya se mostraron todas, el botón sobra
  });
}
