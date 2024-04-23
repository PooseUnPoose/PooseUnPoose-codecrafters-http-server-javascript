const net = require("net");
const fs = require('fs');
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
    socket.on("close", () => {
        socket.end();
        server.close();
    });
});

server.listen(4221, "localhost");
server.on('connection', function(socket) {
    socket.on('data', (chunk) => {
        console.log('data received from the client: ', chunk.toString().split('\r\n'));
        const path = chunk.toString().split('\r\n')[0].split(' ')[1];
        if (path === '/') {
            socket.write('HTTP/1.1 200 OK\r\n\r\n');

        } else if (path.startsWith('/echo')) {
            let arr = path.split('/').filter(elem => elem);
            arr.shift();
            const EchoString = arr.join('/');
            let resp = 'HTTP/1.1 200 OK\r\n';
            resp += 'Content-Type: text/plain\r\n';
            resp += `Content-Length: ${EchoString.length}\r\n\r\n${EchoString}`;
            socket.write(resp);
            return

        }else if(path.startsWith('/user-agent')){
            const UseragentStr = (chunk.toString().split('\r\n')[2].split(' ')[1]);
            let resp = 'HTTP/1.1 200 OK\r\n';
            resp += 'Content-Type: text/plain\r\n';
            resp += `Content-Length: ${UseragentStr.length}\r\n\r\n${UseragentStr}`;
            socket.write(resp);
            return
        }else if(path.startsWith('/files')){
            console.log("we got to the files area");
            FileStr = path.substring(path.lastIndexOf('/')+1);
            console.log(FileStr);
            fs.access(FileStr, fs.constants.F_OK, (err) => {
                if (err) {
                    socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
                    return;
                }
                else{
                    fs.readFile(FileStr, 'utf8', (err, data) => {
                        console.log("we read the file");
                        let resp = 'HTTP/1.1 200 OK\r\n';
                        resp += 'Content-Type: application/octet-stream\r\n';
                        resp += `Content-Length: ${data.length}\r\n\r\n${data}`;
                        socket.write(resp);
                        return
                    });
                    return
                }
            });
            
        } else {
            socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
            return

        }
    })
})