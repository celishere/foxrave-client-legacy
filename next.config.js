/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    transpilePackages: ['@vime/react'],
    env: {
        API_URL: `http://localhost:4242/api/v1`,
        WS_URL: `ws://localhost:4040`
    }
}

module.exports = nextConfig
