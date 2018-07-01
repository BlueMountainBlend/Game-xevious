//=====================================================
//	xevious_parts_playermain.js
//	プレーヤー・ショットパーツ
//	※デバッグモードはURLパラメータをつかう
//		debug:（true/false）:デバッグモード有無
//		mp:（数値）:debug有効時、デバッグしたいマップの配列要素（0スタート）
//		ed:（数値）:debug有効時、敵難易度（0スタート）
//	2018.06.20 : 新規作成
//=====================================================
'use strict';
import _GAME_COMMON from './xevious_common';
import * as _XC from './xevious_canvasimgs';
import * as _XPD from './xevious_parts_draw';
import * as _XPO from './xevious_parts_others';
import * as _XMP from './xevious_map';

export const _PARTS_PLAYERMAIN={
	_players_obj:new Array(),//プレーヤーのオブジェクトを格納
	
	_shots:{
		'shot':new Array(),
		'missile':new Array(),
	},
	_shot_max:2,//一度のショットの最大値
	_shot_missile_target:new Array(),

	_reset:function(){
		//以下定義をリセット
		let _this = this;
		_this._players_obj = new Array();
		_this._shots = {
			'shot':new Array(),
			'missile':new Array(),
		};

		_this._shot_missile_target=new Array();

		window.cancelAnimationFrame(_this._shot_interval);
		_this._shot_interval = null;
		_this._stop_shots();

		window.cancelAnimationFrame(_this._shot_missile_interval);
		_this._shot_missile_interval = null;
		_this._stop_missile_shots();

	},
	_get_players_location:function(){
		//どちらか一つの自機座標を取得する
		let _this = this;
		//自機とフォース・シールドの表示処理
		for(let _i=0; _i<_this._players_obj.length;_i++){
			let _o=_this._players_obj[_i];
			if(!_o.isalive()){continue;}
			return {
				x: _o.getPlayerCenterPosition()._x,
				y: _o.y+_o.height-15
			}
		}
	},
	_draw_players:function(){
		let _this = this;
		//自機とフォース・シールドの表示処理
		for(let _i=0; _i<_this._players_obj.length;_i++){
			if(!_this._players_obj[_i].isalive()){continue;}
			_this._players_obj[_i].setDrawImage();
		}
	},
	_set_move_players(_p){
		let _this = this;
		//自機とフォース・シールドの移動処理
		for(let _i=0; _i<_this._players_obj.length;_i++){
			if(!_this._players_obj[_i].isalive()){continue;}
			_this._players_obj[_i].set_move(_p);
		}
	},
	_set_stop_players(){
		let _this = this;
		//自機とフォース・シールドの移動処理
		for(let _i=0; _i<_this._players_obj.length;_i++){
			if(!_this._players_obj[_i].isalive()){continue;}
			_this._players_obj[_i].set_stop();
		}
	},
	_move_players(_p){
		let _this = this;
		//自機とフォース・シールドの移動処理
		for(let _i=0; _i<_this._players_obj.length;_i++){
			if(!_this._players_obj[_i].isalive()){continue;}
			_this._players_obj[_i].move(_p);
		}
	},
	_move_shots(){
		//ショット移動
		let _this = this;
		for (let _i = 0; _i < _this._players_obj.length; _i++) {
			_this._shots.missile[_i].move();
			_this._shots.shot[_i].move();
		}	
	}, //_move_shots
	_draw_shots(){
		//ショット表示
		let _this=this;
		for (let _i = 0; _i < _this._players_obj.length; _i++) {
			_this._shots.missile[_i].setDrawImage();
			_this._shots.shot[_i].setDrawImage();
		}
	}, //_draw_shots
	_draw_collision(){
		let _this = this;
		for (let _i = 0; _i < _this._players_obj.length; _i++) {
			let _o = _this._players_obj[_i];
			if(_o.isalive()){continue;}
			_o._draw_collision();
		}
	},

	_shot_times:0,//ショット処理制御用カウント
	_shot_interval:null,
	_shot_missile_times:0, //ショット（ミサイル）処理制御用カウント
	_shot_missile_interval:null,
	_control_start_shots(_type){
		let _this = this;
		if(_this._shot_interval!==null){return;}

		let _date=new Date();
		const _loop=()=>{
			_this._shot_interval= window.requestAnimationFrame(_loop);
			_this._shot_times =
				(_this._shot_times > 10)
					? _this._shot_times
					: _this._shot_times + 1;
			//スペースキーによる押しボタンの調整
			//指定数字はおおよその値
			if (_this._shot_times >= 10) {
				//長押しは時間間隔で連射調整させる
	//			console.log('long!');
				let _d=new Date();
				if(_d-_date<50){return;}
				_date=new Date();
				//ショット
			}else{
				//短押しは最初のタイミングのみ発射させる
				if(_this._shot_times!==1){return;}
	//			console.log('shot!');
			}
			//ショットさせる
			_this._start_shots();
		}//_loop
		_this._shot_interval = window.requestAnimationFrame(_loop);

	},
	_control_start_missile_shots(){
		let _this = this;
		if(_this._shot_missile_interval!==null){return;}

		let _date=new Date();
		const _loop=()=>{
			_this._shot_missile_interval= window.requestAnimationFrame(_loop);
			_this._shot_missile_times =
				(_this._shot_missile_times > 10)
					? _this._shot_missile_times
					: _this._shot_missile_times + 1;
			//スペースキーによる押しボタンの調整
			//指定数字はおおよその値
			if (_this._shot_missile_times >= 10) {
				//長押しは時間間隔で連射調整させる
	//			console.log('long!');
				let _d=new Date();
				if(_d-_date<50){return;}
				_date=new Date();
				//ショット
			}else{
				//短押しは最初のタイミングのみ発射させる
				if(_this._shot_missile_times!==1){return;}
	//			console.log('shot!');
			}
			//ショットさせる
			_this._start_missile_shots();
		}//_loop
		_this._shot_missile_interval = window.requestAnimationFrame(_loop);

	},
	_control_stop_shots() {
		let _this = this;
		window.cancelAnimationFrame(_this._shot_interval);
		_this._shot_interval = null;
		_this._stop_shots();
	},
	_control_stop_missile_shots() {
		let _this = this;
		window.cancelAnimationFrame(_this._shot_missile_interval);
		_this._shot_missile_interval = null;
		_this._stop_missile_shots();
	},
	_start_shots(){
		let _this=this;

		//自機・オプションのショット
		for(let _i=0;_i<_this._shots.shot.length;_i++){
			let _ps=_this._shots.shot[_i];
			if(!_ps.player._isalive){continue;}
			_ps._sq=
			(_ps._sq===_ps.shots.length-1)
				?0
				:_ps._sq+1;
			var _s=_ps.shots[_ps._sq];

			if(_s._shot_alive){continue;}
			//ショット中は、ショットを有効にしない
			_s._shot=true;
			_GAME_COMMON._setPlay(_XC._CANVAS_AUDIOS['shot']);

//			console.log('shot')

			//最初の要素（自機）のみショット音をだす
//			if(_i!==0){continue;}
//			_GAME._setPlay(_s._audio);
		}
	}, //_start_shots
	_stop_shots(){
		let _this=this;
		for(let _i=0;_i<_this._shots.shot.length;_i++){
			let _ps=_this._shots.shot[_i];
			for(let _j=0;_j<_ps.shots.length;_j++){
				_ps.shots[_j]._shot=false;
			}
		}
	}, //_move_shots_stop
	_start_missile_shots(){
		let _this=this;
		//ミサイル
		for(var _i=0;_i<_this._shots.missile.length;_i++){
			let _pm=_this._shots.missile[_i];
			if(!_pm.player._isalive){continue;}
			_pm._sq=
				(_pm._sq===_pm.shots.length-1)?
					0
					:_pm._sq+1;
			var _sm=_pm.shots[_pm._sq];
			//ショット中は、ショットを有効にしない
			if(_sm._shot_alive){continue;}
			_sm._shot=true;
			_GAME_COMMON._setPlay(_XC._CANVAS_AUDIOS['shot_missile']);

			//最初の要素（自機）のみショット音をだす
			if(_i!==0){continue;}
//			_GAME._setPlay(_sm._audio);
		}
	}, //_start_missile_shots
	_stop_missile_shots(){
		let _this = this;
		for(var _i=0;_i<_this._shots.missile.length;_i++){
			let _pm=_this._shots.missile[_i];
			for(let _j=0;_j<_pm.shots.length;_j++){
				_pm.shots[_j]._shot=false;
			}
		}
	}, //_stop_missile_shots

	//敵衝突判定処理
	_enemy_collision(_e){
		let _this = this;
		//敵分をループさせる
		for (let _i = 0; _i < _e.length; _i++) {
			let _oe = _e[_i];
			//スタンバイ状態は無視する
			if (_oe.isIgnore()) {continue;}
			if (_oe.isStandBy()) {continue;}
			if (!_oe.isalive()) {continue;}

			//自機ショット衝突判定
			for (let _j = 0; _j < _this._shots.shot.length; _j++) {
				let _os = _this._shots.shot[_j];
				if (!_os.player._isalive) {continue;}
				if (_oe.enemy_type===2) {continue;}
				_os.enemy_collision(_oe);
			}
			//自機衝突判定
			for (let _j = 0; _j < _this._players_obj.length; _j++){
				if (_oe.enemy_type===2) {continue;}
				if(!_this._players_obj[_j].isalive()){continue;}
				_this._players_obj[_j].enemy_collision(_oe);
			}
			//自機ミサイル衝突判定
			for (let _k = 0; _k < _this._shots.missile.length; _k++) {
				let _pm = _this._shots.missile[_k];
				if (!_pm.player.isalive()) {continue;}
				if (_oe.enemy_type===1) {continue;}
				for (let _j = 0; _j < _pm.shots.length; _j++) {
					let _pms = _pm.shots[_j];
					_pm.enemy_collision(_oe, _pms);
				} //_j
			} //_k

		} //_i

	}, //_enemy_collision
	//敵弾衝突判定処理
	_enemy_shot_collision(_es){
		let _this=this;
		if(_es===undefined){return;}
		for(let _i=0;_i<_es.length;_i++){
			let _e=_es[_i];
			//自機衝突判定
			for (let _j = 0; _j < _this._players_obj.length; _j++){
				_this._players_obj[_j].enemy_shot_collision(_e);
			}
		}
	}, //_enemy_shot_collision

	//=============================
	//オブジェクト初期設定
	//=============================
	_init_players_obj(){
		//自機オブジェクトの初期設定
		//_pm：PowerMeterSelectで決定した値
		let _this=this;
		for(let _i=0; _i<2; _i++){
			//自機
			_this._players_obj.push(new GameObject_PLAYER_MAIN({isalive:(_i===0)?true:false}));
			//ショット
			_this._shots.shot.push(new GameObject_SHOTS_NORMAL(_this._players_obj[_i]));
			//ミサイル
			_this._shots.missile.push(new GameObject_SHOTS_MISSILE(_this._players_obj[_i]));
		}
	} //_init_players_obj

}; //_PARTS_PLAYERMAIN



