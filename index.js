const app = require("./src/app");
const connectDB = require("./src/config/database");
const { PORT } = require("./src/secret");

app.listen(PORT, async () => {
  console.log(`App is running on http://localhost:${PORT}`);
  await connectDB();
});
