import http from 'http';
import { WebSocketServer } from 'ws';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { v4 as uuidv4 } from 'uuid';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer(function (req, res) {
    // res.writeHead(200, { 'Content-Type': 'text/plain' });
    // res.end('WebSocket server is running\n');

    if (req.url === '/') {
        // Servir le fichier client.html
        fs.readFile(path.join(__dirname, 'client.html'), (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});



server.listen(8000, function () {
    console.log('Server is listening on port 8080');
});

const wss = new WebSocketServer({ port: 8081 });

server.on('upgrade', function (req, socket, head) {
    console.log('Upgrade notification');
    if (req.url == '/chat') {
        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit('connection', ws, req);
        });
    } else {
        socket.destroy();
    }
});



wss.on('connection', (ws) => {
    console.log('Client WebSocket connected');
    ws.id = uuidv4();
    ws.on('message', (message) => {
        console.log(`Client connecté avec ID : ${ws.id}`);
        wss.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
                client.send(`${ws.id} : ${message}`);
            }
        });
    });

    ws.on('close', () => {
        console.log(`Client ${ws.id || 'inconnu'} déconnecté`);
    });
});

console.log('WebSocket Server running on port 8081');
