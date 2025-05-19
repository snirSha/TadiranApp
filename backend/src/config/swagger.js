import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Tadiran API",
            version: "1.0.0",
            description: "API documentation for the backend",
        },
        servers: [{ url: "http://localhost:4000/api" }],
        components: {
            schemas: {
                Warranty: {
                    type: "object",
                    required: ["userId", "clientName", "productInfo", "installationDate", "invoiceUpload", "status"],
                    properties: {
                        userId: { type: "string", description: "User ID linked to the warranty" },
                        clientName: { type: "string", description: "Client's full name" },
                        productInfo: { type: "string", description: "Product details (e.g., Air Conditioner model)" },
                        installationDate: { type: "string", format: "date", description: "Installation date of the product" },
                        invoiceUpload: { type: "string", description: "Uploaded invoice file path" },
                        extractedDate: { type: "string", format: "date", nullable: true, description: "Extracted installation date from invoice" },
                        status: { type: "string", enum: ["Pending", "Approved", "Rejected", "Manual Review"], description: "Current status of the warranty" }
                    }
                },
                User: {
                    type: "object",
                    required: ["name", "email", "password"],
                    properties: {
                        name: { type: "string", description: "User's full name" },
                        email: { type: "string", description: "Unique email address" },
                        password: { type: "string", description: "Hashed password for authentication" }
                    }
                }
            },
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT", 
                },
            },
        },
        security: [
            {
                bearerAuth: [], // Apply globally
            },
        ],
    },
    apis: ["src/routes/*.js"], // Documentation for routers
};

const swaggerSpec = swaggerJSDoc(options);

export default (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};