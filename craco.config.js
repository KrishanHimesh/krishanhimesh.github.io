/**
 * craco.config.js
 *
 * Suppresses the webpack source-map-loader warning from @zxing/browser
 * ("Failed to parse source map … BrowserQRCodeSvgWriter.ts … ENOENT")
 *
 * The @zxing packages ship sourceMappingURL comments that point to .ts files
 * which are NOT included in the npm package. Telling webpack to ignore source
 * maps from node_modules eliminates the noise without affecting functionality.
 */
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Remove the existing source-map-loader rule that CRA adds for node_modules
      webpackConfig.module.rules = webpackConfig.module.rules.map((rule) => {
        if (rule.oneOf) {
          rule.oneOf = rule.oneOf.map((oneOfRule) => {
            // Find the source-map-loader rule and restrict it to src/ only
            if (
              oneOfRule.loader &&
              oneOfRule.loader.includes('source-map-loader')
            ) {
              return {
                ...oneOfRule,
                // Only process source maps from your own source files
                include: /src/,
                exclude: /node_modules/,
              };
            }
            return oneOfRule;
          });
        }
        return rule;
      });

      // Belt-and-suspenders: also suppress via ignoreWarnings
      webpackConfig.ignoreWarnings = [
        ...(webpackConfig.ignoreWarnings || []),
        {
          module: /@zxing/,
          message: /Failed to parse source map/,
        },
        // Catch-all for any other node_modules source-map warnings
        function (warning) {
          return (
            warning.message &&
            warning.message.includes('Failed to parse source map') &&
            warning.module &&
            warning.module.resource &&
            warning.module.resource.includes('node_modules')
          );
        },
      ];

      return webpackConfig;
    },
  },
};
