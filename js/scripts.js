const overlay = document.getElementById("portfolioOverlay");
const overlayContent = document.getElementById("overlayContent");
const overlayClose = document.getElementById("overlayClose");
const overlayPanel = document.getElementById("overlayPanel");
const desk = document.querySelector(".desk");

const deskObjects = document.querySelectorAll(".desk-object");
const phone = document.querySelector(".phone");
const deskClock = document.getElementById("deskClock");
const deskClockTime = document.getElementById("deskClockTime");
const deskClockPeriod = document.getElementById("deskClockPeriod");
const deskClockControl = document.querySelector(".desk-clock-control");
const deskTimeMenu = document.getElementById("deskTimeMenu");
const deskTimeButtons = document.querySelectorAll("[data-time-mode]");

const timeModes = {
  device: null,
  morning: { hour: 7, minute: 0, label: "EARLY MORNING" },
  midday: { hour: 13, minute: 0, label: "MIDDAY" },
  evening: { hour: 19, minute: 30, label: "EVENING" },
  night: { hour: 1, minute: 0, label: "NIGHT" },
};

/*
  Manual showcase palettes are intentionally independent from the device-time
  timeline below. Tune one of these without changing any other preset.
*/
const manualLightingPresets = {
  morning: {
    sceneWash: [238, 139, 116],
    washAlpha: 0.12,
    center: [116, 76, 62],
    middle: [91, 68, 78],
    edge: [57, 57, 82],
    tintStart: [244, 154, 112],
    tintEnd: [94, 75, 112],
    middleAlpha: 0.09,
    edgeAlpha: 0.16,
    tintAlpha: 0.09,
    brightness: 1.05,
    saturation: 1.01,
    sepia: 0.02,
    lightHue: 18,
    lightBrightness: 0.95,
    dustHue: 12,
  },
  midday: {
    sceneWash: [244, 137, 64],
    washAlpha: 0.13,
    center: [124, 67, 31],
    middle: [105, 58, 36],
    edge: [72, 42, 39],
    tintStart: [255, 151, 67],
    tintEnd: [117, 57, 48],
    middleAlpha: 0.07,
    edgeAlpha: 0.12,
    tintAlpha: 0.07,
    brightness: 1.1,
    saturation: 1.08,
    sepia: 0.05,
    lightHue: 0,
    lightBrightness: 1.05,
    dustHue: 0,
  },
  evening: {
    sceneWash: [126, 72, 144],
    washAlpha: 0.17,
    center: [115, 57, 31],
    middle: [98, 53, 57],
    edge: [58, 40, 78],
    tintStart: [255, 133, 55],
    tintEnd: [84, 48, 86],
    middleAlpha: 0.1,
    edgeAlpha: 0.18,
    tintAlpha: 0.1,
    brightness: 0.99,
    saturation: 1.07,
    sepia: 0.05,
    lightHue: 5,
    lightBrightness: 0.96,
    dustHue: 5,
  },
  night: {
    sceneWash: [56, 91, 145],
    washAlpha: 0.23,
    center: [47, 55, 76],
    middle: [42, 51, 79],
    edge: [24, 34, 61],
    tintStart: [77, 104, 139],
    tintEnd: [42, 59, 98],
    middleAlpha: 0.15,
    edgeAlpha: 0.24,
    tintAlpha: 0.16,
    brightness: 0.86,
    saturation: 0.94,
    sepia: 0,
    lightHue: 148,
    lightBrightness: 0.82,
    dustHue: 145,
  },
};

let selectedTimeMode = "device";

try {
  const savedTimeMode = window.localStorage.getItem("portfolio-time-mode");
  if (savedTimeMode in timeModes) {
    selectedTimeMode = savedTimeMode;
  }
} catch {
  /* The preference is optional when browser storage is unavailable. */
}

