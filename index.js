const config = require('./config');
const app = require('./src/api');

const env = config('app.env');
const port = config('app.port');

app.listen(port, () => {
    console.log(`Started ${env} server on port ${port}`);
});
