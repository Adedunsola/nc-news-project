const request = require('supertest');
const sort = require('jest-sorted');
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

describe('3. GET /api/articles', ()=>{
    test('responds with an array of article objects', ()=>{
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body: {articles}})=>{
            expect(articles).toBeInstanceOf(Array);
            expect(articles).toHaveLength(12);
            articles.forEach((article)=>{
                expect(article).toEqual(
                expect.objectContaining({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(String)
                })
                );
            });
        });
    });
    test('returns the array of article objects sorted by date and is in descending order by default', ()=>{
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body: { articles }})=>{
            expect(articles).toBeSortedBy('created_at', {descending: true})
        });
    });
    test('404, returns Not Found when an invalid path is given', ()=>{
        return request(app)
        .get('/api/articlessstopics')
        .expect(404)
        .then(({body: {msg}})=>{
            expect(msg).toBe('Not Found');
        })
    });
});