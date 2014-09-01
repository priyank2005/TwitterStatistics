var express = require('express');
var twitterWrapper=require('../includes/twitterApiWrapper.js');
var router = express.Router();

router.route('/getTweetsForCity').post(function(req, res) {
	console.log(req.param('q'));
	var searchParam = req.param('q', null);
	var startIndex = req.param('start', null);
	var number = req.param('num', null);
	if (searchParam == null || searchParam.length==0){
		res.status(403).send("Required Parameter 'q' missing.");
		return;
	}
	twitterWrapper.searchTweets(searchParam,'recent',number, function(reply){
		res.send(reply);
	});
})
router.route('/getAllSupportedCities').post(function(req, res){
	res.send(twitterWrapper.listAllSupportedCities());
})
router.route('/steamTweetsForCity').post(function(req, res){
	twitterWrapper.streamSearch("_all");
	res.status(200).send("");
});
router.route('/getExistingMarkers').post(function(req,res){
	res.send(twitterWrapper.getExistingMarkers());
})
router.route('/getTweetCountForACity').post(function(req, res){
    var cityName=req.param('q', null);
    if (cityName==null){
        res.status(403).send();
        return;
    }
    twitterWrapper.tweetCount(cityName,function(reply){
        console.log("From Main Function : ");
        res.send(reply);
    });
})

module.exports = router;
