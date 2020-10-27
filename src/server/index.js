const express = require('express')
const app = express()
const csv = require('csv-parser')
const fs = require('fs')
const filepath = 'flyers_data.csv'

app.use(express.static('dist'))

//api/flyers?page=1&limit=100
app.get("/api/flyers", (req, res) => {
    let flyersData = []
    fs.createReadStream(filepath)
    .on('error', (error) => {
        // handle error
        console.log('error:',error)
    })
    .pipe(csv())
    .on('data', (row) => {
        if(flyersData.length < req.query.limit)
        flyersData.push(row)
    })
    .on('end', () => {
        //send data
        res.send({ flyersData })
        //clear array
        flyersData = []
    })
})

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`))
