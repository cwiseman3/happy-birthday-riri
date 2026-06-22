const SECRET_WORD = "riri";

const WRONG_HINTS = [
  "You know this one. ❤",
  "Think smaller.",
  "It's literally your name.",
  "C3 + … who?",
  "Come on, you got this.",
  "Nope — but you're close. ❤",
];

let wrongAttempts = 0;

/* =====================================================================
   TIMELINE — edit moments below
   ===================================================================== */
const TIMELINE = [
  {
    img: "images/image1.jpeg",
    fit: "contain",
    title: "How it started",
    caption:
      "I've been holding onto this one. This is our first ever message, ever. This is the first day I met you. This first day our souls came into contact. This message here changed our lives. April 14th, 2023. First day I met you and our first text thread.",
  },
  {
    images: [
      "images/funny1.jpeg",
      "images/funny2.jpeg",
      "images/funny3.jpeg",
      "images/funny4.jpeg",
    ],
    title: "Caught on camera",
    caption:
      "Some of my favorite faces. The silly ones, the loud ones — these are the faces I think about when you're not here.",
  },
  {
    img: "images/image2.jpeg",
    video: "images/IMG_1032.mov",
    title: "Our first",
    caption:
      "Our first time you doing my hair. Looking at your face! Those eyes! I miss us having our own space and look forward to us getting that. Working toward that as a team.",
  },
  {
    img: "images/teacherday.jpeg",
    title: "My Teacher",
    caption:
      "I don't know if you know, but this picture is your first day as a teacher at the high school. The first day you ever taught. I know you're a great teacher and I'm so proud of you for that.",
  },
  {
    img: "images/favoriteday.jpeg",
    title: "A favorite day",
    caption:
      "This was a big day for both of us and a favorite day of mine. Your family made me feel welcome. You stood by me and we both owned our space. From your dad doing his nose trick to your grandma and I having great talks.",
  },
  {
    img: "images/justus.jpeg",
    title: "Just us",
    caption:
      "I love this photo of us because it shows so much life. There are a lot of moments we share where the world stops spinning. I can tell in this picture we were in the moment. Also — we look young.",
  },
  {
    video: "images/IMG_4335.mov",
    title: "The little things",
    caption:
      "This is one of my favorite videos of all time of you. This video embodies why I love you so much. The details in the video, the walk  it talks to me. The smile softens my heart. The dress looks beautiful on you. The way you carry yourself is so beautiful.",
  },
  {
    img: "images/adventures.jpeg",
    title: "Adventures",
    caption:
      "This day HERE! This was the day we went out in San Jose. The same day, before we went out, we had one of the deepest conversations I've had with any human on earth. I felt like you knew me. You were prepared for me. This is the night you wore a black dress and we talked and talked before we went out. I always think of this night.",
  },
  {
    img: "images/Nova.jpeg",
    title: "My Daughter",
    caption: "It's your birthday  but my daughter deserves a shout out!",
  },
  {
    img: "images/lately.png",
    title: "And forward",
    caption:
      "Lately I've been feeling like a unit, and this image represents that. I love this image because how I envision the future looks like this. The picture speaks volumes and it's time to show the world what I see in it.",
  },
];

let journeyIndex = 0;
let journeyTotal = 0;

function mediaPath(path) {
  if (!path) return path;
  return path.includes("/") ? path : "images/" + path;
}

function isVideoFile(path) {
  return /\.(mov|mp4|webm)$/i.test(path || "");
}

