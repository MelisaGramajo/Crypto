import express from "express";
var router = express.Router();
import AuthMdw from '../middleware/custom';
import CryptoController from '../controllers/crypto';
import AuthController from '../controllers/auth';
import passport from 'passport';

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Servidor funcionando correctamente" });
});

//Login
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);


//Crypto
router.get('/listAll', AuthMdw.ensureAuthenticated, CryptoController.listAll);
router.post('/addCrypto', AuthMdw.ensureAuthenticated, CryptoController.addCrypto);
router.get('/topCryptos/', AuthMdw.ensureAuthenticated, CryptoController.listTopCrypto);



export default router;
