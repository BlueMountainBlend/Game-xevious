'use strict';

import css from './xevious_main.css';

//URL情報をセット
const _PK_URL = require('url').parse(location.href,true);

//import * as a from './xevious_socketio';
import _GAME_COMMON from './xevious_common';
import * as _XCE from './xevious_controller_event';
import * as _XC from './xevious_canvasimgs';
import * as _XPD from './xevious_parts_draw';
import * as _XPM from './xevious_map';


// sub.jsに定義されたJavaScriptを実行する。
//hello();
//a.socket_init();


//===================================================
//	JAVASCRIPT START
//===================================================
window.addEventListener('load', () => {
    _GAME_COMMON._init({_pu:_PK_URL});
    //CANVASに画像・音声読込
    _GAME_COMMON._init_canvasimgs(_XC).then(function(){
        _XPM._MAP.init({f:_XPD._DRAW_START});
    });

    if (_GAME_COMMON._issp) {
        document.querySelector('body').classList.add('sp');
        _XCE._SP_CONTROLLER._set_obj();
    }

});

//touchmoveブラウザのスクロールを停止
window.addEventListener('touchmove', function (e) {
    e.preventDefault();
}, {passive: false});
