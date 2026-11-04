// Copia del juego el atlas de Pepe (arte oficial de CR) para el retrato y las poses del tráiler.
import { writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GAME = process.env.GAME || resolve(HERE, '../../../coloresruidosos.github.io/juegos/mexico-vs-jose-madero');
const { PEPE_META, PEPE_PNG } = await import(pathToFileURL(resolve(GAME, 'src/data/pepe-atlas.js')));
await mkdir(resolve(HERE, 'assets'), { recursive: true });
await writeFile(resolve(HERE, 'assets/pepe.png'), Buffer.from(PEPE_PNG.split(',')[1], 'base64'));
await writeFile(resolve(HERE, 'assets/pepe.json'), JSON.stringify(PEPE_META));
console.log('assets/pepe.png', Object.keys(PEPE_META.frames).length, 'poses');
