//=====================================================
//	xevious_parts_others
//	パーツクラス定義（その他）
//	2018.06.15 : 新規作成
//=====================================================
'use strict';
import _GAME_COMMON from './xevious_common';
import * as _XC from './xevious_canvasimgs';
import * as _XMP from './xevious_map';

export const _PARTS_OTHERS = {
	_score:null,
	_reset(){
		let _this = this;
		_this._score.reset();
//		_this._score = new xevious_score();
	},
	_set_score(_score){
		this._score.set(_score);
	},
	_draw_score(){
		this._score.setDrawImage();
	},
	//=============================
	//オブジェクト初期設定
	//=============================
	_init_others_obj() {
		let _this = this;
		if(_this._score===null){
			_this._score = new xevious_score();
		}
	}
};


export class xevious_background{
	constructor(_p){
		let _this=this;
		_this.img = _p.img || _XC._CANVAS_IMGS.xevious_background.obj; //画像オブジェクト
		_this.width = _p.width || 510;
		_this.height = _p.height || 720;

		_this._posX_def = [768, 512, 256, 0];
		_this._posX_c = 0;
		_this._posX = _this._posX_def[_this._posX_c];
		_this._posY = 2500;
	}
	init(){
		let _this = this;
		_this._posX_c = 0;
		_this._posX = _this._posX_def[_this._posX_c];
		_this._posY = 2500;
	}
	setDrawImage(){
		let _this=this;
		_GAME_COMMON._context.drawImage(
			_this.img,
			_this._posX,
			_this._posY,
			256,361,
			0,0,
			_this.width,
			_this.height
		);
	}
	move(){
		let _this=this;

		_this._posY -= _XMP._MAP._background_speed;
		_this._posX_c = (_this._posY <= 0) ? _this._posX_c - 1 : _this._posX_c;
		_this._posX_c = (_this._posX_c < 0) ? _this._posX_def.length - 1 : _this._posX_c;
		_this._posY = (_this._posY <= 0) ? 2500 : _this._posY;
		_this._posX = _this._posX_def[_this._posX_c];
	}
}

export class xevious_score{
	constructor(){
		let _this=this;
		_this.score1p = 0;
		_this.score2p = 0;
		_this.def_scorehi = 0;
		_this.scorehi = _this.def_scorehi;
	}
	init(){
		let _this = this;
		_this.score1p = 0;
		_this.score2p = 0;
		_this.scorehi = _this.def_scorehi;
	}
	reset(){
		let _this = this;
		_this.score1p = 0;
		_this.score2p = 0;
	}
	set(_score) {
		let _this=this;
		_this.score1p += _score;
		if (_this.scorehi >= _this.score1p) {
			return;
		}
		_this.scorehi = _this.score1p;
	}
	setDrawImage(){
		//スコアを表示
		let _this=this;
		let _s='';
		_s = '1UP    HIGH SCORE   2UP ';
		_GAME_COMMON._setDrawText(_s, 'center', 0, 0.2);

		_s = ('       ' + _this.score1p).slice(-7)
				+'   '
				+('       ' + _this.scorehi).slice(-7)
				+'   '
				+('       ' + _this.score2p).slice(-7)
		_GAME_COMMON._setDrawText(_s, 'center', 14, 0.2);
	}
	move(){}
};