/* Smooth timeline used only while “Device time” is selected. */
const deviceLightingKeyframes = [
  {
    hour: 0,
    name: "NIGHT",
    sceneWash: [56, 91, 145],
    washAlpha: 0.23,
    center: [47, 55, 76],
    middle: [42, 51, 79],
    edge: [24, 34, 61],
    tintStart: [77, 104, 139],
    tintEnd: [42, 59, 98],
    middleAlpha: 0.15,
    edgeAlpha: 0.24,
    tintAlpha: 0.16,
    brightness: 0.92,
    saturation: 0.94,
    sepia: 0,
    lightHue: 148,
    lightBrightness: 0.82,
    dustHue: 145,
  },
  {
    hour: 5.5,
    name: "EARLY MORNING",
    sceneWash: [238, 139, 116],
    washAlpha: 0.12,
    center: [116, 76, 62],
    middle: [91, 68, 78],
    edge: [57, 57, 82],
    tintStart: [244, 154, 112],
    tintEnd: [94, 75, 112],
    middleAlpha: 0.09,
    edgeAlpha: 0.16,
    tintAlpha: 0.09,
    brightness: 1.02,
    saturation: 1.01,
    sepia: 0.02,
    lightHue: 18,
    lightBrightness: 0.95,
    dustHue: 12,
  },
  {
    hour: 10,
    name: "DAY",
    sceneWash: [244, 137, 64],
    washAlpha: 0.13,
    center: [124, 67, 31],
    middle: [105, 58, 36],
    edge: [72, 42, 39],
    tintStart: [255, 151, 67],
    tintEnd: [117, 57, 48],
    middleAlpha: 0.07,
    edgeAlpha: 0.12,
    tintAlpha: 0.07,
    brightness: 1.07,
    saturation: 1.08,
    sepia: 0.05,
    lightHue: 0,
    lightBrightness: 1.05,
    dustHue: 0,
  },
  {
    hour: 16,
    name: "AFTERNOON",
    sceneWash: [224, 103, 65],
    washAlpha: 0.14,
    center: [126, 65, 30],
    middle: [111, 55, 43],
    edge: [76, 42, 48],
    tintStart: [255, 132, 54],
    tintEnd: [115, 55, 65],
    middleAlpha: 0.09,
    edgeAlpha: 0.15,
    tintAlpha: 0.09,
    brightness: 1.05,
    saturation: 1.1,
    sepia: 0.06,
    lightHue: -4,
    lightBrightness: 1.02,
    dustHue: -4,
  },
  {
    hour: 19.5,
    name: "EVENING",
    sceneWash: [126, 72, 144],
    washAlpha: 0.17,
    center: [115, 57, 31],
    middle: [98, 53, 57],
    edge: [58, 40, 78],
    tintStart: [255, 133, 55],
    tintEnd: [84, 48, 86],
    middleAlpha: 0.1,
    edgeAlpha: 0.18,
    tintAlpha: 0.1,
    brightness: 1.04,
    saturation: 1.07,
    sepia: 0.05,
    lightHue: 5,
    lightBrightness: 0.96,
    dustHue: 5,
  },
  {
    hour: 22.5,
    name: "NIGHT",
    sceneWash: [56, 91, 145],
    washAlpha: 0.23,
    center: [47, 55, 76],
    middle: [42, 51, 79],
    edge: [24, 34, 61],
    tintStart: [77, 104, 139],
    tintEnd: [42, 59, 98],
    middleAlpha: 0.15,
    edgeAlpha: 0.24,
    tintAlpha: 0.16,
    brightness: 0.92,
    saturation: 0.94,
    sepia: 0,
    lightHue: 148,
    lightBrightness: 0.82,
    dustHue: 145,
  },
  {
    hour: 24,
    name: "NIGHT",
    sceneWash: [56, 91, 145],
    washAlpha: 0.23,
    center: [47, 55, 76],
    middle: [42, 51, 79],
    edge: [24, 34, 61],
    tintStart: [77, 104, 139],
    tintEnd: [42, 59, 98],
    middleAlpha: 0.15,
    edgeAlpha: 0.24,
    tintAlpha: 0.16,
    brightness: 0.92,
    saturation: 0.94,
    sepia: 0,
    lightHue: 148,
    lightBrightness: 0.82,
    dustHue: 145,
  },
];

function mixNumber(from, to, amount) {
  return from + (to - from) * amount;
}

function mixColor(from, to, amount) {
  return from.map((channel, index) =>
    Math.round(mixNumber(channel, to[index], amount)),
  );
}

function getDeviceLighting(currentHour) {
  const nextIndex = deviceLightingKeyframes.findIndex(
    (keyframe) => keyframe.hour > currentHour,
  );
  const to = deviceLightingKeyframes[nextIndex];
  const from = deviceLightingKeyframes[Math.max(0, nextIndex - 1)];
  const amount = (currentHour - from.hour) / (to.hour - from.hour);
  const colorFields = [
    "sceneWash",
    "center",
    "middle",
    "edge",
    "tintStart",
    "tintEnd",
  ];
  const numberFields = [
    "washAlpha",
    "middleAlpha",
    "edgeAlpha",
    "tintAlpha",
    "brightness",
    "saturation",
    "sepia",
    "lightHue",
    "lightBrightness",
    "dustHue",
  ];
  const profile = {};

  colorFields.forEach((field) => {
    profile[field] = mixColor(from[field], to[field], amount);
  });
  numberFields.forEach((field) => {
    profile[field] = mixNumber(from[field], to[field], amount);
  });

  return {
    profile,
    periodName: amount < 0.5 ? from.name : to.name,
  };
}

function applyLightingProfile(profile) {
  const root = desk?.style;

  if (!root) {
    return;
  }

  function setStyleProperty(property, value) {
    if (root.getPropertyValue(property) !== value) {
      root.setProperty(property, value);
    }
  }

  const colorProperties = {
    sceneWash: "--scene-wash",
    center: "--grade-center",
    middle: "--grade-middle",
    edge: "--grade-edge",
    tintStart: "--grade-tint-start",
    tintEnd: "--grade-tint-end",
  };
  const numberProperties = {
    washAlpha: "--scene-wash-alpha",
    middleAlpha: "--grade-middle-alpha",
    edgeAlpha: "--grade-edge-alpha",
    tintAlpha: "--grade-tint-alpha",
    brightness: "--scene-brightness",
    saturation: "--scene-saturation",
    sepia: "--scene-sepia",
    lightBrightness: "--light-brightness",
  };

  Object.entries(colorProperties).forEach(([field, property]) => {
    setStyleProperty(property, profile[field].join(", "));
  });
  Object.entries(numberProperties).forEach(([field, property]) => {
    setStyleProperty(property, profile[field].toFixed(3));
  });

  setStyleProperty(
    "--light-glow-brightness",
    (profile.lightBrightness * 1.55).toFixed(3),
  );
  setStyleProperty("--light-hue", `${profile.lightHue.toFixed(2)}deg`);
  setStyleProperty("--dust-hue", `${profile.dustHue.toFixed(2)}deg`);
}

