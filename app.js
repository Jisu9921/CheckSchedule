'use strict'
const fs = require('fs')
const request = require('request')
const Iconv  = require('iconv').Iconv
const cheerio = require('cheerio')
const schedule = require('node-schedule')
const winston = require('winston')
const HashMap = require('hashmap')

const TvSchedule = require('./model/TvScheduleCheck.js')
const ChannelData = require('./ChannelData.js')

const env = process.env.NODE_ENV || 'development';
const logDir = 'log';
let scheduletieme = '*/5 9-22 * * 0-7'

let todayTvData = new HashMap()

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const tsFormat = () => (new Date()).toLocaleTimeString()
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'info'
    }),
    new (require('winston-daily-rotate-file'))({
      filename: `${logDir}/-results.log`,
      timestamp: tsFormat,
      datePattern: 'yyyy-MM-dd',
      prepend: true,
      level: env === 'development' ? 'verbose' : 'info'
    })
  ]
});

let scheduleInitData = new Array()

if(scheduleInitData.length == 0){
  detailScheduleInit(function(err){
    setTimeout(function(err){
      let json = JSON.stringify(scheduleInitData)
      fs.writeFile('tvData.json',json, function(err){
      if (err){
        console.log('file write err')
        logger.info('file write err')
      };
        console.log('saved data');
        logger.info('saved data');
      });  
    },5000) 
  })
}

if(todayTvData['_count'] != ChannelData.channelData.length){
  initData()
}

let checkSchedule = schedule.scheduleJob(scheduletieme,function(){
  ChannelData.channelData.forEach(function(value,index){
    TvSchedule.scheduleCheck(ChannelData.channelData[index],function(err,result){
      if(err){
        console.log('Schedule check err')
        logger.info('Schedule check err')
      }
      if(result['data'] !== todayTvData.get(result['channel'])){
        console.log('changed schedule'+result['channel'])
        logger.info('changed schedule'+result['channel'])
        request(slackUrl,function(error,res,body){
          if(error){
            console.log('salck error')
            logger.info('salck error')
          }
          console.log('salck ok')
          logger.info('salck ok')
        });
      }else{
        console.log('pass')
        logger.info('pass')
      }
    })
  })
})

function initData(){
  ChannelData.channelData.forEach(function(value,index){
    TvSchedule.scheduleCheck(ChannelData.channelData[index],function(err,result){
      if(err){
        console.log('Schedule init err')
        logger.info('Schedule init err')
      }
      todayTvData.set(result['channel'],result['data'])
    })
  })
}

function detailScheduleInit(done){
   scheduleInitData = new Array()
   ChannelData.channelData.forEach(function(value,index){
    TvSchedule.detailScheduleInit(ChannelData.channelData[index],function(err,result){
      if(err){
        console.log('Schedule init err')
        logger.info('Schedule init err')
      }
      scheduleInitData.push(result)
    })
  })
  return done(null,null) 
}







