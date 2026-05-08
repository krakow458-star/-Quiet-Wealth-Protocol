import fs from 'fs';
const stats = fs.statSync('public/portal.mp4');
console.log(stats);
