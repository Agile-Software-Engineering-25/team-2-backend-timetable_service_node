// app.test.js
//Massiver Copy Paste aus meinem Projekt und dient nur der Struktur
///////
///////

///////

///////
///////
///////

///////

const request = require('supertest');
const app = require('../../../app.js');
const { getConnection, closeAllPools } = require('../../helper/db/getCon.js');
const { generateTestToken } = require('../helper/getTestToken.js');

beforeAll(async () => {
    // Optional: Tabelle für Tests vorbereiten
    const connection = await getConnection()
    await connection.query('INSERT IGNORE INTO `order` (ID, shipper, customer_id) VALUES (2, "Shop", 3)');

});

afterEach(async () => {
    const connection = await getConnection()

    // await connection.query('DELETE FROM `order`');
});

afterAll(async () => {
    await closeAllPools();
});

describe('POST /api/v2/orders', () => {
    it('should insert a new order', async () => {
        const data = {
            discount: "0",
            first_name: " ",
            last_name: " ",
            nickname: "",
            phone: "",
            street: "",
            number: "",
            addition: "",
            postcode: "",
            city: "",
            country: "",
            cart: [
                {
                    id: 134
                },
                {
                    id: 1699
                },
                {
                    id: 12
                },
                {
                    id: 16
                }
            ],
            customer_id: 502,
            shipper: "Ebay",
            total: 0
        };


        const response = await request(app)
            .post('/api/v2/orders')
            .send(data)
            .set('Authorization', `Bearer ${generateTestToken()}`)
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body.orderId).toBeDefined();
        console.log(response.body)
        const connection = await getConnection()
        // Prüfen, ob Eintrag in DB ist
        const [rows] = await connection.query('SELECT * FROM `order` WHERE ID = ?', [response.body.orderId]);
        expect(rows).toBeDefined();
        expect(rows.customer_id).toBe(data.customer_id)
        expect(rows.shipper).toBe(data.shipper);


        const [coinorder] = await connection.query("SELECT SUM(vk_price * ammount) as coin_total, SUM(summ) as total, COUNT(*) as amount, SUM(ammount) as total_amount FROM coinorder JOIN coin ON coin.coin_id = coinorder.coin_id WHERE ID = ? ", response.body.orderId)
        expect(coinorder.amount).toBe(data.cart.length);

    });
});
describe('POST /api/v2/orders/customer/:id', () => {
    it('should change the customer of an order', async () => {
        const data = {
            customer_id: 5
        };
        const orderId = 2
        const response = await request(app)
            .post('/api/v2/orders/customer/' + orderId)
            .send(data)
            .set('Authorization', `Bearer ${generateTestToken()}`)
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body.resp).toBe("Success");
        const connection = await getConnection()
        // Prüfen, ob Eintrag in DB ist
        const [rows] = await connection.query('SELECT * FROM `order` WHERE ID = ?', [orderId]);
        // await new Promise(r => setTimeout(r, 100)); // 100ms warten

        expect(rows).toBeDefined();
        expect(rows.customer_id).toBe(data.customer_id)
    });
});
