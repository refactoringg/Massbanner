const { Client, GuildMember, MessageEmbed } = require('discord.js-selfbot-v13');
const client = new Client({});
require('dotenv').config();

const express = require('express')
const app = express()
const port = 3000
let statusString = "NONE";
let percentString = "0%";


client.on('ready', async () => {
  console.log(`Logged in as ${client.user.username}`);
  app.listen(port, () => console.log('Started server'));
})

function percentage(partialValue, totalValue) {
    return (100 * partialValue) / totalValue;
} 

client.on('message', async (message) => {
    let members = await message.guild.members.fetch({ force: true }); 
    var failed = 0;

    if(message.content.startsWith("!membercount")) {
        await message.channel.send(`[**Member count**] ${message.guild.memberCount}`)
    }
    var count = 1
    if(message.content.startsWith("!memberlist")) {
        members.forEach(async (member) => {
            message.channel.send(`(${count}) [**${member.displayName}**]`);
            count++;
        });
    }
    if(!message.content.startsWith("!destroy")) return;
    
    var sentCount = 0;
    let msg 
    await message.author.send(`**[Stats]** [${sentCount}/${message.guild.memberCount - 1}] ${percentage(sentCount, message.guild.memberCount - 1)}%`).then((message2) => {
        msg = message2;
    })

    members.forEach(async member => {
        if(member.id === message.author.id) {
            console.log('Message author failed to kick')
        } else {
            const embed = new Discord.MessageEmbed()
                .setColor('#FF0000')
                .setTitle('Banned from Apple Client')
                .setDescription("Don't join back even if asked by the owner.")
                .addFields(
                    { name: 'Why?', value: 'Client could be a RAT. Owner ratted others.', inline: true },
                )
            
            await member.send(embed).catch(async error => {
                console.log("Error occured whilst trying to send message to: " + member.displayName)
            });
            await member.ban({ reason: "Appu26j is a retard" }).catch(async error => {
                failed++;
            }).then(() => {
                sentCount++;
                statusString = `[${sentCount}/${message.guild.memberCount - 1}]`;
                percentString = `${percentage(sentCount, message.guild.memberCount - 1).toFixed(1)}%`
                msg.edit(`**[STATS]** [${sentCount}/${message.guild.memberCount - 1}] ${percentage(sentCount, message.guild.memberCount - 1).toFixed(1)}%`)
            });
        }

        if(sentCount >= ((message.guild.memberCount - failed) - 1)) {
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Stats')
                .setDescription('Massbanner statistics')
                .addFields(
                    { name: 'Banned', value: banned, inline: false },
                    { name: 'Failed', value: failed, inline: false },
                )
            
            msg.edit(embed);
        }
    });
});

app.get('/data', (req, res) => {
    res.json({ "status": statusString, "percent": percentString });
});

console.log('Logging in')
client.login('MTAyMTA2NjUzODY0MTUzMDkxMg.G_-lWN.tUv5C8oKhQPWHub2rZF_SQ7O6mWOVoNyqGIA68');