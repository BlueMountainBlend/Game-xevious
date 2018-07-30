//=====================================================
//	xevious_parts_draw
//	描画定義
//	2018.06.15 : 新規作成
//=====================================================
'use strict';
import _GAME_COMMON from './xevious_common';
import * as _XCE from './xevious_controller_event';
import * as _XC from './xevious_canvasimgs';
import * as _XPPM from './xevious_parts_playermain';
import * as _XPE from './xevious_parts_enemies';
import * as _XES from './xevious_parts_enemy_shot';
import * as _XPO from './xevious_parts_others';
import * as _XMP from './xevious_map';

let _DRAW_SETINTERVAL = null;
let _DRAW_OBJ_BACKGROUND = new Object();

let _FLAG_GAMEOVER = false;
let _COUNT_GAMEOVER = false;

let _DRAW_START_SOUND = true;
let _start_select = 0;


const _is_enemies_collision = () => {
	_XPE._PARTS_ENEMIESMAIN._optimized_enemies();
	//敵だけ当たり判定をする
	let _ar = _XPE._PARTS_ENEMIESMAIN._get_array_enemies();
	_XPPM._PARTS_PLAYERMAIN._enemy_collision(_ar);
}

const _is_enemies_shot_collision = () => {
	_XES._PARTS_ENEMYSHOT._enemyshot.map((_o,_i,_ar)=>{
		//非表示・かつ生存してない場合は、要素から外す
		if (!_o.isshow()) {_ar.splice(_i, 1);}
	});
	_XPPM._PARTS_PLAYERMAIN._enemy_shot_collision(_XES._PARTS_ENEMYSHOT._enemyshot);
}

export const _SET_GAMEOVER = () => {
	_FLAG_GAMEOVER = true;
};
export const _IS_GAMEOVER = () => {
	return _FLAG_GAMEOVER;
};
export const _IS_DRAW_STOP = () => {
	return (_DRAW_SETINTERVAL === null);
}

export const _DRAW = () => {
	window.cancelAnimationFrame(_DRAW_SETINTERVAL);

	const _loop = () => {
		_DRAW_SETINTERVAL = window.requestAnimationFrame(_loop);
		_GAME_COMMON._context.clearRect(0, 0, _GAME_COMMON._canvas.width, _GAME_COMMON._canvas.height);

		_DRAW_OBJ_BACKGROUND.move();
		_DRAW_OBJ_BACKGROUND.setDrawImage();

		_is_enemies_collision();
		_is_enemies_shot_collision();

		//各オブジェクト最適化
		_XPO._PARTS_COLLISION._optimized_collapsed();
		_XPO._PARTS_COLLISION._optimized_collision();
		_XPE._PARTS_ENEMIESMAIN._optimized_enemies();

		//爆発後の移動・表示
		_XPO._PARTS_COLLISION._move_collapsed();
		//敵の移動
		_XPE._PARTS_ENEMIESMAIN._move_enemies();

		_XPE._PARTS_ENEMIESMAIN._draw_enemies_field();
		_XPO._PARTS_COLLISION._draw_collapsed_field();

		_XPE._PARTS_ENEMIESMAIN._draw_enemies_fly();
		_XPO._PARTS_COLLISION._draw_collapsed_fly();
		//敵ショットの移動・表示
		_XES._PARTS_ENEMYSHOT._move_enemyshot();
		_XES._PARTS_ENEMYSHOT._draw_enemyshot();
		//自機ショットの移動・表示
		_XPPM._PARTS_PLAYERMAIN._move_shots();
		_XPPM._PARTS_PLAYERMAIN._draw_shots();
		//自機の移動・表示
		_XPPM._PARTS_PLAYERMAIN._move_players();
		_XPPM._PARTS_PLAYERMAIN._draw_players();
		//爆発の移動・表示
		_XPO._PARTS_COLLISION._move_collision();
		_XPO._PARTS_COLLISION._draw_collision();

		_XPO._PARTS_OTHERS._draw_score();

		_DRAW_GAMECLEAR();
		_DRAW_PLAYER_COLLAPES();
	}
	_DRAW_SETINTERVAL = window.requestAnimationFrame(_loop);
}
export const _DRAW_GAMECLEAR = () => {
	if(!_XPE._PARTS_ENEMIESMAIN._get_enemies()){return;}
	if (_IS_GAMEOVER()){return;}
	_GAME_COMMON._setDrawText('GAME CLEAR', 'center', 300, 0.5);
	_GAME_COMMON._setDrawText('PRESS R TO RESTART', 'center', 400, 0.3);
}
export const _DRAW_GAMESTART = () =>{
//	console.log(_start_select)
	_XPPM._PARTS_PLAYERMAIN._reset();
	_XES._PARTS_ENEMYSHOT._reset();

	_XPPM._PARTS_PLAYERMAIN._init_players_obj({});
	_DRAW_OBJ_BACKGROUND.init();
	_XCE._KEYEVENT_MASTER.removeKeydownStart();
	_XCE._KEYEVENT_MASTER.removeKeydownGameclear();
	_XCE._KEYEVENT_MASTER.removeKeydownGameover();
	_XCE._KEYEVENT_MASTER.addKeydownGame();
	_XCE._KEYEVENT_MASTER.addKeyupGame();

	_XPO._PARTS_OTHERS._init_others_obj();
	_XPO._PARTS_COLLISION.init();


	_XPE._PARTS_ENEMIESMAIN._init(_start_select);
	_XES._PARTS_ENEMYSHOT._init(_start_select);


	_XMP._MAP._set_gamestart();

	_GAME_COMMON._setStopOnBG();
	_GAME_COMMON._setPlayOnBG(_XC._CANVAS_AUDIOS['bg_start'], false, 6500).then(() => {
		_GAME_COMMON._setPlayOnBG(_XC._CANVAS_AUDIOS['bg_main']);
		_DRAW_START_SOUND = false;
	});
	_DRAW();
}
export const _DRAW_STOP = () => {
	window.cancelAnimationFrame(_DRAW_SETINTERVAL);
	_DRAW_SETINTERVAL = null;
}

