
const check = async (condition, response) => {
	
	let operand = await condition.operand().first();
	
	switch (operand.slug) {
		
		case 'is':
			return response === condition.min;
		
		case 'is_not':
			return response !== condition.min;
		
		case 'contains':
			return response.includes(condition.min);
		
		case 'does_not_contain':
			return !response.includes(condition.min) ? true : false;
		
		case 'is_empty':
			return response ? false : true
		
		case 'is_not_empty':
			return response ? true : false
		
		case 'is_less_than':
			return parseFloat(response)  < parseFloat(condition.min);
		
		case 'is_greater_than':
			return parseFloat(response) > parseFloat(condition.min);
		
		case 'is_between':
			return parseFloat(response) >= parseFloat(condition.min) && parseFloat(response) <= parseFloat(condition.max);
		
		default:
			return false;
	}
}

function contains(data, lookup) {
	return data.toLowerCase().indexOf(lookup) === -1;
}

function notContains(data, lookup) {
	return data.toLowerCase().indexOf(lookup) !== -1;
}

module.exports = {
	check
}