var Movie = require('./models/Movie')
var path = require('path')

module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls


	app.get('/api/movies', function (req, res) {
        //use mongoose to get all movies from the database
        Movie.find().sort({year: 1}).exec( function(err, movies){
            if(err){
                res.send(err);
            }else{
                res.json(movies);
            }
        });
    });

    app.post('/api/movies', function (req, res) {
    	var newData = { // this way protects the data
    		title: req.body.title,
    		year: req.body.year,
    		director: req.body.director
    	}
    	// console.log(newData)
    	var newMovie = new Movie(newData)
    	newMovie.save(function (err, newMovie) {

			if (err) {
	            res.status(500);
	            res.json({
	                status: 500,
	                error: err
	            });
	            res.end();
	        }
	        else {
	            res.json({
	                status: 200,
	                newMovie: newMovie
	            });
	            res.end();
	        }
		});
    });

    app.put('/api/movies/:id', function (req, res) {
    	// console.log(req.body)
    	var updateData = { // this way protects the data
    		title: req.body.title,
    		year: req.body.year,
    		director: req.body.director,
    		watched: req.body.watched,
    		rating: req.body.rating
    	}

    	Movie.update({_id: req.body._id}, updateData, function(err, movie) {
    		if (err) {
	            res.status(500);
	            res.json({
	                status: 500,
	                error: err
	            });
	            res.end();
	        }
	        else {
	            res.json({
	                status: 200,
	                movie: movie
	            });
	            res.end();
	        }
    	});
    });

    app.delete('/api/movies/:id', function(req, res) {
    	// console.log('deleting from routes', req.params)
        Movie.remove({_id: req.params.id }, function(err, movie) {
        	if (err) {
	            res.status(500);
	            res.json({
	                status: 500,
	                error: err
	            });
	            res.end();
	        }
	        else {
	            res.json({
	                status: 200,
	                message: 'Movie successfully deleted'
	            });
	            res.end();
	        } 	
        });
    });

	// authentication routes

	// frontend routes =========================================================
	// route to handle all angular requests

	app.all('/*', function(req, res, next) {
		// console.log(req.url)
		var arbitraryUrls = ['partials', 'api'];
		if (arbitraryUrls.indexOf(req.url.split('/')[1]) > -1) {
			// console.log('going next')
			next();
		} else {
			// console.log('not going next')
			res.render('layout');
		}
	});

	app.get('/partials/*', function(req, res, next) {
		// console.log('the path', req.path)
		res.render('.' + req.path);
	});

};