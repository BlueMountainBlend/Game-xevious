//=====================================================
//	xevious_controller_event
//	コントローラー系処理
//=====================================================
'use strict';
import _GAME_COMMON from './xevious_common';
import * as _XPD from './xevious_parts_draw';
import * as _XPPM from './xevious_parts_playermain';

const _ISSP = _GAME_COMMON._issp;
const _EVENT_KEYDOWN = (_ISSP) ? 'touchstart' : 'keydown';
const _EVENT_KEYMOVE = (_ISSP) ? 'touchmove' : 'keydown';
const _EVENT_KEYUP = (_ISSP) ? 'touchend' : 'keyup';


export const _KEYEVENT_MASTER = {
'addKeydownStart':function(){
	if(_ISSP){
		_SP_CONTROLLER._sp_bt_s
			.addEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_start);
		_SP_CONTROLLER._sp_main_center
			.addEventListener(
				_EVENT_KEYDOWN,
				_KEYEVENT_SP.keymove_start_controller);
	}else{
		document
			.addEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT.keydown_start);
	}
},//addKeydownStart
'removeKeydownStart':function(){
	if(_ISSP){
		_SP_CONTROLLER._sp_bt_s
			.removeEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_start);
		_SP_CONTROLLER._sp_main_center
			.removeEventListener(
				_EVENT_KEYDOWN,
				_KEYEVENT_SP.keymove_start_controller);

	}else{
		document
			.removeEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT.keydown_start);
	}

},//removeKeydownStart
'addKeydownGame':function(){
	if(_ISSP){
		_SP_CONTROLLER._sp_bt_r
			.addEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_game_r);
		_SP_CONTROLLER._sp_bt_p
			.addEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_game_p);
		_SP_CONTROLLER._sp_bt_s
			.addEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_game_s);
		_SP_CONTROLLER._sp_bt_b
			.addEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_game_b);
		_SP_CONTROLLER._sp_bt_a
			.addEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_game_a);
		_SP_CONTROLLER._sp_bt_auto
			.addEventListener(
				_EVENT_KEYDOWN,
				_KEYEVENT_SP.keydown_game_auto);
		_SP_CONTROLLER._sp_main_center
			.addEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keymove_game_controller);
		_SP_CONTROLLER._sp_main_center
			.addEventListener(
			_EVENT_KEYMOVE,
			_KEYEVENT_SP.keymove_game_controller);
	}else{
		document.addEventListener(
			_EVENT_KEYDOWN,_KEYEVENT.keydown_game);
	}
},//addKeydownGame
'addKeyupGame':function(){
	if(_ISSP){
		_SP_CONTROLLER._sp_bt_b
			.addEventListener(
			_EVENT_KEYUP,
			_KEYEVENT_SP.keyup_game_b);
		_SP_CONTROLLER._sp_bt_a
			.addEventListener(
			_EVENT_KEYUP,
			_KEYEVENT_SP.keyup_game_a);
		_SP_CONTROLLER._sp_main_center
			.addEventListener(
			_EVENT_KEYUP,
			_KEYEVENT_SP.keyend_game_controller);

		_SP_CONTROLLER._set_reset();

	}else{
		document.addEventListener(
			_EVENT_KEYUP,_KEYEVENT.keyup_game);
	}
},//addKeyupGame
'removeKeydownGame':function(){
	if(_ISSP){
		_SP_CONTROLLER._sp_bt_r
			.removeEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_game_r);
		_SP_CONTROLLER._sp_bt_p
			.removeEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_game_p);
		_SP_CONTROLLER._sp_bt_s
			.removeEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_game_s);
		_SP_CONTROLLER._sp_bt_b
			.removeEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_game_b);
		_SP_CONTROLLER._sp_bt_a
			.removeEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_game_a);
		_SP_CONTROLLER._sp_bt_auto
			.removeEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keydown_game_auto);
		_SP_CONTROLLER._sp_main_center
			.removeEventListener(
			_EVENT_KEYDOWN,
			_KEYEVENT_SP.keymove_game_controller);
		_SP_CONTROLLER._sp_main_center
			.removeEventListener(
			_EVENT_KEYMOVE,
			_KEYEVENT_SP.keymove_game_controller);

	}else{
		document.removeEventListener(
			_EVENT_KEYDOWN,_KEYEVENT.keydown_game);
	}
},//removeKeydownGame
'removeKeyupGame':function(){
	if(_ISSP){
		_SP_CONTROLLER._sp_bt_b
			.removeEventListener(
			_EVENT_KEYUP,
			_KEYEVENT_SP.keyup_game_b);
		_SP_CONTROLLER._sp_bt_a
			.removeEventListener(
			_EVENT_KEYUP,
			_KEYEVENT_SP.keyup_game_a);
		_SP_CONTROLLER._sp_main_center
			.removeEventListener(
			_EVENT_KEYUP,
			_KEYEVENT_SP.keyend_game_controller);
		//コントローラーをリセット
		_SP_CONTROLLER._set_reset();
	}else{
		document.removeEventListener(
			_EVENT_KEYUP,_KEYEVENT.keyup_game);
	}

},//removeKeyupGame

