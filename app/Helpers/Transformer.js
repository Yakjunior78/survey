'use strict';

const transform = async (modelName, model) => {
	const transformer = new(use('App/Models/Transformers/'+modelName))();
	return await transformer.transform(model);
}

module.exports = {
	transform
}
