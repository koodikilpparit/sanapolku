module.exports = {
    ci: {
        collect: {
            url: ['http://localhost:3000/'],
            startServerCommand: 'npm run serve',
        },
        upload: {
            target: 'temporary-public-storage',
        },
    },
};