'addKeydownGameclear':function(){
   if(_ISSP){
	   _SP_CONTROLLER._sp_bt_r
		   .addEventListener(
		   _EVENT_KEYDOWN,
		   _KEYEVENT_SP.keydown_gameclear_r);
	   _SP_CONTROLLER._sp_bt_s
		   .addEventListener(
		   _EVENT_KEYDOWN,
		   _KEYEVENT_SP.keydown_gameclear_s);
	   _SP_CONTROLLER._sp_bt_p
		   .addEventListener(
		   _EVENT_KEYDOWN,
		   _KEYEVENT_SP.keydown_gameclear_p);
   }else{
	   document.addEventListener(
		   _EVENT_KEYDOWN,_KEYEVENT.keydown_gameclear);
   }

},//addKeydownGameclear

'removeKeydownGameclear':function(){
   if(_ISSP){
	   _SP_CONTROLLER._sp_bt_r
		   .removeEventListener(
		   _EVENT_KEYDOWN,
		   _KEYEVENT_SP.keydown_gameclear_r);
	   _SP_CONTROLLER._sp_bt_s
		   .removeEventListener(
		   _EVENT_KEYDOWN,
		   _KEYEVENT_SP.keydown_gameclear_s);
		_SP_CONTROLLER._sp_bt_p
		   .removeEventListener(
		   _EVENT_KEYDOWN,
		   _KEYEVENT_SP.keydown_gameclear_p);

	}else{
	   document.removeEventListener(
		   _EVENT_KEYDOWN,_KEYEVENT.keydown_gameclear);
   }

},//removeKeydownGameclear

'addKeydownGameover':function(){
   if(_ISSP){
	   _SP_CONTROLLER._sp_bt_r
		   .addEventListener(
		   _EVENT_KEYDOWN,
		   _KEYEVENT_SP.keydown_gameover_r);
	   _SP_CONTROLLER._sp_bt_s
		   .addEventListener(
		   _EVENT_KEYDOWN,
		   _KEYEVENT_SP.keydown_gameover_s);
	   _SP_CONTROLLER._sp_bt_p
		   .addEventListener(
		   _EVENT_KEYDOWN,
		   _KEYEVENT_SP.keydown_gameover_p);

	}else{
	   document.addEventListener(
		   _EVENT_KEYDOWN,_KEYEVENT.keydown_gameover);
   }

},//addKeydownGameover

'removeKeydownGameover':function(){
   if(_ISSP){
	   _SP_CONTROLLER._sp_bt_r
		   .removeEventListener(
		   _EVENT_KEYDOWN,
		   _KEYEVENT_SP.keydown_gameover_r);
	   _SP_CONTROLLER._sp_bt_s
		   .removeEventListener(
		   _EVENT_KEYDOWN,
		   _KEYEVENT_SP.keydown_gameover_s);
	   _SP_CONTROLLER._sp_bt_p
	   	.removeEventListener(
	   		_EVENT_KEYDOWN,
	   		_KEYEVENT_SP.keydown_gameover_p);
	}else{
	   document.removeEventListener(
		   _EVENT_KEYDOWN,_KEYEVENT.keydown_gameover);
   }

}//removeKeydownGameover
}//_KEYEVENT_MASTER