export const _DRAW_SWITCH = () => {
	_DRAW_START_SOUND = false;
	if (_DRAW_SETINTERVAL !== null) {
		//描画・コントローラーのショットを止める
		_DRAW_STOP();
		_XPPM._PARTS_PLAYERMAIN._control_stop_shots();
		_XPPM._PARTS_PLAYERMAIN._control_stop_missile_shots();
		_GAME_COMMON._setStopOnBG();
	} else {
		//描画・コントローラーのショットを再開
		_DRAW();
		if (_XCE._SP_CONTROLLER._sp_bt_auto.classList.value.indexOf('auto on') !== -1) {
			//auto指定時は連射を再開
			_XPPM._PARTS_PLAYERMAIN._control_start_shots();
			_XPPM._PARTS_PLAYERMAIN._control_start_missile_shots();
		}
		_GAME_COMMON._setPlayOnBG(_XC._CANVAS_AUDIOS['bg_main']);
	}
}
export const _DRAW_PLAYER_PLAY_SHOT = () => {
	if (_DRAW_START_SOUND){return;}
	_GAME_COMMON._setPlay(_XC._CANVAS_AUDIOS['shot']);
}
export const _DRAW_PLAYER_PLAY_MISSILE_SHOT = () => {
	if (_DRAW_START_SOUND){return;}
	_GAME_COMMON._setPlay(_XC._CANVAS_AUDIOS['shot_missile']);
}
export const _DRAW_PLAYER_ENEMIES = (_p) => {
	if (_DRAW_START_SOUND) {return;}
	_GAME_COMMON._setPlay(_p);
}

export const _DRAW_PLAYER_COLLAPES = () => {
	//クラッシュした瞬間にキーを無効にする
	// _XCE._KEYEVENT_MASTER.removeKeydownGame();
	// _XCE._KEYEVENT_MASTER.removeKeyupGame();

//	_GAME_COMMON._setStopOnBG();
//	_DRAW_STOP_PLAYERS_SHOTS();
//	_DRAW_SCROLL_STOP();

	// let _e=new _XPO.xevious_collision('t0');
	// _e.move();
	// _e.setDrawImage();
	_XPPM._PARTS_PLAYERMAIN._draw_collision();
	if (_IS_GAMEOVER()) {
		if(_COUNT_GAMEOVER>=100){_DRAW_GAMEOVER();}
		_COUNT_GAMEOVER=(_COUNT_GAMEOVER>=100)?100:_COUNT_GAMEOVER+1;
	}
}

