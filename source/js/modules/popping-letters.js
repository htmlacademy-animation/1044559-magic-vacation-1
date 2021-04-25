/**
 * Function gives the HTML Element contains text. Make it animated.
 *
 * @param {Element} domNode - target DOM Element to animate
 * @param {number} duration - animation-duration
 * @param {number} delay - initial delay of entire animation
 * @param {string} timingFunction - string describes the animation timing function
 * @param {number} waveLength - affects relative delays between neighbor letters. Recommend even number between 4 and 12
 * @param {boolean} reverse - if yes letters will fall down
 */
function poppingText(domNode, duration = 800, delay = 100, timingFunction = `ease-out`, waveLength = 6, reverse = false) {
  const words = domNode.textContent.split(` `);
  domNode.innerHTML = ``;
  let animDelayCounter = 0;

  words.forEach((word, idx) => {
    const span = document.createElement(`span`);
    const letters = word.split(``);
    span.classList.add(`anim-popping`);
    letters.forEach((letter) => {
      const letterSpan = document.createElement(`span`);
      animDelayCounter++;
      if (reverse) {
        letterSpan.classList.add(`anim-popping__letter--reverse`);
      } else {
        letterSpan.classList.add(`anim-popping__letter`);
      }
      letterSpan.textContent = letter;
      letterSpan.style.animationDuration = duration / (idx + 1) * 1.5 + `ms`;
      letterSpan.style.animationTimingFunction = timingFunction;
      letterSpan.style.animationDelay =
        (Math.abs((animDelayCounter % waveLength) - waveLength / 2)
        * (Math.trunc(Math.random() * 75 / (idx + 1)) + 75))
        + (duration / (idx + 1) * idx * 1.5)
        + delay
        + `ms`;
      span.appendChild(letterSpan);
    });
    domNode.appendChild(span);
    if (idx < words.length - 1) {
      domNode.insertAdjacentHTML(`beforeend`, ` `);
    }
  });
}

export default poppingText;