function updateClockAndLighting() {
  const now = new Date();
  const preset = timeModes[selectedTimeMode];
  const displayHour = preset?.hour ?? now.getHours();
  const displayMinute = preset?.minute ?? now.getMinutes();
  const currentHour = preset
    ? displayHour + displayMinute / 60
    : now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  const deviceLighting = preset ? null : getDeviceLighting(currentHour);
  const lightingProfile =
    manualLightingPresets[selectedTimeMode] ?? deviceLighting.profile;
  const periodName = preset?.label ?? deviceLighting.periodName;

  applyLightingProfile(lightingProfile);
  const timeText = preset
    ? `${String(displayHour).padStart(2, "0")}:${String(displayMinute).padStart(
        2,
        "0",
      )}`
    : now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

  if (deskClockTime && deskClockTime.textContent !== timeText) {
    deskClockTime.textContent = timeText;
  }

  if (deskClockTime) {
    deskClockTime.dateTime = preset ? timeText : now.toISOString();
  }

  if (deskClockPeriod && deskClockPeriod.textContent !== periodName) {
    deskClockPeriod.textContent = periodName;
  }

  const lightPeriod = periodName
    .toLowerCase()
    .replace(" ", "-");

  if (document.body.dataset.lightPeriod !== lightPeriod) {
    document.body.dataset.lightPeriod = lightPeriod;
  }

  deskTimeButtons.forEach((button) => {
    const isPressed = String(button.dataset.timeMode === selectedTimeMode);

    if (button.getAttribute("aria-pressed") !== isPressed) {
      button.setAttribute("aria-pressed", isPressed);
    }
  });
}

function setClockMenuOpen(isOpen) {
  if (!deskClock || !deskTimeMenu) {
    return;
  }

  deskTimeMenu.hidden = !isOpen;
  deskClock.setAttribute("aria-expanded", String(isOpen));
}

deskClockControl?.addEventListener("pointerdown", (event) => {
  event.stopPropagation();
});

deskClock?.addEventListener("click", () => {
  setClockMenuOpen(deskClock.getAttribute("aria-expanded") !== "true");
});

deskTimeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedTimeMode = button.dataset.timeMode;

    try {
      window.localStorage.setItem("portfolio-time-mode", selectedTimeMode);
    } catch {
      /* The lighting still works for this visit without saved preferences. */
    }

    startClockUpdates();
    setClockMenuOpen(false);
    deskClock?.focus();
  });
});

document.addEventListener("pointerdown", (event) => {
  if (!deskClockControl?.contains(event.target)) {
    setClockMenuOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    deskClock?.getAttribute("aria-expanded") === "true"
  ) {
    setClockMenuOpen(false);
    deskClock.focus();
  }
});

let clockUpdateTimer = null;

function stopClockUpdates() {
  window.clearTimeout(clockUpdateTimer);
  clockUpdateTimer = null;
}

function startClockUpdates() {
  stopClockUpdates();
  updateClockAndLighting();

  if (selectedTimeMode !== "device" || document.hidden) {
    return;
  }

  const millisecondsUntilNextMinute =
    60000 - (Date.now() % 60000) + 50;

  clockUpdateTimer = window.setTimeout(startClockUpdates, millisecondsUntilNextMinute);
}

startClockUpdates();

/* Mouse drag, touch swipe, and keyboard exploration for the wide desk. */
const deskDrag = {
  pointerId: null,
  startX: 0,
  startY: 0,
  startProgress: 0.5,
  progress: 0.5,
  moved: false,
  suppressClick: false,
};

const deskCanvas = desk?.querySelector(".desk-canvas");

/*
  Restrict how much of the complete corner-to-corner track is reachable.
  Increase DESK_TRAVEL_START to trim more from the bottom-left end.
  Decrease DESK_TRAVEL_END to trim more from the top-right end.
*/
const DESK_TRAVEL_START = 0.13;
const DESK_TRAVEL_END = 0.88;
let deskTrack = null;
let deskRenderFrame = null;
let deskResizeFrame = null;

function markDeskExplored() {
  desk?.classList.add("has-been-explored");
}