//==============================================================
//==============================================================
//	キーイベントの定義(PC)
//	イベントの追加は、各シーンに設定
//	イベントの削除は、この関数内に設定
//==============================================================
//==============================================================
export const _KEYEVENT = {
'keydown_start':function(e){
	if (e.key === 'ArrowUp' || e.key === 'Up') {
		_XPD._SET_DRAW_START_SELECT(-1);
	}
	if (e.key === 'ArrowDown' || e.key === 'Down') {
		_XPD._SET_DRAW_START_SELECT(1);
	}
	if(e.key==='S'||e.key==='s'){
		_XPD._DRAW_GAMESTART();
	}
},//keydown_start

'keydown_gameclear':function(e){
	if(e.key==='R'||e.key==='r'){
		_XPD._DRAW_RESET_OBJECT();
		_XPD._DRAW_GAMESTART();
		return false;
	}

	if(e.key==='S'||e.key==='s'){
		_XPD._DRAW_RESET_OBJECT();
		_XPD._DRAW_START();
		return false;
	}

	if(e.key==='P'||e.key==='p'){
		if(_DRAW_SETINTERVAL!==null){
			_DRAW_STOP();
		}else{
			_DRAW();
		}
		return false;
	}

	if(e.key===' '||e.key==='Spacebar'){
		if (_XPPM._PARTS_PLAYERMAIN._shot_setinterval !== null) {
			return;
		}
		_DRAW_PLAYERS_SHOTS();
	}

	if(e.key==='ArrowLeft'||e.key==='Left'){
		_XPPM._PARTS_PLAYERMAIN._set_move_players({x:-1,y:0});
	}
	if(e.key==='ArrowRight'||e.key==='Right'){
		_XPPM._PARTS_PLAYERMAIN._set_move_players({x:1,y:0});
	}
	if(e.key==='ArrowUp'||e.key==='Up'){
		_XPPM._PARTS_PLAYERMAIN._set_move_players({x:0,y:-1});
	}
	if(e.key==='ArrowDown'||e.key==='Down'){
		_XPPM._PARTS_PLAYERMAIN._set_move_players({x:0,y:1});
	}
	//装備
	if(e.key==='B'||e.key==='b'){
		_POWERMETER.playerset();
	}

},
'keydown_gameover':function(e){
	if(e.key==='R'||e.key==='r'){
		_XPD._DRAW_RESET_OBJECT();
		_XPD._DRAW_GAMESTART();
	}
	if(e.key==='S'||e.key==='s'){
		_XPD._DRAW_RESET_OBJECT();
		_XPD._DRAW_START();
	}
	if(e.key==='P'||e.key==='p'){
		_XPD._DRAW_SWITCH();
	}

},
//ゲーム開始時
'keydown_game':function(e){
	if(e.key==='R'||e.key==='r'){
		_XPD._DRAW_RESET_OBJECT();
		_XPD._DRAW_GAMESTART();
	}
	if(e.key==='S'||e.key==='s'){
		// _XPD._DRAW_RESET_OBJECT();
		// _XPD._DRAW_START();
	}
	if(e.key==='P'||e.key==='p'){
		_XPD._DRAW_SWITCH();
	}

	if(e.key===' '||e.key==='Spacebar'){
		_XPPM._PARTS_PLAYERMAIN._control_start_shots();
	}
	if (e.key === 'B' || e.key === 'b') {
		_XPPM._PARTS_PLAYERMAIN._control_start_missile_shots();
	}
	if(e.key==='ArrowLeft'||e.key==='Left'){
		_XPPM._PARTS_PLAYERMAIN._set_move_players({x:-1,y:0});
	}
	if(e.key==='ArrowRight'||e.key==='Right'){
		_XPPM._PARTS_PLAYERMAIN._set_move_players({x:1,y:0});
	}
	if(e.key==='ArrowUp'||e.key==='Up'){
		_XPPM._PARTS_PLAYERMAIN._set_move_players({x:0,y:-1});
	}
	if(e.key==='ArrowDown'||e.key==='Down'){
		_XPPM._PARTS_PLAYERMAIN._set_move_players({x:0,y:1});
	}

},//keydown_game

'keyup_game':function(e){
	if(e.key==='ArrowLeft'||e.key==='Left'){
		_XPPM._PARTS_PLAYERMAIN._set_stop_players();
	}
	if(e.key==='ArrowRight'||e.key==='Right'){
		_XPPM._PARTS_PLAYERMAIN._set_stop_players();
	}
	if(e.key==='ArrowUp'||e.key==='Up'){
		_XPPM._PARTS_PLAYERMAIN._set_stop_players();
	}
	if(e.key==='ArrowDown'||e.key==='Down'){
		_XPPM._PARTS_PLAYERMAIN._set_stop_players();
	}
	if(e.key===' '||e.key==='Spacebar'){
		_XPPM._PARTS_PLAYERMAIN._control_stop_shots();
	}
	if (e.key === 'B' || e.key === 'b') {
		_XPPM._PARTS_PLAYERMAIN._control_stop_missile_shots();
	}

}//keyup_game
}//_KEYEVENT

