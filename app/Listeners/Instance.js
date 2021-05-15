'use strict';

const Dispatch = new(use('App/Services/Survey/Dispatch'))();
const InstanceModel = use('App/Models/Instance');
const InstanceDispatch = new(use('App/Jobs/Instance'))();

const Instance = exports = module.exports = {}

Instance.ready = async (instance) => {
	return await Dispatch.handle(instance);
}

Instance.dispatch = async (data) => {

	let parsedData = JSON.parse(data);
	let instance = parsedData.data;

	try {
		let SurveyInstance = await InstanceModel.find(instance.id);

		await InstanceDispatch.dispatch(SurveyInstance);

		SurveyInstance.sms_sent = true;

		await SurveyInstance.save();

		console.log('SEND SURVEY STEP 4: sms sent');

		return SurveyInstance;

	} catch (e) {
		console.log('ERROR OCCURRED: ', e.message)
	}
}
