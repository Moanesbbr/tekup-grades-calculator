const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main calculator page at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'bookmarklet.html'));
});

app.listen(PORT, () => {
  console.log(`Tekup Grades Calculator running at http://localhost:${PORT}`);
}); 