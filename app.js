const fs = require('fs')
const express = require('express')
const morgan = require('morgan')

const app = express()

// 1) MIDDLEWARES
app.use(morgan('dev'))

app.use(express.json())

app.use((req, res, next) => {
    console.log('Hello from the middleware')
    next()
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tour-simple.json`))

// 2) ROUTE HANDLERS

const getAllTours = (req, res) => {
    res.status(200).json({ 
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
     })
}

const getTour = (req, res) => {
    const id = req.params.id * 1

    if(id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    const tour = tours.find(el => el.id === id)

    res.status(200).json({ 
        status: 'success',
        data: {
            tour
        }
     })
}

const createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1
    const newTour = Object.assign({id: newId}, req.body)
    
    tours.push(newTour)

    fs.writeFile(`${__dirname}/dev-data/data/tour-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })
}

const updateTour = (req, res) => {
    const id = req.params.id * 1

    if(id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour>'
        }
    })
}

const deleteTour = (req, res) => {
    const id = req.params.id * 1

    if(id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
}

// 3) ROUTES

app
    .route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour)
app
    .route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)

// 4) START SERVER

const port = 3000
app.listen(port, () => {
    console.log(`App running on port ${port}`)
})
