'use strict';

const transform = async (model, modelName) => {
	const transformer = new(use('App/Models/Transformers/'+modelName))();
	return await transformer.transform(model);
}

module.exports = {
	transform
}
