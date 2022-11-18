const express = require('express');

function SocketRouter(io) {
   const router = express.Router();

   router.get('/arduino', (req, res) => {

      const count = req.query.count;
      if (!count) {
         return res.json({
            message: "count doesnt exist"
         })
      }

      io.emit('arduinomessage', count)

   })


   return router;
}

module.exports = SocketRouter;