const def_col={
	't0':{//自機
		img:_XC._CANVAS_IMGS.xevious_solvalou_collapes.obj,
		width:90,
		height:90,
		intv:2,
		imgPos:[0,90,180,270,360,450,540,630,720,810,900,990,1080,1170,1260,1350,1440,1530,1620,1710,1800,1890,1980,2960]
	},
	't1':{//敵（空中）
		img:_XC._CANVAS_IMGS.xevious_enemies_collapes.obj,
		width:40,
		height:40,
		intv:2,
		imgPos:[0,40,80,120]
	},
	't2':{//敵（地上）
		img:_XC._CANVAS_IMGS.xevious_enemies_collapes2.obj,
		width:60,
		height:60,
		intv:4,
		imgPos:[0,60,120,180,240,300]
	},
	't3':{//
		img:_XC._CANVAS_IMGS.xevious_enemies_collapes3.obj,
		width:50,
		height:50,
		intv:2,
		imgPos:[0,50,100,150,200,250,300,350,400,450,500,550]
	}


};
export const _PARTS_COLLISION={
	_o:new Array(),
	_collapsed_fly: new Array(),
	_collapsed_field: new Array(),
	init(){
		let _this = this;
		_this._o=new Array();
		_this._collapsed_fly = new Array();
		_this._collapsed_field = new Array();
	},
	_set_collision(_p){
		let _this=this;
		_this._o.push(new xevious_collision(_p));
	},
	_set_collapsed_fly(_p){
		let _this = this;
		_this._collapsed_fly.push(new xevious_collapsed(_p));
	},
	_set_collapsed_field(_p){
		let _this = this;
		_this._collapsed_field.push(new xevious_collapsed(_p));
	},
	_optimized_collision() {
		let _this=this;
		_this._o.map((_o,_i,_ar)=>{
			if(!_o._status){_ar.splice(_i,1);}
		});
	},
	_move_collision(){
		//爆発アニメーションの移動
		let _this=this;
		_this._o.map((_obj)=>{_obj.move();});
	},
	_draw_collision(){
		//爆発アニメーションの表示
		let _this=this;
		_this._o.map((_obj)=>{_obj.setDrawImage();});
	},
	_optimized_collapsed() {
		let _this=this;
		_this._collapsed_field.map((_o,_i,_ar)=>{
			if(!_o._status){_ar.splice(_i,1);}
		});
		_this._collapsed_fly.map((_o,_i,_ar)=>{
			if(!_o._status){_ar.splice(_i,1);}
		});
	},
	_move_collapsed() {
		let _this=this;
		_this._collapsed_field.map((_o)=>{_o.move();});
		_this._collapsed_fly.map((_o)=>{_o.move();});
	},
	_draw_collapsed_field() {
		let _this = this;
		_this._collapsed_field.map((_o)=>{_o.setDrawImage();});
	},
	_draw_collapsed_fly() {
		let _this = this;
		_this._collapsed_fly.map((_o)=>{_o.setDrawImage();});
	},

};

export class xevious_collision {
	constructor(_p) {
		let _this = this;
		_this.type = _p.def || 't0';
		_this.x = _p.x || 0;
		_this.y = _p.y || 0;
		_this._status = true;
		_this.img = def_col[_p.type].img;
		_this.imgPos = def_col[_p.type].imgPos;
		_this.aniItv = def_col[_p.type].intv;
		_this.width = def_col[_p.type].width;
		_this.height = def_col[_p.type].height;
		_this._c = 0;
	}
	set_imgPos() {
		let _this = this;
		_this._c =
			(_this._c >= (_this.imgPos.length * _this.aniItv) - 1) ? 0 : _this._c + 1;
	}
	get_imgPos() {
		let _this = this;
		return _this.imgPos[parseInt(_this._c / _this.aniItv)]
	}
	setDrawImage() {
		//爆発を表示
		let _this = this;
		_GAME_COMMON._setDrawImage({
			img: _this.img,
			imgPosx: _this.get_imgPos(),
			x: _this.x,
			y: _this.y,
			width: _this.width,
			height: _this.height
		});
	}
	move() {
		let _this = this;
		if (_this._c >= (_this.imgPos.length * _this.aniItv) - 1) {
			//アニメーションが終わったら終了
			_this._status = false;
			return;
		}

		_this.set_imgPos();
		_this.x = _XMP._MAP._getX(_this.x);
		_this.y = _XMP._MAP._getY(_this.y);
	}
}

//地上の爆発後画像を表示
export class xevious_collapsed {
	constructor(_p) {
		let _this = this;
		_this.x = _p.x || 0;
		_this.y = _p.y || 0;
		_this.img = _XC._CANVAS_IMGS.xevious_enemies_collapesd.obj;
		_this.width = _this.img.width;
		_this.height = _this.img.height;
		_this._status = true;
	}
	setDrawImage() {
		//爆発を表示
		let _this = this;
		_GAME_COMMON._setDrawImage({
			img: _this.img,
			x: _this.x,
			y: _this.y,
			width: _this.width,
			height: _this.height
		});
	}
	move() {
		let _this = this;
		if(_GAME_COMMON.isCanvasOut({img:_this.img})){_this._status=false;return;}
		_this.x = _XMP._MAP._getX(_this.x);
		_this.y = _XMP._MAP._getY(_this.y);
//				console.log('y:' + _this.y);

	}
}
