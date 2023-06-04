import { createHmac } from 'crypto';
// import moment from 'moment';
// import { localStorage } from '../storage/index.js';


/**
 * function to generate a random hexadecimal string of given length 
 * */
export function GenerateRandomString(length) {
    let chars = '0123456789abcdef'.split('');
    let result = '';
    const { random, floor } = Math;
    for (var i = 0; i < length; i++) {
        result += chars[floor(random() * chars.length)];
    }
    return result;
}
export function HrsToMilliseconds(hrs) {
    return hrs * 60 * 60 * 1000;
}


export function GenerateHash(text, salt) {
    return createHmac("sha256", salt)
        .update(text)
        .digest("hex");
}
export function IsPureObj(data) {
    return typeof data === 'object' && typeof data !== 'function'
}

export function GetMonth(start_date, date) {
    // let start_date_moment = moment(start_date, 'MMM-YYYY');
    // let date_moment = moment(date, 'MMM-YYYY')
    // return parseInt(date_moment.diff(start_date_moment, 'months'));// just to save from crashing
    // Add months to the start date and return month
}

export function GetCollection(collection_name) {
    // let collection = localStorage.getItem(collection_name);
    // if (collection) {
    //     collection = JSON.parse(collection);
    // } else {
    //     collection = []
    // }
    // return collection;
}
export function SetCollection(collection, collection_data) {
    // localStorage.setItem(collection, JSON.stringify(collection_data));
}