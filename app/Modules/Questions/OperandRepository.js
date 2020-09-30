const OperandModel = use('App/Models/Operand');

class OperandRepository {
	async get() {
		return await OperandModel.all();
	}
}

module.exports = OperandRepository