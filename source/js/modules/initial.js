import poppingText from "./popping-letters";

export default () => {
  const introTitleEl = document.querySelector(`.intro__title`);
  const introDateEl = document.querySelector(`.intro__date`);
  document.addEventListener(
      `DOMContentLoaded`,
      () => setTimeout(() => document.body.classList.add(`loaded`), 100)
  );
  poppingText(introTitleEl, 600, 200, `cubic-bezier(0.18, 0.89, 0.32, 1)`);
  poppingText(introDateEl, 400, 700, ``, 6);
};
