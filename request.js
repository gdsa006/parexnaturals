var hostPath = 'https://www.affordascan.com';
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
var qpage = getUrlVars()["pt"];
var qlocationId = getUrlVars()["lid"];

var pageNames = [
           {
               name: 'reqaap', pageName: 'radiology-app-request-appointment'
               , device: { iphone: 1409, ipad: { p: 1223, l: 883 }, desktop: 900 }
           }
           , {
               name: 'lam', pageName: "radiology-app-send-message"
               , device: { iphone: 1198, ipad: { p: 1079, l: 730 }, desktop: 747 }
           }

           , { name: 'TODO', pageName: "radiology-app-location" }
];

var pageName;
$.each(pageNames, function (idx, obj) {
    if (obj.name == qpage) {
        pageName = obj.pageName;
        document.getElementById('cmd_iframe').height = findDevice(obj.device);
        return false;
    }
});
if (pageName == undefined) {
    alert("Some error. Please try again after some time.");
}
var panelColor = "143F90";
var themeName = localStorage.getItem('ThemeName');

if (themeName == "blue") {
    panelColor = "143F90"
} else if (themeName == "green") {
    panelColor = "71AA25"
}

var url = hostPath + "/jsp/" + pageName + ".html?locationId=" + qlocationId + "&noh=y" + "&c=" + panelColor;
document.getElementById('cmd_iframe').src = url;

function findDevice(obj) {
    var width = $(document).width();
    if (width < 750) {
        return obj.iphone;

    } else if (width >= 750 && width <= 1024) {
        if (width <= 900) {
            return obj.ipad.p;
        } else {
            return obj.ipad.l;
        }

    } else {
        return obj.desktop;
    }
}

$(window).resize(function () {
    $.each(pageNames, function (idx, obj) {
        if (obj.name == qpage) {
            document.getElementById('cmd_iframe').height = findDevice(obj.device);
            return false;
        }
    });
});

