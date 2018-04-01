'use strict'

const {sleep} = require('./utils')

module.exports.handler = (event, context, callback) => {
  const { id } = event.id
  /* long call to another service */
  sleep(3000)

  /* validate date */
  const response = {
    statusCode: 200,
    body: JSON.stringify({ 
      flightId: id,
      status: 'on-time',
      departure: 'EZE',
      destination: 'MTL',
      time: '21:00:00'
    })
  };
  
  callback(null, response)
  
}