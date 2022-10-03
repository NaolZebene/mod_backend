const wrapAsync = require('../utils/wrapAsync');
const allmodels = require('../model/models');
const mongoose = require('mongoose')
module.exports.getAllStream = wrapAsync(async function (req, res) {
    const { id } = req.params;
    const collection_data = await allmodels.ListingTable.findOne({ transformer_id: id });
    const all_stream_history = await mongoose.connection.db.collection(collection_data.streamed_data).find().toArray();
    // console.log(all_stream_history)
    return res.json({
        payload: all_stream_history,
        status: 200
    })
})

module.exports.getWeekAverage = wrapAsync(async function (req, res) {
})

module.exports.getMonthAverage = wrapAsync(async function (req, res) {

})

module.exports.getStreamUpTo = wrapAsync(async function (req, res) {

})

module.exports.getWeeklyTemperatureAverage = wrapAsync(async function (req, res) {

})

