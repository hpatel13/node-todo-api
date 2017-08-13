const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
var {ObjectID} = require('mongodb');


//make sure db is empty before test runs
const todos = [{
    _id:new ObjectID(),
    text:'1st test todo'
},{
    _id:new ObjectID(),
    text:'2nd test todo',
    completed:true,
    completedAt:333
}];

beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        Todo.insertMany(todos);
    }).then(()=>{
        done();
    })
})

describe('Post /todos' , ()=> {
    it("should create a new todo",(done) => {
        var text = 'Test todo text';

        request(app).post('/todos').send({text}).expect(200).expect((res)=>{
            expect(res.body.text).toBe(text);
        }).end((err,res)=>{
            if(err){
                return done(err);
            }

            Todo.find({text}).then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e)=>{
                done(e);
            })
        })
    })

    it("should not create a todo with invalid data",(done)=>{
        request(app).post('/todos').send({}).expect(400)
        .end((err,res)=>{
            if(err){
                return done(err);
            }

            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2);
                done();
            }).catch((e)=>{
                done(e);
            })
        })
    })

});

describe('Get /todos' , ()=> {

    it("should get all todos",(done)=>{
        request(app).get('/todos').expect(200).expect((res)=>{
            expect(res.body.todos.length).toBe(2);
        }).end(done)
    });

});

describe('Get /todos/:id' , ()=> {

    it("should get todo by id",(done)=>{
        request(app).get(`/todos/${todos[0]._id.toHexString()}`).expect(200).expect((res)=>{
            //expect(res.body.todos.length).toBe(1);
            expect(res.body.todo.text).toBe('1st test todo');
        }).end(done)
    });

    it("should return 404 if todo not found",(done)=>{
        request(app).get(`/todos/${new ObjectID().toHexString()}`).expect(404).end(done)
    });

    it("should return 404 for non-object ids",(done)=>{
        request(app).get(`/todos/123`).expect(404).end(done)
    });
});

describe('Delete /todos/:id' , ()=> {

    it("should remove a todo",(done)=>{
        request(app).delete(`/todos/${todos[1]._id.toHexString()}`).expect(200).expect((res)=>{
            //expect(res.body.todos.length).toBe(1);
            expect(res.body.todo._id).toBe(todos[1]._id.toHexString());
        }).end((err,res)=>{
            if(err)
                return done(err);

            Todo.findById(`${todos[1]._id.toHexString()}`).then((todo)=>{
                expect(todo).toNotExist();
                done();
            }).catch((e)=>{
                done(e);
            })

        })
    });

    it("should return 404 if todo not found for delete",(done)=>{
        request(app).delete(`/todos/${new ObjectID().toHexString()}`).expect(404).end(done)
    });

    it("should return 404 for non-object ids for delete",(done)=>{
        request(app).delete(`/todos/123`).expect(404).end(done)
    });
});

describe('Patch /todos/:id' , ()=> {

     it("should update a todo",(done)=>{
        request(app).patch(`/todos/${todos[0]._id.toHexString()}`).expect(200).send({text:"change of text",completed:true})
        .expect(200).expect((res)=>{
            //expect(res.body.todos.length).toBe(1);
            expect(res.body.todo.text).toBe("change of text");
            expect(res.body.todo.completed).toBe(true)
            expect(res.body.todo.completedAt).toBeA('number')
        }).end(done);
    });

    it("should clear completedAt when a todo is not completed",(done)=>{
        request(app).patch(`/todos/${todos[1]._id.toHexString()}`).expect(200).send({text:"change of text 2nd",completed:false})
        .expect(200).expect((res)=>{
            //expect(res.body.todos.length).toBe(1);
            expect(res.body.todo.text).toBe("change of text 2nd");
            expect(res.body.todo.completed).toBe(false);
             expect(res.body.todo.completedAt).toNotExist();
        }).end(done);
    });


});