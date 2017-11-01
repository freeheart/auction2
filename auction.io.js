const IO = require('socket.io');
var io = new IO();
io.man = 0;
io.on('connection', function(socket){
    io.man++;
    socket.saytime=0;

    //广播
    //给除了自己以外的客户端广播消息
    socket.broadcast.emit("hello",{data:"hello,everyone"});
    //给所有客户端广播消息
    io.sockets.emit("hello",{data:"hello,all"});

    //获取连接的客户端socket 
    io.sockets.clients().forEach(function (socket) {
        //.....
    })

    //获取分组信息
    //获取所有房间（分组）信息
    io.sockets.manager.rooms
    //来获取此socketid进入的房间信息
    io.sockets.manager.roomClients[socket.id]
    //获取particular room中的客户端，返回所有在此房间的socket实例
    io.sockets.clients('particular room')

    socket.on('hello', function(data){

        //组播
        //不包括自己
        socket.broadcast.to('group1').emit('event_name', data);
        //包括自己
        io.sockets.in('group1').emit('event_name', data);

        socket.saytime=Date.now()
        console.log('listen: hello')
        socket.emit('hello',{data:`I have listened ${socket.saytime},I'm coming`});
    });

    socket.on('room1', function (data) {
        socket.join('room1');
    });

    socket.on('disconnect', function(){
        io.man--
    });
});
io.on('hello',function(socket){
    console.log(socket)
});


//另一种分组方式
io.of('/some').on('connection', function (socket) {
    socket.on('test', function (data) {
        socket.broadcast.emit('event_name',{});
    });
});
/*对应另一种分组方式，客户端代码
var socket = io.connect('wss://localhost/some')
socket.on('even_name',function(data){
   console.log(data);
})
*/


module.exports=io;