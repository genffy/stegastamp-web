module.exports = {
  apps: [{
    name: process.env.npm_package_name,
    // 启动脚本的位置, 其余参数按需配置
    script: "node_modules/next/dist/bin/next",
    args: "start",
    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 1,
    autorestart: true,
    watch: false,
    exec_mode: 'fork',
    max_memory_restart: '1G',
    env: {
      PORT: 3000,
      NODE_ENV: process.env.NODE_ENV,
    },
  }]
};
