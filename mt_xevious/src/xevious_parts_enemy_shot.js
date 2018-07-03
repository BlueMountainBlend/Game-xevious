//=====================================================
//	gradius_parts_enemy_shot.js
//	敵の定義
//	2018.04.13 : 新規作成
//=====================================================
'use strict';
import _GAME_COMMON from './xevious_common';
import * as _XPPM from './xevious_parts_playermain';
import * as _XMP from './xevious_map';

export const _PARTS_ENEMYSHOT={
	_enemyshot:new Array(),
	_init(){//暫定
	},
	_reset(){
		let _this = this;
		_this._enemyshot = new Array();
	},
	_set_enemyshot(_e){
		let _o = _XPPM._PARTS_PLAYERMAIN._get_players_location();
		if(_o===undefined){return;}
		let _x=_o.x;
		let _y=_o.y;
		if(_x===undefined||_y===undefined){return;}
		if(_e.getEnemyCenterPosition()._y>_y){return;}
		this._enemyshot.push(new GameObject_ENEMYSHOT(
			{
				x: _e.getEnemyCenterPosition()._x,
				y: _e.getEnemyCenterPosition()._y,
				tx: _x,
				ty: _y
			}
		))
	},
	_set_enemyshot2(_e){
		let _o = _XPPM._PARTS_PLAYERMAIN._get_players_location();
		if(_o===undefined){return;}
		let _x=_o.x;
		let _y=_o.y;
		if(_x===undefined||_y===undefined){return;}
		this._enemyshot.push(new GameObject_ENEMYSHOT(
			{
				x: _e.x,
				y: _e.y,
				tx: _x,
				ty: _y
			}
		))
	},
	_move_enemyshot(){
		let _this = this;
		for (let _i = 0; _i < _this._enemyshot.length; _i++) {
			_this._enemyshot[_i].move();
		}
	},
	_draw_enemyshot(){
		let _this = this;
		for (let _i = 0; _i < _this._enemyshot.length; _i++) {
			_this._enemyshot[_i].setDrawImage();
		}
	}

};


//====================
//　弾クラス
//	_p.x:敵の弾発射開始x位置
//	_p.y:敵の弾発射開始y位置
//	_p.rad:敵の弾を発射するラジアン（rad）
//			※未指定の場合は自機との角度
//	_p.img:弾の画像
//	_p.imgPos:スプライト画像の位置（Array）
//	_p.width:表示幅
//	_p.height:表示高
//	_p.speed:弾のスピード
//====================
class GameObject_ENEMYSHOT{
	constructor(_p){
		let _this=this;
		_this.x=_p.x||500;
		_this.y=_p.y||300;
		_this.tx=_p.tx||_this.x;
		_this.ty=_p.ty||_GAME_COMMON._canvas.height;

		_this.imgPos=[
			{out:'#ff0000',in:'#aaaaaa'},
			{out:'#aaaaaa',in:'ff0000'},
			{out:'#00ffff',in:'#aaaaaa'},
			{out:'#aaaaaa',in:'#00ffff'}];//スプライトのコマポジション
		_this._c=0;//アニメーションカウント
		_this.aniItv=_p.aniItv||5;//アニメーション間隔
		_this.basePoint=_p.basePoint||1;

		_this.speed=3;//定義：発射スピード
		_this.rad=_p.rad||Math.atan2((_this.ty-_this.y),(_this.tx-_this.x));//ラジアン
		_this.sx=Math.cos(_this.rad);//単位x
		_this.sy=Math.sin(_this.rad);//単位y

		_this._isshow=true;//弾の状態
		_this.is_ignore_collision=false;//自機衝突したら消えるのを無視する

		_this.shotColMap=[
			"1,1,9,9"
		];
	}
	init(){
		let _this=this;
		_this._isshow=false;
	}
	map_collition(){
	}
	getEnemyCenterPosition(){
		return {_x:this.x+(this.width/2),
				_y:this.y+(this.height/2)}
	}
	isshow(){return this._isshow;}
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
		let _ct = _GAME_COMMON._context;
		_ct.fillStyle = _this.get_imgPos().in;
		_ct.beginPath();
		_ct.arc(_this.x, _this.y, 4, 0, Math.PI * 2, false);
		_ct.fill();

		_ct.fillStyle = _this.get_imgPos().out;
		_ct.beginPath();
		_ct.arc(_this.x, _this.y, 2, 0, Math.PI * 2, false);
		_ct.fill();

	}
	move(){
		let _this=this;
		_this.map_collition();
//		_this.y = _XMP._MAP._getY(_this.y);
		if(_this.y<0){return;}
		if(_GAME_COMMON.isCanvasOut(_this)){
			_this.init();
			return;
		}
		_this.x+=_this.sx*_this.speed;
		_this.y+=_this.sy*_this.speed;

		_this.set_imgPos();
	}
}
