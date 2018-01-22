const http   = require('http');
const static = require('node-static');
const file   = new static.Server('./dist', { gzip: true });

http.createServer((request, response) => {
	request.addListener('end', () => {
		file.serve(request, response);
	}).resume();
}).listen(8080);

console.log('SERVER LISTENING ON PORT :8080');