const net = require('net');
const fs = require('fs');

console.log('Logs from your program will appear here!');

const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        const [requestLine, ...headers] = data.toString().split('\r\n');
        const [method, path] = requestLine.split(' ');
        console.log([requestLine, ...headers])
        console.log(method, path);
        if (path === '/') {
            socket.write('HTTP/1.1 200 OK\r\n\r\n');
        } else if (path.startsWith('/echo/')) {
            EchoRequest(path, socket);
        } else if (path.startsWith('/user-agent')) {
            AgentRequest(headers, socket);
        } else if (path.startsWith('/files/')) {
            FileRequest(path, socket);
        } else {
            NotFound(socket);
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
    let UserAgent = '';
    for (const header of headers) {
        if (header.startsWith('User-Agent:')) {
            UserAgent = header.substring('User-Agent:'.length).trim();
            break;
        }
    }
    const ContentLength = UserAgent.length;
    console.log(UserAgent);
    const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${ContentLength}\r\n\r\n${UserAgent}\r\n`;
    socket.write(response);
}

function FileRequest(path, socket) {
    const FileName = path.substring('/files/'.length);
    const Directory = process.argv[process.argv.indexOf('--directory') + 1];
    const FilePath = `${Directory}/${FileName}`;
    if (fs.existsSync(FilePath)) {
        const FileContent = fs.readFileSync(FilePath);
        const ContentLength = FileContent.length;
        const response = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${ContentLength}\r\n\r\n`;
        socket.write(response);
        socket.write(FileContent);
    } else {
        NotFound(socket);
    }
}

function PostFile(path, socket){

}


function NotFound(socket){
    socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
}