//==============================================================
//==============================================================
//	キーイベントの定義(SP)
//	イベントの追加は、各シーンに設定
//	イベントの削除は、この関数内に設定
//==============================================================
//==============================================================

export const _KEYEVENT_SP = {
'keydown_start':function(e){
//	_GAME._setPlay(_CANVAS_AUDIOS['playerset']);

	_XPD._DRAW_GAMESTART();
},//keydown_start
'keymove_start_controller': function (e) {
	e.preventDefault(); // タッチによる画面スクロールを止める
	let _r=_SP_CONTROLLER._get_st(e);
	if(_r===false){return;}
	if(_r===_SP_CONTROLLER._DEF_DIR._U){
		_XPD._SET_DRAW_START_SELECT(-1);
	}
	if(_r===_SP_CONTROLLER._DEF_DIR._D){
		_XPD._SET_DRAW_START_SELECT(1);
	}

}, //keymove_start_controller

//=========================
// KEYDOWN GAME CLEAR
//=========================
'keydown_gameclear_r':function(e){
	_XPD._DRAW_RESET_OBJECT();
	_XPD._DRAW_GAMESTART();
	return false;
},//keydown_gameclear_r
'keydown_gameclear_s':function(e){
	_XPD._DRAW_RESET_OBJECT();
	_XPD._DRAW_START();
	return false;
},//keydown_gameclear_s
'keydown_gameclear_p':function(e){
	if(_DRAW_SETINTERVAL!==null){
		_DRAW_STOP();
	}else{
		_DRAW();
	}
	return false;
},//keydown_gameclear_p

//=========================
// KEYDOWN GAME OVER
//=========================
'keydown_gameover_r':function(e){
	_XPD._DRAW_RESET_OBJECT();
	_XPD._DRAW_GAMESTART();
},
'keydown_gameover_s':function(e){
	_XPD._DRAW_RESET_OBJECT();
	_XPD._DRAW_START();
},//keydown_gameover_s
'keydown_gameover_p':function(e){
	_XPD._DRAW_SWITCH();
},//keydown_gameover_p


//=========================
// KEYMOVE PLAYING
//=========================
'keymove_game_controller':function(e){
	e.preventDefault(); // タッチによる画面スクロールを止める
	let _r=_SP_CONTROLLER._get_st(e);
	if(_r===false){return;}

	if(_r===_SP_CONTROLLER._DEF_DIR._L){
		_XPPM._PARTS_PLAYERMAIN._set_move_players({x:-1,y:0})
 	}
	if(_r===_SP_CONTROLLER._DEF_DIR._LU){
		_XPPM._PARTS_PLAYERMAIN._set_move_players({x:-1,y:-1})
	}
	if(_r===_SP_CONTROLLER._DEF_DIR._U){
		_XPPM._PARTS_PLAYERMAIN._set_move_players({x:0,y:-1})
	}
	if(_r===_SP_CONTROLLER._DEF_DIR._RU){
		_XPPM._PARTS_PLAYERMAIN._set_move_players({x:1,y:-1})
 	}
	if(_r===_SP_CONTROLLER._DEF_DIR._R){
		_XPPM._PARTS_PLAYERMAIN._set_move_players({x:1,y:0})
 	}
	if(_r===_SP_CONTROLLER._DEF_DIR._RD){
		_XPPM._PARTS_PLAYERMAIN._set_move_players({x:1,y:1})
 	}
	if(_r===_SP_CONTROLLER._DEF_DIR._D){
		_XPPM._PARTS_PLAYERMAIN._set_move_players({x:0,y:1})
	}
	if(_r===_SP_CONTROLLER._DEF_DIR._LD){
		_XPPM._PARTS_PLAYERMAIN._set_move_players({x:-1,y:1})
 	}
	// console.log(_rad);
},//keymove_game_controller
'keyend_game_controller':function(e){
	_XPPM._PARTS_PLAYERMAIN._set_stop_players();
},//keyend_game_controller
'keydown_game_r':function(e){
	_XPD._DRAW_RESET_OBJECT();
	_XPD._DRAW_GAMESTART();
},//keydown_game_r
'keydown_game_s':function(e){
	// _XPD._DRAW_RESET_OBJECT();
	// _XPD._DRAW_START();
},//keydown_game_s
'keydown_game_p':function(e){
	_XPD._DRAW_SWITCH();
},//keydown_game_p

'keydown_game_a':function(e){
	if(_SP_CONTROLLER._is_auto()){return;}
	_XPPM._PARTS_PLAYERMAIN._control_start_shots();
},//keydown_game_a
'keydown_game_b':function(e){
	if(_SP_CONTROLLER._is_auto()){return;}
	_XPPM._PARTS_PLAYERMAIN._control_start_missile_shots();
},//keydown_game_b
'keydown_game_auto': function (e) {
	if (_SP_CONTROLLER._is_auto()) {
		_XPPM._PARTS_PLAYERMAIN._control_start_shots();
		_XPPM._PARTS_PLAYERMAIN._control_start_missile_shots();
	}else{
		_XPPM._PARTS_PLAYERMAIN._control_stop_shots();
		_XPPM._PARTS_PLAYERMAIN._control_stop_missile_shots();
	}
}, //keydown_game_auto

'keyup_game_a':function(e){
	if(_SP_CONTROLLER._is_auto()){return;}
	_XPPM._PARTS_PLAYERMAIN._control_stop_shots();
},//keyup_game_a
'keyup_game_b': function (e) {
	if(_SP_CONTROLLER._is_auto()){return;}
	_XPPM._PARTS_PLAYERMAIN._control_stop_missile_shots();
} //keyup_game_b

}//_KEYEVENT_SP



