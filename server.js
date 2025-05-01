const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = 1145;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files (like index.html)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'pages')));

app.post('/create', (req, res) => {
  const { url, name } = req.body;

  // Sanitize name for safety
  const safeName = name.replace(/[^a-z0-9_-]/gi, '');
  const pagePath = path.join(__dirname, 'pages', `${safeName}.html`);

  // Check for duplicate
  if (fs.existsSync(pagePath)) {
    return res.status(400).send('Name already exists. Choose another.');
  }

  const fullUrl = `https://${url}`;
  const iframePage = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
        }
        iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
      </style>
    </head>
    <body>
      <iframe src="/active/embed.html?url=${encodeURIComponent(fullUrl)}" allowfullscreen></iframe>
    </body>
    </html>
  `;

  fs.writeFileSync(pagePath, iframePage);
  res.redirect(`/${safeName}`);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
