const COUNTER_MAX = 5 * 60 * 1000; // 5 minutes
const FPS_INTERVAL = 500;

export default () => {
  const counter = document.querySelector(`.game__counter`);
  const [minutes, seconds] = counter.querySelectorAll(`span`);
  let requestId;

  function startCounter() {
    const start = Date.now();
    let now;
    let then = Date.now();
    let elapsed;

    if (requestId) {
      stopCounter();
    }

    function tick() {
      requestId = requestAnimationFrame(tick);
      const timeRemaining = Date.now() - start;
      now = Date.now();
      elapsed = now - then;
      if (elapsed > FPS_INTERVAL && timeRemaining < COUNTER_MAX + FPS_INTERVAL) {
        then = now - (elapsed % FPS_INTERVAL);
        changeNumbers(timeRemaining);
      } else if (timeRemaining > COUNTER_MAX) {
        stopCounter();
      }
    }

    requestId = requestAnimationFrame(tick);
  }

  function stopCounter() {
    window.cancelAnimationFrame(requestId);
  }

  function changeNumbers(timePassed) {
    minutes.textContent = String(Math.floor(timePassed / 1000 / 60)).padStart(2, `0`);
    seconds.textContent = String(Math.floor((timePassed / 1000) % 60)).padStart(2, `0`);
  }

  window.addEventListener(`popstate`, () => {
    if (window.location.hash === `#game`) {
      startCounter();
    } else {
      stopCounter();
      minutes.textContent = `00`;
      seconds.textContent = `00`;
    }
  });

  window.addEventListener(`DOMContentLoaded`, () => {
    if (window.location.hash === `#game`) {
      startCounter();
    }
  });
};
