const express = require('express');
const path = require('path');
const app = express();

// Add error handling for static files
app.use(express.static(path.join(__dirname, 'public'), { fallthrough: true }));

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'public', 'bookmarklet.html'), (err) => {
    if (err) {
      next(err);
    }
  });
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