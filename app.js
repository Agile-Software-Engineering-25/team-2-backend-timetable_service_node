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
const { initDB } = require('./helper/getCon');
const { generateTestToken } = require('./tests/helper/getTestToken');

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173'],   // React Dev-Server
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
}));
app.use(bodyParser.json());
app.options('*', cors());

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
                path: req.path,
                query: req.query
            };
        }
    }
}));

const api = "/api/v1";

app.get("/", (req, res) => res.redirect(`${api}/docs`));

// offene Routen
app.use(api + '/docs', swaggerUi.serve, swaggerUi.setup(catchEndpoints(app)));
app.get(api + "/login", (req, res) => {
    return res.status(200).send(generateTestToken())
});

app.get("/health", (req, res) => res.status(200).send("OK"));

// Authentication middleware (only in production)
// if (process.env.NODE_ENV == 'prod') {
app.use(authJwt());
// }

//Routers
const scheduleRouter = require("./routers/v1/schedule");
app.use(`${api}/schedule`, scheduleRouter);

async function startServer() {
    await initDB()
    const port = process.env.NODE_ENV !== "prod" ? process.env.TEST_PORT : process.env.PROD_PORT
    const server = app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`)
    })
    return server
}


if (require.main === module) {
    startServer()
}

module.exports = { app, startServer }