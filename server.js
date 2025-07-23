const express = require('express');
const path = require('path');

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main calculator page at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'bookmarklet.html'));
});

module.exports = app; 