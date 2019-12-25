const CronJob = require('cron').CronJob;
const Auction = require('../models/auction');

const job = new CronJob('*/5 * * * * *', function() {
	const d = new Date();
    console.log('Date: ', d);
    Auction.findOne({name: "Sofia"})
    .then(result => {
        console.log(result)
        result.active = false;
        result.save()
        .then(result =>{
            console.log(result);
        })
    })

});

module.exports = function(){
    console.log('Before job instantiation');
    console.log('After job instantiation');
    job.start();
}

