import server from "./server";

const { PORT = 5000 } = process.env;

server.listen(PORT, async () => {
  console.log("App Is Running on Localhost, PORT:", PORT);
});
