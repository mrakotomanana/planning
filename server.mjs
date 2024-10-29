import express from 'express';
import routeList from 'route-list';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import morgan from 'morgan';

import maskdata from 'maskdata';
import rateLimit from 'express-rate-limit'


import dotenv from 'dotenv';
dotenv.config();

const app = express();
import routerAPP from './routes/index.mjs';

const email = "my.test.email@testEmail.com";

const emailMask2Options = {
    // Character to mask the data. The default value is '*'
    maskWith: "--*--", 
    // If we want to keep the starting 'n' characters before the '@' unmasked.
    // Default value is 3
    unmaskedStartCharactersBeforeAt: 3,
    // If we want to keep the last 'n' characters AFTER the '@' unmasked.
    // Default value is 2
    unmaskedEndCharactersAfterAt: 2,
    // Flag to mask or show '@'. Default value is false means do not mask
    maskAtTheRate: false
};

const maskedEmail = maskdata.maskEmail2(email, emailMask2Options);

const maskPasswordOptions = {
    // Character to mask the data
    // default value is '*'
    maskWith: "*",
  
    // To limit the *s in the response when the password length is more
    // Default value is 16
    maxMaskedCharacters: 16,
  
    // To fix the length of output irrespective of the length of the input. This comes in handy when the input length < maxMaskedCharacters but we want a fixed output length.
    // Default value is undefined. If this value is set, then maxMaskedCharacters will not be considered and the output length will always be equal to fixedOutputLength characters.
    fixedOutputLength: undefined,
  
    // To show(not mask) first 'n' characters in the password/secret key. 
    // Default value is 0. 
    unmaskedStartCharacters: 0,
  
    // To show(not mask) last 'n' characters in the password/secret key. 
    // Default value is 0. 
    unmaskedEndCharacters: 0
  };
  
  const password = "Password1$";
  
  const maskedPassword = maskdata.maskPassword(password, maskPasswordOptions);

console.log(email);
console.log(maskedEmail);
console.log(password);
console.log(maskedPassword);

// https://express-rate-limit.mintlify.app/reference/stores
const limiter = rateLimit({
	windowMs: 60 * 1000, // 15 * 60 * 1000, // 15 minutes
	limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
    message: 'Too many requests, please try again later.',
})

// Apply the rate limiting middleware to all requests.

/*

var session = require('express-session');
app.set('trust proxy', 1) // trust first proxy
app.use( session({
   secret : 's3Cur3',
   name : 'sessionId',
  })
);

var session = require('cookie-session');
var express = require('express');
var app = express();

var expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
app.use(session({
  name: 'session',
  keys: ['key1', 'key2'],
  cookie: { secure: true,
            httpOnly: true,
            domain: 'example.com',
            path: 'foo/bar',
            expires: expiryDate
          }
  })
);

*/

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
console.log('Chemin du fichier:', __filename);
console.log('Répertoire courant:', __dirname);


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'templates'));
app.use(express.static(__dirname + '/public'));
app.disable('x-powered-by');

const logger = function(req, res, next) {
	const { method, url } = req;
	const date = new Date().toLocaleString();
	console.log(`${date}: ${method} ${url}`);
	next();
}
app.use(morgan('combined'));
app.use(logger);
app.use(helmet());
app.use(limiter);
const isProduction = process.env.NODE_ENV === 'production';

// app.use('/auth', limiter);

app.use((req, res, next) => {
    res.on('finish', () => {
      console.log('En-têtes de la réponse:', res.getHeaders());
    });
    next();
  });

app.get('/user/:id', function (req, res, next) {
	if (req.params.id == 0) next('route');
	else next();
}, function (req, res) {
	res.send('Scénario normal');
});

app.get('/user/:id', function (req, res) {
	res.send('Scénario anormal');
});


app.get('/', (req, res) => {
    res.render('index', {title: 'Scénario'});
});

app.get('/about', (req, res) => {
    res.send('À propos');
});

app.post('/contact', (req, res) => {
    res.send('Contactez-nous');
});

app.use('/api', routerAPP);

app.use(function(req, res, next) {
    const err = new Error("Page non trouvée");
    err.status = 404;
    next(err); // Transmet l'erreur 404 au middleware d'erreurs global
});

app.use(function(err, req, res, next){
    res.status(err.status || 500); // Si l'erreur est 404, on renvoie le code 404, sinon 500
    const erro = {
        message: err.message,
        status: err.status || 500
    };
    console.error(erro);
    res.json(erro);
});

const routes = routeList.getRoutes(app, 'express');
routeList.printRoutes(routes, {});

const PORT = process.env.PORT || 3000;
const hostname = process.env.HOST || '127.0.0.1';


app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://${hostname}:${PORT}`);
});
