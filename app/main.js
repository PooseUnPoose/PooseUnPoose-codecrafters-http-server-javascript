const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
    socket.on("close", () => {
        socket.end();
        server.close();
    });
    //200 response
    socket.on("data", (data) => {
        const datasplit = data.toString().split('/');
        if (datasplit[1] == ' HTTP'){
            const response = "HTTP/1.1 200 OK\r\n\r\n"
        }
        else{
            const response = "HTTP/1.1 404 OK\r\n\r\n"
        }
        socket.read(data);
        socket.write(response);
    });
});



server.listen(4221, "localhost");
