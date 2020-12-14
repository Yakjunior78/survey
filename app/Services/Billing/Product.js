const Database = use('Database');
const Env = use('Env');
const moment = use('moment');

class Product {
	async store(user)
	{
		let data = await this.data(user);
		
		return Database
			.connection ('mysqlAuth')
			.table ('user_products')
			.insert (data);
	}
	
	async data(user)
	{
		return {
			user_id: user.id,
			product_id: parseInt(Env.get('SURVEY_PRODUCT_ID')),
			customer_account: user.customer_account,
			date_subscribed: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
			active: 1,
			setup: 1,
			created_at: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
			updated_at: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
		}
	}
}

module.exports = Product;