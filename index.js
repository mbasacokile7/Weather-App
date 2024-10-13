
//Import the packags to be used
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

//When dealing with files, we use native node packages
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({extended:true}));

//Allow express to access the static
app.use(express.static("public"));

//HTTP Requests
// For accessing any files while handling requests, using the following directory: __dirname + "/public/index.html, as the endpoint."
// FOr EJS files. Store the EJS files a folder called VIEWS. Then to render them: In the paramter of the res.render function, simply write the file name as a string


// --- HTTP Requests --- //
app.get("/", async (req, res) => {
    res.send('We are live boi');
  });


//Initialise the Server on Port 3000(Can change)
app.listen(port, ()=>{
    console.log(`The server is running on Port: ${port}`);
});
