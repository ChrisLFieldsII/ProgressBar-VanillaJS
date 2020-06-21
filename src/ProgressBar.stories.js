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
function getPromises(numPromises = 9, waitTime = 5) {
  return new Array(Number(numPromises)).fill('').map((_) => wait(Math.random() * Number(waitTime)));
}

function FormRow({ label = '', value = '', onChange, type = 'number' }) {
  const Container = document.createElement('div');
  const Label = document.createElement('label');
  const Input = document.createElement('input');
  Label.innerHTML = label;
  Input.type = type;
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

  let step = 20,
    timeSec = 1,
    repeat = false;

  // Create input to control interval step
  const StepFormRow = FormRow({
    label: 'Set Interval Step',
    value: step + '',
    onChange: (e) => {
      step = Number(e.target.value);
      Bar.startInterval({ step, timeSec, repeat });
    },
  });
  StepFormRow.style.marginTop = '20px';

  // Create input to control interval time
  const TimeFormRow = FormRow({
    label: 'Set Interval Time',
    value: timeSec + '',
    onChange: (e) => {
      timeSec = e.target.value;
      Bar.startInterval({ step, timeSec, repeat });
    },
  });

  const RepeatRow = FormRow({
    label: 'Repeat',
    value: repeat,
    type: 'checkbox',
    onChange: (e) => {
      repeat = e.target.checked;
      Bar.startInterval({ step, timeSec, repeat });
    },
  });

  Bar.startInterval();

  Container.append(Comp, StepFormRow, TimeFormRow, RepeatRow);

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
      numPromises = e.target.value;
      Bar.startPromises(getPromises(numPromises, maxWait));
    },
  });
  NumPromisesFormRow.style.marginTop = '20px';

  // Create input to control max wait time of any promise
  const MaxWaitTimeFormRow = FormRow({
    label: 'Max time a Promise can wait:&nbsp;',
    value: maxWait,
    onChange: (e) => {
      maxWait = e.target.value;
      Bar.startPromises(getPromises(numPromises, maxWait));
    },
  });

  Bar.startPromises(getPromises());

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

  Bar.startInterval({ repeat: true });

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
  const Bar = new ProgressBar({
    autoHideOnEnd: true,
  });
  const Comp = Bar.render();

  Bar.startInterval({ repeat: false, step: 40 });

  const Container = document.createElement('div');

  const Btn = document.createElement('button');
  Btn.innerText = 'Reset';
  Btn.classList.add('btn', 'btn-primary', 'mt-3');
  Btn.addEventListener('click', () => {
    Bar.startInterval({ repeat: false, step: 40 });
  });

  Container.append(Comp, Btn);

  return Container;
};

// export const Pr
