const express = require("express");
const { RPCObserver } = require("./rpc");
const PORT = 9000;

const app = express();
app.use(express.json());

const fakeCustomerResponse = {
    _id: "yt686tu8763tyyr98734",
    name: "Mike",
    country: "Poland",
}

RPCObserver("CUSTOMER_RPC", fakeCustomerResponse)

app.get("/wishlist", (req,res) => {
    return res.json("Customer Service")
})

app.get("/", (req,res) => {
    return res.json("Customer Service")
})

app.listen(PORT, () => {
    console.log(`Customer is Running on ${PORT}`)
    console.clear()
})