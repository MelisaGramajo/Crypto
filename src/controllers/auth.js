import User from "../models/user";
import bcrypt from "bcrypt";
import passport from "passport";
import jwt from "jsonwebtoken";
import error_types from "./error_types";



const controller = {
  register: async (req, res, next) => {
    const typeMoney = ['usd', 'ars', 'eur'];
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
          throw new error_types.Error404("El usuario ya existe");
        } else {
          const test= validatePassword(req.body.password);
          if(test===false){
            throw new error_types.Error404("Password inválido. Revise formato(Debe contener mínimo 8 caracteres y ser alfanumérico)");
          }else{
            if(!typeMoney.includes(req.body.money)){
              throw new error_types.Error404("Ingrese un formato de moneda permitido (usd,ars,eur)");
            }else{
              var hash = bcrypt.hashSync(
                req.body.password,
                parseInt(process.env.BCRYPT_ROUNDS)
              );
              let newUser = new User();
              newUser.name = req.body.name;
              newUser.lastname = req.body.lastname;
              newUser.username = req.body.username;
              newUser.password = hash;
              newUser.money= req.body.money;
              await newUser.save();
            }
          }
        }
      res.json({ message: "User registered" });
    } catch (err) {
      next(err);
    }
  },
  login: (req, res, next) => {
    passport.authenticate("local", { session: false }, (error, user) => {
      if (error || !user) {
        next(new error_types.Error404("Username o Password incorrectos"));
      } else {
        const payload = {
          sub: user._id,
          exp: Date.now() + parseInt(process.env.JWT_LIFETIME),
          username: user.username,
        };
        const token = jwt.sign(
          JSON.stringify(payload),
          process.env.JWT_SECRET,
          { algorithm: process.env.JWT_ALGORITHM }
        );

         res.json({ data: { token: "Bearer "+token } });

      }
    })(req, res);
  }
};

let validatePassword = function(password) {
  var caracteres = /^[a-z0-9]+$/i;
  var alfanum = caracteres.test(password);
  const longitud = password.length >= 8 ? true : false;
  if (alfanum && longitud) {
    return true;
  }
  return false;
};


export default controller;
