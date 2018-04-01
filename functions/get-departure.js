'use strict'

const AWS = require('aws-sdk')
const co = require('co')
const lambda = new AWS.Lambda();
const Promise = require('bluebird')

module.exports.handler = co.wrap(function* (event, context, callback) {
  const {id, date} = event.queryStringParameters

  const flight = {
    FunctionName: "mediocre-saga-sample-dev-get-flight", 
    InvocationType: "RequestResponse", 
    Payload: JSON.stringify({"id": id})
  }

  const forecast = {
    FunctionName: "mediocre-saga-sample-dev-get-forecast", 
    InvocationType: "RequestResponse", 
    Payload: JSON.stringify({"date": date})
  }

  console.log('exec lambdas')

  const departure = yield Promise.all([
      lambda.invoke(forecast).promise().then(res => res.Payload),
      lambda.invoke(flight).promise().then(res => res.Payload)
    ])
    .then(res => {
      return {
        forecast: JSON.parse(res[0]).body,
        flight: JSON.parse(res[1]).body,
      }
    })

  console.log('exec lambdas completed')

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({"departure": departure})
  })

})
