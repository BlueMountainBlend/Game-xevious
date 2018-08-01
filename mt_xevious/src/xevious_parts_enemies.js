//=====================================================
//	xevious_parts_enemies.js
//	敵の定義
//	2018.06.22 : 新規作成
//=====================================================
'use strict';
import _GAME_COMMON from './xevious_common';
import * as _XC from './xevious_canvasimgs';
import * as _XES from './xevious_parts_enemy_shot';
import * as _XMP from './xevious_map';
import * as _XPD from './xevious_parts_draw';
import * as _XPO from './xevious_parts_others';
import * as _XPPM from './xevious_parts_playermain';


export const _PARTS_ENEMIESMAIN={
	_difficult: 0,
	_speed: 1,
 	_enemies_field:new Array(),
	_enemies_fly:new Array(),
	_shot_rate:0.001,
	_init(_num){
		this._shot_rate=(_GAME_COMMON._getDifficult(_num))._shot_rate;
		this._difficult=_num;
		this._speed=(_GAME_COMMON._getDifficult(_num))._enemy_speed;
	},
	_map_def:{
		'a':{
			'_gamestart':(_x,_y)=>{_PARTS_ENEMIESMAIN._enemies_fly.push(new ENEMY_TOROID({x:_x,y:_y}));},
			'_st':'',
			'_getObj':()=>{return new ENEMY_TOROID({})}
		},
		'b':{
			'_gamestart':(_x,_y)=>{_PARTS_ENEMIESMAIN._enemies_fly.push(new ENEMY_BACURA({x:_x,y:_y}));},
			'_st':'',
			'_getObj':()=>{return new ENEMY_BACURA({})}
		},
		'c':{
			'_gamestart':(_x,_y)=>{_PARTS_ENEMIESMAIN._enemies_field.push(new ENEMY_BARRA({x:_x,y:_y}));},
			'_st':'',
			'_getObj':()=>{return new ENEMY_BARRA({})}
		},
		'd':{
			'_gamestart':(_x,_y)=>{_PARTS_ENEMIESMAIN._enemies_field.push(new ENEMY_ZOLBAK({x:_x,y:_y}));},
			'_st':'',
			'_getObj':()=>{return new ENEMY_ZOLBAK({})}
		},
		'e':{
			'_gamestart':(_x,_y)=>{_PARTS_ENEMIESMAIN._enemies_field.push(new ENEMY_LOGRAM({x:_x,y:_y}));},
			'_st':'',
			'_getObj':()=>{return new ENEMY_LOGRAM({})}
		},
		'f':{
			'_gamestart':(_x,_y)=>{_PARTS_ENEMIESMAIN._enemies_fly.push(new ENEMY_ZAKATO({x:_x,y:_y}));},
			'_st':'',
			'_getObj':()=>{return new ENEMY_ZAKATO({})}
		},
		'g':{
			'_gamestart':(_x,_y)=>{_PARTS_ENEMIESMAIN._enemies_field.push(new ENEMY_DEROTA({x:_x,y:_y}));},
			'_st':'',
			'_getObj':()=>{return new ENEMY_DEROTA({})}
		},
		'h':{
			'_gamestart':(_x,_y)=>{_PARTS_ENEMIESMAIN._enemies_field.push(new ENEMY_GARU_DEROTA({x:_x,y:_y}));},
			'_st':'',
			'_getObj':()=>{return new ENEMY_GARU_DEROTA({})}
		},
		'i':{
			'_gamestart':(_x,_y)=>{_PARTS_ENEMIESMAIN._enemies_fly.push(new ENEMY_TORKAN({x:_x,y:_y}));},
			'_st':'',
			'_getObj':()=>{return new ENEMY_TORKAN({})}
		},
		'j':{
			'_gamestart':(_x,_y)=>{_PARTS_ENEMIESMAIN._enemies_fly.push(new ENEMY_ZOSHI({x:_x,y:_y}));},
			'_st':'',
			'_getObj':()=>{return new ENEMY_ZOSHI({})}
		},

		//隠れキャラクター
		'y':{
			'_gamestart':(_x,_y)=>{_PARTS_ENEMIESMAIN._enemies_field.push(new ENEMY_SOL({x:_x,y:_y}));},
			'_st':'',
			'_getObj':()=>{return new ENEMY_SOL({})}
		},


		'z':{
			'_gamestart':(_x,_y)=>{_PARTS_ENEMIESMAIN._enemies_field.push(new ENEMY_ANDORGENESIS({x:_x,y:_y}));},
			'_st':'',
			'_getObj':()=>{return new ENEMY_ANDORGENESIS({})}
		},

	},
	_reset(){
		let _this = this;
		_this._enemies_field = new Array();
		_this._enemies_fly = new Array();
	},
	_get_enemies(){
		return (this._enemies_field.length + this._enemies_fly.length===0);
	},
	_get_array_enemies(){
		return this._enemies_field.concat(this._enemies_fly);
	},
	_optimized_enemies(){
		let _this = this;
		_this._enemies_field.map((_e, _i, _ar) => {
			if (!_e.isshow() && !_e.isalive()) {
				_ar.splice(_i, 1);
			}
		});
		_this._enemies_fly.map((_e, _i, _ar) => {
			if (!_e.isshow() && !_e.isalive()) {
				_ar.splice(_i, 1);
			}
		});
	},
	_move_enemies(){
		let _this = this;
		_this._enemies_field.map((_e) => {_e.move();});
		_this._enemies_fly.map((_e) => {_e.move();});
	},
	_draw_enemies_field(){
		let _this = this;
		_this._enemies_field.map((_e) => {_e.setDrawImage();});
	},
	_draw_enemies_fly(){
		let _this = this;
		_this._enemies_fly.map((_e) => {_e.setDrawImage();});
	}
};


