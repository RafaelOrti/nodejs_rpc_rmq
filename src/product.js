const express = require("express");
const { RPCObserver, RPCRequest } = require("./rpc");
const PORT = 7000;

const app = express();
app.use(express.json());

const fakeProductResponse = {
    _id: "yt686tu8763tyyr98734",
    title: "iPhone",
    PRICE: "600",
}

RPCObserver("PRODUCT_RPC", fakeProductResponse)

app.get("/customer", async (req,res) => {
    const requestPayload = {
        customerId: "yt686tu8763tyyr98734",
    };
    try {
        const responseData = await RPCRequest("CUSTOMER_RPC", requestPayload);
        console.log(responseData);
        return res.status(200).json(responseData);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
})

app.get("/", (req,res) => {
    return res.json("Products Service")
})

app.listen(PORT, () => {
    console.log(`Products is Running on ${PORT}`)
    console.clear()
})