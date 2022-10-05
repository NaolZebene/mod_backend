const express = require('express'); 

function SocketRouter(io){
   const router = express.Router(); 

   router.post('/arduoino/:id', (req,res)=>{
      const {id} = req.params; 
      console.log(id);

      io.emit('message',(data)=>{
         console.log(data);
      })
      
      
   })
}

module.exports = SocketRouter;