//==========================================
//	以下はクラス定義
//==========================================
class GameObject_PLAYER{
	constructor(_p){
		let _this = this;
		_this.img = _p.img || _XC._CANVAS_IMGS.xevious_solvalou.obj;
		_this.width = _p.width || _this.img.width;
		_this.height = _p.height || _this.img.height;
		_this.x = _p.x || 225;
		_this.y = _p.y || 300;
		_this.imgsize = _this.img.height;

		_this._x=0;//移動量x
		_this._y=0;//移動量y

		_this._isalive=_p.isalive||true;//存在可否

		_this._c=0;
		_this.accel=3.0;
	}
	isalive(){return this._isalive;}
	enemy_collision(){}
	map_collition(){}
	getPlayerCenterPosition(){
		return {_x:this.x+(this.width/2),_y:this.y+(this.height/2)}
	}
	setfalsealive(){this._isalive=false;}
	settruealive(){this._isalive=true;}
	setDrawImage(){}
	move(){}
}

export class GameObject_PLAYER_MAIN extends GameObject_PLAYER{
	constructor(_p){
		super(_p);
		let _this=this;
		_this._col_c=0;
		_this._isequipped=false;//装備可否
		_this.map_col_date=null;
		_this.map_col_canint=0;//衝突可否範囲(ms)
	}
	_draw_collision(){
		let _this=this;
		let _pl=_this.getPlayerCenterPosition();
		if(_this._col_c===1){
			_XPO._PARTS_COLLISION._set_collision({
				x:_pl._x,
				y:_this.y+_this.height-15,
				type:'t0'
			});
			_GAME_COMMON._setPlay(_XC._CANVAS_AUDIOS['player_collision']);
			_XPD._SET_GAMEOVER();
		}
		_this._col_c=(_this._col_c>2)?2:_this._col_c+1;
	}
	enemy_collision(_e){
		let _this = this;
		if (_GAME_COMMON.isSqCollision(
			"5,"+ parseInt(_this.height-30) + ",25," + parseInt(_this.height),
			this.x+","+this.y,
			_e.shotColMap,
			_e.x+","+_e.y
			)===_GAME_COMMON._IS_SQ_NOTCOL){return;}
		_e.collision();
		this.setfalsealive();
	}
	enemy_shot_collision(_e){
		let _this = this;
		if (_GAME_COMMON.isSqCollision(
			"5,"+ parseInt(_this.height-30) + ",25," + parseInt(_this.height),
			_this.x+","+_this.y,
			_e.shotColMap,
			_e.x+","+_e.y
			)===_GAME_COMMON._IS_SQ_NOTCOL){return;}
		_e.init();
		this.setfalsealive();
	}
	set_equipped(){
		this._isequipped_count=20;
	}
	map_collition(){
	}
	set_move(_p){
		if(_p===undefined){return;}
		let _this=this;
		_this._x=_p.x*_this.accel||0;
		_this._y=_p.y*_this.accel||0;
	}
	set_stop(){
		let _this=this;
		_this._x=0;
		_this._y=0;
	}
	setDrawImage(){
		let _this=this;
		//自機
		_GAME_COMMON._context.drawImage(
			_this.img,
			0,
			0,
			_this.img.width,
			_this.img.height,
			_this.x,
			_this.y,
			_this.img.width,
			_this.img.height
		);

		//デバッグモードでは当たり判定を表示させる
		// if(_ISDEBUG){
		// 	_CONTEXT.save();
		// 	_CONTEXT.fillStyle='rgba(0,0,255,0.5)';
		// 	_CONTEXT.fillRect(
		// 		_this.x+25,
		// 		_this.y+28,
		// 		20,
		// 		7
		// 	);
		// 	_CONTEXT.restore();
		// }

	}
	move(_p){
		let _this=this;

		//敵・弾に当たったら終了
		if(!_this.isalive()){return;}
//		_this.map_collition();
		let _x = _this.x + _this._x;
		_this.x += (_x<10||_x>_GAME_COMMON._canvas.width-_this.width-10)?0:_this._x;
		let _y = _this.y + _this._y;
		_this.y += (_y<50||_y>_GAME_COMMON._canvas.height-_this.height-50)?0:_this._y;
	}
}

