module.exports = {
  apps: [
    {
      name: 'bot',
      script: './build/server.js',
      wait_ready: true,
      listen_timeout: 10000,
      exec_mode: 'cluster',
      instances: 'max',
      exp_backoff_restart_delay: 100
    }
  ]
};