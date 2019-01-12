/////////// Gas vars
$body = $("body");

$(function() {
    $( "#dialog" ).dialog();
  } );

$(document).on({
    ajaxStart: function() { $body.addClass("loading");    },
    ajaxStop: function() { compare(); $body.removeClass("loading"); },        
});

var resultsShowing = false;
var start;
var startStr;
var end;
var startEnd;
var gas =0;
var mpg = 30;
var natAvr = 245;
var distance;
var startSt = "";
var stP;
var tTime = "";
var airPrice =0;
var passengerNumber =0;
var statePrices =  [{st :"ca",price: 345},{st :"or",price: 307},{st :"wa",price: 324},{st :"id",price: 282},{st :"nv",price: 308},
                    {st :"mt",price: 270},{st :"wy",price: 279},{st :"ut",price: 281},{st :"co",price: 248},{st :"az",price: 275},
                    {st :"nm",price: 236},{st :"tx",price: 208},{st :"ok",price: 205},{st :"ks",price: 208},{st :"ne",price: 221},
                    {st :"sd",price: 239},{st :"nd",price: 239},{st :"mn",price: 229},{st :"ia",price: 214},{st :"mo",price: 200},
                    {st :"ar",price: 209},{st :"la",price: 209},{st :"ms",price: 209},{st :"tn",price: 216},{st :"ky",price: 216},
                    {st :"in",price: 227},{st :"mi",price: 233},{st :"oh",price: 324},{st :"ga",price: 220},{st :"fl",price: 227},
                    {st :"sc",price: 206},{st :"nc",price: 229},{st :"va",price: 222},{st :"wv",price: 248},{st :"pa",price: 264},
                    {st :"md",price: 232},{st :"ny",price: 274},{st :"nj",price: 247},{st :"ct",price: 273},{st :"ma",price: 264},
                    {st :"vt",price: 265},{st :"ri",price: 258},{st :"nh",price: 249},{st :"me",price: 243},{st :"al",pricel: 208},
                    {st :"hi",price: 357},{st :"ak",price: 313},{st :"il",price: 235},{st :"wi",price: 226},{st :"de",price: 217}]


