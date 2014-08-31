var twitter = require('twitter');
var twitConfig = require('../configs/twitter.js');
var citiesConfig = require('../configs/cities.js');
var NodeCache = require("node-cache");
var dateUtils = require('date-utils');
var utilsObj = require('./utils.js');
var myCache = new NodeCache();
var bot = new twitter(twitConfig);
/*


*/
var listAllSupportedCities = function(){
	return citiesConfig;
}
var processTwitCountForPlaceID = function(placeId, fromId, count, maxId, funcPtr) {
    var _searchPlaceID = "place:" + placeId;
    var _cacheName=utilsObj.sha1("placeCount_"+_searchPlaceID);
    var returnObjCache = myCache.get(_cacheName);
    var moveForward=false;
    if (false == utilsObj.isEmpty(returnObjCache)){
        var returnObj = returnObjCache[_cacheName];
        console.log("Cache object Received");
        console.log(returnObj);
        funcPtr(returnObj);
        return;
        //If the fromId is null and cache is avaible then we will only look for new tweets from the max ID.
        moveForward=true;
        
    }else{
        var returnObj = new Object();
    }
    returnObj.max_id=maxId;

    console.log("Searching For PlaceID : " + _searchPlaceID);
    var params = {
        result_type: 'recent',
        count: '200'
    };
    if (fromId!=null){
        console.log("Calling With Max ID : "+fromId);
        params.max_id=fromId;
    }
    if (typeof returnObj.currentCount === "undefined"){
        returnObj.currentCount=count;
    }else{
        console.log("Current Count Set to "+returnObj.currentCount);
    }
    bot.search(_searchPlaceID, params, function(reply) {
        if (typeof reply.search_metadata != "undefined" && typeof reply.search_metadata.count != "undefined"){
            returnObj.currentCount += reply.search_metadata.count;
            console.log("Current Count Incremented to "+returnObj.currentCount);
            if (typeof returnObj.max_id === "undefined"){
                returnObj.max_id = reply.search_metadata.max_id;
            }else if (parseInt(returnObj.max_id)<parseInt(reply.search_metadata.max_id)){
                returnObj.max_id = reply.search_metadata.max_id;
            }
        }
        if (typeof reply.search_metadata != "undefined" && typeof reply.search_metadata.next_results != "undefined") {
            var _nextParams = utilsObj.parseQuery(reply.search_metadata.next_results);
            console.log("Next Parameters Received for Searching For A Place ID : "+_searchPlaceID);
            processTwitCountForPlaceID(placeId, _nextParams.max_id, returnObj.currentCount, returnObj.max_id, funcPtr);
        }else{
            myCache.del(_cacheName);
        	myCache.set(_cacheName, returnObj);
            funcPtr(returnObj);
        }
    });
}
var getPlaceDetailsWithName = function (city, funcPtr){
	var params = {
        query: city,
        granularity : 'city'
    };
    bot.geoSearch(params, function(reply) {
    	var returnObj = new Object();
        if (typeof reply.result !== "undefined" && typeof reply.result.places !== "undefined") {
            returnObj.errorCode=0;
            var found=false;
            for (i=0 ;i<reply.result.places.length; i++){
            	console.log(reply.result.places[i]);
            	if (reply.result.places[i].country_code=="GB"){
            		console.log(reply.result.places[i]);
            		found=true;
            	}
            }
            if (!found){
            	console.log("\n\n\n\n\n\n\n\nNot Found "+city);
            }
            
        } else {
            returnObj.errorCode=1;
            console.log("Unable to get Place ID from Twitter API");
            console.log(reply)
            funcPtr(returnObj);
        }
    })
}
var getTwitterPlaceID = function(city, funcPtr) {
    var params = {
        query: city,
        granularity : 'city'
    };
    console.log(funcPtr);
   	bot.geoSearch(params, function(reply) {
    	//console.log(reply.result);
        var returnObj = new Object();
        if (typeof reply.result !== "undefined" && typeof reply.result.places !== "undefined") {
            returnObj.errorCode=0;
            var id = reply.result.places[0].id;
            console.log("Got ID as " + id);
            processTwitCountForPlaceID(id, null, 0, 0, funcPtr);
        } else {
            returnObj.errorCode=1;
            console.log("Unable to get Place ID from Twitter API");
            console.log(returnObj)
            funcPtr(returnObj);
        }

    })
}
var twitCount = function(searchTerm, funcPtr) {
    var yesterdayDate = Date.yesterday().toFormat('YYYY-MM-DD');
    var currentCount = 0;
    getTwitterPlaceID(searchTerm, funcPtr);
};
var searchTweets = function(searchTerm, resultType, pageSize, funcPtr) {

    var params = {
        result_type: resultType,
        count: pageSize
    };
    bot.search(searchTerm, params, funcPtr);
}
exports.searchTweets = searchTweets;
exports.tweetCount = twitCount;
exports.getTwitterPlaceID = getTwitterPlaceID;
exports.listAllSupportedCities = listAllSupportedCities;