//===========================================
//敵クラス
//（1）main.jsよりインスタンス＋初期化
//（2）main.jsからmove()で処理実行
//（3）isMove()で表示等の可否判定
//（4）爆発処理はshowCollapes()→ani_col()
//衝突判定は
// collision()
//===========================================
class GameObject_ENEMY{
	constructor(_p){
		let _this=this;
		_this.gid=0;//敵のグループID
		_this.img=_p.img;//画像オブジェクト
		_this.imgPos=_p.imgPos||[0];//スプライト時の画像
		_this.aniItv=_p.aniItv||10;//スプライトアニメによる間隔(ms)
		_this.width=_p.width||_this.img.width;
		_this.height=_p.height||_this.img.height;
		_this.x=_p.x||0;//X位置
		_this.y=_p.y||0;//Y位置
		_this._s=_p.s||'0';//MAP衝突ビット
		_this.enemy_type=_p.enemy_type||1; //1:空中,2:地上

		_this.audio_collision = _XC._CANVAS_AUDIOS['enemy_collision1'];
		_this.audio_alive = _XC._CANVAS_AUDIOS['enemy_collision3'];
		
		_this.isshot=false;

		_this.alpha=1;//表示透明度（1〜0。1:表示、0:非表示）
		_this._c=0;//アニメーションカウント

		_this.speed = (_PARTS_ENEMIESMAIN._speed || 1); //敵のスピード
		_this.getscore=30;//倒した時のスコア
		
		_this._standby=true;//スタンバイ状態
		_this._isshow=true;
		_this._status=1;//生存ステータス

		_this.haspc=false;//パワーカプセル所持フラグ

		_this._collision_type=(_this.enemy_type===1)?'t1':'t2';

		//完全に無視する
		_this.is_ignore=_p.is_ignore||false;
		//敵衝突可能フラグ（falseは無敵）
		_this.is_able_collision=true;
		//衝突してるがショットを通過させる
		//true:衝突判定するが、ショットは通過
		//false:衝突するものの無視
		_this.is_ignore_collision=false;
		//衝突時自機の攻撃を初期化させる
		//主にレーザーに対して処理させる
		_this.is_collision_player_init=false;

		//衝突判定座標(x1,y1,x2,y2)
		//左上：x1,y1
		//右下：x2,y2
		_this.shotColMap=[
			"0,0,"+_this.width+","+_this.height
		];
		_this.col_date=null;//打たれた時間
		_this.col_canint=150;//連続ショット許可間隔(ms)
	}
	init(){
		let _this=this;
		_this._status=0;
		_this._isshow=false;
	}
	collision(_s_type,_num){
		//衝突処理
		//パラメータはあるが、デフォルトでは不要
		//ショットタイプ別に処理を分ける際は、
		//このクラスから継承する。
		//_s_type:自機のショットタイプ
		//_num:一度にヒットさせる値
		//戻り値
		//true:当たり判定あり
		//false:当たり判定なし
		let _this=this;
		if(!_this.isCollision()){return false;}
		//無敵は_statusを下げないが衝突させる
		if(!_this.is_able_collision){return true;}
		_this.setStatus();
		return true;
	}
	isAbleCollision(){return this.is_able_collision;}
	isIgnore(){return this.is_ignore;}
	isIgnoreCollision(){return this.is_ignore_collision;}
	isCollision(){
		//衝突判定フラグ
		//_statusを下げる判定フラグ
		let _this=this;
		//150ミリ秒以内は無視する。
		if(_this.col_date===null){
			//1発目は必ず当てる
			_this.col_date=new Date();
			return true;
		}
		let _date=new Date();
		if(_date-_this.col_date>_this.col_canint){
			_this.col_date=new Date();
			return true;
		}
		return false;
	}
	setAlive(){
		let _this=this;
		if(!_this.isalive()){
			_XPO._PARTS_OTHERS._set_score(_this.getscore);
			_XPD._DRAW_PLAYER_ENEMIES(_this.audio_collision);
		}else{
			_XPD._DRAW_PLAYER_ENEMIES(_this.audio_alive);
		}
	}
	setStatus(){
		let _this=this;
		//自機・ショットによって判定を識別させる
		_this._status-=1;
		_this.setAlive();
	}
	getEnemyCenterPosition(){
		return {_x:this.x+(this.width/2),
				_y:this.y+(this.height/2)}
	}
	isalive(){return (this._status>0);}
	isshow(){return this._isshow;}
	shot(){
		//キャンバス内でショットさせる
		if(_GAME_COMMON.isCanvasOut(this)){return;}
		if(_PARTS_ENEMIESMAIN._shot_rate<Math.random()){return;}
		_XES._PARTS_ENEMYSHOT._set_enemyshot(this);

// 		if(Math.random()>=
// 		_DEF_DIFFICULT[_ENEMY_DIFFICULT]._ENEMY_SHOT_RATE){
// 			return;
// 		}

// //		console.log(this.getEnemyCenterPosition()._x);
// 		//敵の中心から弾を発射させるための位置調整
// 		_ENEMIES_SHOTS.push(
// 			new GameObject_ENEMY_SHOT({
// 				x:this.getEnemyCenterPosition()._x,
// 				y:this.getEnemyCenterPosition()._y
// 				})
// 			);
	}
	set_imgPos(){
		let _this=this;
		_this._c=
			(_this._c>=(_this.imgPos.length*_this.aniItv)-1)?0:_this._c+1;
	}
	get_imgPos(){
		let _this=this;
		return _this.imgPos[parseInt(_this._c/_this.aniItv)]
	}
	setDrawImage(){
		let _this=this;
		if(!_this.isMove()){return;}
		_GAME_COMMON._context.save();
		_GAME_COMMON._context.drawImage(
			_this.img,
			_this.get_imgPos(),
			0,
			_this.width,
			_this.height,
			_this.x,
			_this.y,
			_this.width,
			_this.height
		);
		_GAME_COMMON._context.restore();
	}
	isStandBy(){return this._standby;}
	isCanvasOut(){
		//敵位置がキャンバス以外に位置されてるか。
		//※main.jsで、trueの場合は、
		//_IS_ENEMIES_COLLISION、
		//_ENEMIES内、インスタンスが削除される。
		//true:外れてる
		//false:外れていない
		return _GAME_COMMON.isEnemyCanvasOut(
			this,{up:false,down:true,left:true,right:true}
		);
	}
	showCollapes(_x,_y){
		let _this=this;
		//敵を倒した場合
		_this._isshow=false;
		//爆発して終了
		_XPO._PARTS_COLLISION._set_collision({
			x:_x||_this.x+(_this.width/2),
			y:_y||_this.y+(_this.height/2),
			type:_this._collision_type
		});
		if (_this.enemy_type===1) {
			// //地上の敵は爆発後の画像を表示させる
			// _XPO._PARTS_COLLISION._set_collapsed_fly({
			// 	x:_x||_this.x+(_this.width/2),
			// 	y:_y||_this.y+(_this.height/2)
			// });
		}
		else if (_this.enemy_type===2) {
			//地上の敵は爆発後の画像を表示させる
			_XPO._PARTS_COLLISION._set_collapsed_field({
				x:_x||_this.x+(_this.width/2),
				y:_y||_this.y+(_this.height/2)
			});
		}
	}
	isMove(){
		let _this=this;
		//move()判定処理
		//以下false（moveしない）
		//・スタンバイ中
		//・キャンバス外
		//・生存しない
		if(_this.isStandBy()){
			_this.move_standby();
			return false;
		}
		if(_this.isCanvasOut()){
			_this._status=0;
			_this._isshow=false;			
			return false;
		}
		if(!_this.isshow()){
			return false;
		}
		if(!_this.isalive()){
			_this.showCollapes();
			return false;
		}
		return true;
	}
	moveDraw(){
		//敵の描画メイン
		//弾の発射
	}
	moveSet(){}
	move_standby(){
		let _this=this;
		if (_this.y+_this.height > 0) {
			_this._standby=false;
		}
	}
	move(){
		//敵の処理メイン
		//原則継承はしない
		let _this=this;
		_this.x = _XMP._MAP._getX(_this.x);
		_this.y = _XMP._MAP._getY(_this.y);
		if(!_this.isMove()){return;}
		_this.moveSet();
		_this.shot();
		_this.set_imgPos();
	}
}



