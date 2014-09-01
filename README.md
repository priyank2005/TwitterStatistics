TwitterStatistics
=================

Tracking Tweets for A Country (Currently GB). This application lists down latest 20 tweets from top 20 cities of GB, which are London, Birmingham, Liverpool, Leeds, Sheffield, Bristol, Manchester, Leicester, Coventry, Kingston upon Hull, Bradford, Stoke-On-Trent, Wolvehampton, Nottingham, Plymouth, Southhampton, Reading, Derby, Dudley, Newcastle upon Tyme. It also shows the map which highlights location of origin of tweets along with the count.

It uses NodeJs, Socket.io and AngularJs for UI rendering.

Please node that tweet count of historic data is not displayed as twitter limits number of API calls to 150 and does not give a direct API to get tweets.




Installation
=============

To install this execute npm install, then start the application with npm start and http://localhost:3000. Demo application of the same is hosted on http://aqueous-citadel-5297.herokuapp.com/.




API Specs
==========
Some functionality is exposed by rest APIs, details of which are as followes:

http://localhost:3000/api/getTweetsForCity
Method Accepted : POST
Parameters : q = Search Param.

Return : Returns JSON for tweets for the city (number 200).

-----------------------------------------------------------

http://localhost:3000/api/getAllSupportedCities
Method Accepted : POST
Parameters : NONE

Returns 20 cities mentioned above.

-----------------------------------------------------------

http://localhost:3000/api/getExistingMarkers
Method Accepted : POST
Parameters : NONE

Gives a JSON of existing coordinates for tweets origin.

-----------------------------------------------------------

http://localhost:3000/api/getTweetCountForACity
Method Accepted : POST
Parameters : q = City Name.

Tweet count for a city.

------------------------------------------------------------


Known Issues
=============
	-	Twitter API Limiting needs to be handled properly
	-	GMaps3 Needs to be angular friendly.
	- 	Rare Socket Hangup from Twitter needs to be handled.
	-	DB implementation to store tweet count in database instead of memory.
