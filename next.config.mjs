/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config, context) {
        const { isServer, dev } = context
        if (!isServer && !dev) {
            config.optimization.splitChunks.cacheGroups.asyncChunks = {
                enforce: true,
                type: "css/mini-extract",
                chunks: 'async',
            }
        }
        return config
    }
}

export default nextConfig;
