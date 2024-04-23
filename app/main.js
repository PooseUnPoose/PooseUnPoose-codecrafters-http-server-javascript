const net = require("net");
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
            console.log('We got to the user agent area');
            const UseragentStr = (chunk.toString().split('\r\n')[2].split(' ')[1]);
            let resp = 'HTTP/1.1 200 OK\r\n';
            resp += 'Content-Type: text/plain\r\n';
            resp += `Content-Length: ${UseragentStr.length}\r\n\r\n${UseragentStr}`;
            socket.write(resp);
            return
        }else if(path.startsWith('/files')){
            console.log("we got to the files area");
            const filepath = path.substring(path.indexOf('/es/'));
            console.log(filepath);
            return
        } else {
            socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
            return

        }
    })
})