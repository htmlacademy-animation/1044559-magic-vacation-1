import debounce from 'lodash/debounce';

function removeSrc(img) {
  img.src = ``;
}

function activateSvg(prizeItem, img, path, timeout, timeouts) {
  const prizeTimeout = setTimeout(function () {
    img.src = `${path}?${new Date().getTime()}`;
    prizeItem.classList.add(`prizes__item--active`);
  }, timeout);
  timeouts.push(prizeTimeout);
}

export default class FullPageScroll {
  constructor() {
    this.DEBOUNCE_TIMEOUT = 200;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);

    this.activeScreen = 0;
    this.previousScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
    this.transitionsWithTimeout = [{prev: `story`, next: `prizes`}, {prev: `prizes`, next: `rules`}];
    this.timeOuts = [];
  }

  init() {
    document.addEventListener(`wheel`, debounce(this.onScrollHandler, this.DEBOUNCE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    const currentPosition = this.activeScreen;
    this.reCalculateActiveScreenPosition(evt.deltaY);
    if (currentPosition !== this.activeScreen) {
      this.changePageDisplay();
    }
  }

  clearTimeouts() {
    this.timeOuts.forEach((timeout) => clearTimeout(timeout));
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.previousScreen = this.activeScreen;
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
  }

  activateSvgs() {
    if (this.activeScreen === 2 && this.previousScreen !== 2) {
      const prizesSection = document.querySelector(`.prizes`);
      const prize1item = prizesSection.querySelector(`.prizes__item--journeys`);
      const prize2item = prizesSection.querySelector(`.prizes__item--cases`);
      const prize3item = prizesSection.querySelector(`.prizes__item--codes`);
      const imgPrize1 = prizesSection.querySelector(`.prizes__prize1`);
      const imgPrize2 = prizesSection.querySelector(`.prizes__prize2`);
      const imgPrize3 = prizesSection.querySelector(`.prizes__prize3`);
      [prize1item, prize2item, prize3item].forEach((item) => item.classList.remove(`prizes__item--active`));
      [imgPrize1, imgPrize2, imgPrize3].forEach(removeSrc);

      activateSvg(prize1item, imgPrize1, `img/prize1.svg`, 0, this.timeOuts);
      activateSvg(prize2item, imgPrize2, `img/prize2.svg`, 3333, this.timeOuts);
      activateSvg(prize3item, imgPrize3, `img/prize3.svg`, 5555, this.timeOuts);
    }
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  changeScreenTransitionDuration(prevId, activeId) {
    return this.transitionsWithTimeout.some((transition) => {
      return prevId === transition.prev && activeId === transition.next;
    }) ? 350 : 0;
  }

  changeVisibilityDisplay() {
    this.clearTimeouts();
    this.activateSvgs();
    const timeout = this.changeScreenTransitionDuration(this.screenElements[this.previousScreen].id, this.screenElements[this.activeScreen].id);

    this.screenElements.forEach((screen) => {
      if (timeout && (screen.id === `story` || screen.id === `prizes`)) {
        setTimeout(() => {
          screen.classList.add(`screen--hidden`);
        }, timeout);
      } else {
        screen.classList.add(`screen--hidden`);
      }
      screen.classList.remove(`active`);
    });

    if (timeout) {
      setTimeout(() => this.screenElements[this.activeScreen].classList.remove(`screen--hidden`), timeout);
    } else {
      this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
    }
    setTimeout(() => this.screenElements[this.activeScreen].classList.add(`active`), 0);
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen],
      },
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    this.previousScreen = this.activeScreen;
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }
}
