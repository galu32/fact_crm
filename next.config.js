const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    // eslint-disable-next-line no-unused-vars
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Important: return the modified config
        if (!dev) config.optimization = {
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        keep_classnames: true,
                        keep_fnames: true
                    }
                })
            ]
        };
        return config;
    },
};