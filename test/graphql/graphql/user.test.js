// // test.js
// const { spec } = require('pactum');
// const { eachLike, like } = require('pactum-matchers');

// // request.setBaseUrl('http://lojaebac.ebaconline.art.br/graphql')

// let token;

// beforeEach(async () => {
//     token = await spec()
//         .post('http://lojaebac.ebaconline.art.br/graphql')
//         .withGraphQLQuery(`
//         mutation AuthUser($email: String, $password: String) {
//             authUser(email: $email, password: $password) {
//                 success
//                 token
//             }
//         }
//   `)
//         .withGraphQLVariables({
//             "email": "admin@admin.com",
//             "password": "admin123"
//         })
//         .stores('data.authUser.token')
// });


// it('listagem de usuarios', async () => {
//     await spec()
//         .post('http://lojaebac.ebaconline.art.br/graphql')
//         .withHeaders("Authorization", token)
//         .withGraphQLQuery(`
//             query {
//             Users {
//                 id
//                 email
//                 profile {
//                 firstName
//                 }
//             }
//             }
//   `)
//         .expectStatus(200)
//         .expectJsonMatch({
//             data:{
//                 Users: eachLike({
//                     id: like("687c765a6150ee90d8deacc7"),
//                     email: like("cooper.stiedemann28@gmail.com"),
//                     profile: {
//                         firstName: like("Cooper")
//                     }
//                 })
//             }
//         })
//         .toss();
// });




// test.js
const { spec } = require('pactum');
const { eachLike, like, expression } = require('pactum-matchers');


describe('Testes de Usuários', () => {
    beforeEach(async () => {
        token = await spec()
            .post('http://lojaebac.ebaconline.art.br/graphql')
            .withGraphQLQuery(`
                mutation AuthUser($email: String, $password: String) {
                    authUser(email: $email, password: $password) {
                        success
                        token
                    }
                }
            `)
            .withGraphQLVariables({
                "email": "admin@admin.com",
                "password": "admin123"
            })
            .returns('data.authUser.token')
            .toss();
    });

    it('deve listar os usuarios corretamente', async () => {
        await spec()
            .post('http://lojaebac.ebaconline.art.br/graphql')
            .withHeaders("Authorization", 'Bearer $S{userToken}')
            .withGraphQLQuery(`
                query {
                    Users {
                        id
                        email
                        profile {
                            firstName
                        }
                    }
                }
            `)
            .inspect()
            .expectStatus(200)
            .expectJsonMatch({
                data: {
                    Users: eachLike({
                        id: like("687c765a6150ee90d8deacc7"),
                        email: like("cooper.stiedemann28@gmail.com"),
                        profile: {
                            firstName: like("Cooper")
                        }
                    })
                }
            })
            .toss();
    });
});