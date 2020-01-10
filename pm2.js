module.exports = {
  apps: [
    {
      name: "viact-backend",
      script: "./src/local.js",
      watch: true,
      env_production: {
        "PORT": 80,
        "NODE_ENV": "production",
      }
    }
  ]
}