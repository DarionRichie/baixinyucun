const Server = require('ws').Server;

const ws = new Server({ port: 9999 });
ws.on('connection', function(socket) {
    // 监听客户端发来的消息
    socket.on('message', function(msg) {
        console.log(msg);   // 这个就是客户端发来的消息
        // ws.send("yes");
    });
    socket.on('error', function(msg,ru) {
        console.log(msg);   // 这个就是客户端发来的消息
        console.log(ru);
        // ws.send("yes");
    });
    socket.on('close', function(msg,ru) {
        console.log(msg);   // 这个就是客户端发来的消息
        console.log("断开连接");
        // ws.send("yes");
    });
})
var Socket = {
// 监听服务端和客户端的连接情况
    first:function(option){
        // console.log(ws.clients);
        try{
        ws.clients.forEach(function(conn){
            conn.send(JSON.stringify(option));
        })
    }catch (e) {
            console.log(e);
        }
    },
}
module.exports = Socket;