export class ENEMY_TOROID extends GameObject_ENEMY {
	constructor(_p){
		super({
			img:_p.img||_XC._CANVAS_IMGS.xevious_enemy_toroid.obj,
			x:_p.x,
			y:_p.y,
			imgPos:[0],
			width:30,
			height:30
		});
		let _this=this;
		_this.turnflag = false;//自機と同じxになったら切り替える
		_this.speedx = 0;
		_this.speedy = _PARTS_ENEMIESMAIN._speed;
	}
	move_standby(){
		let _this = this;
		if (_this.y > 0) {
			_this._standby = false;
			_this.speedx=(_this.x<(_GAME_COMMON._canvas.width/2))?1:-1;
		}
	}
	moveSet(){
		let _this = this;
		_this.speedx=(()=>{
			if(_this.turnflag){return _this.speedx;}
			if(_this.y<100){return _this.speedx;}
			let _o = _XPPM._PARTS_PLAYERMAIN._get_players_location();
			if(_o===undefined){return _this.speedx;}
			if (_this.speedx < 0) {
				if (_o.x < _this.x) {
					_this.turnflag = true;
					return _this.speedx * -3;
				}
			} else {
				if (_o.x > _this.x) {
					_this.turnflag = true;
					return _this.speedx * -3;
				}
			}
			return _this.speedx;
		})();
//		console.log(_this.speedx)
		if(_this.turnflag){
			_this.imgPos = [0, 30, 60, 90, 120, 150, 180];
			_this.aniItv = 1;
			_this.speedy = 2;
		}
		_this.x+=_this.speedx;
		_this.y+=_this.speedy;
	}
}

