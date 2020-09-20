const InstanceModel = use('App/Models/Instance');
const InstanceForm = new(use('App/Modules/Instances/Form'))();

const { validate } = use('Validator');

class InstanceRepository {
	
	async create(data) {
		
		let validation = await InstanceForm.validate(data);
		
		if (validation.fails()) {
			return InstanceForm.error(validation);
		}
		
		let instanceModel = new InstanceModel;
		
		instanceModel.description = data.description;
		instanceModel.survey_id = data.survey_id;
		instanceModel.start_at = data.start_at;
		instanceModel.end_at = data.end_at;
		instanceModel.group_id = data.group_id;
		instanceModel.channel_id = data.channel_id;
		instanceModel.created_by = data.created_by;
		instanceModel.created_by_name = data.created_by_name;
		instanceModel.status_id = data.status_id;
		
		await instanceModel.save();
		
		return instanceModel;
	}
}

module.exports = InstanceRepository;