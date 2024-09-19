const fs = require('fs');
const path = require('path');


const serviceWorkerFile = fs.createReadStream(path.join(process.cwd(), 'node_modules/web-push-notifications/lib/service-worker.js'));
const writeServiceWorkerFile = fs.createWriteStream(path.join(process.cwd(), 'build', 'pushwoosh-service-worker.js'));

serviceWorkerFile.pipe(writeServiceWorkerFile);

