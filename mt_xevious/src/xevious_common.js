//=====================================================
//	xevious_common.js
//	共通定義
//	2018.06.15 : 新規作成
//=====================================================
'use strict';
import * as xevious_canvasimgs from './xevious_canvasimgs';

//JSONファイル取得関数
//url:対象ファイル
//type:レスポンスのデータタイプ（json）
//f:コールバック関数
const _AJAX = (_p) => {
	return new Promise((_res,_rej),()=>{
	let _r = new XMLHttpRequest();
	_r.onreadystatechange = () => {
		if (_r.readyState === 4) { //通信の完了時
			if (_r.status === 200) { //通信の成功時
				console.log('OK');
				_res(_r.response);
			} else {
				//connecting
				console.log('NG');
				_rej();
			}
		}
	}
	_r.open('GET', _p.url + '?date=' + (new Date().getTime()));
	_r.responseType = _p.type || 'json';
	_r.send(null);

	});
} // _AJAX

const _init_draw_audios = (_obj) => {
	return new Promise((_res,_rej)=>{
	let _audioLoadedCount = 0;
	let _alertFlag = false;
	let _gsl_r = document.querySelector('#game_start_loading .rate');

	for (let _i in _obj) {
		let _r = new XMLHttpRequest();
		_r.open('GET', _obj[_i].src, true);
		_r.responseType = 'arraybuffer'; //ArrayBufferとしてロード
		_r.onload = function () {
			// contextにArrayBufferを渡し、decodeさせる
			_GAME_COMMON._audio_context.decodeAudioData(
				_r.response,
				function (_buf) {
					_obj[_i].buf = _buf;
					_audioLoadedCount++;
					if (_audioLoadedCount >=
						Object.keys(_obj).length){
						_res();
						return;
					}
					//ローディングに進捗率を表示させる
//					_gsl_r.innerHTML = parseInt(_audioLoadedCount / Object.keys(_obj).length * 100) + '%';
//					console.log(_s);

				},
				function (_error) {
					alert('一部音声読み込みに失敗しました。再度立ち上げなおしてください:' + _error);
					_rej();
					return;
				});
		};
		_r.send();
	}
	});
}

const _init_draw_imgs = (_obj) => {
	return new Promise(function(_res,_rej){
	let _imgLoadedCount = 0;
	let _alertFlag = false;
	for (let _i in _obj) {
		let _o = _obj[_i];
		_o.obj.src = _obj[_i].src;
		_o.obj.onload = function () {
			_o.obj.width *= _o.rate;
			_o.obj.height *= _o.rate;
			_imgLoadedCount++;
			if (_imgLoadedCount >=
				Object.keys(_obj).length) {
				_res();
				return;
			}
			let _s = parseInt(_imgLoadedCount / Object.keys(_obj).length * 100);
			//ローディングに進捗率を表示させる
			// _GAME._setTextToFont(
			// 	document.querySelector('#game_start>.text_loading'),
			// 	'now loading ' + _s + ' per', 30);
		}
		_o.obj.onabort = function () {}
		_o.obj.onerror = function () {
			if (_alertFlag) {
				return;
			}
			_alertFlag = true;
			alert('一部画像読み込みに失敗しました。再度立ち上げなおしてください');
			_rej();
			return;
		}
	}
	//	});//promise
	});
};

const _DEF_DIFFICULT = [{
		"_shot_rate": 0.001,
		"_shot_speed": 0,
		"_enemy_speed": 1
	},
	{
		"_shot_rate": 0.0025,
		"_shot_speed": 1,
		"_enemy_speed": 2
	},
	{
		"_shot_rate": 0.005,
		"_shot_speed": 3,
		"_enemy_speed": 3
	}
];


