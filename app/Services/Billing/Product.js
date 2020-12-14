const Database = use('Database');
const Env = use('Env');

class Product {
	async store(user)
	{
		return Database
			.connection ('mysqlAuth')
			.table ('user_products')
			.insert ({
				user_id: user.id,
				product_id: Env.get('SURVEY_PRODUCT_ID'),
				customer_account: user.customer_account,
				date_subscribed: '',
				active: 1,
				setup: 1,
			});
	}
}

module.exports = Product;