function calculateDeskTrack() {
  if (!desk || !deskCanvas) {
    return null;
  }

  const viewportWidth = desk.clientWidth;
  const viewportHeight = desk.clientHeight;
  const canvasWidth = deskCanvas.offsetWidth;
  const canvasHeight = deskCanvas.offsetHeight;
  const angle =
    parseFloat(getComputedStyle(deskCanvas).getPropertyValue("--desk-angle")) ||
    -10;
  const angleRadians = (Math.abs(angle) * Math.PI) / 180;
  const rotatedWidth =
    canvasWidth * Math.cos(angleRadians) +
    canvasHeight * Math.sin(angleRadians);
  const horizontalOverflow = Math.max(0, (rotatedWidth - canvasWidth) / 2);

  /*
    Align the rotated desk's true left and right bounds with the viewport.
    This prevents dragging beyond either end without adding artificial gutters.
  */
  const fullStartX = horizontalOverflow;
  const fullEndX = viewportWidth - canvasWidth - horizontalOverflow;
  const fullVerticalTravel =
    Math.abs(fullStartX - fullEndX) * Math.tan(angleRadians);

  /*
    This keeps the laptop at the height you selected while deriving both
    endpoints from the desk angle. Change 0.91 only to move the entire track
    up or down; the diagonal itself will remain aligned with the artwork.
  */
  const centerY = viewportHeight - canvasHeight * 0.96;
  const fullStartY = centerY - fullVerticalTravel / 2;
  const fullEndY = centerY + fullVerticalTravel / 2;
  const startX = fullStartX + (fullEndX - fullStartX) * DESK_TRAVEL_START;
  const endX = fullStartX + (fullEndX - fullStartX) * DESK_TRAVEL_END;
  const startY = fullStartY + (fullEndY - fullStartY) * DESK_TRAVEL_START;
  const endY = fullStartY + (fullEndY - fullStartY) * DESK_TRAVEL_END;

  return { startX, endX, startY, endY };
}

function renderDeskPosition() {
  const track = deskTrack ?? calculateDeskTrack();

  if (!track || !deskCanvas) {
    return;
  }

  deskTrack = track;
  const progress = Math.min(1, Math.max(0, deskDrag.progress));
  const { startX, endX, startY, endY } = track;
  const x = startX + (endX - startX) * progress;
  const y = startY + (endY - startY) * progress;

  const deskX = `${x}px`;
  const deskY = `${y}px`;

  if (deskCanvas.style.getPropertyValue("--desk-x") !== deskX) {
    deskCanvas.style.setProperty("--desk-x", deskX);
  }
  if (deskCanvas.style.getPropertyValue("--desk-y") !== deskY) {
    deskCanvas.style.setProperty("--desk-y", deskY);
  }

  /*
    Keep the full-screen grade fixed, but move the window light with the desk.
    Progress 0.5 is the lighting composition's neutral starting position.
  */
  const lightX = (endX - startX) * (progress - 0.5);
  const lightY = (endY - startY) * (progress - 0.5);
  const lightXValue = `${lightX}px`;
  const lightYValue = `${lightY}px`;

  if (desk.style.getPropertyValue("--light-x") !== lightXValue) {
    desk.style.setProperty("--light-x", lightXValue);
  }
  if (desk.style.getPropertyValue("--light-y") !== lightYValue) {
    desk.style.setProperty("--light-y", lightYValue);
  }
}

function requestDeskRender() {
  if (deskRenderFrame !== null) {
    return;
  }

  deskRenderFrame = window.requestAnimationFrame(() => {
    deskRenderFrame = null;
    renderDeskPosition();
  });
}

function refreshDeskTrack() {
  deskTrack = calculateDeskTrack();
  requestDeskRender();
}

refreshDeskTrack();
window.addEventListener("resize", () => {
  if (deskResizeFrame !== null) {
    return;
  }

  deskResizeFrame = window.requestAnimationFrame(() => {
    deskResizeFrame = null;
    refreshDeskTrack();
  });
});

function startDeskDrag(event) {
  if (!desk || event.button !== 0 || overlay.classList.contains("is-open")) {
    return;
  }

  deskDrag.pointerId = event.pointerId;
  deskDrag.startX = event.clientX;
  deskDrag.startY = event.clientY;
  deskDrag.startProgress = deskDrag.progress;
  deskDrag.moved = false;
}

function moveDeskDrag(event) {
  if (!desk || deskDrag.pointerId !== event.pointerId) {
    return;
  }

  const distanceX = event.clientX - deskDrag.startX;
  const distanceY = event.clientY - deskDrag.startY;
  const distance = Math.hypot(distanceX, distanceY);

  if (!deskDrag.moved && distance < 6) {
    return;
  }

  deskDrag.moved = true;
  deskDrag.suppressClick = true;
  desk.classList.add("is-dragging");

  /*
    Do not capture a simple press: doing so can retarget the resulting click
    from a desk object to the desk itself in some browsers. Capture only after
    the movement threshold confirms that the user is actually dragging.
  */
  if (!desk.hasPointerCapture(event.pointerId)) {
    desk.setPointerCapture(event.pointerId);
  }

  const track = deskTrack;

  if (!track) {
    return;
  }

  const trackX = track.endX - track.startX;
  const trackY = track.endY - track.startY;
  const trackLengthSquared = trackX * trackX + trackY * trackY;
  const projectedProgress =
    (distanceX * trackX + distanceY * trackY) / trackLengthSquared;

  deskDrag.progress = Math.min(
    1,
    Math.max(0, deskDrag.startProgress + projectedProgress),
  );
  requestDeskRender();
  markDeskExplored();
}

function endDeskDrag(event) {
  if (!desk || deskDrag.pointerId !== event.pointerId) {
    return;
  }

  if (desk.hasPointerCapture(event.pointerId)) {
    desk.releasePointerCapture(event.pointerId);
  }

  deskDrag.pointerId = null;
  requestDeskRender();
  window.requestAnimationFrame(() => {
    desk.classList.remove("is-dragging");
  });

  window.setTimeout(() => {
    deskDrag.suppressClick = false;
  }, 0);
}

