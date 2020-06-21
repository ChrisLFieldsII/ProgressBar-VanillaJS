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
    // customization
    outerBarStyle = {},
    innerBarStyle = {},
    cssPrefix = 'cf-light',

    // event handlers
    onChange = noop,

    // configuration
    autoHideOnEnd = false,
    initProgress = 0,
    autoStart = true,
    autoEnd = true,
  } = {}) {
    this.outerBarStyle = outerBarStyle;
    this.innerBarStyle = innerBarStyle;
    this.cssPrefix = cssPrefix;

    this.onChange = onChange;

    this.autoHideOnEnd = autoHideOnEnd;
    this.initProgress = initProgress;
    this.autoStart = autoStart;
    this.autoEnd = autoEnd;

    this.Container = null;
    this.Bar = null;

    this.progress = 0;
    this.inProgress = false;
    this.height = innerBarStyle.height || '4px';
    this.promiseInterval = null;
    this.interval = null;
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

  /**
   * @desc Hide Progress Bar
   */
  hide = () => {
    this.Bar.style.height = '0';
    return this;
  };

  /**
   * @desc Set Progress Bar to start progress.
   * Must be called before setting progress.
   */
  startProgress = () => {
    this.clearIntervals();
    this.progress = 0;
    this.inProgress = true;
    this.Bar.style.height = this.height;
    return this;
  };

  /**
   * @desc Set Progress Bar to stop progress
   */
  endProgress = () => {
    this.clearIntervals();
    this.inProgress = false;
    if (this.autoHideOnEnd) this.hide();
    return this;
  };

  /**
   * @desc Set progress of Bar
   * @param {number} progress Percentage 0-100
   */
  setProgress = (progress) => {
    if (!this.inProgress) return alert('not in progress');

    if (progress < 0) progress = 0;
    if (progress >= 100) {
      progress = 100;
      if (this.autoEnd) this.endProgress();
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
  startPromises(promises) {
    if (!promises.length) return;

    this.startProgress();

    const numPromises = promises.length;
    const step = 100 / numPromises;
    let promisesAdded = 0;

    this.promiseInterval = setInterval(() => {
      promises.forEach(async (promise) => {
        const promiseState = await getPromiseState(promise);

        const isInDoneState = promiseState === 'fulfilled' || promiseState === 'rejected';
        if (isInDoneState && !promise.addedToProgress) {
          promise.addedToProgress = true;
          const newProgress = promisesAdded * step + step;
          this.setProgress(newProgress);
          promisesAdded++;
        }
      });
    }, 50);

    return this;
  }

  startInterval = ({ progress = 0, repeat = false, step = 20, timeSec = 1 } = {}) => {
    // if want to repeat, autoEnd can not be enabled
    if (repeat) this.autoEnd = false;

    const setIntervalProgress = () => {
      let newProgress = this.progress + step;
      if (newProgress > 100 && repeat) newProgress = 0;
      this.setProgress(newProgress);
    };

    this.startProgress();

    if (progress) this.setProgress(progress);

    // the timeout helps keep progress bar from instantly showing.
    // need to initially set progress since interval takes timeSec to kick in
    setTimeout(setIntervalProgress, 5);

    this.interval = setInterval(() => {
      setIntervalProgress();
    }, 1000 * timeSec);

    return this;
  };

  clearIntervals = () => {
    clearInterval(this.promiseInterval);
    clearInterval(this.interval);
  };

  /**
   * @desc Create Progress Bar
   * @returns {HTMLDivElement} Element
   */
  render = () => {
    // Create outer bar
    const Container = document.createElement('div');
    this.Container = Container;
    Container.classList.add(`${this.cssPrefix}-progressbar-container`);
    this.applyStyle(Container, this.outerBarStyle);

    // Create inner bar
    const Bar = document.createElement('div');
    this.Bar = Bar;
    Bar.classList.add(`${this.cssPrefix}-progressbar`);
    Bar.style.height = this.height;
    Bar.style.width = 0;
    this.applyStyle(Bar, this.innerBarStyle);

    // Check configurations
    if (this.autoStart) this.startProgress();
    if (this.initProgress > 0) this.setProgress(this.initProgress);

    Container.append(Bar);

    return Container;
  };
}

export default ProgressBar;