function lastTripData() {
    document.getElementById("startCityLast").innerHTML = localStorage.getItem("startCityLast");
    document.getElementById("endCityLast").innerHTML = localStorage.getItem("endCityLast");
    document.getElementById("gallonCostLast").innerHTML = localStorage.getItem("gallonCostLast");
    document.getElementById("mileageLast").innerHTML = localStorage.getItem("mileageLast");
    document.getElementById("gasCostLast").innerHTML = localStorage.getItem("gasCostLast");
    document.getElementById("passengersLast").innerHTML = "Passengers: " + localStorage.getItem("passengersLast");

    //clear results
    document.getElementById("airlineOne").innerHTML = "";
    document.getElementById("ticketPriceOne").innerHTML = "";
    document.getElementById("gallonCost").innerHTML = "";
    document.getElementById("gasCost").innerHTML = "";
    document.getElementById("mileage").innerHTML = "";


}
$("#lastTrip").hide();
// Calculates everything on one click.
    $("#submit").on("click", function(){
        start = $("#inputAddressStart").val().trim();
        end = $("#inputAddressEnd").val().trim();
        passengerNumber = $("#inputPassengers").val().trim();
        var date1 = $("#startDate").val();
        var date2 = $("#endDate").val();
        $("#lastTrip").show();

    //console.log(start,end);
    $.ajax({
        method:"GET",
        url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + start +"&key=AIzaSyD08s15o4F0-Az1EgHff_9Tz1xnoT7qyAw",
    }).then(function(response){
        
        startSt = response.results[0].formatted_address;
        startSt= startSt.substr(startSt.indexOf(",")+2,2);
        startStr  = response.results[0].address_components[0].long_name;
        //console.log(startStr);
        //console.log(startSt);
        for(let i = 0; i < statePrices.length; i++){
            if(statePrices[i].st === startSt.toLowerCase()){
                stP=statePrices[i].price;
                break;
            }
        }
        //console.log(stP);
    });
    $.ajax({
        method:"GET",
        url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + end +"&key=AIzaSyD08s15o4F0-Az1EgHff_9Tz1xnoT7qyAw",
    }).then(function(response){
        endStr = response.results[0].address_components[0].long_name;
        //console.log(endStr);
        
    });
    toggle();
    $.ajax({
        method:"GET",
        url: "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin="+start+"&destination="+end+"&key=AIzaSyD08s15o4F0-Az1EgHff_9Tz1xnoT7qyAw",
    }).then(function(response){
        //console.log(response);
        distance = response.routes[0].legs[0].distance.text;
        distance = distance.replace(/,/g, "");
        distance = parseInt(distance);
        //tTime = response.routes[0].legs[0].duration.text;
        //console.log(distance/mpg);
        gas = ((distance/mpg * stP)/100) * 2;
        //console.log(gas.toFixed(2));
        $("#gallonCost").text(stP / 100);
        $("#gasCost").text(gas.toFixed(2));
        $("#mileage").text(distance * 2);
        //$("#travelTime").text(tTime);
        localStorage.setItem('gallonCostLast', stP / 100);
        localStorage.setItem('gasCostLast', gas.toFixed(2));
        localStorage.setItem('mileageLast', distance);
        localStorage.setItem('startCityLast', start);
        localStorage.setItem('endCityLast', end);
        localStorage.setItem('passengersLast', passengerNumber);
    });

    // 1. Need to get "Airport-code "for the API call, and store in a1store.
    var destination1 = $("#inputAddressStart").val().trim();
    var destination2 = $("#inputAddressEnd").val().trim();

    // Gets starting Airport Location.
    var queryURL = "https://cors-anywhere.herokuapp.com/https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query=" + destination1;

    $.ajax({
        url: queryURL,
        method: "GET",
        headers: {
        "X-RapidAPI-Key": "90c31e4b4emshc13f2d740766935p15ab71jsnbc32b0502db4"
    }

    }).then(function(response) {

        //console.log(response);


        //$("#airport1").text("Your nearest starting airport is: "+ response.Places[0].PlaceName + " Airport.");

        // Storing 1st airport code for the API call here!!!!
        var a1store = response.Places[0].PlaceId;

            // In same ajax call (so it happens one after another) getting the end airport.
            var queryURL2 = "https://cors-anywhere.herokuapp.com/https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query=" +destination2;

            $.ajax({
                url: queryURL2,
                method: "GET",
                headers: {
                "X-RapidAPI-Key": "90c31e4b4emshc13f2d740766935p15ab71jsnbc32b0502db4"
            }

            }).then(function(response) {

                //$("#airport2").text("Your ending airport is: "+ response.Places[0].PlaceName + " Airport.");

                // Storing 2nd airport code for API call here!!
                var a2store= response.Places[0].PlaceId;
                
                

                    // Final AJAX. Puts the cost and airline together.

                    var queryURL3 = "https://cors-anywhere.herokuapp.com/https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/"+ a1store +"/" + a2store +"/"+ date1+"/"+ date2;

                    $.ajax({
                        url: queryURL3,
                        method: "GET",
                        headers: {
                        "X-RapidAPI-Key": "90c31e4b4emshc13f2d740766935p15ab71jsnbc32b0502db4"
                    }
                    
                    }).then(function(response3) {

                        //console.log(response3);
                            // Accounting in multiple passengers    
                            passengerNumber = $("#inputPassengers").val();
                            passengerNumber = parseInt(passengerNumber);
                            // 1st Airline.
                            airPrice = response3.Quotes[0].MinPrice;
                            $("#ticketPriceOne").text("Ticket Price: $"+ passengerNumber* response3.Quotes[0].MinPrice);
                            $("#ticketPriceOneLast").text("Ticket Price Per Passenger: $"+response3.Quotes[0].MinPrice);
                            $("#ticketPriceOneLast").append("<br> Total Ticket Price: $"+ passengerNumber* response3.Quotes[0].MinPrice);



                            // Correctly showing the airline.
                            var air1Store = response3.Quotes[0].InboundLeg.CarrierIds[0];
                            var air1Name =  response3.Carriers.find(x => x.CarrierId === air1Store).Name;
                            $("#airlineOne").text( "Airline: " + air1Name);
                            $("#airlineOneLast").text( "Airline: " + air1Name);


                            /*2nd Airline (Taking out for now.)
                            $("#ticketPriceTwo").text("Ticket Price: $"+ passengerNumber* response3.Quotes[1].MinPrice);
                            $("#ticketPriceTwoLast").text("Ticket Price: $"+ passengerNumber* response3.Quotes[1].MinPrice);
                            // Correctly showing the airline.
                            var air2Store = response3.Quotes[1].InboundLeg.CarrierIds[0];
                            var air2Name =  response3.Carriers.find(x => x.CarrierId === air2Store).Name;
                            $("#airlineTwo").text( "Airline: " + air2Name);
                            $("#airlineTwoLast").text( "Airline: " + air2Name); */


                        
                            $("#firstDateLast").text(date1);
                            $("#endDateLast").text(date2);





                        
                    });
            });
    });   
});
function compare(){
    console.log(gas, airPrice*passengerNumber, passengerNumber);

    if(gas < airPrice*passengerNumber){
        $("#driveResults").css({border: "3px solid red"});
    } else if(gas > airPrice*passengerNumber){
        $("#flyResults").css({border: "3px solid red"});
    } else {
        $("#driveResults").css({border: "0px solid red"});
        $("#flyResults").css({border: "0px solid red"});
    }
}

$("#newSearch").click(toggle);
function toggle (){
    $("#driveResults").css({border: "0px"});
    $("#flyResults").css({border: "0px"});
    resultsShowing = !resultsShowing;
    if (resultsShowing){
        $("#searchForm").hide();
        $("#results").show();
    } else {
        $("#searchForm").show();
        $("#results").hide();
        lastTripData();
         }
    }