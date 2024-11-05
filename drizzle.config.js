/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://neondb_owner:YXnfAE3Kc4hM@ep-raspy-brook-a8ey4vbn.eastus2.azure.neon.tech/neondb?sslmode=require'
    }
};