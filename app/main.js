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
            EchoRequest(path, socket);
            return
        }else if(path.startsWith('/user-agent')){
            UserAgentRequest(path, socket);
            return
        } else {
            socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
            return

        }
    })
})

function EchoRequest(path, socket){
    const Echostring = path.substring('/echo/'.length);
    console.log (Echostring);
    const EchoLength = Echostring.length;
    const Response = `HTTP/1.1 200 OK\r\n Content-Type: text/plain\r\n Content-Length: ${EchoLength}\r\n\r\n${Echostring}`;
    socket.write(Response);
}
function UserAgentRequest(path, socket){
    const UserAgentStr = (chunk.toString().split('\r\n')[2].split(' ')[1]);
    const UserAgentLength = UserAgentStr.length;
    const Response = `HTTP/1.1 200 OK\r\n Content-Type: text/plain\r\n Content-Length: ${UserAgentLength}\r\n\r\n${UserAgentStr}`;
    socket.write(Response);
}
function FileRequest(path, socket){

}