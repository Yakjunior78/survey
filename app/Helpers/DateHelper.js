'use strict';

const moment = use('moment');

const isNowOrPast = async (dateTime) => {
	
	if(!dateTime) {
		return true;
	}
	
	return !!(
		moment (dateTime) < moment (new Date()) ||
		moment (dateTime).isSame (moment (now), 'time')
	);
}

module.exports = {
	isNowOrPast
}
