'use strict';

const moment = use('moment');

const isNowOrPast = async (dateTime) => {
	
	if(!dateTime) {
		return true;
	}
	
	let now = new Date();
	
	return !!(moment (dateTime) < moment (now) || moment (dateTime).isSame (moment (now), 'time'));
}

module.exports = {
	isNowOrPast
}