function buildMemoryMedia(item, title) {
  if (item.images && item.images.length) {
    return (
      '<div class="memory-gallery">' +
      item.images
        .map(
          (src, j) =>
            '<img class="memory-gallery-photo" src="' +
            mediaPath(src) +
            '" alt="' +
            title +
            " " +
            (j + 1) +
            '" onerror="this.onerror=null;this.src=\'images/reveal.svg\'" />'
        )
        .join("") +
      "</div>"
    );
  }

  const videoSrc = item.video
    ? mediaPath(item.video)
    : isVideoFile(item.img)
      ? mediaPath(item.img)
      : null;
  const imgSrc = item.img && !isVideoFile(item.img) ? mediaPath(item.img) : null;

  if (videoSrc) {
    const poster = imgSrc ? ' poster="' + imgSrc + '"' : "";
    return (
      '<div class="memory-video-wrap">' +
      '<video class="memory-media memory-video" src="' +
      videoSrc +
      '"' +
      poster +
      ' playsinline muted loop preload="metadata" aria-label="' +
      title +
      '"></video>' +
      '<div class="memory-video-overlay" aria-hidden="false">' +
      '<button type="button" class="memory-video-play" aria-label="Play video">' +
      '<span class="memory-video-play-icon" aria-hidden="true"></span>' +
      '<span class="memory-video-play-label">Play video</span>' +
      "</button>" +
      '<div class="memory-video-loading" aria-label="Loading video">' +
      '<span class="memory-video-spinner"></span>' +
      "</div>" +
      "</div></div>"
    );
  }

  const src = imgSrc || "images/reveal.svg";
  return (
    '<img class="memory-media memory-photo" src="' +
    src +
    '" alt="' +
    title +
    '" onerror="this.onerror=null;this.src=\'images/reveal.svg\'" />'
  );
}

function initVideoPlayers() {
  document.querySelectorAll(".memory-video-wrap").forEach((wrap) => {
    const video = wrap.querySelector(".memory-video");
    const playBtn = wrap.querySelector(".memory-video-play");
    if (!video || !playBtn) return;

    playBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      wrap.classList.add("is-loading");
      video.muted = false;
      video.play().catch(() => wrap.classList.remove("is-loading"));
    });

    video.addEventListener("loadstart", () => wrap.classList.add("is-loading"));
    video.addEventListener("waiting", () => wrap.classList.add("is-loading"));
    video.addEventListener("canplay", () => wrap.classList.remove("is-loading"));
    video.addEventListener("playing", () => {
      wrap.classList.add("is-playing");
      wrap.classList.remove("is-loading");
    });
    video.addEventListener("pause", () => wrap.classList.remove("is-playing"));
    video.addEventListener("error", () => wrap.classList.remove("is-loading"));
  });
}

function syncMemoryVideos(activePanelIndex) {
  document.querySelectorAll(".journey-panel").forEach((panel, pi) => {
    const wrap = panel.querySelector(".memory-video-wrap");
    if (!wrap) return;
    const video = wrap.querySelector(".memory-video");
    video.pause();
    video.currentTime = 0;
    video.muted = true;
    wrap.classList.remove("is-playing", "is-loading");
    if (pi === activePanelIndex) video.load();
  });
}

function buildJourney() {
  const rail = document.querySelector(".journey-rail");
  const track = document.querySelector(".journey-track");
  const letterPanel = document.querySelector(".journey-letter");
  if (!rail || !track || !letterPanel) return;

  // insert memory panels before the letter
  TIMELINE.forEach((item, i) => {
    const panel = document.createElement("section");
    const isGallery = item.images && item.images.length;
    panel.className =
      "journey-panel journey-memory" +
      (isGallery ? " journey-memory-gallery" : i % 2 === 1 ? " flip" : "");
    panel.dataset.label = item.title;
    const fitClass = item.fit === "contain" ? " memory-fit-contain" : "";
    const hasVideo = !!(item.video || isVideoFile(item.img));
    panel.innerHTML = `
      <div class="memory-layout">
        <div class="memory-photo-wrap${fitClass}${hasVideo ? " memory-has-video" : ""}">
          ${buildMemoryMedia(item, item.title)}
        </div>
        <div class="memory-story">
          <h3 class="memory-title">${item.title}</h3>
          <p class="memory-caption">${item.caption}</p>
        </div>
      </div>`;
    track.insertBefore(panel, letterPanel);
  });

  // build rail nodes for every panel (welcome + memories + letter)
  const panels = track.querySelectorAll(".journey-panel");
  journeyTotal = panels.length;
  rail.innerHTML = '<span class="journey-rail-fill"></span>';

  panels.forEach((panel, i) => {
    const label = panel.dataset.label || (i === 0 ? "Start" : "For you");
    const node = document.createElement("button");
    node.className = "journey-node";
    node.setAttribute("aria-label", "Go to " + label);
    node.innerHTML = `
      <span class="journey-node-dot"></span>
      <span class="journey-node-label">${label}</span>`;
    node.addEventListener("click", () => goToPanel(i));
    rail.appendChild(node);
  });

  initVideoPlayers();

  const prev = document.querySelector(".journey-prev");
  const next = document.querySelector(".journey-next");
  if (prev) prev.addEventListener("click", () => goToPanel(journeyIndex - 1));
  if (next) next.addEventListener("click", () => goToPanel(journeyIndex + 1));

  addJourneySwipe(document.querySelector(".journey-viewport"));

  window.addEventListener("keydown", (e) => {
    if (e.target && e.target.tagName === "INPUT") return;
    if (e.key === "ArrowRight") goToPanel(journeyIndex + 1);
    if (e.key === "ArrowLeft") goToPanel(journeyIndex - 1);
  });

  goToPanel(0, true);
}

