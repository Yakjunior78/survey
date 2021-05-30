'use strict';

const CategoryRepo = new(use('App/Modules/Categories/CategoryRepository'))();

class CategoryController {
	
	async index({ response }) {
		return response.json({
			categories: await CategoryRepo.get()
		});
	}
}

module.exports = CategoryController
