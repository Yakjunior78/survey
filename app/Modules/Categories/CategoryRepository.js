'use strict';

const CategoryModel = use('App/Models/Category');

class CategoryRepository {
	async get() {
		return await CategoryModel.all();
	}
}

module.exports = CategoryRepository;