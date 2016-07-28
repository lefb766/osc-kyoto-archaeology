import Twitter = require('twitter');
import fs = require('fs');
import path = require('path');
import yargs = require('yargs');

function main() {
    const config = require('./config.json') as Config;
    const saveDir = 'gathered_tweets';

    const argv = yargs
        .default('t', '#OSC京都考古学')
        .argv as Args;

    let client = new Twitter(config);

    try {
        fs.accessSync(saveDir);
    } catch (e) {
        fs.mkdirSync(saveDir);
    }

    client.stream('statuses/filter', {track: argv.t}, (stream) => {
        stream.on('data', tweet => {
            if (!tweet.retweeted_status) { // not a retweet
                saveTweetTo(saveDir, tweet);
                console.log([tweet.user.screen_name, ': ', tweet.text].join(''));
            }
        });
    });
}

declare module 'fs' {
    function writeFile(fd: number, content: any, callback :any);
}

interface Args {
    t: string;
}

interface Config {
    consumer_key: string;
    consumer_secret: string;
    access_token_key: string;
    access_token_secret: string;
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

main();
