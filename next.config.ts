import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  webpack(config, { webpack }) {
    config.plugins.push(new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    }));
    return config;
  },
};
export default nextConfig;
