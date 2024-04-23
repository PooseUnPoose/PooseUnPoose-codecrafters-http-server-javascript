const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
    socket.on("close", () => {
        socket.end();
        server.close();
    });
    
    socket.on("data", (data) => {
        httpRequest = data.toString();
        console.log(data);
        const [path] = httpRequest.split(" ");

        console.log(path[2]);
        if (path === "/") {
            socket.write("HTTP/1.1 200 OK\r\n\r\nNice");
        } else {
            socket.write("HTTP/1.1 404 Not Found\r\n\r\nBad");
        }
        socket.on("end", () => {})
    });
});



server.listen(4221, "localhost");