desk?.addEventListener("pointerdown", startDeskDrag);
desk?.addEventListener("pointermove", moveDeskDrag);
desk?.addEventListener("pointerup", endDeskDrag);
desk?.addEventListener("pointercancel", endDeskDrag);

desk?.addEventListener("keydown", (event) => {
  if (
    event.target !== desk ||
    !["ArrowLeft", "ArrowRight"].includes(event.key)
  ) {
    return;
  }

  event.preventDefault();
  deskDrag.progress = Math.min(
    1,
    Math.max(
      0,
      deskDrag.progress + (event.key === "ArrowRight" ? 0.12 : -0.12),
    ),
  );
  requestDeskRender();
  markDeskExplored();
});

/* Replace these three values when the final contact details are ready. */
const contactLinks = {
  linkedin: "https://www.linkedin.com/in/joao-silva98/",
  github: "https://github.com/Shindanx",
  email: "mailto:joao.carneirosilva98@gmail.com",
};

/*
  Replace the placeholder links and text
  with your real portfolio content.
*/
const portfolioSections = {
  about: `
    <div class="device-overlay notebook-overlay" data-notebook-page="about">
      <img
        class="device-frame notebook-base"
        src="images/NoteBookOverlayBase.png"
        alt="Open notebook"
        draggable="false"
      />

      <img
        class="notebook-items"
        src="images/AboutItems.png"
        alt="About notebook items"
        draggable="false"
      />

      <nav class="notebook-tabs" aria-label="About notebook pages">
        <button
          class="notebook-tab notebook-tab-about"
          type="button"
          data-notebook-target="about"
          aria-label="Open About page"
          aria-current="page"
        >
          <img src="images/AboutTab.png" alt="" draggable="false" />
        </button>

        <button
          class="notebook-tab notebook-tab-journey"
          type="button"
          data-notebook-target="journey"
          aria-label="Open Journey page"
        >
          <img src="images/JourneyTab.png" alt="" draggable="false" />
        </button>

        <button
          class="notebook-tab notebook-tab-skills"
          type="button"
          data-notebook-target="skills"
          aria-label="Open Skills page"
        >
          <img src="images/SkillsTab.png" alt="" draggable="false" />
        </button>
      </nav>
    </div>
  `,

  projects: `
    <div class="device-overlay laptop-overlay">
      <div class="device-screen laptop-screen">
        <div class="laptop-home">
          <img
            class="laptop-home-art"
            src="images/LaptopHomeScreen.png"
            alt=""
            draggable="false"
          />
          <div class="project-desktop">
            <div class="project-shortcut project-shortcut-sakecat">
              <button
                class="project-icon"
                type="button"
                data-project-url="https://shindanx.github.io/sakecat/"
                data-project-title="SakeCat"
                aria-describedby="sakecat-description"
                aria-label="Open SakeCat website"
                aria-expanded="false"
              >
                <img src="images/SakeCatIcon.png" alt="" draggable="false" />
              </button>
              <div class="project-tooltip" id="sakecat-description">
                <strong>SakeCat</strong>
                <span>A playful, character-led website with a warm Japanese-inspired identity.</span>
                <button class="project-open" type="button">Open website</button>
              </div>
            </div>

            <div class="project-shortcut project-shortcut-black-ice">
              <button
                class="project-icon"
                type="button"
                data-project-url="https://shindanx.github.io/black-ice-tailoring/"
                data-project-title="Black Ice Tailoring"
                aria-describedby="black-ice-description"
                aria-label="Open Black Ice Tailoring website"
                aria-expanded="false"
              >
                <img src="images/BlackIceIcon.png" alt="" draggable="false" />
              </button>
              <div class="project-tooltip" id="black-ice-description">
                <strong>Black Ice Tailoring</strong>
                <span>A refined tailoring website built around an elegant, high-contrast visual identity.</span>
                <button class="project-open" type="button">Open website</button>
              </div>
            </div>
          </div>
        </div>
        <div class="laptop-browser" hidden>
          <div class="browser-toolbar">
            <button class="browser-back" type="button" aria-label="Back to project selection">←</button>
            <span class="browser-title"></span>
          </div>
          <iframe class="project-frame" title="Project website preview"></iframe>
        </div>
      </div>
      <picture>
        <source media="(max-width: 700px)" srcset="images/LaptopOverlayMobile.png" />
        <img class="device-frame" src="images/LaptopOverlay.png" alt="" draggable="false" />
      </picture>
    </div>
  `,

  media: `
    <div class="device-overlay camera-overlay">
      <div class="device-screen camera-screen">
        <iframe
          src="https://www.youtube.com/embed/videoseries?list=PLXK7mN6yKKY1Xsm5F9N0LLBeJJBZTmdMg"
          title="João Silva video portfolio playlist"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      </div>
      <picture>
        <source media="(max-width: 700px)" srcset="images/CameraOverlayMobile.png" />
        <img class="device-frame" src="images/CameraOverlay.png" alt="" draggable="false" />
      </picture>
    </div>
  `,

  contact: `
    <div class="device-overlay phone-overlay">
      <nav class="phone-apps" aria-label="Contact links">
        <a
          class="phone-app phone-app-linkedin"
          href="${contactLinks.linkedin}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit LinkedIn (opens in a new tab)"
        >
          <img src="images/LinkedIn.png" alt="" draggable="false" />
          <span>LinkedIn</span>
        </a>
        <a
          class="phone-app phone-app-github"
          href="${contactLinks.github}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit GitHub (opens in a new tab)"
        >
          <img src="images/GitHub.png" alt="" draggable="false" />
          <span>GitHub</span>
        </a>
        <a
          class="phone-app phone-app-email"
          href="${contactLinks.email}"
          aria-label="Send me an email"
        >
          <img src="images/Email.png" alt="" draggable="false" />
          <span>Email</span>
        </a>
        <button
          class="phone-app phone-back"
          type="button"
          aria-label="Close contact phone"
        >
          <img src="images/BackButton.png" alt="" draggable="false" />
          <span>Back</span>
        </button>
      </nav>
      <img class="device-frame" src="images/PhoneOverlay.png" alt="" draggable="false" />
    </div>
  `,

  branding: `
    <div class="device-overlay koikuro-overlay">
      <picture>
        <source media="(max-width: 700px)" srcset="images/PaperBagOverlayMobile.png" />
        <img
          class="bag-frame"
          src="images/PaperBagOverlay.png"
          alt="Open KoiKuro paper bag"
          draggable="false"
        />
      </picture>

      <div class="bag-items" aria-label="KoiKuro brand project">
        <button class="bag-item bag-sketchbook" type="button" data-brand-section="sketches">
          <img src="images/SketchBook.png" alt="" draggable="false" />
          <span>Sketches</span>
        </button>
        <button class="bag-item bag-menu" type="button" data-brand-section="logo">
          <img src="images/KoiKuroMenu.png" alt="" draggable="false" />
          <span>Final logo</span>
        </button>
        <button class="bag-item bag-chopsticks" type="button" data-brand-section="mockups">
          <img src="images/Chopsticks.png" alt="" draggable="false" />
          <span>Mockups</span>
        </button>
      </div>

      <section class="koikuro-detail" hidden aria-live="polite">
        <button class="koikuro-back" type="button">← Back to bag</button>
        <div class="koikuro-detail-content"></div>
      </section>
    </div>

    <div class="koikuro-lightbox" hidden role="dialog" aria-modal="true" aria-label="Expanded project image">
      <button class="koikuro-lightbox-close" type="button" aria-label="Close expanded image">×</button>
      <img src="" alt="" />
      <p></p>
    </div>
  `,
};

