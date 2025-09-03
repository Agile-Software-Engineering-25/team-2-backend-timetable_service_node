const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const { catchEndpoints } = require("./helper/openApi");
const { authJwt } = require('./helper/jwt');

const pinoHttp = require('pino-http');
const logger = require('./helper/logger');
const { setContext } = require('./helper/context');
const { randomUUID } = require("crypto")

require("dotenv/config");


//middleware
app.use(bodyParser.json());


app.use((req, res, next) => {
    setContext({ path: req.path, method: req.method, next });
});

app.use(pinoHttp({
    logger,
    customLogLevel: function (res, err) {
        if (res.statusCode >= 500) return 'error'
        if (res.statusCode >= 400) return 'warn'
        return 'info'
    },
    serializers: {
        req(req) {
            return {
                method: req.method,
                url: req.url,
                path: req.path,       // 👈 explizit Pfad loggen
                query: req.query
            };
        }
    }
}));

// if (process.env.NODE_ENV == 'prod') {
app.use(authJwt());
// }
//Routers
const scheduleRouter = require("./routers/v1/schedule");
const { initDB, query } = require('./helper/getCon');
const { generateAccessToken } = require('./helper/accessToken');

const api = "/api/v1";

app.use(`${api}/schedule`, scheduleRouter);


app.use(api + '/docs', swaggerUi.serve, swaggerUi.setup(catchEndpoints(app)));
app.get(api + "/login", (req, res) => {
    return res.status(200).send(generateAccessToken({
        "realm_access": {
            "roles": [
                "testabc",
                "offline_access",
                "uma_authorization",
                "default-roles-hvs2"
            ]
        },
        "resource_access": {
            "account": {
                "roles": [
                    "manage-account",
                    "manage-account-links",
                    "view-profile"
                ]
            }
        },
        "scope": "openid email profile",
        "email_verified": false,
        "name": "Luca Schmitz",
        "preferred_username": "test2",
        "given_name": "Luca",
        "family_name": "Schmitz",
        "email": "newuser@example.com"
    }))
});

if (process.env.NODE_ENV != 'test') {
    app.listen(
        process.env.NODE_ENV !== "prod" ? process.env.TEST_PORT : process.env.PROD_PORT,
        async () => {
            await initDB()


            console.log("Start Up")

            console.log(
                "Server is running now on the URL http://localhost:" +
                (process.env.NODE_ENV !== "prod" ? process.env.TEST_PORT : process.env.PROD_PORT)
            );
        }
    );
}
module.exports = app