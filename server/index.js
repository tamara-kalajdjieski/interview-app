const express = require('express');
const axios = require('axios');
//const { corsMiddleware } = require('./middleware/cors/cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 8081;

// app.use(corsMiddleware); //try with cors()
app.use(cors());
app.use('/api', createProxyMiddleware({
    target: 'https://proxy-api-407662926597.us-central1.run.app',  
    changeOrigin: true,
    pathRewrite: {
      '^/api': '',
    },
    onProxyRes: (proxyRes, req, res) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    }
  }));

app.get('/', (req, res) => {
    res.send('Welcome to CORS server!');
});

app.post('/search', async (req, res) => {
    const payload = req.body;
    try {
        const response = await axios.post(`https://proxy-api-407662926597.us-central1.run.app/search`, payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-encoding': '*',
                },
            })
        res.json(response.data);
    } catch (error) {
        console.error('Error making the request to the main API:', error);
        res.status(500).json({ error: 'Failed to fetch search results' });
    }
});

app.get('/record/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            status: 400,
            message: 'ID must be present',
        });
    }

    try {
        const response = await axios.get(
            `https://proxy-api-407662926597.us-central1.run.app/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-encoding': '*',
                },
            }
        );
        res.json(response.data);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

app.post('/bulk-get', async (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'ids must be an array with at least one ID' });
    }
    try {
        const response = await axios.post(`https://proxy-api-407662926597.us-central1.run.app/bulk-get/`, {
            ids: ids,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'accept-encoding': '*',
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching bulk data:', error);
        res.status(500).json({ error: 'Failed to fetch bulk data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
