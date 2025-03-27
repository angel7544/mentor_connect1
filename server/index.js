const proxyRouter = require('./routes/proxy');

// Add proxy route
app.use('/api/proxy', proxyRouter); 