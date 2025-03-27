const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  try {
    const { url, method, headers, body } = req.body;
    
    const response = await axios({
      method,
      url,
      headers,
      data: body
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message 
    });
  }
});

module.exports = router; 