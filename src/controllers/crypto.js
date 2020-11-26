import Users from '../models/user';
import UserCrypto from '../models/userCrypto';
const axios = require('axios');

let cryptosList = [];

const controller = {
    listAll: async (req, res) => {
        try {
            const user = await Users.findById(req.user._id);
            const money = user.money;
            await serviceCrypto();
            cryptosList.forEach((elemento) => {
                const priceMoney = elemento.current_price[money];
                elemento.current_price = priceMoney;
            });
            return res.json(cryptosList);
        } catch (error) {
            console.log(error);
        }
    },
    addCrypto: async (req, res) => {
        try {
            const user = await Users.findById(req.user._id);
            const username = user.username;
            const crypto = req.body.crypto;
            await serviceCrypto();
            const cryptoExists = cryptosList.find(elemento => elemento.symbol == crypto);
            if (cryptoExists) {
                const find = await UserCrypto.findOne({ username: username, crypto: crypto });
                if (find) {
                    return res.status(500).json({ 'msg': "Ya posee la cryptomoneda relacionada" });
                } else {
                    const newCripto = UserCrypto({ username, crypto });
                    newCripto.save()
                    return res.status(200).json({ 'msg': 'Cryptomoneda añadida con éxito' });

                }
            } else {
                return res.status(400).json({ 'msg': 'No existe la cryptomoneda' });
            }

        } catch (error) {
            console.log(error);
        }
    },
    listTopCrypto: async (req, res) => {
        try {
            const user = await Users.findById(req.user._id);
            const username = user.username;
            const money = user.money;
            const orden = parseInt(req.query.order);
            const top = parseInt(req.query.top);
            const criptosUser = await UserCrypto.find({ username: username });
            await serviceCrypto();
            let arr = [];
            criptosUser.forEach(async (criptoUser) => {
                const el = cryptosList.find(elemento => elemento.symbol == criptoUser.crypto);
                arr.push(el);
            });
            let ordenedArr = ordenar(arr, money, orden);
            if (ordenedArr.length > top) {
                ordenedArr = ordenedArr.slice(0, top);
            }
            return res.send(ordenedArr);

        } catch (error) {
            console.log(error);
        }
    }

};

/**
 * Devuelve el array ordenado de manera ascendente o descendente, dependiendo del órden pasado
 * Por defecto el orden es descendente
 * @param {1, -1} order 1: Orden ascendente | -1: Orden descendente
 * @param {*} arr Arreglo a ordenar
 * @return Array ordenado
 */
let ordenar = function (arr, money, order) {
    if (order > 0) {
        arr.sort((a, b) => {
            if (a.current_price[money] > b.current_price[money])
                return 1;
            if (a.current_price[money] < b.current_price[money])
                return -1;
            return 0;
        });
    }
    else {
        arr.sort((a, b) => {
            if (a.current_price[money] > b.current_price[money])
                return -1;
            if (a.current_price[money] < b.current_price[money])
                return 1;
            return 0;
        });
    }
    return arr;
}


async function serviceCrypto() {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins');
        cryptosList = [];
        const criptos = response.data;
        for (let i = 0; i < criptos.length; i++) {
            cryptosList.push({
                symbol: criptos[i].symbol,
                current_price: {
                    ars: criptos[i].market_data.current_price.ars,
                    eur: criptos[i].market_data.current_price.eur,
                    usd: criptos[i].market_data.current_price.usd,
                },
                name: criptos[i].name,
                image: criptos[i].image,
                last_updated: criptos[i].last_updated
            });
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default controller;