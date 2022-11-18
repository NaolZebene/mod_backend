const Schedule = require('../model/Schedule')
const wrapAsync = require('../utils/wrapAsync')
module.exports.CreateSchedule = wrapAsync(async function (req, res) {
    const data = req.body;
    console.log(data)

    if (!(data.personnel.length && data.Type && data.date && data.transformer_ids.length)) {
        return res.json({
            payload: "All inputs are required",
            status: 200
        })
    }

    const data_to_be_inserted = {
        personnel: data.personnel,
        Type: data.Type,
        date: data.date,
        transformer_ids: data.transformer_ids

    }

    const inserted_data = new Schedule(data_to_be_inserted);
    await inserted_data.save();

    return res.json({
        payload: "Schedule Created Successfully",
        status: 200
    })
})

module.exports.EditSchedule = wrapAsync(async function (req, res) {
    const { id } = req.params;
    const data = req.body;

    if (!(data.personnel.length && data.Type && data.date && data.transformer_ids.length)) {
        return res.json({
            payload: "All inputs are required",
            status: 200
        })
    }

    const data_to_be_inserted = {
        personnel: data.personnel,
        Type: data.Type,
        date: data.date,
        transformer_ids: data.transformer_ids
    }

    await Schedule.findOneAndUpdate(id, data_to_be_inserted, { new: true });

    return res.json({
        payload: "Schedule edited successfully",
        status: 200
    })


})
module.exports.ViewAllSchedule = wrapAsync(async function (req, res) {
    const all_schedules = await Schedule.find();
    if (all_schedules.length) {
        return res.json({
            payload: all_schedules,
            status: 200
        })
    }
    return res.json({
        payload: "No Schedule Exists Add Schedule to view more",
        status: 200
    })
})

module.exports.DeleteSchedule = (async function (req, res) {
    const { id } = req.params;
    const ids = id.split(",")
    // console.log(ids)

    ids.forEach(async (one_id) => {
        if (one_id !== "") {
            let data_exists = await Schedule.findOne({ _id: one_id });
            if (!data_exists) {
                return res.json({
                    payload: "No Such Schedule Exists",
                    status: 200
                })
            }
            await Schedule.findByIdAndDelete(one_id);
            console.log(one_id);
        }
    })

    return res.json({
        payload: "Schedule Deleted Successfully",
        status: 200
    })


})

module.exports.ScheduleComplete = wrapAsync(async function (req, res) {
    const { id } = req.params;
    await Schedule.findByIdAndUpdate({ _id: id }, { status: "complete" });
})
