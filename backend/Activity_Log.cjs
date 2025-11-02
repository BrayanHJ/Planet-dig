const express = require('express');
const router = express.Router();
const db = require('./db.cjs');
const { autenticarUsuario } = require('./auth.cjs');

