module.exports = {
  apps: [
    {
      name: 'weather', // 项目名称
      script: 'weather-server.js', // 要执行的脚本，也就是我们上文中利用 pushstate-server 工具执行 dist 目录内容的脚本。
      node_args: '--max-old-space-size=2048'
    },
  ],
  deploy: {
    production: {
      user: 'root', // 通过root权限进入服务器
      host: '8.218.210.218', // 服务器ip地址
      ref: 'origin/master', // 要拉取代码的分支
      repo: 'git@gitee.com:nnnannn/weather.git', // 代码仓库地址，我存放的是 Github
      path: '/workspace/weather', // 拉取代码后，存放在服务器的文件地址。
      'post-deploy': 'git reset --hard && git checkout master && git pull && npm i --production=false && npm run build:release && pm2 startOrReload ecosystem.config.js', // 顺序执行这些指令，最后 pm2 startOrReload ecosystem.config.js 会通过 pm2 启动 vue3-admin-server.js
      env: {
        NODE_ENV: 'production'
      }
    }
  }
}