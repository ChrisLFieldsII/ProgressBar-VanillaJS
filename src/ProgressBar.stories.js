import { action } from '@storybook/addon-actions';

import ProgressBar from './ProgressBar';

export default {
  title: 'Progress Bar Demo',
};

export const ProgressBarDefault = () => {
  return new ProgressBar().render();
};
