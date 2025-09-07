const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const swaggerUi = require('swagger-ui-express');
const pinoHttp = require('pino-http');
const { randomUUID } = require("crypto");
require("dotenv/config");

// Import custom modules
const { Event, EventType, EventSchema } = require('./models/Event');
const scheduleRouter = require('./routers/v1/schedule');
const { requireRole } = require('./helper/permission');
const { catchEndpoints } = require("./helper/openApi");
const { authJwt } = require('./helper/jwt');
const logger = require('./helper/logger');
const { setContext } = require('./helper/context');
const { generateTestToken } = require('./tests/helper/getTestToken');

const app = express();
const PORT = process.env.PORT || 3000;
const api = "/api/v1";

// Middleware
app.use(cors());
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
                path: req.path,
                query: req.query
            };
        }
    }
}));

// Authentication middleware (only in production)
if (process.env.NODE_ENV == 'prod') {
    app.use(authJwt());
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Event model info endpoint - showcases the integrated Event model
app.get('/api/event-model', (req, res) => {
    res.json({
        EventTypes: Object.values(EventType),
        Schema: EventSchema,
        ExampleEvent: {
            time: "2025-09-07T10:00:00Z",
            endTime: "2025-09-07T11:30:00Z",
            title: "Datenbanken II",
            roomId: "room-123",
            courseId: "INF-DB2",
            studyGroup: "INF21A",
            lecturer: "Prof. Dr. Schmidt",
            type: EventType.KURS
        }
    });
});

// API Routes
app.use(api + '/schedule', scheduleRouter);

// Swagger documentation
app.use(api + '/docs', swaggerUi.serve, swaggerUi.setup(catchEndpoints(app)));

// Test login endpoint
app.get(api + "/login", (req, res) => {
    return res.status(200).send(generateTestToken())
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Application Error:', err.message);

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            message: err.message
        });
    }

    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.originalUrl} not found`
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Timetable Service started on port ${PORT}`);
    console.log(`📊 Event Model loaded with types: ${Object.values(EventType).join(', ')}`);
    console.log(`🔗 API available at: http://localhost:${PORT}${api}/schedule`);
    console.log(`📋 Model info at: http://localhost:${PORT}/api/event-model`);
    console.log(`📖 API docs at: http://localhost:${PORT}${api}/docs`);
});

module.exports = app;
