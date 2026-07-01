import { app } from './app.js';

const port = Number(process.env.API_PORT ?? 3000);

app.listen(port, () => {
  console.log(`Aizome API listening on http://localhost:${port}`);
});
