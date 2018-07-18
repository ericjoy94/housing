const express = require('express'),
          app = express(),
     template = require('./views/template')
         path = require('path'),
         spdy = require('spdy'),
         fs = require('fs'),
         port = 3300

// Serving static files
app.use('/assets', express.static(path.resolve(__dirname, 'assets')));
app.use('/media', express.static(path.resolve(__dirname, 'media')));

// hide powered by express
app.disable('x-powered-by');
// start the server
// app.listen(process.env.PORT || 3000);

// our apps data model
const data = require('./assets/data.json');

let initialState = {
  isFetching: false,
  apps: data
}

//SSR function import
const ssr = require('./views/server');

const options = {
  key: fs.readFileSync(__dirname + '/http2-express/server.key'),
  cert:  fs.readFileSync(__dirname + '/http2-express/server.crt')
}

// server rendered home page
app.get('/', (req, res) => {
 
  const { preloadedState, content}  = ssr(initialState)
  const response = template("Server Rendered Page", preloadedState, content)
  res.setHeader('Cache-Control', 'assets, max-age=604800')
  res.send(response);
});

// Pure client side rendered page
app.get('/client', (req, res) => {
  let response = template('Client Side Rendered page')
  res.setHeader('Cache-Control', 'assets, max-age=604800')
  res.send(response);
});

// tiny trick to stop server during local development

  app.get('/exit', (req, res) => {
    if(process.env.PORT) {
      res.send("Sorry, the server denies your request")
    } else {
      res.send("shutting down")
      process.exit(0)
    }

  });

  spdy
  .createServer(options, app)
  .listen(port, (error) => {
    if (error) {
      console.error(error)
      return process.exit(1)
    } else {
      console.log('Listening on port: ' + port + '.')
    }
  })
