module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Disable source maps in production to reduce bundle size
      if (process.env.NODE_ENV === 'production') {
        webpackConfig.devtool = false;
      }
      
      return webpackConfig;
    },
  },
};