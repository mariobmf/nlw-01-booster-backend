import express from 'express';

const app = express();

app.get('/', (request, response) => {
  return response.send('Initial Commit');
});

app.listen(3333);