function openSection(sectionName) {
  const sectionContent = portfolioSections[sectionName];

  if (!sectionContent) {
    console.warn(`Section "${sectionName}" does not exist.`);
    return;
  }

  overlayContent.innerHTML = sectionContent;
  overlayPanel.classList.toggle(
    "is-device-panel",
    sectionName === "about" ||
      sectionName === "projects" ||
      sectionName === "media" ||
      sectionName === "contact" ||
      sectionName === "branding",
  );
  overlayPanel.classList.toggle("is-phone-panel", sectionName === "contact");

  if (sectionName === "projects") {
    setupLaptopBrowser();
  }

  if (sectionName === "about") {
    setupNotebookTabs();
  }

  if (sectionName === "contact") {
    overlayContent
      .querySelector(".phone-back")
      .addEventListener("click", closeOverlay);
  }

  if (sectionName === "branding") {
    setupKoiKuroBag();
  }

  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";
  overlayClose.focus();
}

function setupNotebookTabs() {
  const notebook = overlayContent.querySelector(".notebook-overlay");
  const itemsImage = notebook?.querySelector(".notebook-items");
  const tabs = notebook?.querySelectorAll(".notebook-tab");

  if (!notebook || !itemsImage || !tabs?.length) {
    return;
  }

  const notebookPages = {
    about: {
      src: "images/AboutItems.png",
      alt: "About notebook items",
    },
    journey: {
      src: "images/JourneyItems.png",
      alt: "Journey notebook items",
    },
    skills: {
      src: "images/SkillsItems.png",
      alt: "Skills notebook items",
    },
  };

  function selectNotebookPage(pageName) {
    const page = notebookPages[pageName];

    if (!page) {
      return;
    }

    itemsImage.src = page.src;
    itemsImage.alt = page.alt;
    notebook.dataset.notebookPage = pageName;

    tabs.forEach((tab) => {
      const isActive = tab.dataset.notebookTarget === pageName;

      if (isActive) {
        tab.setAttribute("aria-current", "page");
      } else {
        tab.removeAttribute("aria-current");
      }
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      selectNotebookPage(tab.dataset.notebookTarget);
    });
  });
}

function closeOverlay() {
  const brandDetail = overlayContent.querySelector(
    ".koikuro-detail:not([hidden])",
  );

  if (brandDetail) {
    overlayContent.querySelector(".koikuro-back")?.click();
    return;
  }

  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";

  /* Removing an embedded player stops playback after closing the camera. */
  window.setTimeout(() => {
    if (!overlay.classList.contains("is-open")) {
      overlayContent.innerHTML = "";
      overlayPanel.classList.remove("is-device-panel", "is-phone-panel");
    }
  }, 180);
}

