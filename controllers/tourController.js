const Tour = require('../models/tourModel');

exports.getAllTours = async (req,res) => {
    try {
        const tours = await Tour.find();
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        })
    }
    catch (err) {
        res.status(400).json({
            status: 'failure',
            message: err
        })
    }
}
exports.getStats = async (req,res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: {ratingsAverage: {$gte: 0}}
            },
            {
                $group: {
                    _id: '$difficulty',
                    count: {$sum: 1},
                    numRatings: {$sum: '$ratingsQuantity'},
                    avgRating: {$avg: '$ratingsAverage'},
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'}
                }
            },
            {
                $sort: {
                    numRatings: 1
                }
            },
            {
                $skip: 1
            },
            {
                $limit: 2
            }
        ])
        res.status(200).json({
            status: 'success',
            results: stats.length,
            data: stats
        })
    }
    catch (err) {
        res.status(400).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

exports.getMonthStats = async (req,res) => {
    try {
        const year = req.params.year;
        const stats = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}/01-01`),
                        $lte : new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: {$month: '$startDates'},
                    numTours: {$sum: 1},
                    tours: {$push: '$name'}
                }
            },
            {
                $addFields: {month: '$_id'}
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: {
                    month: 1
                }
            }
        ])
        res.status(200).json({
            status: 'Success',
            results: stats.length,
            data : stats
        })
    }
    catch (err) {
        res.status(400).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}