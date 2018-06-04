/* Copyright (c) 2018, Tehran.ir. All rights reserved. */
/*
   DESCRIPTION
     Base functionality for current application scripts. 

   NOTES
     This script should imported in the top of all scripts.

   PRIVATE CLASSES
     <list of private classes defined - with one-line descriptions>

   NOTES
     <other useful comments, qualifications, etc.>
*/

var TehranMV = TehranMV || {version:"1.0.0"};
TehranMV.util = TehranMV.util || {};
TehranMV.gv = TehranMV.gv || {};
// If true logs will be printed in the console.
TehranMV.gv.logConsole = true;
TehranMV.gv.mapviewer_baseURL = "http:" + "//"+ "192.168.88.15:8080"+"/mapviewer";
TehranMV.gv.api_baseURL = "http:" + "//"+ "192.168.88.26:5858";
(function () {
    var ua = navigator.userAgent.toLowerCase(),		
    webkit = /webkit/.test(ua),
    mobile = typeof orientation !== 'undefined' ? true : false,
    android = /android/.test(ua), 
    chrome = /chrome/.test(ua),
    firefox = /firefox/.test(ua),
    mozilla = /(mozilla)(?:.*? rv:([\w.]+))?/.test(ua),            
    opera = /(opera)(?:.*version)?[ \/]([\w.]+)/.test(ua),
    msie = /(msie) ([\w.]+)/.test(ua);
         
  TehranMV.browser = {
		msie: msie,
		msie6: msie && !window.XMLHttpRequest,
                mozilla: mozilla,                
		webkit: webkit,
                safari: webkit, //deprecated, use webkit instead.
                firefox: firefox,
		webkit3d: webkit && ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()),                
                chrome: chrome,
		gecko: ua.indexOf("gecko") !== -1,                
		opera: opera,
		android: android,
		mobileWebkit: mobile && webkit,
		mobileOpera: mobile && opera,
		mobile: mobile,
		touchSupported: 
        (function () {
			try{
                if("ontouchstart" in document.documentElement)
                    return true;
                else
                    return false;
            } catch(e)
            {
                return false;
            }  
		}())
	};
}());

/**
 * Generate random unique
 */
TehranMV.util.generateRandomUnique = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+=-?><|}{";

    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

/**
 * Is string null or empty
 * @param {any} MyVar
 */
TehranMV.util.isStringEmptyOrUndefined = function(value) {      
    return (
        (typeof value== 'undefined')            //undefined
            ||
            (value == null)                     //null
            ||
            (value == false) //!MyVariable      //false
            ||
            (value.length == 0)                 //empty
            ||
            (value == "")                       //empty
            ||
            (value.replace(/\s/g,"") == "")     //empty
            ||
            (!/[^\s]/.test(value))              //empty
            ||
            (/^\s*$/.test(value))               //empty
    );
}

/**
 * Log data in console.
 * @param {any} func
 * @param {any} text
 * @param {any} data
 */
TehranMV.util.logIntendedData = function(func, text, data) {
    if (TehranMV.gv.logConsole) {
        console.log("----> The function --> "   + func + 
            " executed and the message is --> " + text + 
            " --> ", data);
    }
}

/**
 * A hack for DNN action result to fetch JSON data and create JSON object.
 * @param {string} dnnActionResult
 */
TehranMV.util.hackDnnActionResultForJsonResponse = function(dnnActionResult) {
    var dnnViewResp = dnnActionResult.responseText;
    dnnViewResp = dnnViewResp.substring(0, dnnViewResp.indexOf("<!DOCTYPE html>"));
    if (dnnViewResp === "") {
        dnnViewResp = "{}";
    }
    return JSON.parse(dnnViewResp);
}

/**
 * Get marker image based on current state.
 *
 * 0: In chartable --> yellow
 * 1: In progress -->blue
 * 2: Confirmed --> green
 * 3: Rejected --> red
 * 4: Unknown --> brown
 *
 * @param {int} currentState
 */
TehranMV.util.getMaprkerIcon = function(currentState) {
    var iconBase = '/DesktopModules/MVC/UrbanElementsDatabaseModule/Content/images/map/';

    switch (currentState) {
    case 0:
        return iconBase + 'spotlight-yellow-poi2.png';
    case 1:
        return iconBase + 'spotlight-blue-poi2.png';
    case 2:
        return iconBase + 'spotlight-green-poi2.png';
    case 3:
        return iconBase + 'spotlight-red-poi2.png';
    default:
        return iconBase + 'spotlight-brown-poi2.png';
    }
}

/**
 * Get marker object used in the Map.createMarker
 * @param {any} latitude
 * @param {any} longitude
 * @param {any} currentState
 * @param {any} extraData
 * @param {any} functionForClick
 */
TehranMV.util.getCreateMarkerOptions = function(latitude, longitude, currentState, extraData, functionForClick) {
    if (currentState == undefined || currentState > 3) {
        currentState = 4;
    }

    // Index is important because object found with index.
    var icons = [
        {
            currentState: 0,
            title: "در کارتابل",
            path: TehranMV.util.getMaprkerIcon(0)
        },
        {
            currentState: 1,
            title: "در انتظار تایید",
            path: TehranMV.util.getMaprkerIcon(1)
        },
        {
            currentState: 2,
            title: "تایید شده",
            path: TehranMV.util.getMaprkerIcon(2)
        },
        {
            currentState: 3,
            title: "رد شده",
            path: TehranMV.util.getMaprkerIcon(3)
        },
        {
            currentState: 4,
            title: "نامشخص",
            path: TehranMV.util.getMaprkerIcon(4)
        }
    ];

    return {
        lat: latitude,
        lng: longitude,
        title: icons[currentState].title,
        icon: icons[currentState].path, // The index of target icon is equal to current status in the back-end
        // Custom object with extra data.
        details: extraData,
        click: functionForClick
    }
}

/**
 * Progress bar in AJAX requests.
 */
jQuery(document).ready(function() {
    $(document).ajaxStart(function () {
        $('#progress-circle').show();
    });
    $(document).ajaxStop(function () {
        $('#progress-circle').hide();
    });
    $(document).ajaxError(function () {
        $('#progress-circle').hide();
    });   
});
