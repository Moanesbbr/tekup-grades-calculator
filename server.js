const express = require('express');
const path = require('path');
const app = express();

// Add CORS headers for development
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath, stat) => {
        if (filePath.endsWith('.js')) {
            res.set({
                'Content-Type': 'application/javascript; charset=utf-8',
                'Cache-Control': 'no-cache'
            });
        }
    }
}));

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'public', 'bookmarklet.html'), (err) => {
    if (err) {
      next(err);
    }
  });
});

app.get('/assets/main.js', (req, res) => {
    res.type('application/javascript');
    res.sendFile(path.join(__dirname, 'public', 'assets', 'main.js'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;