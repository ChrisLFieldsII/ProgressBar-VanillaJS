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
  return interval;
}

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
function FormRow({ label = '', value = '', onChange }) {
  const Container = document.createElement('div');
  const Label = document.createElement('label');
  const Input = document.createElement('input');
  Label.innerHTML = label;
  Input.type = 'number';
  Input.value = value;
  Input.style.margin = '10px';
  Input.addEventListener('change', onChange);
  Container.append(Label, Input);
  return Container;
}

export const Default = () => {
  return new ProgressBar().render();
};

export const Interval = () => {
  const Bar = new ProgressBar();
  const Comp = Bar.render();

  const Container = document.createElement('div');

  startProgressInterval({ Bar });

  Container.append(Comp);

  return Container;
};

export const Promises = () => {
  const Bar = new ProgressBar();
  const Comp = Bar.render();

  let numPromises = 9,
    maxWait = 5;

  const Container = document.createElement('div');

  // Create input to control number of promises
  const NumPromisesFormRow = FormRow({
    label: 'How many Promises to load:&nbsp;',
    value: numPromises,
    onChange: (e) => {
      console.log(e);
      numPromises = e.target.value;
      Bar.setProgressPromises(getPromises(numPromises, maxWait));
    },
  });
  NumPromisesFormRow.style.marginTop = '20px';

  // Create input to control max wait time of any promise
  const MaxWaitTimeFormRow = FormRow({
    label: 'Max time a Promise can wait:&nbsp;',
    value: maxWait,
    onChange: (e) => {
      console.log(e);
      maxWait = e.target.value;
      Bar.setProgressPromises(getPromises(numPromises, maxWait));
    },
  });

  Bar.setProgressPromises(getPromises());

  Container.append(Comp, NumPromisesFormRow, MaxWaitTimeFormRow);

  return Container;
};

export const CustomStyle = () => {
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

export const InitialProgress = () => {
  const Bar = new ProgressBar({
    initProgress: 60,
  });
  const Comp = Bar.render();
  return Comp;
};

export const AutoHideOnEnd = () => {
  let interval;
  const Bar = new ProgressBar({
    autoHideOnEnd: true,
  });
  const Comp = Bar.render();

  interval = startProgressInterval({ Bar, repeat: false });

  const Container = document.createElement('div');

  const Btn = document.createElement('button');
  Btn.innerText = 'Reset';
  Btn.classList.add('btn', 'btn-primary', 'mt-3');
  Btn.addEventListener('click', () => {
    clearInterval(interval);
    Bar.startProgress();

    interval = startProgressInterval({ Bar, repeat: false });
  });

  Container.append(Comp, Btn);

  return Container;
};

// export const Pr
