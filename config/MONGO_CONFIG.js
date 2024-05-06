'use strict';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import tunnel from 'tunnel-ssh';
const dotenv = require('dotenv').config();

const {
    MONGO_DB_NAME = '',
    MONGO_HOSTS = '',
    MONGO_USERNAME = '',
    MONGO_PASSWORD = '',
    MONGO_REPLICASET,
    MONGO_READ_PREFERENCE,
    MONGO_PEM_PATH = '',
    TUNNEL_ENVIRONMENT = false,
    SSH_USERNAME = '',
    SSH_PRIVATE_KEY = '',
    SSH_HOST = '',
    SSH_PORT = '',
    SSH_DESTINATION_HOST = '',
    SSH_DESTINATION_PORT = '',
    SSH_LOCAL_HOST = '',
    SSH_LOCAL_PORT = '',
} = process.env;

let REQUIRED_CONFIG = ['MONGO_DB_NAME', 'MONGO_HOSTS', 'MONGO_PEM_PATH'];

if (TUNNEL_ENVIRONMENT) {
    REQUIRED_CONFIG = [
        ...REQUIRED_CONFIG,
        'SSH_USERNAME',
        'SSH_PRIVATE_KEY',
        'SSH_HOST',
        'SSH_PORT',
        'SSH_DESTINATION_HOST',
        'SSH_DESTINATION_PORT',
    ];
}

REQUIRED_CONFIG.forEach((key) => {
    if (!process.env[key]) {
        console.error('[Error] Missing MongoDB Config: ' + key);
        return process.exit(1);
    }
});

let CONNECTION_URI;
if (TUNNEL_ENVIRONMENT) {
    CONNECTION_URI = `mongodb+srv://${SSH_LOCAL_HOST}:${SSH_LOCAL_PORT}/${MONGO_DB_NAME}`;
} else {
    const MONGO_CREDENTIALS = `${MONGO_USERNAME}:${MONGO_PASSWORD}@`;
    CONNECTION_URI = `mongodb+srv://${MONGO_CREDENTIALS}${MONGO_HOSTS}/${MONGO_DB_NAME}`;
}
console.log(CONNECTION_URI);
let CONFIG = {
    DBNAME: MONGO_DB_NAME,
    CONNECTION_URI,
    OPTIONS: {
        sslValidate: true,
        ssl: true,
        // sslCA: [fs.readFileSync(path.join(path.resolve() + MONGO_PEM_PATH))],
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        promiseLibrary: Promise,
        poolSize: 10,
        retryWrites: false,
        replicaSet: MONGO_REPLICASET,
        readPreference: MONGO_READ_PREFERENCE,
    },
    SSH_TUNNEL_CONFIG: {
        username: SSH_USERNAME,
        privateKey: TUNNEL_ENVIRONMENT
            ? fs.readFileSync(path.join(path.resolve() + SSH_PRIVATE_KEY))
            : '',
        host: SSH_HOST,
        port: parseInt(SSH_PORT),
        dstHost: SSH_DESTINATION_HOST,
        dstPort: parseInt(SSH_DESTINATION_PORT),
        localHost: SSH_LOCAL_HOST,
        localPort: parseInt(SSH_LOCAL_PORT),
    },
};

mongoose.connection.on('connected', () => {
    console.info('[Info] Mongo Connection Established');
});
mongoose.connection.on('reconnected', () => {
    console.info('[Info] Mongo Connection Re-established');
});
mongoose.connection.on('disconnected', () => {
    console.warn('[Error] Mongo Connection Disconnected');
});
mongoose.connection.on('close', () => {
    console.warn('[Info] Mongo Connection Closed');
});
mongoose.connection.on('error', (error) => {
    console.error('[Error] Mongo Connection ERROR: ', error);
    throw error;
});

// if (process.env.APP_ENVIROMENT === 'dev') { mongoose.set('debug', true) }

const mongoConnect = async () => {
    if (TUNNEL_ENVIRONMENT) {
        await tunnel(CONFIG.SSH_TUNNEL_CONFIG);
        await mongoose.connect(CONNECTION_URI, {
            sslValidate: true,
            ssl: true,
            sslCA: [
                fs.readFileSync(path.join(path.resolve() + MONGO_PEM_PATH)),
            ],
            useNewUrlParser: true,
            useUnifiedTopology: true,
            authMechanism: 'SCRAM-SHA-1',
            auth: {
                user: MONGO_USERNAME,
                password: MONGO_PASSWORD,
            },
            tlsAllowInvalidHostnames: true,
            tlsAllowInvalidCertificates: true,
            useCreateIndex: true,
            retryWrites: false,
        });
    } else {
        await mongoose.connect(CONNECTION_URI, CONFIG.OPTIONS);
    }
};
const MONGO_CONFIG = { CONFIG, mongoConnect };
export default MONGO_CONFIG;
