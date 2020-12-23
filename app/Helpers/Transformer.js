'use strict';

const transform = async (model, modelName, data) => {
	const transformer = new(use('App/Models/Transformers/'+modelName))();
	return await transformer.transform(model, data);
}

module.exports = {
	transform
}
