import poppingText from "./popping-letters";

export default () => {
  const introTitleEl = document.querySelector(`.intro__title`);
  const introDateEl = document.querySelector(`.intro__date`);
  const historyTitleEl = document.querySelector(`.slider__item-title`);
  const prizesTitleEl = document.querySelector(`.prizes__title`);
  const rulesTitleEl = document.querySelector(`.rules__title`);
  const gameTitleEl = document.querySelector(`.game__title`);

  document.addEventListener(
      `DOMContentLoaded`,
      () => setTimeout(() => document.body.classList.add(`loaded`), 100)
  );
  poppingText(introTitleEl, 600, 200, `cubic-bezier(0.18, 0.89, 0.32, 1)`);
  poppingText(introDateEl, 400, 700);
  poppingText(historyTitleEl, 250, 0, `cubic-bezier(0.18, 0.89, 0.32, 1)`, 8);
  poppingText(prizesTitleEl, 250, 0, `cubic-bezier(0.18, 0.89, 0.32, 1)`);
  poppingText(rulesTitleEl, 250, 0, `cubic-bezier(0.18, 0.89, 0.32, 1)`);
  poppingText(gameTitleEl, 250, 0, `cubic-bezier(0.18, 0.89, 0.32, 1)`);
};
