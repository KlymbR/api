import 'jasmine';
import 'jasmine-expect';
import * as request from 'request';
import { IUser } from '../src/models/User';

const url = 'http://localhost:8080/users';
const example: IUser = {
    firstname: 'Jasmine',
    lastname: 'KLYMBR',
    phone: '+33678901234',
    gender: 0,
    birthdate: new Date,
    email: 'jasmine@klymbr.com',
    password: 'password',
    licenses: [{
        id: 8080,
        number: 80,
        end: new Date,
        status: 80,
        club: {
            id: 8080,
            name: 'Klymbr'
        }
    }],
    address: {
        number: 80,
        street: 'klymbr street',
        postalcode: 8080,
        city: 'Klymbr'
    }
};

describe('/users', () => {
    const checker = (body) => {
        expect(body).toHaveString('_id');
        expect(body).toHaveString('created');
        expect(body).not.toHaveMember('password');

        expect(body).toHaveString('firstname');
        expect(body).toHaveString('lastname');
        expect(body).toHaveString('phone');
        expect(body).toHaveString('email');
        expect(body).toHaveString('birthdate');
        expect(body).toHaveNumber('gender');
        expect(body).toHaveObject('address');
        expect(body).toHaveArrayOfObjects('licenses');
        expect(body).toHaveArrayOfSize('licenses', 1);

        expect(body.phone).toMatch(/^(\+\d{11}|\d{10})$/);

        expect(body.address).toHaveString('street');
        expect(body.address).toHaveString('city');
        expect(body.address).toHaveNumber('number');
        expect(body.address).toHaveNumber('postalcode');

        expect(body.licenses[0]).toHaveNumber('id');
        expect(body.licenses[0]).toHaveNumber('number');
        expect(body.licenses[0]).toHaveString('end');
        expect(body.licenses[0]).toHaveNumber('status');
        expect(body.licenses[0]).toHaveObject('club');

        expect(body.licenses[0].club).toHaveNumber('id');
        expect(body.licenses[0].club).toHaveString('name');
    };

    it('GET', (done) => {
        request.get(url, { json: true }, (err, res, body) => {
            expect(res.statusCode).toBe(200);
            expect(body).toBeArrayOfObjects();
            done();
        });
    });
    it('POST', (done) => {
        request.post(url, { body: example, json: true }, (err, res, body) => {
            expect(res.statusCode).toBe(201);
            checker(body);
            done();
        });
    });
    it('PATCH', (done) => {
        const before = Object.assign({}, example);
        before.gender = 1;
        before.lastname = 'PATCH';
        request.post(url, { body: before, json: true }, (err, res, b) => {
            request.patch(`${url}/${b._id}`, { body: example, json: true }, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                checker(body);
                expect(body.gender).toEqual(before.gender);
                expect(body.lastname).not.toEqual(before.lastname);
                request.patch(url + '/5b3258bfe3d80d2c11651d73', { body: example, json: true }, (err, res, body) => {
                    expect(res.statusCode).toBe(404);
                    expect(body).toHaveString('error');
                    expect(body).toHaveString('error_description');
                    expect(body.error).toBe('not_found');
                    done();
                });
            });
        });
    });
    it('DELETE', (done) => {
        request.post(url, { body: example, json: true }, (err, res, b) => {
            request.delete(`${url}/${b._id}`, { json: true }, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                request.delete(url + '/5b3258bfe3d80d2c11651d73', { json: true }, (err, res, body) => {
                    expect(res.statusCode).toBe(404);
                    expect(body).toHaveString('error');
                    expect(body).toHaveString('error_description');
                    expect(body.error).toBe('not_found');
                    done();
                });
            });
        });
    });
});