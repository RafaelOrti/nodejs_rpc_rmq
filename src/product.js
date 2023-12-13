const express = require("express");
const PORT = 7000;

const app = express();
app.use(express.json());

app.get("/products", (req,res) => {
    return res.json("Products Service")
})

app.get("/", (req,res) => {
    return res.json("Products Service")
})

app.listen(PORT, () => {
    console.log(`Products is Running on ${PORT}`)
    console.clear()
})