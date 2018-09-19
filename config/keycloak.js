module.exports = {
    config: {
        username: 'test1',
        password: 'test',
        grant_type: 'password',
        client_id: 'admin-cli'
    },
    tokenUrl: '/realms/master/protocol/openid-connect/token',
    baseUrl: 'http://localhost:8080/auth'
};