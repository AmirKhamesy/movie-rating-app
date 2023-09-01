/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["tmdb.org", "themoviedb.org", "image.tmdb.org"],
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcrypt"],
  },
};

module.exports = nextConfig;
