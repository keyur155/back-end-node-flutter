const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

router.post('/register', AuthController.register);
router.post('/login', async( req ,res ,next) =>{
console.log("requested");
try {
    const result = await AuthController.login(req ,res);
//    console.log("result is ",result);
    res.json({
          success: true,
          data: result
        });
    }
      catch (error) {
        // Pass error to the error handling middleware
        next(error);
      }
      });


//router.post('/login', async( req ,res) =>{
//    const result = await AuthController.register(req.body);
//    res.json({
//          success: true,
//          data: result
//        });
//      } catch (error) {
//        // Pass error to the error handling middleware
//        next(error);
//      }
//}

router.options('/login', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Content-Security-Policy-Report-Only', 'default-src: https:');
  res.header('Access-Control-Allow-Methods', 'PUT POST PATCH DELETE, GET');
  res.status(200).json({});
});


router.post('/verifyOTP' ,AuthController.verifyOTP);

module.exports = router;
