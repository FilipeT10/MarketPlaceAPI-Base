export const environment = {
    server: { port: process.env.PORT || 3000},
    db: {url: process.env.MONGODB_URI || 'mongodb+srv://developer:loHC0F2Afb6MmB8f@marketplace.qsxoe.mongodb.net/myFirstDatabase'},
    security: {
        saltRounds: process.env.SALT_ROUND || 11,
        apiSecret: process.env.API_SECRET || 'marketplace-api-secret'
    }
}