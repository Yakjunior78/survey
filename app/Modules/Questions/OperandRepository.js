const OperandModel = use('App/Model/Operand');

class OperandRepository {
	async index() {
		return await OperandModel.all();
	}
}

module.exports = OperandRepository