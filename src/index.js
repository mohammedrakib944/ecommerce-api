const app = require("./app");
const connectDB = require("./config/database");
const { PORT } = require("./secret");

app.listen(PORT, async () => {
  console.log(`App is running on http://localhost:${PORT}`);
  await connectDB();
});
