// const DbOperations= require('../util/DbOperations'); 

const allmodels = require('../model/models')
const mongoose = require('mongoose');
const wrapAsync = require('../utils/wrapAsync')



module.exports.CreateTransformer = wrapAsync(async function(req,res){
  
  const array_data = [req.body]; 

  array_data.forEach(data=>{
    if(!(data.Name && data.Serial && data.Location)){
  
      return res.json({
        payload:"All form inputs are required", 
        status :200
      })
    }
  })

  array_data.forEach(async (data,i) =>{
    let transformer_id = `transformer${Date.now()}`;
    let trans_model = await allmodels.CreateTransformer(transformer_id)
    let files = []
    req.files.forEach(file=>{
      
      files.push({file_name:file.filename})
    })
    let new_data = {
      Name: data.Name,
      Serial: data.Serial,
      Location:data.Location,
      Rating : JSON.parse(data.Rating) || [],
      files:files
    }
    let inserted_data = new trans_model(new_data);
     await inserted_data.save()
  })

  return res.json({
    payload:`data inserted successfully`, 
    status:200
  })

})

module.exports.allTransformer = wrapAsync(async function(req,res){
 
  const all_data = await allmodels.ListingTable.find(); 
  var all_transformer = []
  for(let index=0; index<all_data.length;index++){
  const transformer = await mongoose.connection.db.collection(await all_data[index].transformer_table_id);
  const transformer_data = await transformer.find().toArray()
   if(transformer_data.length > 0){

    all_transformer[index] = transformer_data[0]
   }
   
  }
  if (all_transformer.length > 0){
    return res.json({
      payload:all_transformer,
      status:200
    })
  }
  return res.json({
    payload:"No data found", 
    status:200
  })
   
})

module.exports.editTransformer = wrapAsync(async function(req,res){
  const {id} = req.params; 
  const data = req.body; 
  const ids = id.split(",")

  if(!(data.Name && data.Serial && data.Location)){
    return res.json({
      payload:"All inputs are required",
      status:200
  })
  
  }
  let files = []; 
  req.files.forEach(file=>{
    files.push({file_name:file.filename});
  })

  console.log(JSON.parse(data.Rating));
  let new_data = {
    Name:data.Name, 
    Serial:data.Serial, 
    Location:data.Location, 
    Rating:JSON.parse(data.Rating) || [],
    files:files
  }

   ids.forEach(async (one_id,i)=>{
    let collection_id = await allmodels.ListingTable.findOne({transformer_id:one_id})
    await mongoose.connection.db.collection(collection_id.transformer_table_id).updateOne({_id:mongoose.Types.ObjectId(one_id)},{$set:new_data},{upsert:true})
   })
   
  return res.json({
    payload:"Data Updated Successfully", 
    status:200
  })
})

module.exports.DeleteTransformer = wrapAsync(async function(req,res){
  const {id} = req.params; 
  const ids = id.split(",")

  
  ids.forEach(async (one_id)=>{
    let collection_id = await allmodels.ListingTable.findOne({transformer_id:one_id});
    await mongoose.connection.db.collection(collection_id.streamed_data).drop()
    await mongoose.connection.db.collection(collection_id.status_collection_id).drop()
    await mongoose.connection.db.collection(collection_id.transformer_table_id).drop()
    await allmodels.ListingTable.findByIdAndDelete(collection_id._id);
  })

  return res.json({
    payload:"Deleted data Successfully",
    status:200
  })

})

module.exports.getOneTransformer = wrapAsync(async function(req,res){
    const {id} = req.params; 
    const ids = id.split()
    const collection_id = await allmodels.ListingTable.findOne({transformer_id:id}); 
    if(!collection_id){
      return res.json({
        payload:"Data dont exist", 
        status:200
      })
    }

    const transformer_data = await mongoose.connection.db.collection(collection_id.transformer_table_id);
    const populated_table = await transformer_data.findOne({_id:mongoose.Types.ObjectId(id)}); 
    
    if (!populated_table){
      return res.json({
        payload:"Data dont exist", 
        status:200
      })
    }

    return res.json({
      payload:populated_table,
      status:200
    })
    
})

