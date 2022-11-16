const express = require('express');
const exphbs  = require('express-handlebars');
const port = process.env.PORT || 3000;
const HOST = 'http://mau-mp-ecommerce-nodejs.herokuapp.com';

const mercadopago = require('mercadopago');
mercadopago.configure({
    access_token: 'APP_USR-8709825494258279-092911-227a84b3ec8d8b30fff364888abeb67a-1160706432',
    integrator_id: 'dev_24c65fb163bf11ea96500242ac130004'

});

const app = express();
app.use(express.json());
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets')); 
app.use('/assets', express.static(__dirname + '/assets'));

// GET's methods
app.get('/', function (req, res) {
    res.render('home');
});
app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});
app.get('/status', (req, res) => {
    res.render('status', req.query);
});

// POST's methods
app.post('/checkout', (req, res)=>{
    const { body } = req;
    const preference = {
        items: [
            {
                id: 4321,
                title: body.title,
                description: "Dispositivo móvil de Tienda e-commerce",
                picture_url: body.picture_url,
                quantity: parseInt(body.quantity),
                unit_price: parseFloat(body.price),
                category_id: 'phones',
                currency_id: 'ARS'
            }
        ],
        payer: {
            name: "Lalo",
            last_name: "Landa",
            email: "test_user_36961754@testuser.com",
            phone: {
                area_code: "54",
                number: 1126723038
            },
            address: {
                street_name: "calle falsa",
                street_number: 123,
                zip_code: "1606"
            }
        },
        external_reference: "fernandeznm24@gmail.com",
        payment_methods: {
            excluded_payment_methods: [
                {
                    id: "visa"
                }
            ],
            installments: 6
        },
        back_urls: {
            success: HOST + '/status',
            failure: HOST + '/status',
            pending: HOST + '/status'
        },
        notification_url: HOST + '/webhook',
        auto_return: "approved"
    };

    mercadopago.preferences.create(preference)
        .then(response => {
            console.log(response.body);
            return res.send({id: response.body.id, init_point: response.body.init_point});
        })
        .catch(e => console.log(e))
});

app.post('/webhook', (req, res) => {
    console.log(req.body, "Webhook");
    res.status(200).send(req.body);
    return 'OK'
});

app.listen(port);