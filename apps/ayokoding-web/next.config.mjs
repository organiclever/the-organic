/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@libs/hello"],
  experimental: {
    serverComponentsExternalPackages: ["@notionhq/client"],
  },
};

export default nextConfig;