function goToPanel(i, instant) {
  if (journeyTotal === 0) return;
  i = Math.max(0, Math.min(i, journeyTotal - 1));
  journeyIndex = i;

  const track = document.querySelector(".journey-track");
  if (instant) track.style.transition = "none";
  track.style.transform = "translateX(" + -i * 100 + "%)";
  if (instant) {
    void track.offsetWidth;
    track.style.transition = "";
  }

  document.querySelectorAll(".journey-node").forEach((n, ni) => {
    n.classList.toggle("active", ni === i);
    n.classList.toggle("done", ni < i);
  });

  const fill = document.querySelector(".journey-rail-fill");
  if (fill) fill.style.width = journeyTotal > 1 ? (i / (journeyTotal - 1)) * 100 + "%" : "0";

  document.querySelectorAll(".journey-panel").forEach((p, pi) => {
    p.classList.toggle("active", pi === i);
  });

  const prev = document.querySelector(".journey-prev");
  const next = document.querySelector(".journey-next");
  if (prev) prev.disabled = i === 0;
  if (next) next.disabled = i === journeyTotal - 1;

  const counter = document.querySelector(".journey-counter");
  if (counter) counter.textContent = i + 1 + " / " + journeyTotal;

  syncMemoryVideos(i);
}

function addJourneySwipe(el) {
  if (!el) return;
  let startX = null;
  el.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
    },
    { passive: true }
  );
  el.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) goToPanel(journeyIndex + (dx < 0 ? 1 : -1));
    startX = null;
  });
}

function unlockSite() {
  const inputEl = document.getElementById("password-input");
  const input = inputEl.value.trim().toLowerCase();
  const error = document.getElementById("error-message");
  const unlockScreen = document.getElementById("unlock-screen");

  if (input !== SECRET_WORD) {
    error.textContent = WRONG_HINTS[wrongAttempts % WRONG_HINTS.length];
    wrongAttempts++;
    unlockScreen.classList.remove("wrong");
    void unlockScreen.offsetWidth;
    unlockScreen.classList.add("wrong");
    return;
  }

  error.textContent = "";
  wrongAttempts = 0;
  playHeartTransition();
}

function playHeartTransition() {
  const unlockScreen = document.getElementById("unlock-screen");
  const overlay = document.getElementById("heart-transition");
  const site = document.getElementById("birthday-site");

  // must match .panel { transition: transform 1s ... } in style.css
  const PANEL_MS = 1000;
  const COME_TOGETHER = PANEL_MS + 80;
  const HOLD = 1200;
  const OPEN = PANEL_MS;

  site.classList.remove("hidden");
  goToPanel(0, true);

  overlay.classList.add("show");
  void overlay.offsetWidth;
  overlay.classList.add("together");

  // hide login and split the photo open — birthday site shows through the gap
  setTimeout(() => {
    unlockScreen.classList.add("hidden");
    overlay.classList.remove("together");
    overlay.classList.add("open");
  }, COME_TOGETHER + HOLD);

  setTimeout(() => {
    overlay.classList.remove("show", "open", "together");
  }, COME_TOGETHER + HOLD + OPEN + 80);
}

document.addEventListener("DOMContentLoaded", () => {
  buildJourney();

  const replayBtn = document.getElementById("replay-journey");
  if (replayBtn) replayBtn.addEventListener("click", () => goToPanel(0));

  const bg = document.querySelector(".unlock-photo");
  if (bg) {
    const reveal = () => bg.classList.add("loaded");
    if (bg.complete) reveal();
    else {
      bg.onload = reveal;
      bg.onerror = reveal;
    }
  }

  const inputEl = document.getElementById("password-input");
  if (inputEl) {
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        unlockSite();
      }
    });
    inputEl.focus();
  }
});
