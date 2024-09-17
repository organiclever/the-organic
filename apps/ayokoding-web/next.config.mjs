/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@libs/hello"],
  experimental: {
    serverComponentsExternalPackages: ["@notionhq/client"],
  },
  output: "standalone",
};

export default nextConfig;
