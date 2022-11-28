export default () => ({
    port: parseInt(process.env.PORT, 10) || 9090,
    jwt_secret: process.env.JWT_SECRET,
    jwt_expiration_time: process.env.JWT_EXPIRATION_TIME,
});
