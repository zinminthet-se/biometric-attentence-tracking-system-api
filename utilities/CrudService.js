class CrudService {
  constructor(model) {
    this.model = model;
  }
  findAll() {
    return this.model.findAll();
  }
}
module.exports = CrudService;
