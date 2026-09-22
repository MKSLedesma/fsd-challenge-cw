const path = require('path');
const dotenv = require('dotenv');

const envFiles = [
    path.join(__dirname, '../../.env'),
    path.join(__dirname, '../../atlas-credentials.env')
];

for (const envFile of envFiles) {
    dotenv.config({ path: envFile, override: false });
}
