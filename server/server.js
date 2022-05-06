const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const db = require('./config/connection');
const {ApolloServer} = require("apollo-server-express");
const {typeDefs, resolvers} = require("./schemas");
const {authMiddleware} = require("./utils/auth");

const app = require('./app')
const PORT = process.env.PORT || 3001;

// Apollo server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
});

async function startApollo() {
    await server.start()
    server.applyMiddleware({app});
}

startApollo();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
}


if (process.env.NODE_ENV === 'production') app.use(express.static(path.join(__dirname, '../client/build')));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
