//WebSocket
import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
    console.log("New client connected");

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

// Function to broadcast updates to all connected clients
export const broadcastUpdate = (data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};