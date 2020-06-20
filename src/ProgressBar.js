import './ProgressBar.css';

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
 */
class ProgressBar {
  constructor({ autoHideOnEnd = true } = {}) {
    this.autoHideOnEnd = autoHideOnEnd;

    this.progress = 0;
    this.inProgress = false;
    this.Container = null;
    this.Bar = null;
    this.interval = null;
  }

  startProgress = () => {
    this.progress = 0;
    this.inProgress = true;
    this.Bar.style.height = '4px';
  };

  endProgress = () => {
    clearInterval(this.interval);
    this.inProgress = false;
    if (this.autoHideOnEnd) this.hide();
  };

  /**
   * @desc Set progress of Bar
   * @param {number} progress Percentage 0-100
   */
  setProgress = (progress) => {
    this.progress = progress;
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
  }

  hide = () => {
    this.Bar.style.height = '0';
  };

  render = () => {
    const Container = document.createElement('div');
    this.Container = Container;
    Container.classList.add('cf-progressbar-container');

    const Bar = document.createElement('div');
    this.Bar = Bar;
    Bar.classList.add('cf-progressbar');
    Bar.style.height = '4px';

    Container.append(Bar);

    this.setProgress(0);

    return Container;
  };
}

export default ProgressBar;
