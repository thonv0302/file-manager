
const path = require('path');
module.exports = {
    entry: 'server.js', // Điểm bắt đầu của ứng dụng  
    output: { filename: 'bundle.js', path: path.resolve(__dirname, 'dist') }
};