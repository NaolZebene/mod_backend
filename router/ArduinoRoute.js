const express = require('express'); 

function SocketRouter(io){
   const router = express.Router(); 

   router.get('/arduino', (req,res)=>{

      const count = req.query.count
      
   })

   
   return router;
}

module.exports = SocketRouter;