import Twitter = require('twitter');
import fs = require('fs');
import path = require('path');

declare module 'fs' {
    function writeFile(fd: number, content: any, callback :any);
}

interface Config {
    consumer_key: string;
    consumer_secret: string;
    access_token_key: string;
    access_token_secret: string;
}

const config = require('./config.json') as Config;

let client = new Twitter(config);

const saveDir = 'gathered_tweets';
try {
    fs.accessSync(saveDir);
} catch (e) {
    fs.mkdirSync(saveDir);
}

function saveTweetTo(dir: string, tweet: any) {
    fs.open(path.join(dir, tweet.id_str + '.json'), 'w', (err, fd) => {
        if (err) {
            console.log("fs.open: " + typeof err);
        } else {
            fs.writeFile(fd, JSON.stringify(tweet), console.log.bind(console));
        }
    })
}

client.stream('statuses/filter', {track: '#OSC京都考古学'}, (stream) => {
    stream.on('data', tweet => {
        if (!tweet.retweeted_status) { // not a retweet
            saveTweetTo(saveDir, tweet);
            console.log([tweet.user.screen_name, ': ', tweet.text].join());
        }
    });
});