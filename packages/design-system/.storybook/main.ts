import type { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.ts', '../src/**/*.mdx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  viteFinal(viteConfig) {
    // Storybook loads the package's vite.config.ts, which is configured for the
    // library build. Those options are meaningless (and harmful) for the docs
    // site, so drop them and set the Pages sub-path instead.
    delete viteConfig.build?.lib;
    viteConfig.base = process.env.STORYBOOK_BASE_PATH ?? '/';
    return viteConfig;
  },
};

export default config;
