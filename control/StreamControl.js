const wrapAsync = require('../utils/wrapAsync');
const allmodels = require('../model/models');
const mongoose = require('mongoose');
// const { cpus } = require('workerpool');

module.exports.getAllStream = wrapAsync(async function (req, res) {
    const { id } = req.params;
    const collection_data = await allmodels.ListingTable.findOne({ transformer_id: id });
    const all_stream_history = await mongoose.connection.db.collection(collection_data.streamed_data).find().toArray();
    console.log(all_stream_history)
    return res.json({
        payload: all_stream_history,
        status: 200
    })
})

module.exports.getDataInRange = wrapAsync(async function (req, res) {
    const { id } = req.params;
    const incoming_request = req.body;


    if (!(incoming_request.DateOne && incoming_request.DateTwo && incoming_request.interval)) {
        return res.json({
            msg: "All inputs are required"
        })
    }

    const incomingDateOne = new Date(incoming_request.DateOne);
    const incomingDateTwo = new Date(incoming_request.DateTwo);
    const final_result = []
    // const filtered_data = []
    const collection_data = await allmodels.ListingTable.findOne({ transformer_id: id });
    const all_stream_history = await mongoose.connection.db.collection(collection_data.streamed_data).find().toArray();
    all_stream_history.forEach(data => {
        if (data.Time != undefined) {
            let date = new Date(data.Time);
            if (date >= incomingDateOne && date <= incomingDateTwo) {
                final_result.push(data);
            }

        }
    })

    let sampled_data = [];
    increased_date = new Date(final_result[0].Time);
    const interval = incoming_request.interval
    let j = 0
    while (new Date(increased_date) < incomingDateTwo && j < final_result.length) {
        if (increased_date < new Date(final_result[j].Time)) {
            increased_date = new Date(new Date(increased_date).setMilliseconds(new Date(increased_date).getMilliseconds() + interval));
            let new_data = {
                ...final_result[j - 1],
                Time: increased_date
            }
            sampled_data.push(new_data)

        } else if (increased_date == new Date(final_result[j].Time)) {
            increased_date = new Date(new Date(increased_date).setMilliseconds(new Date(increased_date).getMilliseconds() + interval));
            let new_data = {
                ...final_result[j],
                Time: increased_date
            }
            sampled_data.push(new_data)
        }

        else {
            j++
        }
    }

    console.log("outside loop", final_result)


    return res.json({
        paylaod: sampled_data,
        status: 200
    })


})



module.exports.getWeeklyTemperatureAverage = (async function (req, res) {
    const { id } = req.params;

    // console.log(id)
    const final_result = []

    const collection_data = await allmodels.ListingTable.findOne({ transformer_id: id });
    const all_stream_history = await mongoose.connection.db.collection(collection_data.streamed_data).find().toArray();
    all_stream_history.forEach(data => {
        if (data.Temperature) {
            let now = new Date().toJSON();
            let current_time = new Date(now);
            let difference = current_time.getTime() - new Date(data.Time).getTime();
            let date_difference = Math.ceil(difference / (1000 * 3600 * 24));
            if (date_difference <= 7) {
                final_result.push(data.Temperature);
            }

        }


    })

    const sum = final_result.reduce((ac, val) => {
        return ac + val
    }, 0)



    const average = sum / final_result.length;

    return res.json({
        payload: [
            {
                "Weekly-Temperature-Average": average
            }
        ],
        status: 200
    })


})
