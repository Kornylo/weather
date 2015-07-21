var $ = jQuery;

/* ---  exists  ----- */
jQuery.fn.exists = function() {
  return $(this).length;
};



/* ------------------- backgraund ---------------------*/

if($(".first_page, .royalSlider").exists()) {
  $(document).ready(function() { 
    $('.first_page, .royalSlider').css('height', window.innerHeight);
  });

  $(window).resize(function() {
    $('.first_page, .royalSlider').css('height', $(window).height());
  });
}


/* ----------------- open menu slide -------------------- */
$(document).ready(function() {
  $("#menu_open").click(function() {  
		if ($("#wrapper, #slide_menu, #wrapper_header").hasClass("open_menu")) {
			$("#wrapper, #slide_menu, #wrapper_header").removeClass("open_menu");   
		}
		else {
			$("#wrapper, #slide_menu, #wrapper_header").addClass("open_menu");     
		}
	});
  $(".menu_close, #wrapper").click(function() {  
		$("#wrapper, #slide_menu, #wrapper_header").removeClass("open_menu");   
	});
});


$(".holder").hide();
$(".holder").fadeIn(5000);


function getWeatherData(lang, fnOK, fnError) {
    navigator.geolocation.getCurrentPosition(locSuccess, locError);

    function locSuccess(position) {
        // Check cache
        var cache = localStorage.weatherCache && JSON.parse(localStorage.weatherCache);
        var currDate = new Date();
        // If the cache is newer than 30 minutes, use the cache
        if(cache && cache.timestamp && cache.timestamp > currDate.getTime() - 30*60*1000){
            fnOK.call(this, cache.data);
        } else {
            $.getJSON(
                'http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + position.coords.latitude + '&lon=' +
                position.coords.longitude + '&units=metric' + '&lang=' + lang + '&callback=?',
                function (response) {
                    // Store the cache
                    localStorage.weatherCache = JSON.stringify({
                        timestamp: (new Date()).getTime(),	// getTime() returns milliseconds
                        data: response
                    });
                    // Call the function again
                    locSuccess(position);
                }
            );
        }
    }

    function locError(error) {
        var message = 'Location error. ';
        switch(error.code) {
            case error.TIMEOUT:
                message += 'A timeout occured! Please try again!';
                break;
            case error.POSITION_UNAVAILABLE:
                message += 'We can\'t detect your location. Sorry!';
                break;
            case error.PERMISSION_DENIED:
                message += 'Please allow geolocation access for this to work.';
                break;
            case error.UNKNOWN_ERROR:
                message += 'An unknown error occured!';
                break;
        }
        fnError.call(this, message);
    }
}

$(function() {
   
    
   getWeatherData('uk', fnOK, fnErr);    
    
    function fnOK(data) {
        console.dir(data);
   $('#city').html(data.city.name + ' ' + data.city.country); 
   $('#temp').html(Math.round(data.list[0].temp.day )+"°C"); 
   $('.img_now').html('<img src="images/'+data.list[0].weather[0].icon+'.png">'); 
   $('.img_now_noon').html('<img src="images/'+data.list[1].weather[0].icon+'.png">'); 
   $('.img_now_afternoon').html ('<img src="images/'+data.list[2].weather[0].icon+'.png">'); 
   $('.img_now_evening').html('<img src="images/'+data.list[3].weather[0].icon+'.png">'); 
   $('.img_now_nights').html('<img src="images/'+data.list[8].weather[0].icon+'.png">'); 
   $('.noon').html(Math.round(data.list[1].temp.day )+"°C");
   $('.afternoon').html(Math.round(data.list[2].temp.day )+"°C");
   $('.evening').html(Math.round(data.list[3].temp.day )+"°C");
   $('.nights').html(Math.round(data.list[4].temp.day )+"°C");
   $(".humidity_noon").html( data.list[1].humidity  + "%" +"Humidity");
   $(".humidity_afternoon").html( data.list[2].humidity  + "%" +"Humidity");
   $(".humidity_evening").html( data.list[3].humidity  + "%" +"Humidity");
   $(".humidity_nights").html( data.list[4].humidity  + "%" +"Humidity");
   $('#temp').html(data.list[0].main.humidity.day); 
 

    }
     
    
    function fnErr(msg) {
      console.error(msg);   
    }
});