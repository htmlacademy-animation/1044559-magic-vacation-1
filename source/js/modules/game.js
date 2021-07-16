const COUNTER_MAX = 5 * 60 * 1000; // 5 minutes
const FPS_INTERVAL = 250;

export default () => {
  const counter = document.querySelector(`.game__counter`);
  const [minutes, seconds] = counter.querySelectorAll(`span`);
  let requestId;

  function startCounter() {
    const start = Date.now() + COUNTER_MAX;
    let now;
    let then = Date.now();
    let elapsed;

    if (requestId) {
      stopCounter();
    }

    function tick() {
      requestId = requestAnimationFrame(tick);
      const timeRemaining = start - Date.now();
      now = Date.now();
      elapsed = now - then;
      if (elapsed > FPS_INTERVAL && timeRemaining > 0) {
        then = now - (elapsed % FPS_INTERVAL);
        changeNumbers(timeRemaining);
      } else if (timeRemaining <= 0) {
        stopCounter();
      }
    }

    requestId = requestAnimationFrame(tick);
  }

  function stopCounter() {
    window.cancelAnimationFrame(requestId);
  }

  function changeNumbers(timeRemaining) {
    minutes.textContent = String(Math.floor(timeRemaining / 1000 / 60)).padStart(2, `0`);
    seconds.textContent = String(Math.floor((timeRemaining / 1000) % 60)).padStart(2, `0`);
  }

  window.addEventListener(`popstate`, () => {
    if (window.location.hash === `#game`) {
      startCounter();
    } else {
      stopCounter();
      minutes.textContent = `05`;
      seconds.textContent = `00`;
    }
  });

  window.addEventListener(`DOMContentLoaded`, () => {
    if (window.location.hash === `#game`) {
      startCounter();
    }
  });
};
