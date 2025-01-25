import fastify from "fastify";
import { knex } from "./database";
import { randomUUID } from "crypto";

const app = fastify()

app.get('/hello', async () => {
    // .insert({
    //     id: randomUUID(),
    //     title: 'Transação de teste',
    //     amount: 1000
    // }).returning('*')
    const transactions = await knex('transactions')
    .where('amount', 100)
    .select('*')

    return transactions
})

app.listen({
    port: 3333
}).then(() => {
    console.log("HTTP Server Running!")
})