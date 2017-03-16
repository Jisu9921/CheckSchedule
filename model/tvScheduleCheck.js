// tvScheduleCheck.js
const Iconv  = require('iconv').Iconv
const cheerio = require('cheerio')
const request = require('request')

class TvSchedule{

}


TvSchedule.scheduleCheck = function(channelData,done) {
	let option = {}
	let result = {}

	option['url'] = 'http://m.skbroadband.com/content/realtime/Channel_List.do?key_depth1='+channelData['key_depth1']+'&key_depth2='+channelData['key_depth2']+'&key_depth3='
	option['encoding'] = 'binary'

	request(option, function(error, response, body) {
	    if (error) throw error;
	    let strContents = new Buffer(body, 'binary');
	    let iconv = new Iconv('euc-kr', 'utf-8//translit//ignore');
	    strContents = iconv.convert(strContents).toString()
	    let $ = cheerio.load(strContents);
	    $("#dawn").each(function(){
	    	let data = $("#dawn").find(".title").find("span").not(".caption").not(".fullHD").not("nowon").text()
	    	result['channel'] = channelData['channel']
	    	result['data'] = data
	    	return done(null,result)
	    })
	})	
}

TvSchedule.detailScheduleCheck = function(channelData,done){
	let option = {}
	option['url'] = 'http://m.skbroadband.com/content/realtime/Channel_List.do?key_depth1='+channelData['key_depth1']+'&key_depth2='+channelData['key_depth2']+'&key_depth3='
	option['encoding'] = 'binary'

	request(option, function(error, response, body) {
	    if (error) throw error;
	    var strContents = new Buffer(body, 'binary');
	    var iconv = new Iconv('euc-kr', 'utf-8//translit//ignore');
	    strContents = iconv.convert(strContents).toString()
	    var $ = cheerio.load(strContents);
	    let results = new Array()
	    $("#dawn").find(".title").each(function(){
	        let initFirstData = $(this).find("span").not(".caption").not(".fullHD").not(".nowon").text()
	        results.push(initFirstData)
	    })
	    return done(null,results)
	})
}

TvSchedule.detailScheduleInit = function(channelData,done){
	let option = {}
	let result = {}
	let datas = new Array()
	option['url'] = 'http://m.skbroadband.com/content/realtime/Channel_List.do?key_depth1='+channelData['key_depth1']+'&key_depth2='+channelData['key_depth2']+'&key_depth3='
	option['encoding'] = 'binary'

	request(option, function(error, response, body) {
	    if (error) throw error;
	    var strContents = new Buffer(body, 'binary');
	    var iconv = new Iconv('euc-kr', 'utf-8//translit//ignore');
	    strContents = iconv.convert(strContents).toString()
	    var $ = cheerio.load(strContents);
	    let results = new Array()
	    $("#dawn").find(".title").each(function(){
	        let initFirstData = $(this).find("span").not(".caption").not(".fullHD").not(".nowon").text()
	        results.push(initFirstData)
	    })
	    result['channel'] = channelData['channel']
	    result['data'] = results
	    return done(null,result)
	})
}

module.exports = TvSchedule;