export class ENEMY_BACURA extends GameObject_ENEMY {
	constructor(_p){
		super({
			img:_p.img||_XC._CANVAS_IMGS.xevious_enemy_bacura.obj,
			x:_p.x,
			y:_p.y,
			aniItv:5,
			imgPos:[0,70,140,210,280,350,420],
			width:70,
			height:40
		});
		let _this=this;
//		_this.is_able_collision = false;
		_this.speed = _PARTS_ENEMIESMAIN._speed;
		_this._status = 255;
		_this._rad = 0;
		_this._step1 = false;
		_this._step2 = false;
	}
	moveSet(){
		let _this=this;
		if (_PARTS_ENEMIESMAIN._difficult<1){
			_this.y += _this.speed;
			_this.y = _XMP._MAP._getY(_this.y);
			return;
		}

		if(_this.y>250&&!_this._step1&&!_this._step2){_this._step1=true;}
		if(_this._step1&&!_this._step2){
			_this.speed = (Math.cos(_this._rad) * _PARTS_ENEMIESMAIN._speed);
			_this._rad+=0.02;
		}
		if(_this._rad>2*Math.PI){
			_this._step2=true;
		}
		if(_this._step2){
			_this.speed = _PARTS_ENEMIESMAIN._speed;
		}
		_this.y += _this.speed;
	}
	move(){
		//敵の処理メイン
		//原則継承はしない
		let _this=this;
		_this.x = _XMP._MAP._getX(_this.x);
		if(!_this.isMove()){
			_this.y = _XMP._MAP._getY(_this.y);
			return;
		}
		_this.moveSet();
		_this.set_imgPos();
	}
}

