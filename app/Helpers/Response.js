'use strict';

const notAllowed = async (message) => {
	return {
		status: 403,
		message: message
	}
}

module.exports = {
	notAllowed
}
