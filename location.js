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
function OpenMapModal(title, link) {

    $('#dvDesc').html($(link).parents('.location').find('.desc').html());

    $('#myModalLabel1').html(title);

    $('#mdLocation').modal('show');
    var address = $(link).parents('.location').find('address').find('span').text();
    GetLocationAndSetPin(address);
}

$('#mdLocation').on('shown.bs.modal', function (e) {
    RefreshGooglemap();
})
$(function () {
    //change page title. when come from 
    var title = getUrlVars()["pt"];
    if (title == "reqapp") {
        $(".page-title").html("Request an Appointment");
        
        $(".req-a").removeClass("req-app").addClass("btn-thm");
    } else if (title == "lam") {
        $(".page-title").html("Leave a Message");

        $(".req-m").removeClass("req-app").addClass("btn-thm");
    }


    var selectLoc = $('#' + getUrlVars()["loc"]);

    var docWidth = $(document).width();
    var scrollalign;
    if (docWidth < 767) {
        scrollalign = -10;
    }
    else {
        scrollalign = -150;
    }

    if (selectLoc.length != 0) {
        $('html, body').animate({
            scrollTop: selectLoc.offset().top + scrollalign
        }, 2000, null, function () {
            selectLoc.addClass('active-loc');
            setTimeout(function () {
                selectLoc.find('.linkTwo').trigger("click");
            }, 500);
        });
    }
});

$('#mdLocation').on('hidden.bs.modal', function (e) {
    $('.active-loc').removeClass('active-loc');
});


var fromLat = 39.9689946, fromLng = -75.58809659999997, myLatlng, map;
var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();

function GetLocationAndSetPin(address) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            fromLat = results[0].geometry.location.lat();
            fromLng = results[0].geometry.location.lng();
            myLatlng = new google.maps.LatLng(fromLat, fromLng);
            //console.log(fromLat);
            //console.log(fromLng);

            initialize();

        } else {
            alert("Request failed.")
        }
    });
};

function initialize() {
    var markers = [];
    myLatlng = new google.maps.LatLng(fromLat, fromLng);
    var mapOptions = {
        zoom: 12,
        center: myLatlng
    }
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    directionsDisplay.setMap(map);

    var input = (document.getElementById('pac-input'));
    var searchBox = new google.maps.places.SearchBox(input);

    google.maps.event.addListener(searchBox, 'places_changed', function () {
        CalcRoute();
    });

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Destimation'
    });
}
function CalcRoute() {
    var start = document.getElementById('pac-input').value;
    var end = new google.maps.LatLng(fromLat, fromLng);
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}

function RefreshGooglemap() {
   // try {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);

    //}
   // catch (ex) {
     //   console.log(ex);
   // }
}

google.maps.event.addDomListener(window, 'load', initialize);