const _GAME_COMMON = {
	_audio_context: '',
	_canvas: '',
	_context: '',
	_enemy_difficult: 0,
	_isdebug: false,
	_issp: (window.ontouchstart === null),
	_score: null,

	_audio_buffer_loader:null,
	_audio_now_obj_bg:null,//バックグラウンド現在再生用
	_audio_context_source_bg:null,//バックグラウンド再生用
	_audio_settimeout:null,
	_is_audio_context_source_bg:false,//バックグラウンド再生中判別フラグ

	_IS_SQ_COL:0,
	_IS_SQ_COL_NONE:1,
	_IS_SQ_NOTCOL:2,

	_txt:{//スプライトされたフォントのマッピング
		"0": "1300",
		"1": "1325",
		"2": "1350",
		"3": "1375",
		"4": "1400",
		"5": "1425",
		"6": "1450",
		"7": "1475",
		"8": "1500",
		"9": "1525",
		"A": "0",
		"B": "74",
		"C": "148",
		"D": "222",
		"E": "296",
		"F": "370",
		"G": "444",
		"H": "518",
		"I": "592",
		"J": "666",
		"K": "740",
		"L": "814",
		"M": "888",
		"N": "962",
		"O": "1036",
		"P": "1110",
		"Q": "1184",
		"R": "1258",
		"S": "1332",
		"T": "1406",
		"U": "1480",
		"V": "1554",
		"W": "1628",
		"X": "1702",
		"Y": "1776",
		"Z": "1850",
		"a": "1924",
		"b": "1998",
		"c": "2072",
		"d": "2146",
		"e": "2220",
		"f": "2294",
		"g": "2368",
		"h": "2442",
		"i": "2516",
		"j": "2590",
		"k": "2664",
		"l": "2738",
		"m": "2812",
		"n": "2886",
		"o": "2960",
		"p": "3034",
		"q": "3108",
		"r": "3182",
		"s": "3256",
		"t": "3330",
		"u": "3404",
		"v": "3478",
		"w": "3552",
		"x": "3626",
		"y": "3700",
		"z": "3774",
		"0": "3848",
		"1": "3922",
		"2": "3996",
		"3": "4070",
		"4": "4144",
		"5": "4218",
		"6": "4292",
		"7": "4366",
		"8": "4440",
		"9": "4514",
		":": "2160"
	},
	_init:function(_p){
		let _this=this;
		if(_p===undefined){return;}
		_this._canvas = document.getElementById('game');
		_this._context = _this._canvas.getContext('2d');
		_this._audio_context = new(window.AudioContext || window.webkitAudioContext)();
		_this._isdebug = (_p._pu.query['debug'] === 'true');
		_this._enemy_difficult = _p._pu.query['ed'] || 0;

	},
	_init_canvasimgs: function (_xc) {
		return Promise.all(
			[_init_draw_imgs(_xc._CANVAS_IMGS), _init_draw_audios(_xc._CANVAS_AUDIOS)])
		.then(([]) => {
			console.log('success')
		});
	},

	isEnemyCanvasOut(_oe,_dir,_size){
		//_dir {up,right,down,left}
		//_size {up,right,down,left}
		//	trueまたはfalseを指定
		let _e=_oe.getEnemyCenterPosition();

		//向き判別
		let _d=_dir||{up:true,down:true,left:true,right:true}
		let _e_w=_oe.width;
		let _e_h=_oe.height;

		//サイズ判別
		let _s=_size||{up:0,down:0,left:0,right:0}
		let _up=_s.up||0;
		let _right=_s.right||0;
		let _down=_s.down||0;
		let _left=_s.left||0;
	
		if((_e._x<0-_e_w-_left&&_d.left===true)//左
			||(_e._x>this._canvas.width+_e_w+_right&&_d.right===true)//右
			||(_e._y<0-_e_h-_up&&_d.up===true)//上
			||(_e._y>this._canvas.height+_e_h+_down&&_d.down===true)//下
			){
				return true;
			}
		return false;
	},
	isShotCanvasOut(_t){
		let _this=this;
		if(_t.x<0
			||_t.x>_this._canvas.width
			||_t.y<0
			||_t.y>_this._canvas.height
			){
			return true;
		}
		return false;
	},
	isCanvasOut(_p){
		//向き判別
		if(_p===undefined){return;}
		let _d=_p.dir||{up:false,down:true,left:true,right:true}
		let _x=_p.x;
		let _y=_p.y;
		let _w=_p.width;
		let _h=_p.height;

	
		if((_x<0-_w&&_d.left===true)//左
			||(_x>this._canvas.width&&_d.right===true)//右
			||(_y<0-_h&&_d.up===true)//上
			||(_y>this._canvas.height+_h&&_d.down===true)//下
			){
				return true;
			}
		return false;

	},
	_set_ajax(_p){
		return new Promise((_res, _rej) => {
		let _r = new XMLHttpRequest();
		_r.onreadystatechange = () => {
			if (_r.readyState === 4) { //通信の完了時
				if (_r.status === 200) { //通信の成功時
					console.log('OK');
					_res(_r.response);
				} else {
					//connecting
					console.log('NG');
					_rej();
				}
			}
		}
		_r.open('GET', _p.url + '?date=' + (new Date().getTime()));
		_r.responseType = _p.type || 'json';
		_r.send(null);

	});
	},
	_setDrawImage(_d){
		let _this=this;
		//画像表示
		//画像自体、canvasimgで定義したrateは1.0を使用すること。
		//deg:角度
		//scale:画像中心を基点とした比率維持の拡大縮小。
		//		0の場合は表示しない。
		//basePoint:拡縮・回転時の基準点
	
		//以下は描画処理させない
		//引数未定義は終了
		if(_d===undefined
			||_d.img===undefined
			||_d.scale===0){return;}
		//引数は以下
		let _width=_d.width||_d.img.width;
		let _height=_d.height||_d.img.height;
		let _deg=_d.deg||0;
		let _imgPosx=_d.imgPosx||0;
		let _imgPosy=_d.imgPosy||0;
		let _scale=_d.scale||1;
		let _x=_d.x||0;
		let _y=_d.y||0;
		let _basePoint=_d.basePoint||5;//拡縮による基準点
		let _alpha=(_d.alpha===undefined)?1:_d.alpha;//透明度
	
		if(_d.basePoint===1
			&&_d.imgPosx===undefined
			&&_d.alpha===undefined
			&&_d.scale===undefined
			&&_d.deg===undefined){
	
	//		console.log('here')
			_this._context.drawImage(
				_d.img,
				_x,
				_y,
				_width,
				_height		
			);
			return;
		}
	
		const _DEF_BASEPOINT=[//拡縮基準点ポイントの定義(0-8)
			{x:0,y:0},//0:ここはありえない
			{x:0,y:0},//1:左上
			{x:-(_width/2),y:0},//2:上真中
			{x:-_width,y:0},//3:右上
			{x:0,y:-(_height/2)},//4:左真中
			{x:-(_width/2),y:-(_height/2)},//5:真中
			{x:-_width,y:-(_height/2)},//6:右真中
			{x:0,y:-_height},//7:左下
			{x:-(_width/2),y:-_height},//8:下真中
			{x:-_width,y:-_height}//9:右下
		]
	
		_this._context.save();
		_this._context.globalAlpha=_alpha;
		_this._context.translate(_x,_y);
		_this._context.rotate(_deg*Math.PI/180);
	//	console.log(_scale)
		_this._context.scale(_scale,_scale);
		_this._context.drawImage(
			_d.img,
			_imgPosx,
			_imgPosy,
			_width,
			_height,
			_DEF_BASEPOINT[_basePoint].x,
			_DEF_BASEPOINT[_basePoint].y,
			_width,
			_height		
		);
		_this._context.restore();	
	}, //_setDrawImage
	_setDrawText(_s, _x, _y, _r) {
		//キャンバス用にテキストからフォントに置換させる。
		//_s:テキスト
		//_x:テキスト開始x座標位置
		//		数字:x座標位置
		//		left:左寄せ
		//		center:中央寄せ
		//		right:右寄せ
		//_y:テキスト開始y座標位置
		//		数字:x座標位置
		//		top:上寄せ
		//		center:中央寄せ
		//		bottom:下寄せ
		//_r:文字表示比率(0.0〜1.0)
		let _this = this;
		if(_s===undefined){return;}
		const img = xevious_canvasimgs._CANVAS_IMGS['font'].obj;
		const imgWidth = 74;
		const imgHeight = 75;
		_r = _r || 1;
		_x=(()=>{//x位置の調整
			if(_x === 'left'){return 0;}
			if(_x === 'center'){
				return parseInt(_this._canvas.width/2) - parseInt(_s.length * (imgWidth * _r) / 2)
			}
			if(_x === 'right'){
				return _this._canvas.width - parseInt(_s.length * imgWidth * _r);}
			return _x;
		})();
		_y=(()=>{//y位置の調整
			if(_y === 'top'){return 0;}
			if(_y === 'center'){
				return parseInt(_this._canvas.height/2) - parseInt((imgHeight * _r) / 2)
			}
			if(_y === 'bottom'){
				return _this._canvas.height - parseInt(imgHeight * _r);}
			return _y;
		})();

		//文字表示
		for (let _i = 0; _i < _s.length; _i++) {
			if (_s[_i] === ' ') {
				continue;
			}
			//センタリングに表示
			_this._setDrawImage({
				img: img,
				x: _x + (imgWidth * _r * _i),
				y: _y,
				imgPosx: parseInt(_this._txt[_s[_i]]),
				width: imgWidth,
				height: imgHeight,
				scale: _r,
				basePoint: 1
			});
		}
	}, //_setDrawTextToFont
	isSqCollision(_s1,_s1_n,_s2,_s2_n,_d){
		return (this.isSqCollision_laser(_s1,_s1_n,_s2,_s2_n,_d)).ret;
	},
	isSqCollision_laser(_s1,_s1_n,_s2,_s2_n,_d){
		let _this = this;
		//_s1四辺と、_s2(その中の複数の四辺)の衝突判定。
		//重なった場合は、衝突とする。
		//（1）_s1,_s2の中心点を取得
	
		//_s1:2座標"x1,y1,x2,y2,col"文字列
		//_s1_n:_s1の現在の座標（左上）"x,y"
		//_s2:2座標"x1,y1,x2,y2,col"文字列でかつ配列
		//_s2_n:_s2の現在の座標（左上）"x,y"
		// ※col:当たり判定にしない衝突
		//		false当たり判定にしない
		//_d:デバッグ用(true)
		//
		// return
		// _IS_SQ_COL(0):衝突している、かつ、あたり判定とする。
		// _IS_SQ_COL_NONE(1):衝突している、ただし、あたり判定はしない。
		// _IS_SQ_NOTCOL(2):衝突していない。
	
		//各点の現在の位置を取得する（座標位置は左上）
		let _s1_n_x=parseInt((_s1_n===undefined)?0:_s1_n.split(',')[0]);
		let _s1_n_y=parseInt((_s1_n===undefined)?0:_s1_n.split(',')[1]);
		let _s2_n_x=parseInt((_s2_n===undefined)?0:_s2_n.split(',')[0]);
		let _s2_n_y=parseInt((_s2_n===undefined)?0:_s2_n.split(',')[1]);
	
		let _s1_p=_s1.split(',');//s1ポイント
		let _s1_w=parseInt(_s1_p[2])-parseInt(_s1_p[0]);//幅
		let _s1_h=parseInt(_s1_p[3])-parseInt(_s1_p[1]);//高
		let _s1_l=Math.sqrt(
					Math.pow(_s1_w,2)+Math.pow(_s1_h,2)
				);//斜辺
		let _s1_c_x=(_s1_w/2)+_s1_n_x+parseInt(_s1_p[0]);//_s1の中心点x
		let _s1_c_y=(_s1_h/2)+_s1_n_y+parseInt(_s1_p[1]);//_s1の中心点y
		if(_d){
			console.log(_s1_c_x+":"+_s1_c_y);
		}
		//敵の複数衝突マップ分ループさせる
		for(let _i=0;_i<_s2.length;_i++){
			let _s2_p=_s2[_i].split(',');
			//1衝突マップの幅
			let _s2_w=parseInt(_s2_p[2])-parseInt(_s2_p[0]);
			//1衝突マップの高さ
			let _s2_h=parseInt(_s2_p[3])-parseInt(_s2_p[1]);
			//1衝突マップの当たり判定フラグ
			let _s2_col=(function(_f){
				if(_f===undefined){return true;}
				if(_f==='false'){return false;}
				return false;
			})(_s2_p[4]);
	
			//1衝突マップの斜辺
			let _s2_l=Math.sqrt(
				Math.pow(_s2_w,2)+Math.pow(_s2_h,2)
			);//斜辺
				
			let _s2_c_x=(_s2_w/2)+_s2_n_x+parseInt(_s2_p[0]);//_s2の中心点x
			let _s2_c_y=(_s2_h/2)+_s2_n_y+parseInt(_s2_p[1]);//_s2の中心点y
					
			//_s1（自機）と_s2（1衝突）中心点の距離とその斜辺
			let _d_x=Math.abs(_s2_c_x-_s1_c_x);
			let _d_y=Math.abs(_s2_c_y-_s1_c_y);
			let _d_l=Math.sqrt(
				Math.pow(_d_x,2)+Math.pow(_d_y,2)
			);//斜辺
	
			//衝突判定
			let _tmpx=_s2_n_x+parseInt(_s2_p[0]);
	//		if(_d_l<(_s1_l/2)+(_s2_l/2)){
			if((_s1_w/2)+(_s2_w/2)>_d_x
				&&(_s1_h/2)+(_s2_h/2)>_d_y){
				return (_s2_col)
					?{ret:_this._IS_SQ_COL,val:_tmpx}
					:{ret:_this._IS_SQ_COL_NONE,val:_tmpx};
			}
		}//_i
		return {ret:_this._IS_SQ_NOTCOL,val:_this._canvas.width};
	},
	_setPlay(_obj,_time){
		//_obj:再生させたい音声オブジェクト
		//_time:再生完了時間（ms）
		let _this = this;
		return new Promise((_res, _rej) => {
			if(_obj===null||_obj===undefined){return;}
		
			var _s=_this._audio_context.createBufferSource();
			_s.buffer=_obj.buf;
			_s.loop=false;
			_s.connect(_this._audio_context.destination);
			_s.start(0);
			if(_time===undefined){return;}
			_this._audio_settimeout=setTimeout(()=>{_res();},_time);
		});
	},
	_setPlayOnBG(_obj,_loop,_time){
		//_obj:再生させたい音声オブジェクト
		//_loop:ループ可否
		//_time:再生完了時間（ms）
		let _this = this;
		return new Promise((_res,_rej)=>{
			//バックグラウンド用再生
			if(_obj===null||_obj===undefined){return;}
			
			if(_this._is_audio_context_source_bg===true){
				_this._audio_context_source_bg.stop();
				_this._is_audio_context_source_bg=false;
			}
			let _t = _this._audio_context.createBufferSource();
			_t.buffer=_obj.buf;
			_this._audio_now_obj_bg=_obj;//バッファの一時保存用
			_t.loop=(_loop===false)?false:true;
			_t.loopStart=0;
			_t.connect(_this._audio_context.destination);
			_t.start(0,0);
			
			_this._audio_context_source_bg=_t;
			_this._is_audio_context_source_bg=true;

			if(_time===undefined){return;}
			_this._audio_settimeout=setTimeout(()=>{_res();},_time);
		});

	},
	_setStopOnBG(){
		//バックグラウンド用停止
		let _this = this;
		if(!_this._is_audio_context_source_bg){return;}
		_this._audio_context_source_bg.stop();
		_this._is_audio_context_source_bg=false;
		clearTimeout(_this._audio_settimeout);
	},
	_getDifficult(_num){
		return _DEF_DIFFICULT[_num];
	}
};

export default _GAME_COMMON;