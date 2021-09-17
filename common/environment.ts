export const environment = {
    server: { port: process.env.PORT || 3000},
    db: {url: process.env.DB_URL || 'mongodb://localhost/marketplace-manager'},
    security: {
        saltRounds: process.env.SALT_ROUND || 11,
        apiSecret: process.env.API_SECRET || 'marketplace-api-secret'
    }
}