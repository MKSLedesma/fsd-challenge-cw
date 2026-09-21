const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../src/app');

const token = jwt.sign(
    { id: 1, email: 'test@example.com' },
    process.env.JWT_SECRET || 'clave_secreta',
    { expiresIn: '1h' }
);

test('signup rechaza email invalido', async () => {
    const response = await request(app)
    .post('/api/auth/signup')
    .send({ email: 'email-invalido', password: 'example'});

    assert.equal(response.status, 400);
    assert.equal(response.body.message, "El email no tiene un formato valido")
});

test('signup rechaza passwords menores a seis caracteres', async() => {
    const response = await request(app)
    .post('/api/auth/signup')
    .send({ email: 'test@example.com', password: 'error' })

    assert.equal(response.status, 400);
    assert.equal(response.body.message, "La contrasenia debe tener al menos 6 caracteres")
});

test('login devuelve 401 con credenciales invalidas', async () => {
    const response = await request(app)
    .post('/api/auth/login')
    .send({ email:'void@test.com', password: 'error' });

    assert.equal(response.status, 401);
    assert.equal(response.body.message, 'Email o contrasenia invalidos');
})

test('animales requiere token', async () => {
    const response = await request(app).get('/api/animales');

    assert.equal(response.status, 401);
    assert.equal(response.body.message, 'Token requerido');
})

test('animales autentica token', async () => {
    const response = await request(app)
    .get('/api/animales')
    .set('Authorization', 'Bearer token-error');

    assert.equal(response.status, 401);
})

test('animales filtra resultados con token valido', async () => {
    const response = await request(app)
    .get('/api/animales')
    .query({ clase: 'Ave'})
    .set('Authorization', `Bearer ${token}`);

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body));
    assert.ok(response.body.length > 0);
    assert.ok(response.body.every((animal) => animal.clase === 'Ave'));
})

test('opciones devuelve valores de filtros', async () => {
    const response = await request(app)
    .get('/api/animales/opciones')
    .set('Authorization', `Bearer ${token}`);

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body.clases));
    assert.ok(Array.isArray(response.body.dietas));
    assert.ok(Array.isArray(response.body.continentes));
})