const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const app = express();

const port = process.env.PORT || 8080;

// Inbuild Middleware
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: true }));

// View Engine Setup
app.set('views',path.join(__dirname,'templates/views'));
app.set('view engine','ejs');

app.get('',function(req,res){
    res.render('weather',{
        city: null,
                des: null,
                icon: null,
                temp: null,
                temp_min: null,
                temp_max: null
    })
});

app.get('/about',function(req,res){
    res.render('about',{})
});

app.get('/help',function(req,res){
    res.render('help',{
        helpText: 'Feel free to mail us at kulkarnisiddhesh29@gmail.com'
    })
});

app.get('/weather',async function(req,res){
    const myCity = req.query.city;
   // console.log(req.query.city);
    const url_api = `https://api.openweathermap.org/data/2.5/weather?q=${myCity}&appid=872291a5a7a05cf77598f5a580d41011&units=metric`;

    try {
        await fetch(url_api)
          .then(res => res.json())
          .then(data => {
            if (data.message === 'city not found') {
              res.render('weather', {
                city: "Please enter a valid city name!!!",
                des: null,
                icon: null,
                temp: null,
                temp_min: null,
                temp_max: null
              })
            } else {
              const city = data.name;
              const des = data.weather[0].main;
              const icon = data.weather[0].icon;
              const temp = data.main.temp;
              const temp_min = Math.floor(data.main.temp_min);   
              const temp_max = Math.floor(data.main.temp_max);
    
              res.render('weather', {
                city, des, icon, temp , temp_min , temp_max
              });
            }
          });
    
      } catch (err) {
        res.render('weather', {
          city: 'Something went Wrong!!!',
          des: null,
          icon: null,
          temp: null,
          temp_min: null,
          temp_max: null
        })
      }

});

app.get('*',function(req,res){
    res.render('404',{
        errorMsg: '404' 
    })
});

app.listen(port,function(error){
    if(error) throw error
    console.log("Server created Successfully")
});