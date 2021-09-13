const redisClient = require("../helper/redisClient");
const { promisify } = require('util');

const GET_ASYNC = promisify(redisClient.get).bind(redisClient);

module.exports = async (req, res, next) => {
    const cachedData = await GET_ASYNC(req.url);
    if (cachedData) {
        let dataCache = JSON.parse(cachedData);
        return res.send(dataCache);
    }
    next();
}