export const _DRAW_RESET_OBJECT = () => {
	_XPPM._PARTS_PLAYERMAIN._reset();
	_XPE._PARTS_ENEMIESMAIN._reset()

	_FLAG_GAMEOVER=false;
	_COUNT_GAMEOVER=0;

	_DRAW_START_SOUND = true;

	_GAME_COMMON._setStopOnBG();
}

//スタート画面表示
export const _SET_DRAW_START_SELECT = (_num) => {
	_start_select = ((_start_select === 0 && _num < 0) || (_start_select === 2 && _num > 0)) ? _start_select : _start_select + _num;
//	console.log(_start_select)
}
export const _DRAW_START = () => {
	_DRAW_OBJ_BACKGROUND = new _XPO.xevious_background({});
	_XCE._KEYEVENT_MASTER.removeKeydownGame();
	_XCE._KEYEVENT_MASTER.removeKeyupGame();
	_XCE._KEYEVENT_MASTER.removeKeydownGameover();

	_XCE._KEYEVENT_MASTER.addKeydownStart();

	window.cancelAnimationFrame(_DRAW_SETINTERVAL);
	_XPPM._PARTS_PLAYERMAIN._init_players_obj({});
	_DRAW_OBJ_BACKGROUND.init();
	_XPO._PARTS_OTHERS._init_others_obj();

	let _c = 0;
	_start_select = 0;
//	console.log('reset::'+_start_select)
	const _loop = () => {
		_DRAW_SETINTERVAL = window.requestAnimationFrame(_loop);
		_GAME_COMMON._context.clearRect(0, 0, _GAME_COMMON._canvas.width, _GAME_COMMON._canvas.height);

		_DRAW_OBJ_BACKGROUND.move();
		_DRAW_OBJ_BACKGROUND.setDrawImage();

		_XPO._PARTS_OTHERS._draw_score();
		//タイトルロゴ表示
		_GAME_COMMON._setDrawImage({
			img: _XC._CANVAS_IMGS.xevious_logo.obj,
			x: 250 - parseInt(386 / 2),
			y: 130,
			basePoint: 1
		});
		_GAME_COMMON._setDrawText('NO PAKURI', 'center', 280, 0.3);
		_GAME_COMMON._setDrawText('EASY', 'center', 380, 0.3);
		_GAME_COMMON._setDrawText('NORMAL', 'center', 420, 0.3);
		_GAME_COMMON._setDrawText('HARD', 'center', 460, 0.3);

		//選択矩形表示
		_GAME_COMMON._context.save();
//		console.log(_start_select)
		_GAME_COMMON._context.strokeStyle='rgba(255,255,255,1)';
		_GAME_COMMON._context.strokeRect(100, 375+(40*_start_select), _GAME_COMMON._canvas.width-200, 30);
		_GAME_COMMON._context.stroke();
//		_GAME_COMMON._context.restore();
		if (_c % 30 > 5 && _c % 30 < 30) {
			_GAME_COMMON._setDrawText('PRESS S TO DECIDE', 'center', 510, 0.2);
		}
		_c = (_c > 30) ? 0 : _c + 1;
	}
	_DRAW_SETINTERVAL = window.requestAnimationFrame(_loop);
} //_DRAW_START


const _DRAW_GAMEOVER=()=>{
	_XCE._KEYEVENT_MASTER.removeKeydownGame();
	_XCE._KEYEVENT_MASTER.removeKeyupGame();
	_XCE._KEYEVENT_MASTER.addKeydownGameover();

	_GAME_COMMON._setDrawText(
		'GAMEOVER',
		"center",
		(_GAME_COMMON._canvas.height / 2) - (60 / 2) - 40,
		0.5);

	_GAME_COMMON._setDrawText(
		'PRESS R TO RESTART',
		"center",
		(_GAME_COMMON._canvas.height / 2) + 30,
		0.25);

	_GAME_COMMON._setDrawText(
		'PRESS S TO BACK TO OPNING',
		"center",
		(_GAME_COMMON._canvas.height / 2) + 60,
		0.25);


}// _DRAW_GAMEOVER