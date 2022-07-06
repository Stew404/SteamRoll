/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['steamcdn-a.akamaihd.net', 'cdn2.steamgriddb.com'],
  }
}

module.exports = nextConfig
