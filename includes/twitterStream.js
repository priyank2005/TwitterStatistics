var twitter = require('twitter');
var twitConfig = require('../configs/twitter.js');
var citiesConfig = require('../configs/cities.js');
var twitterApiWrapper = require("./twitterApiWrapper.js");
var bot = new twitter(twitConfig);
var tweetsBuffer = new Array();
var sendTweetsBuffer = new Array();
var TWEETS_BUFFER_SIZE = 3;
var SOCKETIO_TWEETS_EVENT = 'tweet-io:tweets';
var SOCKETIO_START_EVENT = 'tweet-io:start';
var SOCKETIO_STOP_EVENT = 'tweet-io:stop';
var broadcastTweets = function() {
	//send buffer only if full
	if (tweetsBuffer.length >= TWEETS_BUFFER_SIZE) {
		//broadcast tweets
		io.sockets.emit(SOCKETIO_TWEETS_EVENT, tweetsBuffer);
		
		sendTweetsBuffer = tweetsBuffer;
		tweetsBuffer = [];
	}
}


var startSocketStream = function (searchTerm){
	var nbOpenSockets = 0;
	var object = new Object();
	if (searchTerm == "_all"){
		var searchCoordinates=new Array();
		for (i=0; i<citiesConfig.length; i++){
			searchCoordinates.push(citiesConfig[i].coordinates);
		}
		var _searchCoordinates=searchCoordinates.join(",");
	}
	var params = {
        locations: [_searchCoordinates]
    };
    var streamClient=null;
	io.sockets.on('connection', function(socket) {
	    console.log('Client connected !');
	    if (nbOpenSockets <= 0) {
	        nbOpenSockets = 0;
	        console.log('First active client. Start streaming from Twitter');
	        if (sendTweetsBuffer != null && sendTweetsBuffer.length != 0) {
				io.sockets.emit(SOCKETIO_TWEETS_EVENT, sendTweetsBuffer);
			}
	        bot.stream('filter', params, function(stream) {
	        	streamClient=stream;
	        	stream.on('data', function(tweet) {
			        var msg = {};
					msg.text = tweet.text;
					msg.location = tweet.place.full_name;
					msg.coordinates = tweet.place.bounding_box.coordinates[0][0];
					twitterApiWrapper.addMarkerCoordinates(msg.coordinates);
					msg.user = {
						name: tweet.user.name, 
						image: tweet.user.profile_image_url
					};
					tweetsBuffer.push(msg);
					broadcastTweets();
			    });
			});
	    }
	 
	    nbOpenSockets++;
	 
	    socket.on('disconnect', function() {
	        console.log('Client disconnected !');
	        nbOpenSockets--;
	 
	        if (nbOpenSockets <= 0) {
	            nbOpenSockets = 0;
	            console.log("No active client. Stop streaming from Twitter");
	            //FixMe: No destory method in twitter library. 
	            if (null != streamClient)
	            	setTimeout(streamClient.destroy, 5000);
	            else{
	            	console.log("No Active Streams Found to close");
	            }
	        }
	    });
	});
}
exports.startSocketStream = startSocketStream;