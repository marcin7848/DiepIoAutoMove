// ==UserScript==
// @name         DiepIO
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  dieio
// @author       Marcin
// @match        https://diep.io
// @match        http://diep.io
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant unsafeWindow
// @require http://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==


(function() {
    'use strict';

    const channel1 = new BroadcastChannel('mouseMoveEvent');
    const channel2 = new BroadcastChannel('keyEvent');

    if(!GM_getValue("diepTab")){
        GM_setValue("diepTab", 0);
    }

    var diepTab = parseInt(GM_getValue("diepTab")) + 1;
    GM_setValue("diepTab", diepTab);

    if (diepTab >= 4) {
        GM_setValue("diepTab", 0);
    }
    console.log("TabID: " + diepTab);

    if(diepTab != 1){
        channel1.onmessage = e => {
            var mousemove = new jQuery.Event("mousemove");
            mousemove.clientX = e.data.clientX;
            mousemove.clientY = e.data.clientY;
            $("#canvas").trigger(mousemove);
        };
        channel2.onmessage = e => {
            var keyEv = jQuery.Event(e.data.command); //keydown or keyup
            keyEv.keyCode = e.data.keyCode;
            $("#canvas").trigger(keyEv);
        };
    }

    $(window).keydown(function(event) {
        var keyCode = event.keyCode;
        if(diepTab == 1){
            channel2.postMessage({command: "keydown", keyCode: keyCode});
        }
    });
    $(window).keyup(function(event) {
        var keyCode = event.keyCode;
        if(diepTab == 1){
            channel2.postMessage({command: "keyup", keyCode: keyCode});
        }
    });

    $(window).mousemove(function(event) {
        var clientX = event.clientX;
        var clientY = event.clientY;
        channel1.postMessage({clientX: clientX, clientY: clientY});
    });
})();
