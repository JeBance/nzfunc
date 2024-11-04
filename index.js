module.exports.hasJsonStructure = function (string) {
	if (typeof string !== 'string') return false;
	try {
		const result = JSON.parse(string);
		const type = Object.prototype.toString.call(result);
		return type === '[object Object]' 
			|| type === '[object Array]';
	} catch(e) {
		console.log(e);
	}
	return false;
};
