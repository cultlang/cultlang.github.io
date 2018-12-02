// Example next.config.js for adding a loader that depends on babel-loader
// This source was taken from the @zeit/next-mdx plugin source:
// https://github.com/zeit/next-plugins/blob/master/packages/next-mdx
module.exports = {
    webpack: (config, {}) => {
      config.module.rules.push({
        test: /.md/,
        use: [
          {
            loader: 'raw-loader',
          }
        ]
      })
  
      return config
    }
  }