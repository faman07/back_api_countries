//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const axios = require('axios');
//const {getCountriesApi}=require('../api/src/routes/controllers/LoadDb/LoadDb');

//const axios =require('axios')
// Syncing all the models at once.
conn.sync({ force: true }).then(() => {
  server.listen(PORT, async () => {
   //Get Data
   const apiCountriesResponse = await axios.get('https://restcountries.com/v3/all');
   const apiCountries = await apiCountriesResponse.data.map(c => {
     return {
       id: c.cca3,
       name: c.name.common,
       flag: c.flags[1],
       continent: c.region,
       capital: c.capital ? c.capital[0] : 'No found Capital',
       subregion: c.subregion,
       area: c.area,
       population: c.population
     }
   })
   //Send DB
   const countrydb = async () =>{
     try {
       const verifyBd = await Country.findAll()
       if(verifyBd.length == 0){
         const getData = await apiCountries
         await Country.bulkCreate(getData);
         console.log('creado')
       }
     } catch (error) {
       console.log(error)
     }
   }
   const loadbd = async () =>{await countrydb()}

   //Load BD
   loadbd()
   console.log('%s listening at ',process.env.PORT); // eslint-disable-line no-console
 });
});