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
            EchoRequest(path, socket);
        } else if (path.startsWith('/user-agent')) {
            AgentRequest(headers, socket);
        } else if (path.startsWith('/files/')) {
            FileRequest(path, socket);
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

function EchoRequest(path, socket) {
    const EchoString = path.substring('/echo/'.length);
    const EchoLength = EchoString.length;
    const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${EchoLength}\r\n\r\n${EchoString}\r\n`;
    socket.write(response);
}

function AgentRequest(headers, socket) {
    let userAgent = '';
    for (const header of headers) {
        if (header.startsWith('User-Agent:')) {
            userAgent = header.substring('User-Agent:'.length).trim();
            break;
        }
    }
    const contentLength = userAgent.length;
    console.log(userAgent);
    const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${contentLength}\r\n\r\n${userAgent}\r\n`;
    socket.write(response);
}

function FileRequest(path, socket) {
    const FileName = path.substring('/files/'.length);
    const Directory = process.argv[process.argv.indexOf('--directory') + 1];
    const FilePath = `${Directory}/${FileName}`;
    
    if (fs.existsSync(FilePath)) {
        const FileContent = fs.readFileSync(FilePath);
        const FileLength = FileContent.length;
        const Response = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-length: ${FileLength}`;
        console.log("We got here");
        socket.write(Response);
        socket.write(FileContent);
    }else{
        socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
    }
}