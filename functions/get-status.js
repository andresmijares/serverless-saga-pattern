'use strict'

const AWS = require('aws-sdk')
const co = require('co')
const lambda = new AWS.Lambda();
const Promise = require('bluebird')

const stepfunctions = new AWS.StepFunctions()

module.exports.handler = co.wrap(function* (event, context, callback) {

  const {id} = event.queryStringParameters

  const departure = yield stepfunctions
    .getExecutionHistory({
      executionArn: id
    })
    .promise()
    .then(res => {
      const list = res.events
      .filter(l => l.type === 'PassStateEntered')
      .map(m => {
        return {
          flight: JSON.parse(m.stateEnteredEventDetails.input)[0].body,
          forecast: JSON.parse(m.stateEnteredEventDetails.input)[1].body
        }
      })[0]
      return list
    })

  const response = {
    statusCode: 200,
    body: JSON.stringify({ "executionArn": id, departure })
  };
  
  callback(null, response)

})

