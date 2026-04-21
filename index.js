const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const BETFAIR_API = 'https://api.betfair.com/exchange/betting/rest/v1.0';
const BETFAIR_AUTH = 'https://identitysso.betfair.com/api/login';

// LOGIN
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const response = await fetch(
      `${BETFAIR_AUTH}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
      {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'X-Application': '1' }
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// BETFAIR API PROXY
app.post('/api/betfair/:endpoint', async (req, res) => {
  try {
    const { endpoint } = req.params;
    const { sessionToken, appKey, params } = req.body;
    const response = await fetch(`${BETFAIR_API}/${endpoint}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authentication': sessionToken,
        'X-Application': appKey || '1'
      },
      body: JSON.stringify(params)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
