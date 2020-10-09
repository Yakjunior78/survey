'use strict';

const transform = async (model, modelName, channel) => {
	const transformer = new(use('App/Models/Transformers/'+modelName))();
	return await transformer.transform(model, channel);
}

module.exports = {
	transform
}
