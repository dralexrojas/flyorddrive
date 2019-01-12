// https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=
//https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=Washington,DC&destinations=New+York+City,NY&key=
var resultsShowing = false;
var start;
var end;
var gas;
var mpg = 30;
var natAvr = 245;
var distance;
var startSt = "";
var stP;
var tTime = "";
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

$("#submit").click(function(e){
    start = $("#inputAddressStart").val().trim();
    end = $("#inputAddressEnd").val().trim();
    console.log(start,end);
    $.ajax({
        method:"GET",
        url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + start +"&key=AIzaSyD08s15o4F0-Az1EgHff_9Tz1xnoT7qyAw",
    }).then(function(response){
        console.log(response);
        startSt = response.results[0].formatted_address;
        startSt= startSt.substr(startSt.indexOf(",")+2,2);
        console.log(startSt);
        for(let i = 0; i < statePrices.length; i++){
            if(statePrices[i].st === startSt.toLowerCase()){
                stP=statePrices[i].price;
                break;
            }
        }
        console.log(stP);
    });
    toggle();
    $.ajax({
        method:"GET",
        url: "http://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin="+start+"&destination="+end+"&key=AIzaSyD08s15o4F0-Az1EgHff_9Tz1xnoT7qyAw",
    }).then(function(response){
        console.log(response);
        distance = response.routes[0].legs[0].distance.text;
        distance = distance.replace(/,/g, "");
        distance = parseInt(distance);
        tTime = response.routes[0].legs[0].duration.text;
        console.log(distance/mpg);
        gas = (distance/mpg * stP)/100;
        console.log(gas.toFixed(2));
        $("#gallonCost").text(stP / 100);
        $("#gasCost").text(gas.toFixed(2));
        $("#mileage").text(distance);
        $("#travelTime").text(tTime);
    });
}); 

$("#newSearch").click(toggle);

function toggle (){
    resultsShowing = !resultsShowing;
    if (resultsShowing){
        $("#searchForm").hide();
        $("#results").show();
    } else {
        $("#searchForm").show();
        $("#results").hide();
    }
}