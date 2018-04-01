'use strict'

const {sleep} = require('./utils')

module.exports.handler = (event, context, callback) => {
  const {date} = event

  /* long call to another service */
  sleep(5000)

  /* validate date */
  const response = {
    statusCode: 200,
    body: JSON.stringify({ "message": "The forecast is cloudy" })
  };
  callback(null, response)
  
}
