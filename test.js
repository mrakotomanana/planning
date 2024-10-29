const { availableLanguages, welcoming } = require('./test_modules/welcome');
const fs = require('fs');

console.log(availableLanguages());
console.log(welcoming('en'));

fs.writeFile('test.txt', 'text ajouter', function (err){
    if(err) throw err;
    console.log(data);
});