export class ENEMY_BARRA extends GameObject_ENEMY {
	constructor(_p){
		super({
			img:_p.img||_XC._CANVAS_IMGS.xevious_enemy_barra.obj,
			x:_p.x,
			y:_p.y,
			imgPos:[0],
			width:30,
			height:30,
			enemy_type:2
		});
		let _this=this;
		_this.getscore = 100; //倒した時のスコア
		_this.audio_collision = _XC._CANVAS_AUDIOS['enemy_collision2'];

	}
	shot(){}
}


export class ENEMY_LOGRAM extends GameObject_ENEMY {
	constructor(_p){
		super({
			img:_p.img||_XC._CANVAS_IMGS.xevious_enemy_logram.obj,
			x:_p.x,
			y:_p.y,
			imgPos:[0],
			width:30,
			height:30,
			aniItv:20,
			enemy_type:2
		});
		let _this=this;
		_this.getscore = 200; //倒した時のスコア
		_this.isopen = false;
		_this.isshot = false;
		_this.audio_collision = _XC._CANVAS_AUDIOS['enemy_collision2'];

	}
	shot(){
		let _this=this;
		//キャンバス内でショットさせる
		if(_GAME_COMMON.isCanvasOut(this)){return;}

		if(!_this.isopen){
			if(Math.random()>=_PARTS_ENEMIESMAIN._shot_rate){return;}
			_this.imgPos = [0, 30, 60, 90, 120, 150];
			_this.isopen = true;
			return;
		}
//		console.log(_this.get_imgPos())
		//ここはショット中の処理
		if (_this.get_imgPos() === 90) {
			if(!_this.isshot){
				_XES._PARTS_ENEMYSHOT._set_enemyshot(_this);
				_this.isshot = true;
			}
		}
		if (_this.get_imgPos() === 150) {
			//ショットが完了したら元に戻す
			_this.imgPos = [0];
			_this.isopen = false;
			_this.isshot = false;
		}		
	}
}

export class ENEMY_ZOLBAK extends GameObject_ENEMY {
	constructor(_p){
		super({
			img:_p.img||_XC._CANVAS_IMGS.xevious_enemy_zolbak.obj,
			x:_p.x,
			y:_p.y,
			imgPos:[0,30,60,90,120,150,180,210],
			width:30,
			height:30,
			aniItv:20,
			enemy_type:2
		});
		let _this=this;
		_this.getscore = 200; //倒した時のスコア
		_this.audio_collision = _XC._CANVAS_AUDIOS['enemy_collision2'];

	}
	shot(){}
}

export class ENEMY_DEROTA extends GameObject_ENEMY {
	constructor(_p){
		super({
			img:_p.img||_XC._CANVAS_IMGS.xevious_enemy_derota.obj,
			x:_p.x,
			y:_p.y,
			imgPos:[0,30,60,90,120,150],
			width:30,
			height:30,
			aniItv:20,
			enemy_type:2
		});
		let _this=this;
		_this.getscore = 1000; //倒した時のスコア
		_this.audio_collision = _XC._CANVAS_AUDIOS['enemy_collision2'];
	}
}

export class ENEMY_GARU_DEROTA extends GameObject_ENEMY {
	constructor(_p) {
		super({
			img: _XC._CANVAS_IMGS.xevious_enemy_garu_derota.obj,
			x: _p.x,
			y: _p.y,
			imgPos: [0, 60, 120, 180, 240, 300],
			width: 60,
			height: 60,
			aniItv: 20,
			enemy_type: 2
		});
		let _this = this;
		_this.getscore = 1000; //倒した時のスコア
		_this.audio_collision = _XC._CANVAS_AUDIOS['enemy_collision2'];
		_this.shotColMap = ["15,15,30,30"];
		_this._is_collision=false;
	}
	showCollapes() {
		let _this = this;
		if(_this._is_collision){return;}
		//敵を倒した場合
		_this.imgPos = [360, 420, 480, 540, 600, 660];
		//爆発して終了
		_XPO._PARTS_COLLISION._set_collision({
			x: _this.x+30,
			y: _this.y+30,
			type: _this._collision_type
		});
		_this._is_collision=true;
	}
	setDrawImage() {
		let _this = this;
		_GAME_COMMON._context.save();
		_GAME_COMMON._context.drawImage(
			_this.img,
			_this.get_imgPos(),
			0,
			_this.width,
			_this.height,
			_this.x,
			_this.y,
			_this.width,
			_this.height
		);
		_GAME_COMMON._context.restore();
	}
	move() {
		let _this = this;
		_this.x = _XMP._MAP._getX(_this.x);
		_this.y = _XMP._MAP._getY(_this.y);
		_this.set_imgPos();
		if (!_this.isMove()) {return;}
		_this.moveSet();
		_this.shot();
	}
}

