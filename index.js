const http = require('http');
const express = require('express');
const axios = require('axios');
const { urlencoded } = require('body-parser');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();
app.use(urlencoded({ extended: false}));

const PORT = 3000;

const url = 'https://pokeapi.co/api/v2/pokemon';
const pokemonCount = 151;

app.post('/sms', async (req, res) => {
    const twiml = new MessagingResponse();

    console.log(`Incoming message from ${req.body.From}: ${req.body.Body}`);

    const pokemonData = await fetchPokemonData(generateRandomNumber());
    const pokemonName = pokemonData.name;
    twiml
        .message(`You got: ${pokemonName.toUpperCase()}!`)
        .media(`${pokemonData.front_default}`);

    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
});

http.createServer(app).listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

function generateRandomNumber() {
    return Math.floor(Math.random() * Math.floor(pokemonCount));
}

const fetchPokemonData = async (pokeNumber) => {
    try {
        const { data: {name, sprites: {front_default}}} = await axios.get(`${url}/${pokeNumber}`);
        const pokemonData = { name, front_default };
        return pokemonData;
    } catch(error) {
        console.log(error);
    }
}