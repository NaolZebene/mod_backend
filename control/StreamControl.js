const wrapAsync = require('../utils/wrapAsync');
const allmodels = require('../model/models');
const mongoose = require('mongoose'); 
const { cpus } = require('workerpool');

module.exports.getAllStream = wrapAsync(async function (req, res) {
    const { id } = req.params;
    const collection_data = await allmodels.ListingTable.findOne({ transformer_id: id });
    const all_stream_history = await mongoose.connection.db.collection(collection_data.streamed_data).find().toArray();
    console.log(all_stream_history)
    // console.log(all_stream_history)
    return res.json({
        payload: all_stream_history,
        status: 200
    })
})

module.exports.getWeekAverage = wrapAsync(async function (req, res) {
    const {id} = req.params; 
    const incoming_request = req.body; 

    if(!(incoming_request.Date_One && incomingDate.Date_Two)){
        return res.json({
            msg:"All inputs are required"
        })
    }

    const incomingDate = new Date(incoming_request.Date); 
    const filtered_data = []
    const collection_data = await allmodels.ListingTable.findOne({transformer_id:id}); 
    const all_stream_history = await mongoose.connection.db.collection(collection_data.streamed_data).find().toArray(); 
    all_stream_history.forEach(data=>{
        if(data.Time  != undefined){
            let date = new Date(data.Time); 
       
        }
    })

    // const now = new Date()
    // console.log("now",now.getDate())

})

module.exports.getMonthAverage = wrapAsync(async function (req, res) {

})

module.exports.getStreamUpTo = wrapAsync(async function (req, res) {

})

module.exports.getWeeklyTemperatureAverage = wrapAsync(async function (req, res) {

})

module.exports.getIndividualData = wrapAsync(async function(req,res){

})
