var Discord = require('discord.js');
var bot = new Discord.Client();
var WebSocket = require('ws');

var wss = new WebSocket.Server({
    port: 8080
});

var ws = new WebSocket('');

bot.on('ready', () => {
    console.log('Logged in succesfully!');
});

bot.on('error', () => {
    console.log('Please insert token or look out for another reason of the error');
})

bot.on('message', msg => {
    
});

bot.login('');