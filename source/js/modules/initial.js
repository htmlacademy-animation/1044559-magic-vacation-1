import poppingText from "./popping-letters";

export default () => {
  const introDomElement = document.querySelector(`.intro__title`);
  document.addEventListener(
      `DOMContentLoaded`,
      () => setTimeout(() => document.body.classList.add(`loaded`), 100)
  );
  poppingText(introDomElement, 700, 200, `cubic-bezier(0.18, 0.89, 0.32, 1)`);
};
