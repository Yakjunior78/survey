'use strict';

const moment = use('moment');

const isNowOrPast = async (dateTime) => {
	
	if(!dateTime) {
		return true;
	}
	
	let now = new Date();
	
	now.setHours( now.getHours() + 3 );
	
	console.log(dateTime, now, 'these are the dates');
	
	return !!(
		moment (dateTime) < moment (now) ||
		moment (dateTime).isSame (moment (now), 'time')
	);
}

module.exports = {
	isNowOrPast
}
