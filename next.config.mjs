/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.dummyjson.com' },
      { protocol: 'https', hostname: 'i.dummyjson.com' },
    ],
  },
};
export default nextConfig;