export class ENEMY_ZAKATO extends GameObject_ENEMY {
	constructor(_p){
		super({
			img:_p.img||_XC._CANVAS_IMGS.xevious_enemy_zakato.obj,
			x:_p.x,
			y:_p.y,
			imgPos:[0],
			width:20,
			height:20,
			enemy_type:1
		});
		let _this=this;
		_this.getscore = 200; //倒した時のスコア
		_this._collision_type = 't3';
		_this.rad = 0;
		_this.speedx = _PARTS_ENEMIESMAIN._speed;
		_this.speedy = _PARTS_ENEMIESMAIN._speed + 3;

		_this._scc = 0;//self-collision-count 自爆カウント
	}
	shot(){}
	showCollapes() {
		let _this = this;
		//敵を倒した場合
		_this._isshow = false;
		//爆発して終了
		_XPO._PARTS_COLLISION._set_collision({
			x: _this.getEnemyCenterPosition()._x,
			y: _this.getEnemyCenterPosition()._y,
			type: _this._collision_type
		});
		_XES._PARTS_ENEMYSHOT._set_enemyshot(_this);
	}
	move_standby(){
		let _this = this;
		if (_this.y === 100) {
			_this.img=_XC._CANVAS_IMGS.xevious_enemies_collapes0.obj;
			_this.imgPos=[0,60,120,180,240,320,400,480,540,600];
			_this.width=60;
			_this.height=60;
			//			_this._standby = false;
//			_this.speedx=(_this.x<(_GAME_COMMON._canvas.width/2))?1:-1;
		}
		if(_this.y > 100){
			//登場する前の描画
			_GAME_COMMON._context.save();
			_GAME_COMMON._context.drawImage(
				_this.img,
				_this.get_imgPos(),
				0,
				_this.width,
				_this.height,
				_this.x-(_this.width/2),
				_this.y-(_this.height/2),
				_this.width,
				_this.height
			);
			_GAME_COMMON._context.restore();

		}
//		console.log(_this.get_imgPos())
		if(_this.get_imgPos()===600){
			_this._standby = false;
			_this.img=_XC._CANVAS_IMGS.xevious_enemy_zakato.obj;
			_this.imgPos=[0];
			_this.width=20;
			_this.height=20;

			let _o=_XPPM._PARTS_PLAYERMAIN._get_players_location();
			if(_o===undefined){return;}
			_this.rad=Math.atan2((_o.y-_this.y),(_o.x-_this.x));
			_this.speedx = Math.cos(_this.rad) * 2 * _PARTS_ENEMIESMAIN._speed;
			_this.speedy = Math.sin(_this.rad) * 2 * _PARTS_ENEMIESMAIN._speed;
		}
//		_this.setDrawImage();
		_this.set_imgPos();
	}
	moveSet(){
		let _this=this;

		if(_this._scc>50){_this._status=0;}
		if (!_this.isalive()) {
			_XES._PARTS_ENEMYSHOT._set_enemyshot(this);
			return;
		}
		let _o = _XPPM._PARTS_PLAYERMAIN._get_players_location;
		_this.x+=_this.speedx;
		_this.y+=_this.speedy;
		_this._scc++;
	}
}

export class ENEMY_ZOSHI extends GameObject_ENEMY {
	constructor(_p){
		super({
			img:_p.img||_XC._CANVAS_IMGS.xevious_enemy_zoshi.obj,
			x:_p.x,
			y:_p.y,
			imgPos:[0,30,60,90,120,150],
			width:30,
			height:30,
			enemy_type:1
		});
		let _this=this;
		_this.getscore = 100; //倒した時のスコア
		_this._collision_type = 't3';


		let _o=_XPPM._PARTS_PLAYERMAIN._get_players_location();
		if(_o===undefined){return;}
		_this.rad=Math.atan2((_o.y-_this.y),(_o.x-_this.x));
		_this.speedx = Math.cos(_this.rad) * 3 * _PARTS_ENEMIESMAIN._speed;
		_this.speedy = Math.sin(_this.rad) * 3 * _PARTS_ENEMIESMAIN._speed;
	}
	shot(){}
	moveSet(){
		let _this=this;
		if (!_this.isalive()) {
			return;
		}
		_this.x+=_this.speedx;
		_this.y+=_this.speedy;
	}
}



