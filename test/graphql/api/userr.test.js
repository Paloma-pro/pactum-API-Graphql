// test.js
const { spec, request } = require('pactum');
const { eachLike, like } = require('pactum-matchers');

request.setBaseUrl('http://lojaebac.ebaconline.art.br')

describe('Testes de Usuários', () => {
    beforeEach(async () => {
        token = await spec()
            .post('/public/authUser')
            .withJson({
                "email": "admin@admin.com",
                "password": "admin123"
            })
            .returns('data.token')
            .toss();
    });

    it('API - deve listar os usuarios corretamente', async () => {
        await spec()
            .get('/api/getUsers')
            .withHeaders("Authorization", 'Bearer $S{userToken}')
            .inspect()
            .expectStatus(200)
            .expectJsonMatch({
                users: eachLike({
                    "_id": like("687c765a6150ee90d8deacc7"),
                    email: like("cooper.stiedemann28@gmail.com"),
                    profile: {
                        firstName: like("Cooper")
                    }
                })
            })
            .toss();
    });
});