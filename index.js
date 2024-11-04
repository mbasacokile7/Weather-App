
//Import the packags to be used
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import env from "dotenv"
 

//When dealing with files, we use native node packages
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
// Initialize the env module
env.config();
const apiKey = process.env.API_KEY;

const auth = {"appid":apiKey};

app.use(bodyParser.urlencoded({extended:true}));

//Allow express to access the static
app.use(express.static("public"));

//HTTP Requests
// For accessing any files while handling requests, using the following directory: __dirname + "/public/index.html, as the endpoint."
// FOr EJS files. Store the EJS files a folder called VIEWS. Then to render them: In the paramter of the res.render function, simply write the file name as a string


// --- HTTP Requests --- //
// This will render the landing page;
app.get("/", async (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
  });

// Get Request to redirect to the landing page
app.get("/return", (req, res) =>{
  res.redirect("/");
});

//Post request to view response from API call
app.post("/results", async (req, res) => {
  // Get data that the user entered using body-parser
  let userCity = req.body.userCity;
  let userCountryCode = req.body.userCountryCode;
  //Add a try catch block to catch errors
  try {
    // API URL to get Current Weather forecast
    const apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userCity + "," + userCountryCode +"&units=metric&appid=" + apiKey;
    // API URL for 5 Day forecast
    const apiURL_2 = "https://api.openweathermap.org/data/2.5/forecast?q=" + userCity + "," + userCountryCode + "&units=metric&appid=" + apiKey;
    // Use Promise.all() to make parallel requests, to make the app fast
    const [response, response_2] = await Promise.all([
      axios.get(apiURL),
      axios.get(apiURL_2)
    ]);
    //Store Current Temp forecast data
    const result = response.data;
    // Get URL to render icons
    let iconURL = "http://openweathermap.org/img/wn/" + result.weather[0].icon + "@2x.png";
   
    //Store 5 Day Forecast data
    const result_2 = response_2.data
    console.log(result_2);
    //Render results ejs page and convert the JS Object into a string
    res.render("results.ejs", {data: result, iconURL:iconURL});
  } catch (error) {
    // Render the error page if there is an error
    res.render("error.ejs");
    console.log(error);
  }
})



// Initialise the Server on Port 3000(Can change)
app.listen(port, ()=>{
    console.log(`The server is running on Port: ${port}`);
});
