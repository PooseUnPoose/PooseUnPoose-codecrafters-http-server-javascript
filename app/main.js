const net = require('net');

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log('Logs from your program will appear here!');

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
    socket.on('close', () => {
        socket.end();
        server.close();
    });
    
    socket.on('data', (data) => {
        httpRequest = data.toString();

        console.log("This is the full http request \n"+httpRequest);
        const path = httpRequest.split(' ');
        console.log("This is the path \n");
        console.log(path[1]);

        console.log("this is a test - " + httpRequest.substring(0, 10));
        console.log("this is a test - " + path[1].substring(0,6));
        console.log("this is a test - " + path[1].substring(6));

        if (path[1] === '/') {
            socket.write('HTTP/1.1 200 OK\r\nContent-Length: 0\r\n\r\n');
        } 
        
        else if(httpRequest.substring(0, 10) === 'GET /echo/'){
            console.log("We got to the echo request")
            let EchoText = path[1].substring(6);
            EchoLength = EchoText.length;
            socket.write('HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n Content-Length:'+EchoLength+'\r\n\r\n'+EchoText);
        }else {
            socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
        }
        socket.on('end', () => {})
    });
});



server.listen(4221, 'localhost');