export class ENEMY_TORKAN extends GameObject_ENEMY {
	constructor(_p) {
		super({
			img: _XC._CANVAS_IMGS.xevious_enemy_torkan.obj,
			x: _p.x,
			y: _p.y,
			imgPos: [0],
			width: 30,
			height: 30,
			aniItv: 10,
			enemy_type: 1
		});
		let _this = this;
		_this.getscore = 50; //倒した時のスコア

		_this.init_speedx=(_p.x>_GAME_COMMON._canvas.width/2)?-1:1;
		_this.init_speedy = _PARTS_ENEMIESMAIN._speed+5;
		_this.speedx=_this.init_speedx;
		_this.speedy=_this.init_speedy;
		_this.changeY=(Math.random()*400-200)+200;

		_this.changedY = false;//止まったときにtrue
		_this.isshot = false;//弾発射完了後にtrue
	}
	shot(){
		//この敵は1回だけ弾を発射させる。
		let _this = this;
		if (!_this.changedY){return;}
		if(_this.isshot){return;}
		_XES._PARTS_ENEMYSHOT._set_enemyshot(this);
		_this.isshot = true;
	}
	moveSet() {
		let _this = this;
		_this.y += _this.speedy;
		if (_this.changedY && _this.y<0){_this.init();return;}
		if (_this.changedY && _this.get_imgPos() === 150) {
			_this.imgPos=[180];
			_this.speedx = _this.init_speedx * -1;
			_this.speedy = _this.init_speedy * -1;
			return;
		}
		//止まってショットを放つ
		if(_this.y>_this.changeY&&_this.speedy>=0){
			_this.imgPos=[0,30,60,90,120,150];
			_this.speedx=0;
			_this.speedy=0;
			_this.shot();
			_this.changedY=true;
			return;
		}
		_this.x += _this.speedx;
	}
}


export class ENEMY_SOL extends GameObject_ENEMY {
	constructor(_p){
		super({
			img:_XC._CANVAS_IMGS.xevious_enemy_sol.obj,
			x:_p.x,
			y:_p.y,
			aniItv:20,
			imgPos:[0],
			width:80,
			height:80,
			enemy_type: 2

		});
		let _this = this;
		_this.getscore = 2000; //倒した時のスコア
		_this._status = 2;
		_this.shotColMap = ["0,0,30,30"];

//		_this.is_ignore = true;
//		_this.is_able_collision = false;
	}
	showCollapes() {
		let _this = this;
		//敵を倒した場合
		_this._isshow = false;
		//爆発して終了
		_XPO._PARTS_COLLISION._set_collision({
			x: _this.x+20,
			y: _this.y+20,
			type: _this._collision_type
		});
		//地上の敵は爆発後の画像を表示させる
		_XPO._PARTS_COLLISION._set_collapsed_field({
			x: _this.x+20,
			y: _this.y+20
		});
	}
	shot(){}
	moveSet(){
		let _this=this;
		if (_this._status === 0) {
			_this.init();
			return;
		}
		if (_this.get_imgPos() === 560) {
			_this.imgPos=[560];
			_this.is_ignore = false;
			return;
		}
		if (_this._status === 1) {
			_this.imgPos = [0, 80, 160, 240, 320, 400, 480, 560];
			_this.is_ignore = true;
		}
	}
}




