const path = require("path");

module.exports = {
  webpack: (config, _) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@widget": path.resolve(__dirname, "./src/containers/Common/widget"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@models": path.resolve(__dirname, "./src/models"),
      "@navigation": path.resolve(__dirname, "./src/navigation"),
      "@common": path.resolve(__dirname, "./src/components/Common"),
    };
    return config;
  },
};
