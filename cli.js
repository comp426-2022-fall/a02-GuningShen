#!/usr/bin/env node

// Dependencies
import minimist from 'minimist'; //minimist is the parser on any args on the command line
import moment from 'moment-timezone';
import fetch from 'node-fetch';

const args = minimist(process.argv.slice(2));

// default action
if (args.h) {
    try {console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.
    `)
    process.exit(0);
    } 
    catch (err) {
        process.exit(1);
    }
}


let latitude = '35';
let longitude = '-79';

if (args.n) {
    latitude = args.n;
} else if (args.s) {
    latitude = '-' + args.s;
} else {
    console.log("Latitude must be in range");
    process.exit(0);
}
if (args.e) {
    longitude = args.e;
} else if (args.w) {
    longitude = '-' + args.w;
} else {
    console.log("Longitude must be in range");
    process.exit(0);
}

let timezone = moment.tz.guess();
if (args.z) {
    timezone = args.z;
}

const base_url = 'https://api.open-meteo.com/v1/forecast'
const data_string = 'latitude=' + latitude + '&longitude=' + longitude + '&hourly=temperature_2m,windspeed_180m,winddirection_180m&daily=weathercode,precipitation_hours&temperature_unit=fahrenheit&timezone=' + timezone
const url = base_url + '?' + data_string;

const response = await fetch(url);
const data = await response.json();

if (args.j) {
    console.log(data);
    process.exit(0);
}

let days;
if (args.d != null) {
    days = args.d;
} else {
    days = 1;
}

if (data.daily.precipitation_hours[days] != 0.0) {
    console.log("You might need your galoshes");
} else{
    console.log("You will not need your galoshes");
}

if (days == 0) {
    console.log("today.")
} else if (days > 1) {
    console.log("in " + days + " days.")
} else {
    console.log("tomorrow.")
}