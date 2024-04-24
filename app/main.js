const net = require('net');

const fs = require('fs');

console.log('Logs from your program will appear here!');

const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        const [requestLine, ...headers] = data.toString().split('\r\n');
        const [method, path] = requestLine.split(' ');
        if (path === '/') {
            socket.write('HTTP/1.1 200 OK\r\n\r\n');
        } else if (path.startsWith('/echo/')) {
            handleEchoRequest(path, socket);
        } else if (path.startsWith('/user-agent')) {
            handleAgentRequest(headers, socket);
        } else if (path.startsWith('/files/')) {
            handleFileRequest(path, socket);
        } else {
            socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
            return;
        }
        socket.end();
    });
    socket.on('close', () => {
        socket.end();
    });
});

server.listen(4221, 'localhost');

function handleEchoRequest(path, socket) {
    const randomString = path.substring('/echo/'.length);
    const contentLength = randomString.length;
    const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${contentLength}\r\n\r\n${randomString}\r\n`;
    socket.write(response);

}

function handleAgentRequest(headers, socket) {
    let userAgent = 'Unknown';
    for (const header of headers) {
        if (header.startsWith('User-Agent:')) {
            userAgent = header.substring('User-Agent:'.length).trim();
            break;
        }
    }
    const contentLength = userAgent.length;
    console.log(userAgent);
    const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${contentLength}\r\n\r\n${userAgent}\r\n`;
    // Send the response
    socket.write(response);

}