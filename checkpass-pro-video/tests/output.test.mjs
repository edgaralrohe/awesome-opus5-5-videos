// T16: el MP4 entregable cumple la spec (NFR "Entrega").
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const MP4 = 'out/checkpass-pro-30s.mp4';

test('MP4: 1080×1920, 30 fps, 30 s ±1 frame, H.264 yuv420p, <20 MB, con audio', () => {
  assert.ok(fs.existsSync(MP4), 'ejecuta primero `npm run render`');
  const info = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', MP4]));
  const v = info.streams.find(s => s.codec_type === 'video');
  assert.equal(v.codec_name, 'h264');
  assert.equal(v.pix_fmt, 'yuv420p');
  assert.equal(v.width, 1080);
  assert.equal(v.height, 1920);
  assert.equal(v.r_frame_rate, '30/1');
  assert.ok(Math.abs(+v.duration - 30) <= 1 / 30 + 1e-6, `duración ${v.duration}`);
  assert.ok(info.streams.some(s => s.codec_type === 'audio'));
  assert.ok(+info.format.size < 20 * 1024 * 1024, `${info.format.size} bytes`);
});
