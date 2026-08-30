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
  modalFrame.classList.remove('vertical'); // YouTube: caja horizontal 16:9
  modalFrame.innerHTML = `<iframe
      src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0"
      title="Video de Spa en Casa"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen></iframe>`;
  modal.classList.add('open');
}

// Los Reels de Instagram son verticales, así que usan su propio marco
// (ver clase .vertical en el CSS) en vez de la caja 16:9 de YouTube.
function openInstagram(reelId) {
  modalFrame.classList.add('vertical');
  modalFrame.innerHTML = `<iframe
      src="https://www.instagram.com/reel/${reelId}/embed"
      title="Video de Spa en Casa (Instagram)"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowfullscreen></iframe>`;
  modal.classList.add('open');
}

function closeVideo() {
  modal.classList.remove('open');
  modalFrame.innerHTML = ''; // detiene la reproducción al cerrar
}

document.querySelectorAll('.video-card').forEach(card => {
  card.querySelector('.video-thumb').addEventListener('click', () => {
    if (card.dataset.provider === 'instagram') {
      openInstagram(card.dataset.instagramId);
    } else {
      openVideo(card.dataset.youtubeId);
    }
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
// ---------- Lightbox de Galería: zoom + navegación ----------
const galleryItems = Array.from(document.querySelectorAll('.gallery-grid .img-placeholder'));
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxStage = document.getElementById('lightboxStage');

let currentIndex = 0;
let scale = 1, translateX = 0, translateY = 0;
let isDragging = false, dragStartX = 0, dragStartY = 0;
let lastTouchDist = null;
let lastTapTime = 0;
let swipeStartX = null;

// Solo cuenta las fotos que sí cargaron (las que fallan se autoeliminan con onerror)
function getGalleryImages() {
  return galleryItems.map(item => item.querySelector('.real-img')).filter(img => img);
}

function applyTransform() {
  lightboxImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  lightboxImg.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
}

function resetZoom() {
  scale = 1; translateX = 0; translateY = 0;
  applyTransform();
}

function showImage(index) {
  const imgs = getGalleryImages();
  if (!imgs.length) return;
  currentIndex = (index + imgs.length) % imgs.length;
  lightboxImg.src = imgs[currentIndex].src;
  lightboxImg.alt = imgs[currentIndex].alt || '';
  resetZoom();
}

function openLightbox(index) {
  showImage(index);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxImg.src = '';
  document.body.style.overflow = '';
}

function nextImage() { showImage(currentIndex + 1); }
function prevImage() { showImage(currentIndex - 1); }

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', nextImage);
lightboxPrev.addEventListener('click', prevImage);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'ArrowLeft') prevImage();
});

// Zoom con la rueda del mouse (PC)
lightboxStage.addEventListener('wheel', (e) => {
  e.preventDefault();
  const delta = e.deltaY < 0 ? 0.15 : -0.15;
  scale = Math.min(4, Math.max(1, scale + delta));
  if (scale === 1) { translateX = 0; translateY = 0; }
  applyTransform();
}, { passive: false });

// Doble clic también restaura el zoom, por si acaso (queda como respaldo)
lightboxImg.addEventListener('dblclick', resetZoom);

const ZOOM_CLICK_SCALE = 2.2;   // a cuánto zoom salta al hacer click
const DRAG_THRESHOLD = 5;       // px de movimiento para que cuente como arrastre y no como click

let mouseDownX = 0, mouseDownY = 0, hasMoved = false;

// Click para hacer/quitar zoom, centrado en el punto donde clickeaste
function toggleClickZoom(clientX, clientY) {
  const rect = lightboxStage.getBoundingClientRect();
  const ox = clientX - (rect.left + rect.width / 2);
  const oy = clientY - (rect.top + rect.height / 2);

  if (scale === 1) {
    const newScale = ZOOM_CLICK_SCALE;
    translateX = ox - (newScale / scale) * (ox - translateX);
    translateY = oy - (newScale / scale) * (oy - translateY);
    scale = newScale;
  } else {
    scale = 1; translateX = 0; translateY = 0;
  }
  applyTransform();
}

lightboxImg.addEventListener('mousedown', (e) => {
  e.preventDefault(); // evita que el navegador intente "arrastrar" la imagen como archivo
  mouseDownX = e.clientX;
  mouseDownY = e.clientY;
  hasMoved = false;
  isDragging = true;
  dragStartX = e.clientX - translateX;
  dragStartY = e.clientY - translateY;
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const movedDist = Math.hypot(e.clientX - mouseDownX, e.clientY - mouseDownY);
  if (movedDist > DRAG_THRESHOLD) {
    hasMoved = true;
    lightboxImg.classList.add('dragging');
  }
  // Solo mueve la imagen si ya se confirmó que es un arrastre (no un click) y hay zoom aplicado
  if (hasMoved && scale > 1) {
    translateX = e.clientX - dragStartX;
    translateY = e.clientY - dragStartY;
    applyTransform();
  }
});

window.addEventListener('mouseup', (e) => {
  if (isDragging && !hasMoved) {
    // Soltaste casi en el mismo punto: fue un click, no un arrastre → alterna el zoom
    toggleClickZoom(e.clientX, e.clientY);
  }
  isDragging = false;
  hasMoved = false;
  lightboxImg.classList.remove('dragging');
});

// ---------- Gestos táctiles (celular) ----------
function touchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
}

lightboxStage.addEventListener('touchstart', (e) => {
  if (e.touches.length === 2) {
    lastTouchDist = touchDistance(e.touches);
  } else if (e.touches.length === 1) {
    const now = Date.now();
    if (now - lastTapTime < 300) resetZoom(); // doble toque = restaurar
    lastTapTime = now;

    if (scale > 1) {
      isDragging = true;
      dragStartX = e.touches[0].clientX - translateX;
      dragStartY = e.touches[0].clientY - translateY;
    } else {
      swipeStartX = e.touches[0].clientX; // para deslizar entre fotos
    }
  }
}, { passive: true });

lightboxStage.addEventListener('touchmove', (e) => {
  if (e.touches.length === 2 && lastTouchDist !== null) {
    e.preventDefault();
    const newDist = touchDistance(e.touches);
    const delta = (newDist - lastTouchDist) * 0.01;
    scale = Math.min(4, Math.max(1, scale + delta));
    if (scale === 1) { translateX = 0; translateY = 0; }
    applyTransform();
    lastTouchDist = newDist;
  } else if (e.touches.length === 1 && isDragging) {
    e.preventDefault();
    translateX = e.touches[0].clientX - dragStartX;
    translateY = e.touches[0].clientY - dragStartY;
    applyTransform();
  }
}, { passive: false });

lightboxStage.addEventListener('touchend', (e) => {
  if (e.touches.length < 2) lastTouchDist = null;
  if (e.touches.length === 0) {
    isDragging = false;
    if (scale === 1 && swipeStartX !== null && e.changedTouches.length) {
      const deltaX = e.changedTouches[0].clientX - swipeStartX;
      if (Math.abs(deltaX) > 50) (deltaX > 0 ? prevImage() : nextImage());
    }
    swipeStartX = null;
  }
});

// ---------- Ver más imágenes (mobile: muestra 4, el resto al hacer clic) ----------
const verMasImagenesBtn = document.getElementById('verMasImagenesBtn');
if (verMasImagenesBtn) {
  verMasImagenesBtn.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.gallery-grid .gallery-hidden').forEach(item => {
      item.classList.remove('gallery-hidden');
    });
    verMasImagenesBtn.remove();
  });
}
