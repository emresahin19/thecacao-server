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
        // {
        //     name: 'demo-api', 
        //     script: 'node dist/apps/api/main.js', 
        //     cwd: './project',
        //     env: {
        //     NODE_ENV: 'production',
        //         PORT: 4040, 
        //     },
        // },
    ],
};
  