function setupLaptopBrowser() {
  const home = overlayContent.querySelector(".laptop-home");
  const browserView = overlayContent.querySelector(".laptop-browser");
  const projectFrame = overlayContent.querySelector(".project-frame");
  const browserTitle = overlayContent.querySelector(".browser-title");
  const backButton = overlayContent.querySelector(".browser-back");
  const projectButtons = overlayContent.querySelectorAll(".project-icon");
  const projectShortcuts = overlayContent.querySelectorAll(".project-shortcut");
  const mobileProjects = window.matchMedia("(max-width: 700px)");

  function openProject(button) {
    projectFrame.src = button.dataset.projectUrl;
    browserTitle.textContent = button.dataset.projectTitle;
    home.hidden = true;
    browserView.hidden = false;
    backButton.focus();
  }

  function selectMobileProject(selectedShortcut) {
    projectShortcuts.forEach((shortcut) => {
      const isSelected = shortcut === selectedShortcut;

      shortcut.classList.toggle("is-selected", isSelected);
      shortcut
        .querySelector(".project-icon")
        ?.setAttribute("aria-expanded", String(isSelected));
    });
  }

  projectButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (mobileProjects.matches) {
        selectMobileProject(button.closest(".project-shortcut"));
        return;
      }

      openProject(button);
    });
  });

  projectShortcuts.forEach((shortcut) => {
    shortcut.querySelector(".project-open")?.addEventListener("click", () => {
      openProject(shortcut.querySelector(".project-icon"));
    });
  });

  backButton.addEventListener("click", () => {
    projectFrame.src = "about:blank";
    browserView.hidden = true;
    home.hidden = false;
    selectMobileProject(null);
    projectButtons[0].focus();
  });
}

