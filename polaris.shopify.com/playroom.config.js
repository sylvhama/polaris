const path = require('node:path');
const {breakpoints, toPx} = require('@shopify/polaris-tokens');
const breakpointsConfig = Object.values(breakpoints)
  .map((value) => +toPx(value).replace('px', ''))
  .filter((val) => val > 0);

module.exports = {
  baseUrl: '/sandbox/',
  components: './playroom/components.ts',
  outputPath: './public/sandbox',
  // Optional:
  title: 'Polaris Sandbox',
  themes: './playroom/locales.ts',
  //snippets: "./playroom/snippets.js",
  frameComponent: './playroom/FrameComponent.tsx',
  //scope: "./playroom/useScope.js",
  widths: breakpointsConfig,
  port: 9000,
  openBrowser: true,
  paramType: 'hash', // default is 'hash'
  //exampleCode: `
  //  <Button>
  //    Hello World!
  //  </Button>
  //`,
  baseUrl: '/',
  webpackConfig: () => ({
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          include: path.resolve('./playroom'),
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                presets: [
                  [
                    require.resolve('@babel/preset-env'),
                    {shippedProposals: true},
                  ],
                  require.resolve('@babel/preset-react'),
                  require.resolve('@babel/preset-typescript'),
                ],
                plugins: [require.resolve('babel-plugin-preval')],
              },
            },
          ],
        },
        {
          test: /\.css$/i,
          include: path.dirname(
            require.resolve('@shopify/polaris/package.json'),
          ),
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
  }),
  iframeSandbox: 'allow-scripts',
};
