'use strict';
const socketio = io.connect('http://localhost:1234');
const msgArea = document.getElementById("msg");
const myName = Math.floor(Math.random() * 100) + "さん";


export function publishMessage() {
    var textInput = document.getElementById('msg_input');
    var msg = "[" + myName + "] " + textInput.value;
    socketio.emit("publish", {
        value: msg
    });
    textInput.value = '';
}
export function socket_init() {

 // socketio = io({ path: '/public/git/Game_xevious/mt_xevious/socket.io/' });
 socketio.on("connected", function (name) {});
 socketio.on("publish", function (data) {
     addMessage(data.value);
 });
 socketio.on("disconnect", function () {});

 // 2.イベントに絡ませる関数の定義
 const start=(name)=>{
     socketio.emit("connected", name);
 }

const addMessage=(msg)=>{
     var domMeg = document.createElement('div');
     domMeg.innerHTML = new Date().toLocaleTimeString() + ' ' + msg;
     msgArea.appendChild(domMeg);
 }

 // 3.開始処理
 addMessage("貴方は" + myName + "として入室しました");
 start(myName);

}