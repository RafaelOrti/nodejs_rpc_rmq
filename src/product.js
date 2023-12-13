const express = require("express");
const { RPCObserver } = require("./rpc");
const PORT = 7000;

const app = express();
app.use(express.json());

const fakeProductResponse = {
    _id: "yt686tu8763tyyr98734",
    title: "iPhone",
    PRICE: "600",
}

RPCObserver("PRODUCT_RPC", fakeProductResponse)

app.get("/customer", (req,res) => {
    return res.json("Products Service")
})

app.get("/", (req,res) => {
    return res.json("Products Service")
})

app.listen(PORT, () => {
    console.log(`Products is Running on ${PORT}`)
    console.clear()
})