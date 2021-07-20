const FPS_INTERVAL = 1000 / 12;

export function removeSrc(img) {
  img.src = ``;
}

export function activateSvg(prizeItem, img, path, timeout, timeouts) {
  const prizeTimeout = setTimeout(function () {
    img.src = `${path}?${new Date().getTime()}`;
    prizeItem.classList.add(`prizes__item--active`);
  }, timeout);
  timeouts.push(prizeTimeout);
}

function activateSvgTitleAnimation(element, from, to, transformFunction) {
  const finish = Date.now() + FPS_INTERVAL * 7;
  let requestId;
  let then = Date.now();
  let now;
  let elapsed;

  function tick() {
    requestId = requestAnimationFrame(tick);
    const timeRemaining = finish - Date.now();
    now = Date.now();
    elapsed = now - then;
    if (elapsed > FPS_INTERVAL && timeRemaining > 0) {
      then = now - (elapsed % FPS_INTERVAL);
      element.textContent = transformFunction(element.textContent);
    } else if (timeRemaining <= 0) {
      element.textContent = to;
      window.cancelAnimationFrame(requestId);
    }
  }

  requestId = requestAnimationFrame(tick);
}

function activateSvgTitleAnimationWithTimeout(selector, from, to, timeout, transformFunction) {
  const element = document.querySelector(selector);
  element.textContent = from;
  return setTimeout(() => activateSvgTitleAnimation(element, from, to, transformFunction), timeout);
}

function transformPrizesTitle(title) {
  return String(((Math.random() * 200) + Number(title)).toFixed(0));
}

export function activatePrizesTitleAnimation(selector, from, to, timeout) {
  return activateSvgTitleAnimationWithTimeout(selector, from, to, timeout, transformPrizesTitle);
}

function transformCasesTitle(title) {
  return Number(title) + 1;
}

export function activateCasesTitleAnimation(selector, from, to, timeout) {
  return activateSvgTitleAnimationWithTimeout(selector, from, to, timeout, transformCasesTitle);
}


