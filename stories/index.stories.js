import { action } from '@storybook/addon-actions';

import ProgressBar from '../src/ProgressBar';

export default {
  title: 'Demo',
};

export const ProgressBarDefault = () => {
  return new ProgressBar().render();
};