function setupKoiKuroBag() {
  const bagItems = overlayContent.querySelector(".bag-items");
  const detail = overlayContent.querySelector(".koikuro-detail");
  const detailContent = overlayContent.querySelector(".koikuro-detail-content");
  const backButton = overlayContent.querySelector(".koikuro-back");
  const itemButtons = overlayContent.querySelectorAll(".bag-item");

  const brandSections = {
    sketches: `
      <p class="detail-kicker">PROCESS</p>
      <h1>Logo Sketches</h1>
      <div class="koikuro-carousel" aria-label="Logo sketches gallery">
        <div class="koikuro-gallery koikuro-sketches">
          <figure><button class="gallery-image-button" type="button"><img src="images/First-Sketch.webp" alt="Early KoiKuro logo sketches" /></button><figcaption>First exploration</figcaption></figure>
          <figure><button class="gallery-image-button" type="button"><img src="images/Sketch-Mid.webp" alt="Intermediate KoiKuro logo sketches" /></button><figcaption>Developing the idea</figcaption></figure>
          <figure><button class="gallery-image-button" type="button"><img src="images/Sketch-Final.webp" alt="Final KoiKuro logo sketch" /></button><figcaption>Final direction</figcaption></figure>
        </div>
        <div class="koikuro-carousel-controls">
          <button class="carousel-previous" type="button" aria-label="Previous image">←</button>
          <span class="carousel-status" aria-live="polite"></span>
          <button class="carousel-next" type="button" aria-label="Next image">→</button>
        </div>
      </div>
    `,
    logo: `
      <p class="detail-kicker">FINAL IDENTITY</p>
      <h1>KoiKuro Logo</h1>
      <div class="koikuro-gallery koikuro-logo-gallery">
        <figure><button class="gallery-image-button" type="button"><img src="images/Logo-Final.png" alt="Final KoiKuro logo" /></button><figcaption>Final logo</figcaption></figure>
      </div>
    `,
    mockups: `
      <p class="detail-kicker">IN CONTEXT</p>
      <h1>Brand Mockups</h1>
      <div class="koikuro-carousel" aria-label="Brand mockups gallery">
        <div class="koikuro-gallery koikuro-mockups">
          <figure><button class="gallery-image-button" type="button"><img src="images/mockup-cup.webp" alt="KoiKuro cup mockup" /></button><figcaption>Takeaway cup</figcaption></figure>
          <figure><button class="gallery-image-button" type="button"><img src="images/mockup-napkin.webp" alt="KoiKuro napkin mockup" /></button><figcaption>Napkin</figcaption></figure>
          <figure><button class="gallery-image-button" type="button"><img src="images/mockup-sign.webp" alt="KoiKuro sign mockup" /></button><figcaption>Restaurant sign</figcaption></figure>
        </div>
        <div class="koikuro-carousel-controls">
          <button class="carousel-previous" type="button" aria-label="Previous image">←</button>
          <span class="carousel-status" aria-live="polite"></span>
          <button class="carousel-next" type="button" aria-label="Next image">→</button>
        </div>
      </div>
    `,
  };

  const lightbox = overlayContent.querySelector(".koikuro-lightbox");
  const lightboxImage = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector("p");
  const lightboxClose = lightbox.querySelector(".koikuro-lightbox-close");
  const mobileBrandGallery = window.matchMedia("(max-width: 700px)");
  let lastExpandedImage = null;

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImage.src = "";
    lastExpandedImage?.focus();
  }

  function setupBrandGallery() {
    const carousel = detailContent.querySelector(".koikuro-carousel");

    if (carousel && mobileBrandGallery.matches) {
      const slides = [...carousel.querySelectorAll("figure")];
      const status = carousel.querySelector(".carousel-status");
      let activeSlide = 0;

      function showSlide(nextSlide) {
        activeSlide = (nextSlide + slides.length) % slides.length;

        slides.forEach((slide, index) => {
          slide.hidden = index !== activeSlide;
        });

        status.textContent = `${activeSlide + 1} / ${slides.length}`;
      }

      carousel
        .querySelector(".carousel-previous")
        .addEventListener("click", () => showSlide(activeSlide - 1));
      carousel
        .querySelector(".carousel-next")
        .addEventListener("click", () => showSlide(activeSlide + 1));
      showSlide(0);
    }

    detailContent
      .querySelectorAll(".gallery-image-button")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const image = button.querySelector("img");

          lastExpandedImage = button;
          lightboxImage.src = image.src;
          lightboxImage.alt = image.alt;
          lightboxCaption.textContent =
            button.closest("figure").querySelector("figcaption")?.textContent ||
            "";
          lightbox.hidden = false;
          lightboxClose.focus();
        });
      });
  }

  itemButtons.forEach((button) => {
    button.addEventListener("click", () => {
      detailContent.innerHTML = brandSections[button.dataset.brandSection];
      bagItems.hidden = true;
      detail.hidden = false;
      setupBrandGallery();
      backButton.focus();
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  backButton.addEventListener("click", () => {
    closeLightbox();
    detail.hidden = true;
    bagItems.hidden = false;
    detailContent.innerHTML = "";
    itemButtons[0].focus();
  });
}

deskObjects.forEach((object) => {
  object.addEventListener("click", (event) => {
    if (deskDrag.suppressClick) {
      event.preventDefault();
      return;
    }

    openSection(object.dataset.section);
  });
});

overlayClose.addEventListener("click", closeOverlay);

const artworkAlphaCanvases = new Map();

/*
  Each device/bag frame is a transparent PNG. Use its alpha channel to tell
  visible artwork clicks from genuine outside clicks instead of treating the
  image's entire rectangular canvas as solid.
*/
function isOpaqueArtworkClick(event, image) {
  if (!image?.complete || !image.naturalWidth || !image.naturalHeight) {
    return false;
  }

  const bounds = image.getBoundingClientRect();

  if (
    event.clientX < bounds.left ||
    event.clientX >= bounds.right ||
    event.clientY < bounds.top ||
    event.clientY >= bounds.bottom
  ) {
    return false;
  }

  let alphaCanvas = artworkAlphaCanvases.get(image.currentSrc);

  if (!alphaCanvas) {
    alphaCanvas = document.createElement("canvas");
    alphaCanvas.width = image.naturalWidth;
    alphaCanvas.height = image.naturalHeight;

    const context = alphaCanvas.getContext("2d", {
      willReadFrequently: true,
    });

    if (!context) {
      return false;
    }

    context.drawImage(image, 0, 0);
    artworkAlphaCanvases.set(image.currentSrc, alphaCanvas);
  }

  const imageX = Math.floor(
    ((event.clientX - bounds.left) / bounds.width) * image.naturalWidth,
  );
  const imageY = Math.floor(
    ((event.clientY - bounds.top) / bounds.height) * image.naturalHeight,
  );
  const context = alphaCanvas.getContext("2d", {
    willReadFrequently: true,
  });

  if (!context) {
    return false;
  }

  let alpha = 0;

  try {
    alpha = context.getImageData(imageX, imageY, 1, 1).data[3];
  } catch (error) {
    console.warn("Could not inspect overlay artwork transparency.", error);
  }

  return alpha > 8;
}

overlay.addEventListener("click", (event) => {
  if (event.target !== overlay) {
    return;
  }

  const overlayArtwork = overlayContent.querySelector(
    [
      ".notebook-base",
      ".laptop-overlay .device-frame",
      ".camera-overlay .device-frame",
      ".phone-overlay > .device-frame",
      ".bag-frame",
    ].join(", "),
  );

  if (isOpaqueArtworkClick(event, overlayArtwork)) {
    return;
  }

  closeOverlay();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeOverlay();
  }
});

/* Periodically wake the phone screen, then let it fade back to sleep. */
let phoneWakeTimer = null;
let phoneSleepTimer = null;

function wakePhoneScreen() {
  if (!phone) {
    return;
  }

  phone.classList.add("is-screen-on");

  window.clearTimeout(phoneSleepTimer);
  phoneSleepTimer = window.setTimeout(() => {
    phone.classList.remove("is-screen-on");
  }, 1800);
}

function schedulePhoneWake() {
  window.clearTimeout(phoneWakeTimer);

  if (document.hidden) {
    phoneWakeTimer = null;
    return;
  }

  const delay = Math.floor(Math.random() * 15000) + 12000;

  phoneWakeTimer = window.setTimeout(() => {
    wakePhoneScreen();
    schedulePhoneWake();
  }, delay);
}

schedulePhoneWake();

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopClockUpdates();
    window.clearTimeout(phoneWakeTimer);
    window.clearTimeout(phoneSleepTimer);
    phoneWakeTimer = null;
    phoneSleepTimer = null;
    phone?.classList.remove("is-screen-on");
    return;
  }

  startClockUpdates();
  schedulePhoneWake();
});
