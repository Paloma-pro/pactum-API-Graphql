const { reporter, flow, handler, mock } = require('pactum');
const { like } = require('pactum-matchers');
const pf = require('pactum-flow-plugin');

function addFlowReporter() {
  pf.config.url = 'http://localhost:8080'; // pactum flow server url
  pf.config.projectId = 'lojaebac-front';
  pf.config.projectName = 'Loja Ebac Front';
  pf.config.version = '1.0.00';
  pf.config.username = 'scanner';
  pf.config.password = 'scanner';
  reporter.add(pf.reporter);
}

// global before
before(async () => {
  addFlowReporter();
});

// global after
after(async () => {
  await reporter.end();
});

handler.addInteractionHandler('Login Response', () => {
    return {
        provider: 'lojaebac-api',
        flow: 'Login',
        request: {
            method: 'POST',
            path: '/public/authUser',
            body: {
                "email": "admin@admin.com",
                "password": "admin123"
            },
            response: {
                status: 200,
                body: {
                    "success": true,
                    "message": "login successfully",
                    "data": {
                        "_id": "679f50eb0cf0a913258b286c",
                        "role": "admin",
                        "profile": {
                            "firstName": "admin"
                        },
                        "email": "admin@admin.com",
                        "token": like("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY3OWY1MGViMGNmMGE5MTMyNThiMjg2YyIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTc1MzMwNjMxMCwiZXhwIjoxNzUzMzkyNzEwfQ.QgyVIP5e43bvZrjjPIEdaQrPAmiysh2DmSd1jRo71e4")
                    }
                }
            }
        }
    }
})



it('FRONT - Deve autenticar usuario corretamente', async () => {
    await flow("Login")
    .useInteraction('Login Response')
        .post('http://lojaebac.ebaconline.art.br/public/authUser')
        .withJson({
            "email": "admin@admin.com",
            "password": "admin123"
        })
        .expectStatus(200)
        .expectJson('success', true)
});