//==============================================================
//==============================================================
//SP用コントローラー定義
//==============================================================
//==============================================================
export const _SP_CONTROLLER = {
	x:0,
	y:0,
	_sp_main_center:new Object(),
	_sp_main:new Object(),
	_sp_bt_hide:new Object(),
	_sp_bt_r:new Object(),
	_sp_bt_p:new Object(),
	_sp_bt_s:new Object(),
	_sp_bt_b:new Object(),
	_sp_bt_a:new Object(),
	_sp_bt_auto: new Object(),
	_is_auto: function(){ return _SP_CONTROLLER._sp_bt_auto.classList.value.indexOf('auto on') !== -1 },
	_DEF_DIR:{//向き定義
		_U:0,//上
		_D:1,//下
		_R:2,//右
		_L:3,//左
		_LU:4,//左上
		_LD:5,//左下
		_RU:6,//右上
		_RD:7//右下
	},
	_SP_CONTROLLER_SETINTERVAL:false,
	_set_sp_main_movePoint(e){
		//_sp_main、タッチ時の相対座標をセットする
		let _tr=_SP_CONTROLLER._sp_main.getBoundingClientRect();

		for(let _i=0;_i<e.touches.length;_i++){
			//マルチタップから
			//自身のタッチ箇所のみ設定
			if(_SP_CONTROLLER._sp_main_center===e.touches[_i].target){
				this.x=e.touches[_i].clientX-_tr.left;
				this.y=e.touches[_i].clientY-_tr.top;
			}
		}
	},
	_draw_sp_main(_p){
		//タッチに合わせてコントローラを描画させる
		//obj:イベントオブジェクト
		//x:x位置
		//y:y位置
		if(!this._SP_CONTROLLER_SETINTERVAL){return;}
		_p.obj.target.style.left=parseInt(_p.x)+'px';
		_p.obj.target.style.top=parseInt(_p.y)+'px';
	},
	//=========================
	//コントローラーの表示処理
	//=========================
	_keymove_sp_main(e){
		let _this = _SP_CONTROLLER;
		//コントローラ、touchmove表示定義
		_this._SP_CONTROLLER_SETINTERVAL=true;
		//sp_mainの相対座標をセット
		_this._set_sp_main_movePoint(e);

		//子要素の中心点設定
		let _c1_x=_this.x-(parseInt(window.getComputedStyle(_this._sp_main_center).width)/2),
			_c1_y=_this.y-(parseInt(window.getComputedStyle(_this._sp_main_center).height)/2)
		_this._draw_sp_main({obj:e,x:_c1_x,y:_c1_y});

		e.stopPropagation();
		e.preventDefault();
	},
	_keyup_sp_main(e){
		let _this = _SP_CONTROLLER;
		//コントローラ、touchend表示定義
		_this._SP_CONTROLLER_SETINTERVAL=false;
		e.target.style.top="";
		e.target.style.left="";
		e.stopPropagation();
		e.preventDefault();
	},
	_keydown_sp_bts(e){
		//ボタン用、touchdown表示定義
		e.stopPropagation();
		e.preventDefault();

		if (e.target.classList.value.indexOf('auto') !== -1) {
			if (e.target.classList.value.indexOf('auto on') !== -1){
				e.currentTarget.classList.remove('on');
			}else{
				e.currentTarget.classList.add('on');
			}
			return;
		}
		e.currentTarget.classList.add('on');
	},
	_keyup_sp_bts(e){
		//ボタン用、touchend表示定義
		e.stopPropagation();
		e.preventDefault();

		if (e.target.classList.value.indexOf('auto') !== -1) {return;}
		e.currentTarget.classList.remove('on');
	},
	sp_bts_reset(){

	},
	//=========================
	//自機操作制御
	//=========================
	_get_st:function(e){
		let _c1=this._sp_main_center;
		let _c0=this._sp_main;
		//親要素に対してイベントを定義し、
		//子要素はタッチ位置に併せて調整

		//sp_mainの相対座標をセット
		this._set_sp_main_movePoint(e);

		//親要素の中心点から角度を算出
		let _w=parseInt(window.getComputedStyle(_c0).width);
		let _h=parseInt(window.getComputedStyle(_c0).height);
		let _dx=(_w/2)-this.x,
			 _dy=(_h/2)-this.y;

		let _d=Math.sqrt(
			Math.pow(_dx,2)+Math.pow(_dy,2)
		);
		if(_d<5){return false;}
		let _a=parseInt(Math.atan2(_dy,_dx)*180/Math.PI);
//		console.log('_a:::'+_a);
		
		if(_a>-30&&_a<=30){return this._DEF_DIR._L;}
		if(_a>30&&_a<=60){return this._DEF_DIR._LU;}
		if(_a>60&&_a<=120){return this._DEF_DIR._U;}
		if(_a>120&&_a<=150){return this._DEF_DIR._RU;}
		if((_a>150&&_a<=180)||(_a<-150&&_a>=-180)){return this._DEF_DIR._R;}
		if(_a<-120&&_a>=-150){return this._DEF_DIR._RD;}
		if(_a<-60&&_a>=-120){return this._DEF_DIR._D;}
		if(_a<-30&&_a>=-60){return this._DEF_DIR._LD;}
		//		return {'_rad':_a,'_dis':_d};
	},//_get_st
	_set_reset(){
		//コントローラーの位置を元に戻す
		// let _c1=
		// 	document
		// 		.querySelector('.sp_controller_main_center');
		// _c1.style.left='';
		// _c1.style.top='';
		this._sp_bt_auto.classList.remove('on');
	},//_set_reset
	//以下は初期処理
	_set_obj(){
		this._sp_main_center=
			document.querySelector('.sp_controller_main_center');
		this._sp_main=
			document.querySelector('.sp_controller_main');
		this._sp_bt_hide=
			document.querySelector('.sp_controller_bt.hide');
		this._sp_bt_r=
			document.querySelector('.sp_controller_bt.r');
		this._sp_bt_p=
			document.querySelector('.sp_controller_bt.p');
		this._sp_bt_s=
			document.querySelector('.sp_controller_bt.s');
		this._sp_bt_b=
			document.querySelector('.sp_controller_bt.b');
		this._sp_bt_a=
			document.querySelector('.sp_controller_bt.a');
		this._sp_bt_auto =
			document.querySelector('.sp_controller_bt.auto');
		
		//イベント定義
		this._sp_main_center.addEventListener(_EVENT_KEYMOVE,this._keymove_sp_main);
		this._sp_main_center.addEventListener(_EVENT_KEYUP,this._keyup_sp_main);

		const _spc_bt=document.querySelectorAll('.sp_controller_bt');
		for(let _i=0;_i<_spc_bt.length;_i++){
			_spc_bt[_i].addEventListener(_EVENT_KEYDOWN,this._keydown_sp_bts);	
			_spc_bt[_i].addEventListener(_EVENT_KEYUP,this._keyup_sp_bts);
		}	
	}
}