#!/usr/bin/env node

var moment = require('moment-timezone');

var us_shortcuts = {
  EST:'US/Eastern',
  EDT:'US/Eastern',
  CST:'US/Central',
  CDT:'US/Central',
  MST:'US/Mountain',
  MDT:'US/Mountain',
  PST:'US/Pacfic',
  PDT:'US/Pacfic',
  AKST:'US/Alaska',
  AKDT:'US/Alaska',
  HAST:'US/Hawaii',
  IST:'Asia/Kolkata'
}

function getTimeZoneName(abbr) {
  var tz = moment.tz.zone(abbr) ? moment.tz.zone(abbr).name : us_shortcuts[abbr.toUpperCase()];
  if( tz ) return [tz];

  var tz_abbr = []
  moment.tz.names().map((name)=>{
    var zone = moment.tz.zone(name);
    if(zone.abbrs.indexOf(abbr) != -1) {
      tz_abbr.push(zone.name);
    }
  });
  if(tz_abbr.length == 0) tz_abbr = ['UTC'];
  return tz_abbr;
}

function parseTime(timeString) {
    if (timeString == '') return null;

    var time = timeString.match(/^(\d+)(:(\d\d))?\s*((a|(p))m?)?\s*(\w{3})?\s*(\w{3})?$/i);

    if (time == null) return null;

    var hours = parseInt(time[1],10);
    if (hours == 12 && !time[6]) {
          hours = 0;
    }
    else {
        hours += (hours < 12 && time[6])? 12 : 0;
    }
    var baseDate = new Date();
    baseDate.setHours(hours);
    baseDate.setMinutes(parseInt(time[3],10) || 0);
    baseDate.setSeconds(0, 0);
    if( !time[8] ) {
      if(time[7]) {
        time[8] = time[7];
        time[7] = 'UTC';
      } else {
        time[7], time[8] = 'UTC';
      }
    }

    var baseDateString = moment(baseDate).format("YYYY-MM-DD HH:mm:ss")
    var from_tz = getTimeZoneName(time[7])[0];
    var from_date = moment.tz(baseDateString, from_tz);
    var to_tz = getTimeZoneName(time[8])[0];
    var to_date = from_date.tz(to_tz);
    return to_date;
}

var time = parseTime(process.argv.slice(2).join(" "));
if(time) console.log(time.format("HH:mm:ssZ"));
