
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

// Initialize the env module and define environment variables
env.config();
const apiKey = process.env.API_KEY;
const port = process.env.PORT || 3000;

const auth = {"appid":apiKey};

app.use(bodyParser.urlencoded({extended:true}));

// Set the view engine
app.set('view engine', 'ejs');

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

// Create an object to store all the average temp values for each day
const averageTemps = {dayOne: [], dayTwo: [], dayThree: [], dayFour: [], dayFive:[]};
// JS Object to store average temp values.
const dailyAvgTemps = {
                       dayOne: {dayOfWeek: "" , dayDate: "", avgTemp:0 , avgMinTemp:0, avgMaxTemp:0},
                       dayTwo: {dayOfWeek: "", dayDate: "", avgTemp:0 , avgMinTemp:0, avgMaxTemp:0},
                       dayThree: {dayOfWeek: "", dayDate: "", avgTemp:0 , avgMinTemp:0, avgMaxTemp:0},
                       dayFour: {dayOfWeek: "", dayDate: "", avgTemp:0 , avgMinTemp:0, avgMaxTemp:0},
                       dayFive:{dayOfWeek: "", dayDate: "", avgTemp:0 , avgMinTemp:0, avgMaxTemp:0}
                      }

// Create a function to get the dates
let forecastDates = [];
let forecastDays = []
const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
const daysofWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
function getDates(data){
  for(const item in data){
    const day = daysofWeek[new Date(data[item].dt_txt).getDay()]
    const date = new Date(data[item].dt_txt).getDate() ;
    const month = new Date(data[item].dt_txt).getMonth() ;
    const year = new Date(data[item].dt_txt).getFullYear();
    const finalDate = date + " " + months[month] + " " +year;
    if(!forecastDates.includes(finalDate) || !forecastDays.includes(day)){
      forecastDates.push(finalDate);
      forecastDays.push(day);
    } else{ 
      continue;
      
    }
  }
  return [forecastDates, forecastDays]
}
// Create a function to extract certain data for 5-day forecast
let count = 0;
function dataRetrieval(data){
  // Loop through the data arrray(data.List)
  const [forecastDates, forecastDays] = getDates(data);
  
  for (let item in data){
    //Get the date of each data entry/timestamp Conditional varibale
    const date = new Date(data[item].dt_txt).getDate();
    // Get current date 
    const currentDate = new Date(data[0].dt_txt).getDate();
    // Use Switch Statement to execute certain codeblocks
    switch (date) {
      case (currentDate + 1):
        // Day 2
        averageTemps.dayTwo.push(data[item].main.temp);
        break;
      case (currentDate + 2):
        // Day 3
        averageTemps.dayThree.push(data[item].main.temp);
        break;
      case (currentDate + 3):
        // Day 4
        averageTemps.dayFour.push(data[item].main.temp);
        break;
      case (currentDate + 4):
        // Day 5
        averageTemps.dayFive.push(data[item].main.temp);
        break;
      default:
        averageTemps.dayOne.push(data[item].main.temp);
    }
  }

  // Variable to initialize sum
  let sum = null;
  //Function to fimd the sum of an array
  function findSum(array){
    sum = 0
    array.forEach(num =>{
      sum += num;
    })
    return sum
  }
  // TODO: Refactor the code. Its repetitive, and can be condensed to have more elegant code.
  // Get the average temp, and the average max and min : DAY ONE
  dailyAvgTemps.dayOne.avgTemp = (Math.round(findSum(averageTemps.dayOne)/averageTemps.dayOne.length)*100)/100;
  dailyAvgTemps.dayOne.avgMaxTemp = Math.round(Math.max(...averageTemps.dayOne)*100)/100;
  dailyAvgTemps.dayOne.avgMinTemp = Math.round(Math.min(...averageTemps.dayOne)*100)/100;
  dailyAvgTemps.dayOne.dayDate = forecastDates[1]
  dailyAvgTemps.dayOne.dayOfWeek = forecastDays[1]
        
  // Get the average temp, and the average max and min : DAY TWO
  dailyAvgTemps.dayTwo.avgTemp = Math.round((findSum(averageTemps.dayTwo)/averageTemps.dayTwo.length)*100)/100;
  dailyAvgTemps.dayTwo.avgMaxTemp = Math.round(Math.max(...averageTemps.dayTwo)*100)/100;
  dailyAvgTemps.dayTwo.avgMinTemp = Math.round(Math.min(...averageTemps.dayTwo)*100)/100;
  dailyAvgTemps.dayTwo.dayDate = forecastDates[2]
  dailyAvgTemps.dayTwo.dayOfWeek = forecastDays[2]
  
  // Get the average temp, and the average max and min : DAY THREE
  dailyAvgTemps.dayThree.avgTemp = Math.round((findSum(averageTemps.dayThree)/averageTemps.dayThree.length)*100)/100;
  dailyAvgTemps.dayThree.avgMaxTemp = Math.round(Math.max(...averageTemps.dayThree)*100)/100;
  dailyAvgTemps.dayThree.avgMinTemp = Math.round(Math.min(...averageTemps.dayThree)*100)/100;
  dailyAvgTemps.dayThree.dayDate = forecastDates[3]
  dailyAvgTemps.dayThree.dayOfWeek = forecastDays[3]
        
  // Get the average temp, and the average max and min : DAY FOUR
  dailyAvgTemps.dayFour.avgTemp = Math.round((findSum(averageTemps.dayFour)/averageTemps.dayFour.length)*100)/100;
  dailyAvgTemps.dayFour.avgMaxTemp = Math.round(Math.max(...averageTemps.dayFour)*100)/100;
  dailyAvgTemps.dayFour.avgMinTemp = Math.round(Math.min(...averageTemps.dayFour)*100)/100;
  dailyAvgTemps.dayFour.dayDate = forecastDates[4]
  dailyAvgTemps.dayFour.dayOfWeek = forecastDays[4]
       
  // Get the average temp, and the average max and min : DAY FIVE
  dailyAvgTemps.dayFive.avgTemp = Math.round((findSum(averageTemps.dayFive)/averageTemps.dayFive.length)*100)/100;
  dailyAvgTemps.dayFive.avgMaxTemp = Math.round(Math.max(...averageTemps.dayFive)*100)/100;
  dailyAvgTemps.dayFive.avgMinTemp = Math.round(Math.min(...averageTemps.dayFive)*100)/100;
  dailyAvgTemps.dayFive.dayDate = forecastDates[5]
  dailyAvgTemps.dayFive.dayOfWeek = forecastDays[5]
   
  // Return the Dailiy Average Temp Readings
 return dailyAvgTemps
}

//Post request to view response from API call
app.post("/results", async (req, res) => {
  // Get data that the user entered using body-parser
  let userCity = req.body.userCity;
  let userCountryCode = req.body.userCountryCode;
  //Add a try catch block to catch errors
  try {
    // API URL to get Current Weather forecast
    const apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userCity + "," + userCountryCode +"&units=metric&appid=" + apiKey;
    // API URL for 7 Day forecast
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

    //Apply data retrieval function to get desired temps
    const dailyTemps = dataRetrieval(result_2.list);
    console.log(dailyTemps);

    //Render results ejs page and convert the JS Object into a string
    res.render("results.ejs", {data: result, iconURL:iconURL, dailyTemps: dailyTemps});
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

