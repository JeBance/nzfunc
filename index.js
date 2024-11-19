const fs = require('fs');
const http = require('http');
const crypto = require('crypto');

module.exports.hasJsonStructure = function (string) {
	if (typeof string !== 'string') return false;
	try {
		const result = JSON.parse(string);
		const type = Object.prototype.toString.call(result);
		return type === '[object Object]' 
			|| type === '[object Array]';
	} catch(e) {
//		console.log(e);
	}
	return false;
};

module.exports.hasPGPstructure = function (string) {
	if (typeof string !== 'string') return false;
	try {
		if ((data.slice(0,27) === '-----BEGIN PGP MESSAGE-----')
		&& (data.slice((data.length - 26),-1) === '-----END PGP MESSAGE-----')) {
			return true;
		}
	} catch(e) {
//		console.log(e);
	}
	return false;
};

module.exports.getHASH = function (string, algorithm) {
	let hash = crypto.createHash('md5').update(string).digest('hex');
	return hash;
};

module.exports.getHMAC = function (string, algorithm, secret) {
	try {
		let hash, hmac;
		hmac = crypto.createHmac(algorithm, secret);    
		hmac.write(string);
		hmac.end();
		hash = hmac.read().toString('hex');
		return hash;
	} catch(e) {
		console.log(e);
	}
	return false;
};

module.exports.isUrlValid = function (string) {
	try {
		const regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
		return regex.test(string);
	} catch(e) {
		console.log(e);
		return false;
	}
};

module.exports.isIPv4withTCPportValid = function (string) {
	try {
		const regex = /^((?:(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?:\.(?!\:)|)){4})\:(?!0)(\d{1,4}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/g;
		return regex.test(string);
	} catch(e) {
		console.log(e);
		return false;
	}
};

module.exports.doRequest = async (options, data = null) => {
	return new Promise ((resolve, reject) => {
		let req = http.request(options);

		req.on('response', res => {
			resolve(res);
		});

		req.on('error', err => {
			reject(err);
		});

		if (data !== null) req.write(data);
		req.end();
	}); 
}

module.exports.getResponse = async (res) => {
	return new Promise ((resolve, reject) => {
		let data = [];

		res.on('data', chunk => {
			data.push(chunk);
		});

		res.on('end', () => {
			resolve(Buffer.concat(data).toString());
		});
	});
}

module.exports.getProgramFiles = (path) => {
	let files = { index: {}, favicon: {} };
	try {
//		console.log('Checking "index.html" file...');
		files.index = fs.readFileSync(path + '/index.html');
//		console.log('\x1b[1m%s\x1b[0m', '"index.html" has been read ✔️');
	} catch(e) {
		console.error('\x1b[1m%s\x1b[0m', `Could not read index.html file: ${e}`);
		process.exit(1);
	}

	try {
//		console.log('Checking "favicon.ico" file...');
		files.favicon = fs.readFileSync(path + '/favicon.ico');
//		console.log('\x1b[1m%s\x1b[0m', '"favicon.ico" has been read ✔️');
	} catch(e) {
		console.error('\x1b[1m%s\x1b[0m', `Could not read favicon.ico file: ${e}`);
		process.exit(1);
	}
	
	return files;
}


