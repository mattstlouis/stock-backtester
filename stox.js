//var express = require('express');
//var app = express();
var oauth = require('oauth');
var mysql = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 't00rt00r'
});

conn.connect();

// Setup key/secret for authentication and API endpoint URL
var configuration = {
  api_url: "https://api.tradeking.com/v1",
  consumer_key: "Ju1IojpiVHS81ClEnX9PlsRyYOoqNatI1J8NQkxH ",
  consumer_secret: "d9L4nBZ4T2WMaIBtYHzGcV2a1uMhLm4mGsCeBrVq",
  access_token: "38UD2PcFN1VoMN6hAs3OoG6IMMWHxaIKUuDL9p1p",
  access_secret: "IrWAUi1ll9oblGaig0LPFvY8VVPrlbj9pfDRMeFR"
}

// Setup the OAuth Consumer
var tradeking_consumer = new oauth.OAuth(
  "https://developers.tradeking.com/oauth/request_token",
  "https://developers.tradeking.com/oauth/access_token",
  configuration.consumer_key,
  configuration.consumer_secret,
  "1.0",
  "http://mywebsite.com/tradeking/callback",
  "HMAC-SHA1");

function runHistorical(){
	
	getHistoricalQuotes('NOK', time);
	//updateStock('MSFT', time);
	//updateStock('GOOG', time);
	
}

function getHistoricalQuotes(stock, date){

	var start_date = '2015-05-08';

	conn.query('truncate table stox.' + stock);
	
	tradeking_consumer.get(configuration.api_url+'/market/timesales.json?symbols=' + stock + '&startdate=' + start_date + '&interval=tick&rpp=1000', configuration.access_token, configuration.access_secret, function(error, data, response) {
	
		var stock_data = JSON.parse(data);
	
		conn.query('create table stox.' + stock + ' (id int(11) NOT NULL AUTO_INCREMENT, price double, volume int(11), timestamp timestamp, PRIMARY KEY (id))', function(error, result){    	
			for(var i = 0; i < stock_data.response.quotes.quote.length; i++){
				var quote = stock_data.response.quotes.quote[i];
				var date = new Date(quote.timestamp * 1000);
				conn.query('insert into stox.' + stock + ' (price, volume, timestamp) values (?,?,?)', [quote.last, quote.vl, date]);
			}
		});
	  }
	);
}

updateData();

//app.listen(3000);
