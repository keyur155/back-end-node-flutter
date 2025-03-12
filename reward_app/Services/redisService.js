const Redis = require('ioredis');
const createClient = require('redis');
require('dotenv').config();

const redisClient = createClient.createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD, // Use environment variable for security
    socket: {
        
        host: process.env.REDIS_HOST,
        // host:'redis.railway.internal',
        port: 18126,
        // tls: {} // Add this if your Redis server requires SSL
    }
});

redisClient.on('error', err => {
    console.error('Redis Client Error', err);
});

redisClient.connect()
    .then(() => {
        console.log('Connected to Redis');
    })
    .catch(err => {
        console.error('Failed to connect to Redis', err);
    });
// const Redis = require('ioredis');
// const createClient = require('redis')
// require('dotenv').config();


// const redisClient = createClient.createClient({
//     username: 'default',
//     password: 'lHSMXfHPXgQgn2ALLADX4a4btfDavdU8',
//     socket: {
//         host: 'redis-18126.c10.us-east-1-2.ec2.redns.redis-cloud.com',
//         port: 18126
//     }
// });



// redisClient.on('error', err => console.log('Redis Client Error', err));


// let redisClient;

// if (!global.redisClient) {
//     // Method 1: Connect using Redis URL (recommended)
//     // global.redisClient = new Redis("redis://default:DZCbeauUOvHeDIIPsydYFoxoyLbtZSGb@redis.railway.internal:6379");
    
//     // Alternative Method 2: Connect using individual parameters
//     global.redisClient = new Redis({
//         host: "redis.railway.internal", // Just the hostname part
//         password: "DZCbeauUOvHeDIIPsydYFoxoyLbtZSGb",
//         port: 6379,
//         username: "default" // Include username if needed
//     });

//     const client = createClient({
//         username: 'default',
//         password: '*******',
//         socket: {
//             host: 'redis-18126.c10.us-east-1-2.ec2.redns.redis-cloud.com',
//             port: 18126
//         }
//     });

//     global.redisClient.on("error", (err) => {
//         console.error("❌ Redis connection error:", err);
//     });

//     global.redisClient.on("connect", () => {
//         console.log("✅ Connected to Redis successfully!");
//     });
// }

// redisClient = global.redisClient;

function generateKey(req){
    const baseUrl = req.path.replace(/^\/+|\/+$/g, '').replace(/\//g,':');
    const params = req.query;
    const sortedParams = Object.keys(params)
          .sort()
          .map((key) => `${key}=${params[key]}`) // Removed extra }
          .join('&');

    return sortedParams ? `${baseUrl}:${sortedParams}` : baseUrl; // Changed space+colon+space to just colon
}

module.exports = {generateKey, redisClient};
// const Redis = require('ioredis');
// require('dotenv').config();


// let redisClient;

// if (!global.redisClient) {
//     global.redisClient = new Redis({
//         host: "redis://default:DZCbeauUOvHeDIIPsydYFoxoyLbtZSGb@redis.railway.internal:6379",
//         password: "DZCbeauUOvHeDIIPsydYFoxoyLbtZSGb",
//         port: 6379,
    
//     });

//     global.redisClient.on("error", (err) => {
//         console.error("❌ Redis connection error:", err);
//     });

//     global.redisClient.on("connect", () => {
//         console.log("✅ Connected to Redis Cloud successfully!");
//     });
// }

// redisClient = global.redisClient;
// // async function startServer() {


// // let redisClient;

// // if (!global.redisClient) {
// //     global.redisClient = new Redis({
// //         host: "redis-12837.c305.ap-south-1-1.ec2.redns.redis-cloud.com",
// //         password: "lLPNQ4l2MevvLQE0GQrGlbZUWri9rDeN",
// //         port: 12837,
// //         tls: {} // Required for Redis Cloud
// //     });

// //     global.redisClient.on("error", (err) => {
// //         console.error("❌ Redis connection error:", err);
// //     });

// //     global.redisClient.on("connect", () => {
// //         console.log("✅ Connected to Redis Cloud successfully!");
// //     });
// // }

// // redisClient = global.redisClient;
// //     // try {
// //     //     const client = new Redis({
// //     //       host: 'redis-12837.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
// //     //       password : 'lLPNQ4l2MevvLQE0GQrGlbZUWri9rDeN',
// //     //       port: 12837
// //     //     });

// //     //     await client.connect(); // Ensure this is inside an async function

// //     //     console.log("Connected to Redis successfully!");
// //     // } catch (error) {
// //     //     console.error("Redis connection error:", error);
// //     // }
// // }




// function generateKey(req){
//     const baseUrl = req.path.replace(/^\/+|\/+$/g, '').replace(/\//g,':');
//     const params = req.query;
//     const sortedParams = Object.keys(params)
//           .sort()
//           .map((key) => `${key}=${params[key]}}`)
//           .join('&');

//     return sortedParams ? `${baseUrl} : ${sortedParams}` :baseUrl;
//     // return sortedParams ? `${baseUrl}:${sortedParams}` : baseUrl;

// }
// module.exports = {generateKey ,redisClient};






