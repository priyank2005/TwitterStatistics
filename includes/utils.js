var sha1 = require('sha1');

function sha1(string){
	return sha1(string);
}


function parseQuery(qstr)
{
  var query = {};
  var a = qstr.split('&');
  for (var i in a)
  {
    var b = a[i].split('=');
    query[decodeURIComponent(b[0].replace("?",""))] = decodeURIComponent(b[1]);
  }

  return query;
}
function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}
exports.parseQuery=parseQuery;
exports.isEmpty=isEmpty;
exports.sha1 = sha1;