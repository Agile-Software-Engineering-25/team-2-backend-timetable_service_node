const listEndpoints = require('express-list-endpoints');
require('dotenv/config');
const fs = require("fs");

const APP_DIR = process.env.APP_DIR
const doc_path = APP_DIR + '/openapi.json';

// Hole alle definierten Endpunkte

function catchEndpoints(app) {
    const endpoints = listEndpoints(app);
    const generatedPaths = {};

    endpoints.forEach(route => {
        const routePath = route.path.replace(/:([a-zA-Z0-9_]+)/g, '{$1}'); // z. B. :id => {id}
        if (!generatedPaths[routePath]) {
            generatedPaths[routePath] = {};
        }

        route.methods.forEach(method => {
            const lowerMethod = method.toLowerCase();
            const tag = extractTagFromPath(route.path);

            generatedPaths[routePath][lowerMethod] = {
                summary: `Auto-generiert: ${method} ${route.path}`,
                tags: [tag],
                parameters: [],

                responses: {
                    200: {
                        description: 'OK',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Erfolg'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };

            // Füge optional einen Request Body hinzu
            if (['post', 'put', 'patch'].includes(lowerMethod)) {
                generatedPaths[routePath][lowerMethod].requestBody = {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                example: {
                                    // Optional: Füge hier Standardfelder ein
                                }
                            }
                        }
                    }
                };
            }

            // Pfadparameter hinzufügen (z. B. {id})
            const pathParamMatches = [...routePath.matchAll(/{([^}]+)}/g)];
            pathParamMatches.forEach(match => {
                generatedPaths[routePath][lowerMethod].parameters.push({
                    name: match[1],
                    in: 'path',
                    required: true,
                    schema: { type: 'string' }
                });
            });
        });
    });


    // Lade vorhandene OpenAPI-Dokumentation, falls vorhanden
    const existingOpenapi = fs.existsSync(doc_path)
        ? JSON.parse(fs.readFileSync(doc_path, 'utf8'))
        : {
            openapi: '3.0.0',
            info: {
                title: 'Auto-generierte API',
                version: '1.0.0',
                description: 'Diese OpenAPI-Dokumentation wurde automatisch aus Routendaten erzeugt.'
            },
            paths: {},
            tags: []
        };

    // Ergänze neue Routen, ohne bestehende zu überschreiben
    Object.entries(generatedPaths).forEach(([routePath, methods]) => {
        if (!existingOpenapi.paths[routePath]) {
            existingOpenapi.paths[routePath] = methods;
        } else {
            Object.entries(methods).forEach(([method, spec]) => {
                if (!existingOpenapi.paths[routePath][method]) {
                    existingOpenapi.paths[routePath][method] = spec;
                }
            });
        }
    });
    fs.writeFileSync(doc_path, JSON.stringify(existingOpenapi, null, 2));

    return existingOpenapi
};
function extractTagFromPath(routePath) {
    const segments = routePath.split('/').filter(Boolean);
    return segments.length >= 3 ? capitalize(segments[2]) : 'General';
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}



module.exports = { catchEndpoints } 