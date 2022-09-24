const mongoose = require('mongoose'); 

const {Schema,model} = mongoose; 
const allmodel = require('./models');

const scheduleSchema = new Schema({
    personnel:[
        {
            name:String, 
          
        }
    ], 
    Type:{
        type:String, 
        required:true
    }, 
    transformer_ids :[
        {
            id:String, 

        }
    ], 
    date:{
        type:String, 
        required:true
    }, 
    Description:{
        type:String
    }, 
    status:{
        type:String, 
        default:"pending"
    }
})

scheduleSchema.post('save', async function(doc){
    const transformer_ids = doc.transformer_ids; 
    transformer_ids.forEach(async (Oneid)=>{
       let collection_data = await allmodel.ListingTable.findOne({transformer_id:Oneid.id})
       let updated_data = await mongoose.connection.db.collection(collection_data.transformer_table_id).findOne({_id:mongoose.Types.ObjectId(Oneid)}); 
       updated_data.Schedule_History.push({schedule_id:doc._id});
       let new_data = {
        Name:updated_data.Name, 
        Serial:updated_data.Serial, 
        Location:updated_data.Location, 
        Schedule_History:[
            ...updated_data.Schedule_History, 
        ]
       }
       await mongoose.connection.db.collection(collection_data.transformer_table_id).updateOne({_id:mongoose.Types.ObjectId(Oneid)},{$set:new_data}, {upsert:true});        
    })
})

const Schedule = model('Schedule',scheduleSchema); 
module.exports = Schedule;