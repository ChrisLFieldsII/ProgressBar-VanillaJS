import './ProgressBar.css';

function noop() {}

// https://stackoverflow.com/questions/30564053/how-can-i-synchronously-determine-a-javascript-promises-state
async function getPromiseState(promise) {
  const test = {};
  return Promise.race([promise, test]).then(
    (v) => (v === test ? 'pending' : 'fulfilled'),
    () => 'rejected'
  );
}

/**
 * @desc Progress Bar.
 * Can take array of promises to control progress (uncontrolled) or
 * manually set progress (controlled).
 * Note: Only apply height to inner bar
 */
class ProgressBar {
  constructor({
    autoHideOnEnd = false,
    outerBarStyle = {},
    innerBarStyle = {},
    initProgress = 0,
    cssPrefix = 'cf-light',
    onChange = noop,
  } = {}) {
    this.autoHideOnEnd = autoHideOnEnd;
    this.outerBarStyle = outerBarStyle;
    this.innerBarStyle = innerBarStyle;
    this.initProgress = initProgress;
    this.cssPrefix = cssPrefix;
    this.onChange = onChange;

    this.progress = 0;
    this.inProgress = false;
    this.Container = null;
    this.Bar = null;
    this.interval = null;
    this.height = innerBarStyle.height || '4px';
  }

  /**
   * @desc Take style object and apply to element
   * @param {HTMLElement} element Element
   */
  applyStyle = (element, style) => {
    Object.entries(style).forEach(([key, value]) => {
      element.style[key] = value;
    });
  };

  startProgress = () => {
    this.progress = 0;
    this.inProgress = true;
    this.Bar.style.height = this.height;
    return this;
  };

  endProgress = () => {
    clearInterval(this.interval);
    this.inProgress = false;
    if (this.autoHideOnEnd) this.hide();
    return this;
  };

  /**
   * @desc Set progress of Bar
   * @param {number} progress Percentage 0-100
   */
  setProgress = (progress) => {
    if (progress < 0) progress = 0;
    if (progress >= 100) {
      progress = 100;
      this.endProgress();
    }

    this.progress = progress;
    this.onChange(progress);
    this.Bar.style.width = progress + '%';
    return this;
  };

  /**
   * @desc Set progress based off of promises
   * @param {Array.<Promise>} promises Array of promises
   */
  setProgressPromises(promises) {
    if (!promises.length) return;

    clearInterval(this.interval);
    this.startProgress();

    const numPromises = promises.length;
    const step = 100 / numPromises;
    let promisesAdded = 0;

    this.interval = setInterval(() => {
      promises.forEach(async (promise) => {
        const promiseState = await getPromiseState(promise);
        console.log(promiseState);

        const isInDoneState = promiseState === 'fulfilled' || promiseState === 'rejected';
        if (isInDoneState && !promise.addedToProgress) {
          promise.addedToProgress = true;
          const newProgress = promisesAdded * step + step;
          this.setProgress(newProgress);
          promisesAdded++;

          // check if this was last promise to be added
          if (promisesAdded === numPromises) {
            this.endProgress();
          }
        }
      });
    }, 50);

    return this;
  }

  hide = () => {
    this.Bar.style.height = '0';
    return this;
  };

  render = () => {
    const Container = document.createElement('div');
    this.Container = Container;
    Container.classList.add(`${this.cssPrefix}-progressbar-container`);
    this.applyStyle(Container, this.outerBarStyle);

    const Bar = document.createElement('div');
    this.Bar = Bar;
    Bar.classList.add(`${this.cssPrefix}-progressbar`);
    Bar.style.height = this.height;
    this.applyStyle(Bar, this.innerBarStyle);

    Container.append(Bar);

    this.setProgress(this.initProgress);

    return Container;
  };
}

export default ProgressBar;
