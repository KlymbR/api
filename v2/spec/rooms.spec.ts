import 'jasmine';
import 'jasmine-expect';
import * as request from 'request';
import { IRoom } from '../src/models/Room';

const url = 'http://localhost:8080/v2/rooms';
const example: IRoom = {
    title: 'Salle de la Rochette',
    latitude: 43.8417705,
    longitude: 5.7757431
};

describe('/rooms', () => {
    const checker = (body) => {
        expect(body).toHaveString('_id');
        expect(body).toHaveString('title');
        expect(body).toHaveNumber('latitude');
        expect(body).toHaveNumber('longitude');
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
        before.latitude = 43.8417705;
        before.title = 'PATCH';
        request.post(url, { body: before, json: true }, (err, res, b) => {
            request.patch(`${url}/${b._id}`, { body: example, json: true }, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                checker(body);
                expect(body.latitude).toEqual(before.latitude);
                expect(body.title).not.toEqual(before.title);
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