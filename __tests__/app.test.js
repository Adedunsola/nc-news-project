const request = require('supertest');
const app = require('../app');
const db = require('../db/data/test-data/index');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');



afterAll(()=>{
    if(db.end) db.end();
});

beforeEach(()=> seed(testData))

describe('1. GET /api', ()=>{
    test('returns message: OK', ()=>{
        return request(app)
        .get('/api')
        .expect(200)
        .then((response)=>{
            const msg = response.text;
            expect(msg).toBe('OK');
        })
    });
    test('404, returns Not Found', ()=>{
        return request(app)
        .get('/apppp')
        .expect(404)
        .then(({body: {msg}})=>{
            expect(msg).toBe('Not Found');
        })
    });
});

describe('2. GET /api/topics', ()=>{
    test('responds with an array of topic objects', ()=>{
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body: {topics}})=>{
            expect(topics).toBeInstanceOf(Array);
            expect(topics).toHaveLength(3);
            topics.forEach((topic)=>{
                expect(topic).toEqual(
                expect.objectContaining({
                  description: expect.any(String),
                  slug: expect.any(String), 
                })
                )
            })
        });
    });
    test('404, returns Not Found when invalid API is given', ()=>{
        return request(app)
        .get('/api/banana')
        .expect(404)
        .then(({body: {msg}})=>{
            expect(msg).toBe('Not Found');
        })
    });
    test('404, returns Not Found when invalid API is given (attempted hacking)', ()=>{
        return request(app)
        .get('/api/DROPDATABASE;')
        .expect(404)
        .then(({body: {msg}})=>{
            expect(msg).toBe('Not Found');
        })
    });
});