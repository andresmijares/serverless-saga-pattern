'use strict'

const AWS = require('aws-sdk')
const co = require('co')
const lambda = new AWS.Lambda();
const Promise = require('bluebird')

const stepfunctions = new AWS.StepFunctions()

module.exports.handler = co.wrap(function* (event, context, callback) {

const {id, date} = event.queryStringParameters
  const stepMachineName = `GetDepartureMachine` 
  
  const machineLists = yield stepfunctions
      .listStateMachines({})
      .promise()
      .then(list => list)
      .catch(err => context.fail(err))

  const execFunctionsParams = machineLists
    .stateMachines
    .filter(sm => sm.name.indexOf(stepMachineName) >= 0)
    .map(sm => {
      return {
        stateMachineArn: sm.stateMachineArn,
        input: JSON.stringify({
          id,
          date,
        })
      }
    })[0]

  const executionArn = yield stepfunctions
    .startExecution(execFunctionsParams)
    .promise()
    .then(({executionArn}) => {
      return executionArn
    })
    .catch(err => context.fail(err))

  const response = {
    statusCode: 200,
    body: JSON.stringify({ "id": executionArn })
  };

  console.log('finish')
  callback(null, response)

})

/*
  console.log(`exec arn`, exec)

  const execHistory = yield stepfunctions
    .getExecutionHistory({
      executionArn: exec
    })
    .promise()
    .then(list => {
      console.log(`list`, list)
    })
*/