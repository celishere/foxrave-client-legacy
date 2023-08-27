/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['@vime/react'],
    env: {
        API_URL: `https://c32e-46-249-27-61.ngrok-free.app/api/v1`,
        WS_URL: `ws://localhost:4040`
    }
}

module.exports = nextConfig
