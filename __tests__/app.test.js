const request = require('supertest');
const sort = require('jest-sorted');
const app = require('../app');
const db = require('../db/data/test-data/index');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
jest.setTimeout(10000000);


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

describe('4. GET /api/articles/:article_id', ()=>{
    test('responds with the requested article object', ()=>{
        return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then((response)=>{
            expect(response.body).toEqual({article: [{
                article_id: 2,
                title: "Sony Vaio; or, The Laptop",
                topic: "mitch",
                author: "icellusedkars",
                body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
                created_at: "2020-10-16T05:03:00.000Z",
                votes: 0,    
            }]})
        })
    });
    test('400: Invalid article_id returns Bad Request', ()=>{
        return request(app)
        .get('/api/articles/dropTable')
        .expect(400)
        .then((response)=>{
            const msg = response.body.msg;
            expect(msg).toBe('Bad Request');
        })
    });
    test('404: Valid but non-existent article_id returns Not Found', ()=>{
        return request(app)
        .get('/api/articles/55')
        .expect(404)
        .then((response)=>{
            const msg = response.body.msg;
            expect(msg).toBe('Not Found');
        })
    });
});

describe('5. GET api/articles/:article_id/comments', ()=>{
    test('responds with an array of comments for the given article_id when there are existing comments', ()=>{
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body:{comments}})=>{
            expect(comments).toHaveLength(11);
            comments.forEach((comment)=>{
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    body: expect.any(String),
                    votes: expect.any(Number),
                    author: expect.any(String),
                    created_at: expect.any(String),
                })
            })
        })
    });
    test('responds with an empty array when given a valid article_id with no existing comment', ()=>{
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({body:{comments}})=>{
            expect(comments).toHaveLength(0);
        })
    });
    test('returns the array of comments sorted by date and is the most recent date(descending order) by default', ()=>{
        return request(app)
        .get('/api/articles/3/comments')
        .expect(200)
        .then(({body: { comments }})=>{
            expect(comments).toBeSortedBy('created_at', {descending: true})
        });
    });

    test('400: invalid article_id returns bad request', ()=>{
        return request(app)
        .get('/api/articles/monkey/comments')
        .expect(400)
        .then((response)=>{
            const msg = response.body.msg;
            expect(msg).toBe('Bad Request');
        })
    });

    test('404: Valid but non-existent article_id returns Not Found', ()=>{
        return request(app)
        .get('/api/articles/100/comments')
        .expect(404)
        .then((response)=>{
            const msg = response.body.msg;
            expect(msg).toBe('Not Found');
        })
    });
});