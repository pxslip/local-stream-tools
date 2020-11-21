import express from 'express';

const app = express();

app.use(express.static('dist'));

/**
 * Initialize a proxy server that loads different parts of this application in a way OBS can read
 */
export default function() {
  app.listen(30303);
}
