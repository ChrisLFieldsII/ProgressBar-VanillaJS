import './ProgressBar.css';

/**
 * @desc Progress Bar.
 * Can take array of promises to control progress (uncontrolled) or
 * take a progress prop to manually control (controlled).
 */
class ProgressBar {
  constructor({ promises = [] } = {}) {
    this.promises = promises;

    this.progress = 0;
    this.inProgress = false;
    this.Component = null;

    this.render = this.render.bind(this);
  }

  render() {
    const Component = document.createElement('div');
    this.Component = Component;
    Component.classList.add('cf-progressbar-container');

    const Bar = document.createElement('div');
    Bar.classList.add('cf-progressbar');

    Component.append(Bar);

    return Component;
  }
}

export default ProgressBar;
