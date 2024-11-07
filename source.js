const express = require('express');
const http = require('http');
const path = require('path');
const ws = require('ws');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const wss = new ws.Server({ port: 8000 });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/inscription', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'inscrire.html'));
});

app.get('/connection', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'connection.html'));
});

const users = {}

// Inscription d'un utilisateur
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (users[username]) return res.status(400).json({ message: 'Utilisateur existant' });

    const hashedPassword = await bcrypt.hash(password, 10);
    users[username] = { password: hashedPassword };
    res.status(200).json({ message: 'Utilisateur enregistré' });
});

// Connexion de l'utilisateur
app.post('/login', async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    const user = users[username];
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(403).json({ message: `Nom d'utilisateur ou mot de passe incorrect` });
    }

    const token = jwt.sign({ username }, 'votre_secret_jwt', { expiresIn: '1h' });
    res.json({ token });
});


const server = http.createServer(app);

// Stockage des connexions WebSocket
const clients = {};

// Connexion WebSocket avec authentification JWT
wss.on('connection', (ws, req) => {
    console.log('client connection established');

    const token = req.url.split('token=')[1];
    if (!token) return ws.close();

    jwt.verify(token, 'votre_secret_jwt', (err, user) => {
        if (err) return ws.close();

        ws.username = user.username;
        clients[user.username] = ws;

        // Gestion des messages reçus
        ws.on('message', (message) => {
            const data = JSON.parse(message);
            const { recipient, content } = data;

            // Envoi du message au destinataire
            if (clients[recipient]) {
                clients[recipient].send(JSON.stringify({ sender: ws.username, content }));
            }
            ws.send(JSON.stringify({ sender: ws.username, content }));
        });

        ws.on('close', () => {
            delete clients[ws.username];
            console.log(clients);
            console.log( ws.username);
            console.log( user.username);
            console.log('client disconnected');
        });
    });
});

server.listen(3000, () => {
    console.log(`listening on 3000`);
});

server.on('upgrade', (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, function (ws) {
        wss.emit('connection', ws, req)
    });
});