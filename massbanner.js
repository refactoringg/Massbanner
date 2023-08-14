const { Client, GuildMember } = require('discord.js-selfbot-v13');
const client = new Client({});
require('dotenv').config();

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.username}`);
})

function percentage(partialValue, totalValue) {
    return (100 * partialValue) / totalValue;
} 

client.on('message', async (message) => {
    if(!message.content.startsWith("!destroy")) return;
    var sentCount = 0;
    
    let members = await message.guild.members.fetch({ force: true }); 
    var failed = 0

    members.forEach(async member => {
        if(member.id === message.author.id) {
            console.log('Message author. Cannot kick')
        } else {
            await member.ban({ reason: "ban all" }).catch(async error => {
                await message.author.send(
                  `${message.author} Could not be banned because: ${error}`
                );
                failed++;
            });
            sentCount++;
            await message.author.send(`**Status** [${sentCount}/${message.guild.memberCount - 1}] ${percentage(sentCount, message.guild.memberCount - 1)}%`)
        }

        if(sentCount >= ((message.guild.memberCount - failed) - 1)) {
            await message.author.send("**Action completed successfully!**")
        }
    });
});

console.log('Logging in')
client.login(process.env.TOK);