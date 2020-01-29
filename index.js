var Discord = require('discord.js');
var bot = new Discord.Client();
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var http = new XMLHttpRequest();
var axios = require('axios');
var qs = require('querystring');
var FormData = require('form-data');
var data = new FormData();
var loginconfig = require('./config.json')



var token;
var commands;

bot.on('ready', async () => {
    console.log('Logged in succesfully!');
    token = await getToken();

    axios.get('http://localhost:3000/')
        .then((result) => {
            bot.guilds.forEach(element => {
                var channelId;
                var channels = element.channels;

                channelloop:
                for (var c of channels) {
                    var channelType = c[1].type;
                    if (channelType === 'text') {
                        channelId = c[0];
                        break channelloop;
                    }
                }
                element.channels.get(channelId).send(result.data);
            });
        })

    var config = {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    }
    var requestbody = {
        Bot_id: '1'
    }
    axios.post('http://localhost:3000/getbotcommands', JSON.stringify(requestbody), config)
        .then((result) => {
            commands = result.data;
            console.log(commands)
            bot.guilds.forEach(element => {
                var channelId;
                var channels = element.channels;

                channelloop:
                for (var c of channels) {
                    var channelType = c[1].type;
                    if (channelType === 'text') {
                        channelId = c[0];
                        break channelloop;
                    }
                }
                var i = 0;
                var j = 0;
                var allcommandsstring = "";
                element.channels.get(channelId).send("All Commands, @everyone:");
                commands.forEach(c => {
                    i = i + 1;
                    allcommandsstring += i + ": " + commands[j].Command + "\n";
                    j = j + 1;
                    console.log(allcommandsstring);
                });
                element.channels.get(channelId).send(allcommandsstring);
            });
        })
        .catch((err) => {
            console.log(err.response.data.message);
        })
});

bot.on('error', () => {
    console.log('Please insert token or look out for another reason of the error');
})


bot.on('message', msg => {
    console.log('received msg');
    if (msg.author.bot) {
        console.log('msg send by bot');
    }
    else {
        var requestbody = {
            Bot_id: '1',
            Command: msg.content
        }
        var config = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        }
        axios.post('http://localhost:3000/BotCommand', JSON.stringify(requestbody), config)
            .then((result) => {
                console.log(result.data);
                var resultstring = "" + result.data;
                if (resultstring === "0") {
                    console.log(result.data);
                }
                else {
                    msg.channel.send(result.data);
                }
            })
    }

});

bot.login('');//Token in here

function getToken() {
    return new Promise(res => {
        var requestbody = {
            username: 'Admin', //username in here
            password: 'universal' //password in here
        }

        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        axios.post('http://localhost:3000/login', JSON.stringify(requestbody), config)
            .then((result) => {
                console.log(result.data.token);
                res(result.data.token);
            })
            .catch((err) => {
                console.log(err);
            })
    })
}