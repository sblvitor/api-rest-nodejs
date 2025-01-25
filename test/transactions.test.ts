import {  test, beforeAll, afterAll, describe, it, expect } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
import { execSync } from 'node:child_process'
import { beforeEach } from 'node:test'

describe('Transactions routes', () => {
    beforeAll(async () => {
        // execSync('npm run knex migrate:latest')
        await app.ready()
    })
    
    afterAll(async () => {
        await app.close()
    })
    
    beforeEach(() => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
    })

    test('user can create a new transaction', async () => {
         await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 5000,
                type: 'credit'
            })
            .expect(201)
    })

    it('should be able to list all transactions', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 5000,
                type: 'credit'
            })
        
        const cookies = createTransactionResponse.get('Set-Cookie');
        console.log(cookies);
        const listTransactionsResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies ?? [])
            .expect(200);

        expect(listTransactionsResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: 'New transaction',
                amount: 5000
            })
        ])
    })
})

