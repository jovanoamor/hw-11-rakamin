const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');
const Todo = require('../src/models/todo');

describe('Todo API', () => {
  before(async () => {
    await Todo.sync({ force: true });
  });

  it('should create a new todo', async () => {
    const res = await request(app).post('/api/todos').send({ title: 'Test Todo' });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('title', 'Test Todo');
  });

  it('should list all todos', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('should get a todo by id', async () => {
    const todo = await Todo.create({ title: 'Test Todo' });
    const res = await request(app).get(`/api/todos/${todo.id}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('title', 'Test Todo');
  });

  it('should soft delete a todo', async () => {
    const todo = await Todo.create({ title: 'Test Todo' });
    const res = await request(app).delete(`/api/todos/${todo.id}`);
    expect(res.status).to.equal(204);

    const foundTodo = await Todo.findByPk(todo.id, { paranoid: false });
    expect(foundTodo).to.have.property('deletedAt').that.is.not.null;
  });

  it('should not include soft-deleted todos in the list', async () => {
    await Todo.create({ title: 'Another Test Todo' });
    const res = await request(app).get('/api/todos');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.lengthOf(1); // todo yang tidak kedelete akan dilist
  });
});
