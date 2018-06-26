const http = require('http');
const socketio = require('socket.io');
const url = require('url');
const fs = require('fs');
const path = require('path');
const http_listenport=80,http_listenip='127.0.0.1';

let server = http.createServer((_req,_res)=>{
	// _res.writeHead(200, {"Content-Type":"text/html"});
	// console.log(_req);
	// _res.end(fs.readFileSync(__dirname +'/src/xevious.html', "utf-8"));

    var Response = {
    	"200": function (file, filename) {
    		var extname = path.extname(filename);
    		var header = {
    			"Access-Control-Allow-Origin": "*",
    			"Pragma": "no-cache",
    			"Cache-Control": "no-cache"
    		}

    		_res.writeHead(200, header);
    		_res.write(file, "binary");
    		_res.end();
    	},
    	"404": function () {
    		_res.writeHead(404, {
    			"Content-Type": "text/plain"
    		});
    		_res.write("404 Not Found\n");
    		_res.end();

    	},
    	"500": function (err) {
    		_res.writeHead(500, {
    			"Content-Type": "text/plain"
    		});
    		_res.write(err + "\n");
    		_res.end();

    	}
    }


    var uri = url.parse(_req.url).pathname,
//		filename = path.join(process.cwd(), uri);
		filename = '/var/www/html'+uri;
//	if(uri.indexOf('socket')!==-1){return;}
	// console.log('path:' + process.cwd());
	// console.log('uri:' + uri);
	// console.log('filename:' + filename);

    fs.exists(filename, function (exists) {
    	console.log(filename + " " + exists);
    	if (!exists) {
    		Response["404"]();
    		return;
    	}
    	if (fs.statSync(filename).isDirectory()) {
    		filename += '/index.html';
    	}

    	fs.readFile(filename, "binary", function (err, file) {
    		if (err) {
    			Response["500"](err);
    			return;
    		}
    		Response["200"](file, filename);
    	});

    });

});
server.listen(http_listenport);
console.log('Server running at http://' + http_listenip + ':' + http_listenport); 
console.log(__dirname);

const io = socketio(server);

// ユーザ管理ハッシュ
var userHash = {};


// チャットアプリに接続した時に実行される
io.on("connection",(socket)=>{

	/** socketは接続しているブラウザで、以下のコードは接続直後にイベントを登録していく **/

	// ブラウザ毎の接続開始周り。
	socket.on("connected",(name)=>{
		var msg = name + "が入室しました!";
		userHash[socket.id] = name;
		io.emit("pushlish", {value: msg});
	});

	// メッセージ送信のイベント
	socket.on("publish",(data)=>{
		io.emit("publish", {value:data.value});
	});
	socket.on("publish2",(data)=>{
		io.emit("publish2", {value:data.value});
	});
	// ブラウザを閉じた等で退出イベント
	socket.on("disconnect",()=>{
		if(userHash[socket.id]){
			var msg = userHash[socket.id] + "が退出しました";
			delete userHash[socket.id];
			io.emit("publish", {value: msg});
		}
	});
});