class GameObject_SHOTS{
	constructor(_p){
		this.shots=new Array();
		this.player=_p;//プレーヤー
		this._sq=0;//ショット順
	}
	enemy_collision(_e){//敵への当たり処理
		let _this = this;
		if(!_this.player.isalive()){return;}
		for(let _k=0;_k<this.shots.length;_k++){
			let _t=_this.shots[_k];
			if(!_t._shot_alive){continue;}
			//自機より後ろは無視する。
			if(_e.y>_this.player.y+_this.player.height){continue;}
			let _s=_GAME_COMMON.isSqCollision(
				"-12,-12,12,12",
				_t.x+","+_t.y,
				_e.shotColMap,
				_e.x+","+_e.y
			);
			if(_s===_GAME_COMMON._IS_SQ_NOTCOL){continue;}
			if(_s===_GAME_COMMON._IS_SQ_COL){
				_e.collision();					
			}
			_t._init();
		}//for
	}
	map_collition(){}
	getshottype(){}
	setDrawImage(){}
	move(){}
}

class GameObject_SHOTS_MISSILE
			extends GameObject_SHOTS{
	constructor(_p){
		super(_p);
		this.shots=new Array();
		let _t=this;
		this.width=50;
		this.height=50;
		this.dist=235;//ミサイル発射とターケットの距離（px）
		for(let _i=0;_i<1;_i++){
			this.shots.push({
				id:_i,
				x:0,//処理変数：照射x軸
				y:0,
				x_target:null,//xミサイル発射後のターゲット
				y_target:null,//yミサイル発射後のターゲット
				speed:5,//ショットスピード
				_img_target:_XC._CANVAS_IMGS.xevious_solvalou_missile_target.obj,//ターゲット画像
				_img: _XC._CANVAS_IMGS['xevious_logo'].obj,
				_audio: _XC._CANVAS_AUDIOS['shot_laser'],		
				_c_area:25,//ミサイル、爆風の当たり判定
				_enemyid:null,//ミサイルに衝突した敵のオブジェクト
				_shot:false,//処理変数：照射フラグ
				_shot_alive:false,//処理変数：照射中フラグ
				_init:function(){//初期化
					this.x=0,
					this.y=0,
					this.x_target=null,
					this.y_target=null,
					this._c_area=25,
					this._enemyid=null,
					this._shot=false,
					this._shot_alive=false
				}
			});
		}

	}
	is_dist(_t){
		//ミサイル発射からターケットまでの距離に達しているか判定
		return (_t.y-_t.speed-(_t._img_target.height/2)<=_t.y_target);
	}
	enemy_collision(_e,_t){
		let _this = this;
		//非表示のプレーヤーは無視する
		if(!_this.player.isalive()){return;}
		//弾が発していない場合は無視する
		if(!_t._shot_alive){return;}
		// console.log('_t.y' + _t.y);
		// console.log('_t.y_target' + _t.y_target);
		// console.log('===========')
		if(_t.y>=_t.y_target+_t._img_target.height){return;}

//		console.log('judge')
		//ミサイル衝突判定
		let _s=_GAME_COMMON.isSqCollision(
			(0-_t._img_target.width/4)+","
				+(0-_t._img_target.height/4)+","
				+(_t._img_target.width*5/4)+","
				+(_t._img_target.height*5/4),
			_t.x_target+","+_t.y_target,
			_e.shotColMap,
			_e.x+","+_e.y
			);
		if(_s===_GAME_COMMON._IS_SQ_NOTCOL){return;}
		if(_s===_GAME_COMMON._IS_SQ_COL_NONE){return;}
		_e.collision();

	}
	map_collition(_t){
	}
	collapse_missile(_t){
		let _this=this;
	}
	setDrawImage(){
		let _this=this;
		for(let _j=0;_j<_this.shots.length;_j++){
			let _t=_this.shots[_j];
			if(!_t._shot_alive){continue;}

			let _ct = _GAME_COMMON._context;
			_ct.fillStyle = 'rgba(255,0,0,1)';
			_ct.beginPath();
			_ct.arc(_t.x, _t.y, 4, 0, Math.PI * 2, false);
			_ct.fill();

			_ct.fillStyle = 'rgba(255,255,0,1)';
			_ct.beginPath();
			_ct.arc(_t.x, _t.y, 2, 0, Math.PI * 2, false);
			_ct.fill();

			//ターゲット画像
			_GAME_COMMON._setDrawImage({
				img: _t._img_target,
				x: _t.x_target,
				y: _t.y_target,
				width: _t._img_target.width,
				height: _t._img_target.height,
				basePoint:1
			});			
		}
	}
	move(){
		let _this=this;
		let _p=_this.player;
		if(_p.x===undefined){return;}
		//プレーヤーの中心座標取得
		let _pl = _p.getPlayerCenterPosition();

		for(let _j=0;_j<_this.shots.length;_j++){
			let _t=_this.shots[_j];
			if(!_t._shot&&!_t._shot_alive){continue;}
			//撃ち始めは自機位置から放つ
			_t.x=(!_t._shot_alive)?_pl._x:_t.x;
			_t.y=(!_t._shot_alive)?_this.player.y+_this.player.height-15:_t.y-_t.speed;
//console.log('_j:'+_j+'   _t.x:'+_t.x+'   _t.y:'+_t.y);
//console.log('_map_x:'+_map_x);

			if(!_t._shot_alive){
				_t.x_target = _p.x;
				_t.y_target = _p.y;
			}
			if (_t.x_target !== null && _t.y_target !== null) {
				_t.y_target=_XMP._MAP._getY(_t.y_target);
			}

			if (_GAME_COMMON.isShotCanvasOut(_t) || _this.is_dist(_t)) {
				//キャンバスから離れた場合初期化
				_t._init();
				continue;
			}
			_t._shot_alive=true;
		}
	}

}//GameObject_SHOTS_MISSILE

