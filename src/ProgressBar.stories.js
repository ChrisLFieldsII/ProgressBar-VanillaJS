import { action } from '@storybook/addon-actions';

import ProgressBar from './ProgressBar';

export default {
  title: 'Progress Bar Demo',
};

function startProgressInterval({ Bar, progress = 0, repeat = true }) {
  let interval = setInterval(() => {
    progress += 20;
    if (progress > 100 && repeat) progress = 0;
    else if (progress > 100 && !repeat) clearInterval(interval);
    Bar.setProgress(progress);
  }, 1000);
}

export const ProgressBarDefault = () => {
  return new ProgressBar().render();
};

export const ProgresBarInterval = () => {
  const Bar = new ProgressBar();
  const Comp = Bar.render();

  startProgressInterval({ Bar });

  return Comp;
};

async function wait(time) {
  return new Promise((res) => {
    setTimeout(() => {
      res('done');
    }, time * 1000);
  });
}
function getPromises(numPromises = 9, waitTime = 5) {
  return new Array(Number(numPromises)).fill('').map((_) => wait(Math.random() * Number(waitTime)));
}

export const ProgressBarPromises = () => {
  const Bar = new ProgressBar();
  const Comp = Bar.render();

  let numPromises = 9,
    maxWait = 5;

  const Container = document.createElement('div');

  // Create input to control number of promises
  const NumPromisesContainer = document.createElement('div');
  const NumPromisesLabel = document.createElement('label');
  const NumPromisesInput = document.createElement('input');
  NumPromisesLabel.innerHTML = 'How many Promises to load:&nbsp;';
  NumPromisesInput.type = 'number';
  NumPromisesInput.value = numPromises;
  NumPromisesInput.style.margin = '10px';
  NumPromisesInput.addEventListener('change', (e) => {
    console.log(e);
    numPromises = e.target.value;
    Bar.setProgressPromises(getPromises(numPromises, maxWait));
  });
  NumPromisesContainer.append(NumPromisesLabel, NumPromisesInput);

  // Create input to control max wait time of any promise
  const MaxWaitTimeContainer = document.createElement('div');
  const MaxWaitTimeLabel = document.createElement('label');
  const MaxWaitTimeInput = document.createElement('input');
  MaxWaitTimeLabel.innerHTML = 'Max time a Promise can wait:&nbsp;';
  MaxWaitTimeInput.type = 'number';
  MaxWaitTimeInput.value = maxWait;
  MaxWaitTimeInput.style.margin = '10px';
  MaxWaitTimeInput.addEventListener('change', (e) => {
    console.log(e);
    maxWait = e.target.value;
    Bar.setProgressPromises(getPromises(numPromises, maxWait));
  });
  MaxWaitTimeContainer.append(MaxWaitTimeLabel, MaxWaitTimeInput);

  Bar.setProgressPromises(getPromises());

  Comp.style.marginTop = '20px';

  Container.append(NumPromisesContainer, MaxWaitTimeContainer, Comp);

  return Container;
};

export const ProgressBarCustomStyle = () => {
  const Bar = new ProgressBar({
    innerBarStyle: {
      backgroundColor: 'orange',
      height: '10px',
      borderRadius: '10px',
    },
    outerBarStyle: {
      borderRadius: '10px',
    },
  });
  const Comp = Bar.render();

  startProgressInterval({ Bar, repeat: false });

  return Comp;
};

export const ProgressBarInitialProgress = () => {
  const Bar = new ProgressBar({
    initProgress: 60,
  });
  const Comp = Bar.render();
  return Comp;
};