export class ENEMY_ANDORGENESIS extends GameObject_ENEMY {
	constructor(_p){
		super({
			img:_XC._CANVAS_IMGS.xevious_enemy_andorgenesis.obj,
			x:_p.x,
			y:_p.y,
			imgPos:[0],
			width:250,
			height:250
		});
		let _this=this;
		_this.getscore = 6000; //倒した時のスコア
		_this.is_ignore = true;
		_this._count = 0;
		_this.ar_child = new Array();
		_this.ar_child_status = true;//子要素が全て生存していない場合はfalse
		_this.audio_collision = _XC._CANVAS_AUDIOS['enemy_collision2'];

		_this.def_child=[
			{obj:new Object(),img:_XC._CANVAS_IMGS.xevious_enemy_andorgenesis_child0.obj,x:75,y:75,colx:10},
			{obj:new Object(),img:_XC._CANVAS_IMGS.xevious_enemy_andorgenesis_child1.obj,x:160,y:75},
			{obj:new Object(),img:_XC._CANVAS_IMGS.xevious_enemy_andorgenesis_child2.obj,x:75,y:160,colx:10,coly:-5},
			{obj:new Object(),img:_XC._CANVAS_IMGS.xevious_enemy_andorgenesis_child3.obj,x:160,y:160,coly:-5},
			{obj:new Object(),img:_XC._CANVAS_IMGS.xevious_enemy_andorgenesis_child4.obj,x:110,y:110,width:30,height:30,imgPos: [0, 30, 60, 90, 120, 150],colx:15,coly:5},
		]

	}
	shot(){}
	move_standby(){
		let _this=this;
		if(_this.y+_this.height<0){return;}
		_this.def_child.map((_o)=>{
			let _obj = new ENEMY_ANDORGENESIS_CHILD({
				img: _o.img,
				imgPos: _o.imgPos || [0, 18, 36, 54, 72, 90],
				width: _o.width || 18,
				height: _o.height || 18,
				x: _this.x + _o.x,
				y: _this.y + _o.y,
				colx: _o.colx || 0,
				coly: _o.coly || 0,
			});
			_o.obj = _obj;
			_PARTS_ENEMIESMAIN._enemies_field.push(_obj);
		});
		_this._standby = false;

	}
	def_child_remove(){
		let _this = this;
		_this.def_child.map((_o)=>{_o.obj.init();});
	}
	def_child_moveset() {
		let _this = this;
		//移動のセット
		_this.def_child.map((_o) => {
			_o.obj.moveSet({
				x: _this.x + _o.x,
				y: _this.y + _o.y
			});
		});

		//中心が破壊されたら全破壊させる
		if (_this.def_child[4].obj._status === 0) {
			_this.def_child.map((_o) => {
				_o.obj._status = 0;
			});
		}

		//子要素が全て破壊
		let _r=_this.def_child.find((_e)=>{return _e.obj._status === 1;});
		if(_r===undefined){_this.ar_child_status = false;}
		
	}
	moveSet(){
		let _this=this;
		_this.y=(()=>{
			//全て破壊した場合
			if(!_this.ar_child_status){return _this.y-_this.speed*3;}
			//登場するとき
			if(_this.y<100&&_this._count<1000){return _this.y+_this.speed;}
			_this._count++;
			//一定時間を超えた時
			if(_this._count>1000){return _this.y-_this.speed*3;}
			return _XMP._MAP._getYPause(_this.y);
		})();
		if (_this.y + _this.height < 0) {
			_this.init();
			_this.def_child_remove();
			return;
		}

		_this.def_child_moveset();
	}
}

export class ENEMY_ANDORGENESIS_CHILD extends GameObject_ENEMY {
	constructor(_p){
		super({
			img:_p.img||_XC._CANVAS_IMGS.xevious_enemy_andorgenesis.obj,
			x:_p.x,
			y:_p.y,
			imgPos:_p.imgPos||[0],
			width:_p.width||30,
			height:_p.height||30,
			enemy_type:2
		});
		let _this=this;
		_this.getscore = 50; //倒した時のスコア
		_this._standby = false;
		_this._count = 0;
		_this.colx = _p.colx || 0;
		_this.coly = _p.coly || 0;
		_this.audio_collision = _XC._CANVAS_AUDIOS['enemy_collision2'];
	}
	shot(){
		let _this = this;
		if(_PARTS_ENEMIESMAIN._shot_rate<Math.random()){return;}
		_XES._PARTS_ENEMYSHOT._set_enemyshot(_this);
	}
	showCollapes(_x, _y) {
		let _this = this;
		//敵を倒した場合
		_this._isshow = false;
		//爆発して終了
		_XPO._PARTS_COLLISION._set_collision({
			x: _x || _this.x+_this.colx,
			y: _y || _this.y+_this.coly,
			type: _this._collision_type
		});
	}
	moveSet(_p){
		let _this=this;
		if (!_this.isMove()) {
			return;
		}
		_this.x=_p.x;
		_this.y=_p.y;
		_this.shot();
		_this.set_imgPos();
	}
	move(){}
}