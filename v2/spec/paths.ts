import 'jasmine';
import 'jasmine-expect';
import * as request from 'request';
import { IPath } from '../src/models/Path';

const url = 'http://localhost:8080/paths';
const example: IPath = {
    free: true,
    difficulty: '6A',
    grips: [{
        id: 1,
        data: 123,
        on: false
    }],
    average: 76,
    best: {
        id: 'idtest',
        time: 63,
        firstname: 'Moha',
        lastname: 'La Squale'
    }
};

describe('/paths', () => {
    const checker = (body) => {
        expect(body).toHaveString('_id');
        expect(body).toHaveBoolean('free');
        expect(body).toHaveString('difficulty');

        expect(body.grips[0]).toHaveNumber('id');
        expect(body.grips[0]).toHaveNumber('data');
        expect(body.grips[0]).toHaveBoolean('on');

        expect(body).toHaveNumber('average');

        expect(body.best).toHaveNumber('time');
        expect(body.best).toHaveString('firstname');
        expect(body.best).toHaveString('lastname');
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
        before.free = true;
        before.difficulty = 'PATCH';
        request.post(url, { body: before, json: true }, (err, res, b) => {
            request.patch(`${url}/${b._id}`, { body: example, json: true }, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                checker(body);
                expect(body.free).toEqual(before.free);
                expect(body.lastname).not.toEqual(before.difficulty);
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