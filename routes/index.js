var express = require('express');
var router = express.Router();
var path = require('path');


var ziggeoAPIKey = process.env.ZIGGEO_URL;
ziggeoAPIKey = ziggeoAPIKey.substring(ziggeoAPIKey.indexOf('//') + 2, ziggeoAPIKey.lastIndexOf(':'));

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

//var pg = require('pg');
//var conString = process.env.DATABASE_URL || 'postgres://cdegour:@localhost/sHoHealth';

pool.on('error', (err, client) => {
  console.error("unexpected error on idle client", err);
  process.exit(-1);
});

router.get('/', function(req, res, next){
  //res.sendFile(path.join(__dirname + '/../views/index.html'));
  res.render('index', {zigToken: ziggeoAPIKey});
});

router.get('/thanks', function(req, res, next){
  res.sendFile(path.join(__dirname+ '/../views/thankYou.html'));
});


router.get('/player/:videoID', function(req, res, next) {
  res.render('player', { title: 'Express', zigToken: ziggeoAPIKey, videoID: req.params.videoID});
});

router.post('/candidateAdd', (req, res, next) => {
  pool.connect((err, client, done) => {
    if (err) throw err;
    client.query('INSERT INTO "salesforce"."candidate__c"("youtube_video_id__c", "email_address__c", "first_name__c", "last_name__c", "twitter_handle__c", "name") values($1, $2, $3, $4, $5, $6) returning id',
      [req.body.inputVidID, req.body.email, req.body.fname, req.body.lname, req.body.twitter, req.body.fname + ' ' + req.body.lname], (qerr, qres) => {
        if (qerr) {
          console.error(qerr);
          res.send('problem going into the table: ' + qerr + '<br/>');
        } else {
          console.log('insert successful');
          res.sendFile(path.join(__dirname+'/../views/thankYou.html'));
        }
      });
  });
});


module.exports = router;
