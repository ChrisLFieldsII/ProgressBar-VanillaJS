import { action } from '@storybook/addon-actions';

import ProgressBar from './ProgressBar';

export default {
  title: 'Progress Bar Demo',
};

async function wait(time) {
  return new Promise((res) => {
    setTimeout(() => {
      res('done');
    }, time * 1000);
  });
}
const getPromises = () => new Array(9).fill('').map((o) => wait(Math.floor(Math.random() * 5)));

export const ProgressBarDefault = () => {
  return new ProgressBar().render();
};

export const ProgresBarInterval = () => {
  const Bar = new ProgressBar();
  const Comp = Bar.render();
  let progress = 0;

  setInterval(() => {
    progress += 20;
    if (progress > 100) progress = 0;
    Bar.setProgress(progress);
  }, 1000);

  return Comp;
};

export const ProgressBarPromises = () => {
  const Bar = new ProgressBar();
  const Comp = Bar.render();

  Bar.setProgressPromises(getPromises());

  return Comp;
};
