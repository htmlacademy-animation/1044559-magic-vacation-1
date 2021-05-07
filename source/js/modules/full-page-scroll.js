import debounce from 'lodash/debounce';

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

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.previousScreen = this.activeScreen;
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
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
