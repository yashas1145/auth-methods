import express from "express";
import axios from "axios";
import btoa from "btoa";

const app = express();
const port = 3000;
const score = 5;
const page = 2;
const apiUrl = "https://secrets-api.appbrewery.com";
const apikey = "36103f34-1412-4f27-aff1-229a46b52539";
const token = "3ad2e719-9db5-4b50-8885-4edd47bca252";

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.get("/noAuth", async (req, res) => {
    try {
        const response = await axios.get(`${apiUrl}/random`);
        res.render("index.ejs", {"data": JSON.stringify(response.data)});
    } catch (err) {
        res.render("index.ejs", {"data": "unable to hit the api [noAuth]"});
    }
});

app.get("/basicAuth", async (req, res) => {
    try {
        const headers = {
            headers: {
                authorization: `Basic ${btoa("yashas:kjm30773")}`
            }
        };
        const response = await axios.get(`${apiUrl}/all?page=${page}`, headers);
        const data = response.data;
        res.render("index.ejs", {"data": JSON.stringify(data[Math.floor(Math.random()*data.length)])});
    } catch (err) {
        res.render("index.ejs", {"data": "unable to hit the api [basicAuth]"});
    }
});

app.get("/apiAuth", async (req, res) => {
    await axios.get(`${apiUrl}/filter?score=${score}&apiKey=${apikey}`)
    .then((response) => {
        const data = response.data;
        res.render("index.ejs", {"data": JSON.stringify(data[Math.floor(Math.random()*data.length)])});
    })
    .catch((err) => {
        res.render("index.ejs", {"data": "unable to hit the api [apiAuth]"});
    });
});

app.get("/tokenAuth", async (req, res) => {
    const headers = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    
    await axios.get(`${apiUrl}/secrets/${Math.floor(Math.random()*10)}`, headers)
    .then((response) => {
        const data = response.data;
        res.render("index.ejs", {"data": JSON.stringify(data)});
    })
    .catch((err) => {
        console.log(err);
        res.render("index.ejs", {"data": "unable to hit the api [tokenAuth]"});
    });
});

app.listen(port, (err) => {
    if(err) throw err;
    console.log(`Server listening on port ${port}`);
})