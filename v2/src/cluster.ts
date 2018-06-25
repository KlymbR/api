import * as recluster from 'recluster';
import * as path from 'path';

const cluster = recluster(path.join(__dirname, 'index.js'));
cluster.run();

process.on('SIGUSR2', () => {
    console.log('Got SIGUSR2, reloading cluster...');
    cluster.reload();
});

console.log('spawned cluster, kill -s SIGUSR2', process.pid, 'to reload');