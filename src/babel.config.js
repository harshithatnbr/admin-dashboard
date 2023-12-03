module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }], // Add the decorator plugin
    // Include any other necessary plugins for your project
  ],
};
