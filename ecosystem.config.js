const dotenv = require('dotenv');
const path = require('path');

// .env dosyasını manuel yükleyelim
dotenv.config({ path: path.resolve(__dirname, '.env') });

module.exports = {
    apps: [
        {
            name: 'demo-www',
            script: 'node_modules/next/dist/bin/next',
            cwd: '/home/web/asimthecat.com/demo/server/apps/www',
            args: 'start -p 4020',
            env: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'demo-dash',
            script: 'node_modules/next/dist/bin/next',
            cwd: '/home/web/asimthecat.com/demo/server/apps/dash',
            args: 'start -p 4030',
            env: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'demo-api',
            script: 'apps/api/dist/src/main.js',
            cwd: '/home/web/asimthecat.com/demo/server',
            env: {
                NODE_ENV: 'production',
                PORT: 4040,
            },
        },
    ],
};
  