class GameObject_SHOTS_NORMAL
			extends GameObject_SHOTS{
	constructor(_p){
		super(_p);
		this.shots=new Array();
		this.speed=20;
		this.draw_shots=[//ショットアニメ定義
			{fs:'rgba(255,246,72,1)',scale:8},
			{fs:'rgba(255,131,62,1)',scale:10},
			{fs:'rgba(255,131,72,1)',scale:12},
			{fs:'rgba(255,131,62,1)',scale:14},
			{fs:'rgba(133,0,4,1)',scale:14},
			{fs:'rgba(100,0,4,1)',scale:16}
		];

		for(let _i=0;_i<_PARTS_PLAYERMAIN._shot_max;_i++){
			this.shots.push({
				x:0,//処理変数：照射x軸
				y:0,
				_img: _XC._CANVAS_IMGS['xevious_logo'].obj,
				_audio: _XC._CANVAS_AUDIOS['shot_laser'],				
				_shot:false,//処理変数：照射フラグ
				_shot_alive:false,//処理変数：照射中フラグ
				_init:function(){//初期化
					this.x=0,
					this.y=0,
					this._shot=false,
					this._shot_alive=false
				}
			});
		}
	}
	map_collition(_t){
		// //MAPの位置を取得
		// let _map_x=_MAP.getMapX(_t.x);
		// let _map_y=_MAP.getMapY(_t.y);

		// if(_MAP.isMapCollision(_map_x,_map_y)){
		// 	//ショットを初期化
		// 	_t._init();
		// 	//MAPの衝突処理
		// 	_MAP.setPlayersShotAbleCollision(_map_x,_map_y);
		// 	return;
		// }
		// if(_MAP.isMapCollision(_map_x+1,_map_y)){
		// 	//ショットを初期化
		// 	_t._init();
		// 	//MAPの衝突処理
		// 	_MAP.setPlayersShotAbleCollision(_map_x+1,_map_y);
		// }
	}
	setDrawImage(){
		let _this = this;
		for(let _j=0;_j<this.shots.length;_j++){
			let _t=this.shots[_j];
			if(!_t._shot_alive){continue;}
//			console.log('shot!')
			let _ct=_GAME_COMMON._context;
			_ct.fillStyle = _this.draw_shots[0].fs;
			_ct.beginPath();
			_ct.arc(_t.x-10, _t.y, 2, 0, Math.PI * 2, false);
			_ct.fill();

			_ct.beginPath();
			_ct.arc(_t.x+10, _t.y, 2, 0, Math.PI * 2, false);
			_ct.fill();
			// let _img=_CANVAS_IMGS['shot1'].obj;
			// _CONTEXT.drawImage(
			// 	_img,
			// 	_t.x,
			// 	_t.y,
			// 	_img.width,
			// 	_img.height
			// );
		}
	}
	move(){
		let _this = this;
		let _p=this.player;
		//プレーヤーの中心座標取得
		let _pl=_p.getPlayerCenterPosition();
		for(let _j=0;_j<this.shots.length;_j++){
			let _t=this.shots[_j];
			if(!_t._shot&&!_t._shot_alive){continue;}
			//撃ち始めは自機位置から放つ
			_t.x=(!_t._shot_alive)?_pl._x:_t.x;
			_t.y=(!_t._shot_alive)?_this.player.y+_this.player.height-15:_t.y-_this.speed;

			if (_GAME_COMMON.isShotCanvasOut(_t)) {
				_t._init();
				continue;
			}
			_t._shot_alive=true;
		}
	}
}
