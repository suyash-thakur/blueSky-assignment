const express = require("express");
const Country = require("../Model/Country");
const EmissionData = require("../Model/EmissionData");
const router = express.Router();
const mongoose = require("mongoose");
const redisClient = require("../helper/redisClient");
const { promisify } = require('util');
const getCachedData = require("../middleware/getCachedData");

const SET_ASYNC = promisify(redisClient.set).bind(redisClient);

router.get('/', (req, res) => {
    res.redirect('/api-docs');
})

router.get('/country', getCachedData, async (req, res, next) => {
    try {
            let countryData = [];
            let country = await Country.find({});
            for (let i = 0; i < country.length; i++) {
                let data = await EmissionData.aggregate([{
                $group: { _id: country[i]._id, uniqueYears: { $addToSet: "$year" } }
            }]);
            let countryValue = {
                _id: country[i]._id,
                name: country[i].name,
                year: data[0].uniqueYears.sort()
            }
            countryData.push(countryValue);
        }
        if (countryData) {
            const saveCacheData = await SET_ASYNC(req.url, JSON.stringify(countryData), "EX", 86400);
        }
            res.send(countryData);
    } catch (err) {
        next(err)
    }
});

router.get('/country/:id', getCachedData, async (req, res, next) => {
    try {
        let validDate = new RegExp(/^(19|20)\d{2}$/);
        if (!mongoose.isValidObjectId(req.params.id)) {
            let err = new Error('Invalid ID format');
            err.type = 'custom';
            throw err;
        }
        if (!req.query.startDate) {
            let err = new Error('Start date is required');
            err.type = 'custom';
            throw err;
        }
        if ((req.query.startDate) && (req.query.endDate) && (req.query.startDate > req.query.endDate)) {
            let err = new Error('Start date should be less than end date');
            err.type = 'custom';
            throw err;
        }
        if (!validDate.test(Number(req.query.startDate))) {
            let err = new Error('Invalid Start Date Format');
            err.type = 'custom';
            throw err;
        }
        if (req.query.endDate && !validDate.test(Number(req.query.endDate))) {
            let err = new Error('Invalid End Date Format');
            err.type = 'custom';
            throw err;
        }
    
        if (!req.query.category || req.query.category.length === 0) {
            let err = new Error('Category is required');
            err.type = 'custom';
            throw err;
        }
        let query = {
            countryID: req.params.id,
            year: {
                $gte: req.query.startDate
            },
            category: req.query.category.split(',').map(item => item.trim())
        }
        if (req.query.endDate) {
            query.year.$lte = req.query.endDate
        }
        let data = await EmissionData.find(query);
        if (data) {
            const saveCacheData = await SET_ASYNC(req.url, JSON.stringify(data), "EX", 86400);
        }
        res.send(data);
    } catch (err) {
        next(err)
    }

});
module.exports = router;
