'use strict';

const OperandRepo = new(use('App/Modules/Questions/OperandRepository'))();

class OperandsController {
	async index({ response }) {
		return response.json({
			operands: await OperandRepo.get()
		});
	}
}

module.exports = OperandsController;