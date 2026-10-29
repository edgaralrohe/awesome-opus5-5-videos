import { startServer } from './server.mjs';

const port = Number(process.env.PORT || 5173);
await startServer(port);
console.log(`Preview en http://localhost:${port}  (espacio = play/pausa, ?t=12 para saltar)`);
