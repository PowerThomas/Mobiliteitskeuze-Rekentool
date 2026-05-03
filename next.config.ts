import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'Mobiliteitskeuze-Rekentool';

const nextConfig: NextConfig = {
  output: 'export',
  // On GitHub Pages the app lives at /<repo-name>/
  // In dev (NODE_ENV=development) basePath is empty so localhost:3000 still works.
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  trailingSlash: true,
};

export default nextConfig;
