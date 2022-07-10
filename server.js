const Hapi = require("@hapi/hapi");
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;

const init = async () => {
    const server = Hapi.server({
        host: HOST,
        port: PORT
    });

    await server.start();
    console.log("Server running on %s", server.info.uri);
};

init();