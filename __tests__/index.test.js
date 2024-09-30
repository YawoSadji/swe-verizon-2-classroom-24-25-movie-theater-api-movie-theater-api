
const request = require('supertest')
const {User, Show} = require('../models/index')
const app = require('../src/app');
const seed = require("../db/seed");
let usersCount;

beforeEach(async()=>{
    await seed();
    const allUsers = await User.findAll();
    usersCount = allUsers.length;
    const allShows = await Show.findAll();
    showsCount = allShows.length;
});

describe('movie theater tests', ()=>{

    test('GET /users returns all users', async()=>{
        const response = await request(app).get('/users');
        expect(response.statusCode).toBe(200);
    });
    test('GET /users returns array of users', async()=>{
        const response = await request(app).get('/users');
        expect(response.body).toBeInstanceOf(Array);
    });
    test('GET /users returns correct number of users', async()=>{
        const response = await request(app).get('/users');
        expect(response.body.length).toBe(usersCount);
    });
    test('GET /users returns the correct user data',async()=>{
        const response = await request(app).get('/users');
        expect(response.body[0]).toEqual(expect.objectContaining({
                username: "g.lucas@gmail.com",
                password: "mt4bwu"
              }));
    });

    test('GET /users/:id returns the correct user',async()=>{
        const response = await request(app).get('/users/1');
        expect(response.body).toEqual(expect.objectContaining({
                id: 1,
                username: "g.lucas@gmail.com",
                password: "mt4bwu"
          }));
    });

    test('GET /users/:id/shows returns all shows watched by user',async()=>{
        const response = await request(app).get('/users/1/shows');
        expect(response.statusCode).toBe(200);
        expect(response.body[0].title).toBe("Inception");
    });

    test('PUT /users/:id/shows/:showId associates user with watched show',async()=>{
        const response = await request(app).put('/users/1/shows/3');
        expect(response.body.shows[2].title).toBe("Harry Potter: The Prisoner of Azkaban");
    });

    test('POST /users returns updated array with new value',async()=>{
        const response = 
        await request(app).post('/users').send({
    
                username: "g.lucas@gmail.com",
                password: "mt4bwu"
              
        });
        expect(response.body[(response.body.length) - 1]).toEqual(expect.objectContaining({
            
                "username": "g.lucas@gmail.com",
                "password": "mt4bwu"
              
          }));
        expect(response.body.length).toEqual(usersCount + 1);
    });

    test('POST returns error when username is not an email', async()=>{
        const response = await request(app).post('/users')
        .send({
            username: 'Eric',
            password: 'mrb456'
        });
        expect(response.statusCode).toBe(400);
    });





    test('GET /shows returns all shows', async()=>{
        const response = await request(app).get('/shows');
        expect(response.statusCode).toBe(200);
    });
    test('GET /shows returns array of shows', async()=>{
        const response = await request(app).get('/shows');
        expect(response.body).toBeInstanceOf(Array);
    });
    test('GET /shows returns correct number of shows', async()=>{
        const response = await request(app).get('/shows');
        expect(response.body.length).toBe(showsCount);
    });
    test('GET /shows returns the correct show data',async()=>{
        const response = await request(app).get('/shows');
        expect(response.body[0]).toEqual(expect.objectContaining({
                title: "Inception",
                genre: "Science Fiction",
                available: true
              }));
    });

    test('GET /shows?genre=genre returns shows with provided genre', async()=>{
        const response = await request(app).get('/shows?genre=Action');
        expect(response.body[0].title).toBe('The Dark Knight');
        expect(response.body[1].title).toBe('Black Panther');
    });

    test('GET /shows/:id returns the correct show',async()=>{
        const response = await request(app).get('/shows/1');
        expect(response.body).toEqual(expect.objectContaining({
                id: 1,
                title: "Inception",
                genre: "Science Fiction",
                available: true
          }));
    });

    test('GET /shows/:id/shows returns all users who watched a show',async()=>{
        const response = await request(app).get('/shows/1/users');
        expect(response.statusCode).toBe(200);
        expect(response.body[0].username).toBe("g.lucas@gmail.com");
    });

    test('PUT /shows/:id/available updates the `available` property of a show',async()=>{
        const response = await request(app).put('/shows/1/available').send({available: false});
        const updatedShow = await Show.findByPk(1);
        expect(updatedShow.available).toBe(false);
    });


    test('POST returns error when title is more than 25 characters', async()=>{
        const response = await request(app).post('/shows')
        .send({
            "title": "movieWithMoreThanTwentyFiveCharacters",
            "genre": "Action",
            "available": true
        });
        expect(response.statusCode).toBe(400);
    });

    test('DELETE /shows/:id deletes show with the provided id',async()=>{
        const response = await request(app).delete('/shows/2');
        const foundShow = await Show.findByPk(2);
        expect(response.body.length).toBe(showsCount - 1);
        expect(foundShow).toBeNull();
    });
});
