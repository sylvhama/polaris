/* eslint-disable require-await */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    scrollRestoration: true,
  },
  async rewrites() {
    return [
      // We want to rewrite the sandbox route in production
      // to point at the public directory that our playroom assets are built to
      ...(process.env.NODE_ENV === 'production'
        ? [
            {
              source: '/sandbox',
              destination: '/sandbox/index.html',
            },
          ]
        : []),
    ];
  },
  async headers() {
    return [
      {
        source: '/api/tokens/v0:path*',
        headers: [
          {key: 'Access-Control-Allow-Credentials', value: 'true'},
          {key: 'Access-Control-Allow-Origin', value: '*'},
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // We run a redirect to port 9000 for non prod environments
      // as playroom files aren't built to the public directory in dev mode.
      ...(process.env.NODE_ENV !== 'production'
        ? [
            {
              source: '/sandbox',
              destination: 'http://localhost:9000',
              permanent: false,
            },
          ]
        : []),
      {
        source: '/components/get-started',
        destination: '/components',
        permanent: false,
      },
      {
        source: '/components/:category/:slug',
        destination: '/components/:slug',
        permanent: false,
      },
      {
        source: '/content/:slug',
        destination: '/foundations/content/:slug',
        permanent: false,
      },
      {
        source: '/design/:slug',
        destination: '/foundations/design/:slug',
        permanent: false,
      },
      {
        source: '/foundations/:slug',
        destination: '/foundations/foundations/:slug',
        permanent: false,
      },
      {
        source: '/patterns/:slug',
        destination: '/foundations/patterns/:slug',
        permanent: false,
      },
      {
        source: '/foundations/patterns/layout',
        destination: '/foundations/patterns/page-layouts',
        permanent: false,
      },
      {
        source: '/foundations/foundations/designing-apps',
        destination: 'https://shopify.dev/apps/design-guidelines',
        permanent: false,
      },
      {
        source: '/foundations/content/app-release-notes',
        destination: 'https://shopify.dev/apps/design-guidelines',
        permanent: false,
      },
      {
        source: '/tokens/all-tokens',
        destination: '/tokens/colors',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
