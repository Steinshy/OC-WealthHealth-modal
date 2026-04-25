import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.ts?(x)'],
  addons: ['@storybook/addon-a11y'],
  async viteFinal(viteConfig) {
    return mergeConfig(viteConfig, {
      /** Relative assets so the static build works under e.g. GitHub Pages /repo/storybook/ */
      base: './',
      /** Storybook preview iframe bundles React, a11y (axe), etc.; expect >500 kB minified */
      build: {
        chunkSizeWarningLimit: 1600,
      },
    });
  },
};

export default config;
