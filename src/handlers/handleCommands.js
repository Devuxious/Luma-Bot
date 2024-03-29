const {
    REST
} = require('@discordjs/rest');
const {
    Routes
} = require('discord-api-types/v9');
const fs = require('node:fs');

const clientId = '991389222323892374';
const guildId = '994981064223232000';

const local = false; /* Change to false to deploy commands globally. */

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        for (folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`)

                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
            }
        }
        const rest = new REST({
            version: '9'
        }).setToken(process.env.token);


        (async () => {
            try {
                console.log('Started refreshing application (/) commands.');

                /*await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId), {
                        body: client.commandArray
                    },*/
                    await rest.put((local ? Routes.applicationGuildCommands(clientId, guildId) : Routes.applicationCommands(clientId)),
                        { 
                            body: client.commandArray 
                        },
                );

                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        })();
    };
};