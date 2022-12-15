export default () => ({
    application_port: parseInt(process.env.NGINX_PORT, 10) || 9090,
    jwt_access_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    jwt_access_expiration_time: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    jwt_refresh_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    jwt_refresh_expiration_time: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
});
