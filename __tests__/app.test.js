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

describe('0. GET /api', ()=>{
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

describe('3. GET /api/topics', ()=>{
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

describe('4. GET /api/articles', ()=>{
    test('responds with an array of article objects', ()=>{
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body: {articles}})=>{
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

describe('5. GET /api/articles/:article_id', ()=>{
    test('responds with the requested article object', ()=>{
        return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then((response)=>{
            expect(response.body).toMatchObject({article: [{
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

describe('6. GET api/articles/:article_id/comments', ()=>{
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

    test('404: Valid but non-existent article_id returns not found', ()=>{
        return request(app)
        .get('/api/articles/100/comments')
        .expect(404)
        .then((response)=>{
            const msg = response.body.msg;
            expect(msg).toBe('Not Found');
        })
    });
});

describe('7. POST api/articles/:article_id/comments', ()=>{
    test('201: responds with the newly posted comment', ()=>{
        const newComment = {
            username: "butter_bridge",
            body: "my eyes hurt from looking at this article"
        };
        return request(app)
        .post('/api/articles/6/comments')
        .send(newComment)
        .expect(201)
        .then(({body})=>{
            expect(body.comment[0]).toMatchObject({
                comment_id: 19,
                body: "my eyes hurt from looking at this article",
                article_id: 6,
                author: "butter_bridge",
                votes: 0,
                created_at: expect.any(String)
            })
        });
    });
    test('201: posting a comment to a valid article id, including multiple keys, only accepts username and body, ignoring others', ()=>{
        const newComment = {
            username: "rogersop",
            body: "my eyes hurt from looking at this article",
            article_id: 15,
            topic: "The article by northcoders"
        };
        return request(app)
        .post('/api/articles/7/comments')
        .send(newComment)
        .expect(201)
        .then(({body})=>{
            expect(body.comment[0]).toMatchObject({
                comment_id: 19,
                body: 'my eyes hurt from looking at this article',
                article_id: 7,
                author: "rogersop",
                votes: 0,
                created_at: expect.any(String)
              })
        })
    });
    test('404: posting a comment to a valid but non-existent article returns not found', ()=>{
        const newComment = {
            username: "butter_bridge",
            body: "my eyes hurt from looking at this article"
        };
        return request(app)
        .post('/api/articles/100/comments')
        .send(newComment)
        .expect(404)
        .then((response)=>{
            const msg = response.body.msg;
            expect(msg).toBe('Not Found');
        });
    });

    test('400: posting a comment to a valid article_id with a null key (that has a NOT NULL constraint) returns bad request', ()=>{
        const newComment = {
            username: "",
            body: "the grass is greener on the other side :)"
        };
        return request(app)
        .post('/api/articles/10/comments')
        .send(newComment)
        .expect(400)
        .then((response)=>{
            const msg = response.body.msg;
            expect(msg).toBe('Bad Request');
        });
    });
    test('400: posting a comment to a valid article_id with a missing key (that has a NOT NULL constraint) returns bad request', ()=>{
        const newComment = {
            username: "icellusedkars",
        };
        return request(app)
        .post('/api/articles/10/comments')
        .send(newComment)
        .expect(400)
        .then((response)=>{
            const msg = response.body.msg;
            expect(msg).toBe('Bad Request');
        });
    });
    test('400: posting a comment to an invalid article id returns bad request', ()=>{
        const newComment = {
            username: "icellusedkars",
            body: "my eyes hurt from looking at this article"
        };
        return request(app)
        .post('/api/articles/DROPDATABASE/comments')
        .send(newComment)
        .expect(400)
        .then((response)=>{
            const msg = response.body.msg;
            expect(msg).toBe('Bad Request');
        })
    });
});

describe('8. PATCH api/articles/:article_id', () => {
    test('responds with the newly updated article after vote increment', () => {
      return request(app)
        .patch('/api/articles/3')
        .send({ inc_votes: 45 })
        .expect(200)
        .then(({body})=>{
          expect(body.article[0]).toMatchObject({
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 45,
          });
        }) 
    });
    test('responds with the newly updated article after vote decrement', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: -45 })
          .expect(200)
          .then(({body})=>{
            expect(body.article).toMatchObject([{
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 55,
            }]);
          }) 
      });
     test('404: patching votes to a valid but non-existent article returns not found', ()=>{
        return request(app)
        .patch('/api/articles/390')
        .send({ inc_votes: 345 })
        .expect(404)
        .then((response)=>{
            const msg = response.body.msg;
            expect(msg).toBe('Article Not Found');
        })
    });
    test('400: patching votes to an invalid article returns bad request', ()=>{
        return request(app)
        .patch('/api/articles/BANANA')
        .send({ inc_votes: 45 })
        .expect(400)
        .then((response)=>{
            const msg = response.body.msg;
            expect(msg).toBe('Bad Request');
        })
    });
    test('400: patching votes to a valid article but with an invalid key, returns bad request', ()=>{
        return request(app)
        .patch('/api/articles/2')
        .send({ inc_votes: 'not a number' })
        .expect(400)
        .then((response)=>{
            const msg = response.body.msg;
            expect(msg).toBe('Bad Request');
        })
    });
    test('400: patching votes to a valid article but without the "inc_votes" property, returns bad request', ()=>{
        return request(app)
        .patch('/api/articles/2')
        .send({voting: 60})
        .expect(400)
        .then((response)=>{
            const msg = response.body.msg;
            expect(msg).toBe('Bad Request');
        })
    });
});

describe('9. GET /api/users', ()=>{
    test('responds with an array of user objects', ()=>{
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body: {users}})=>{
            expect(users).toHaveLength(4);
            users.forEach((user)=>{
                expect(user).toEqual(
                expect.objectContaining({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String),
                })
                );
            });
        });
    })
    test('404: returns Not Found when invalid API is given', ()=>{
        return request(app)
        .get('/api/CreateTable')
        .expect(404)
        .then(({body: {msg}})=>{
            expect(msg).toBe('Not Found');
        })
    });
})

describe('10. GET /api/articles?queries', ()=>{
    test('TOPIC: responds with article specified by the topic query', ()=>{
        return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then(({body})=>{
            expect(body.articles[0]).toMatchObject({
                article_id: 5,
                title: "UNCOVERED: catspiracy to bring down democracy",
                topic: "cats",
                author: "rogersop",
                created_at: "2020-08-03T13:14:00.000Z",
                votes: 0,
                comment_count: '2'
            })
        });
    });
    test('responds with all articles when query is omitted', ()=>{
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body:{articles}})=>{
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
    test('TOPIC: returns empty array when valid but not existent topic query is given', ()=>{
        return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then(({body})=>{
            expect(body.articles).toHaveLength(0)
        })
    });
    test('SORT_BY:title, responds with appropraite sort_by as given in the query (DEFAULT ORDER=DESC)', () => {
        return request(app)
        .get('/api/articles?sort_by=title')
        .expect(200)
        .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy('title', {descending: true})
        })
      });
      test('SORT_BY:comment_count, responds with appropraite sort_by as given in the query (DEFAULT ORDER=DESC)', () => {
        return request(app)
        .get('/api/articles?sort_by=comment_count')
        .expect(200)
        .then(({ body: { articles } }) => {
        expect(articles).toBeSorted('comment_count', {descending: true})
        })
      });
      test('SORT_BY:author, responds with appropraite sort_by as given in the query (DEFAULT ORDER=DESC)', () => {
        return request(app)
        .get('/api/articles?sort_by=author')
        .expect(200)
        .then(({ body: { articles } }) => {
        expect(articles).toBeSorted('author', {descending: true})
        })
      });
      test('SORT_BY:votes, responds with appropraite sort_by as given in the query (DEFAULT ORDER=DESC)', () => {
        return request(app)
        .get('/api/articles?sort_by=votes')
        .expect(200)
        .then(({ body: { articles } }) => {
        expect(articles).toBeSorted('votes', {descending: true})
        })
      });
      test('SORT_BY:topic,responds with appropraite sort_by as given in the query (DEFAULT ORDER=DESC)', () => {
        return request(app)
        .get('/api/articles?sort_by=topic')
        .expect(200)
        .then(({ body: { articles } }) => {
        expect(articles).toBeSorted('topic', {descending: true})
        })
      });
      test('400: returns bad request when given an invalid sort_by query', () => {
        return request(app)
          .get('/api/articles?sort_by=DROP DATABASE')
          .expect(400).then(({body: { msg }})=> {
            expect(msg).toBe('Bad Request')
          })
      });
      test('ORDER:asc, responds with the appropriate order when given the order query (DEFAULT SORT_BY=DATE)', () => {
        return request(app)
        .get('/api/articles?order=asc')
        .expect(200)
        .then(({ body: { articles } }) => {
        expect(articles).toBeSorted('created_at', {ascending: true})
        })
      });
      test('ORDER:desc, responds with the appropriate order when given the order query (DEFAULT SORT_BY=DATE)', () => {
        return request(app)
        .get('/api/articles?order=desc')
        .expect(200)
        .then(({ body: { articles } }) => {
        expect(articles).toBeSorted('created_at', {descending: true})
        })
      });
      test('400: returns bad request when given an invalid order query', () => {
        return request(app)
          .get('/api/articles?order=DROP TABLES')
          .expect(400).then(({body: { msg }})=> {
            expect(msg).toBe('Bad Request')
          })
      });
      test('DEFAULT: that when sort_by or order query is not given, it defaults to sort by date and descending order ', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
        expect(articles).toBeSorted('created_at', {descending: true})
        })
      });
})

describe('11. GET /api/articles/:article_id(comment_count)', ()=>{
    test('responds with the requested article object with comment_count', ()=>{
      return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({body})=>{
          expect(body.article[0]).toMatchObject({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 100,
              comment_count: '11'
          })
      })
  });
  test('responds with the requested article object when there is no comment', ()=>{
    return request(app)
    .get('/api/articles/2')
    .expect(200)
    .then(({body})=>{
        expect(body.article[0]).toMatchObject({
            article_id: 2,
            title: "Sony Vaio; or, The Laptop",
            topic: "mitch",
            author: "icellusedkars",
            body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
            created_at: "2020-10-16T05:03:00.000Z",
            votes: 0,
            comment_count: '0'
        })
    })
});
  test('400: Invalid article_id returns Bad Request', ()=>{
    return request(app)
    .get('/api/articles/BANANA')
    .expect(400)
    .then((response)=>{
        const msg = response.body.msg;
        expect(msg).toBe('Bad Request');
    })
});
test('404: Valid but non-existent article_id returns Not Found', ()=>{
    return request(app)
    .get('/api/articles/200')
    .expect(404)
    .then((response)=>{
        const msg = response.body.msg;
        expect(msg).toBe('Not Found');
    })
});
})

describe('12. DELETE /api/comments/:comment_id', ()=>{
    test('204: NO Content, deletes the comment with the given comment id ', ()=>{
      return request(app)
      .delete('/api/comments/1')
      .expect(204)
  });
  test('404: Valid but non-existent comment_id returns Not Found', ()=>{
    return request(app)
    .delete('/api/comments/2000')
    .expect(404)
    .then((response)=>{
        const msg = response.body.msg;
        expect(msg).toBe('Comment Not Found');
    })
});
test('400: invalid comment_id returns Bad Request', ()=>{
    return request(app)
    .delete('/api/comments/INSERT INTO COMMENTS')
    .expect(400)
    .then((response)=>{
        const msg = response.body.msg;
        expect(msg).toBe('Bad Request');
    })
});
})