import './ProgressBar.css';

/**
 * @desc Progress Bar.
 * Can take array of promises to control progress (uncontrolled) or
 * manually set progress (controlled).
 */
class ProgressBar {
  constructor({ promises = [] } = {}) {
    this.promises = promises;

    this.percentage = 0;
    this.inProgress = false;
    this.Container = null;
    this.Bar = null;

    this.render = this.render.bind(this);
    this.setProgress = this.setProgress.bind(this);
  }

  render() {
    const Container = document.createElement('div');
    this.Container = Container;
    Container.classList.add('cf-progressbar-container');

    const Bar = document.createElement('div');
    this.Bar = Bar;
    Bar.classList.add('cf-progressbar');

    Container.append(Bar);

    this.setProgress(0);

    return Container;
  }

  /**
   * @desc Set progress of Bar
   * @param {number} percentage Percentage 0-100
   */
  setProgress(percentage) {
    this.percentage = percentage;
    this.Bar.style.width = percentage + '%';
    return this;
  }
}

export default ProgressBar;
