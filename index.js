'use strict'

//
// Imports
//

const cluster = require('cluster')

//
// AWS Cluster setup
//

if (cluster.isMaster) {
  var cpuCount = require('os').cpus().length

  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
      cluster.fork()
  }

  // Listen for terminating workers
  cluster.on('exit', function (worker) {
      // Replace the terminated workers
      console.log('Worker ' + worker.id + ' died :(')
      cluster.fork()
  })

} else {

  //
  // Imports
  //

  const AWS     = require('aws-sdk')
  const express = require('express')
  const path    = require('path')
  const http    = require('http')

  const app     = express()

  AWS.config.region = process.env.REGION

  app.set('port', process.env.PORT || 3000)

  //
  // Send an asset
  //

  app.get('/public/*', function (req, res) {
    const filePath = __dirname + "/public" + req.path
    res.sendFile(path.join(filePath))
  })

  //
  // Catch-all
  //

  app.get('*', function (req, res) {
    if (false) return res.status(404).send('Not found')
    else return res.status(200).send()
  })

  //
  // Start Server
  //

  app.listen(app.get('port'), function () {
    console.log('+ Server running on localhost:' + app.get('port') + " in mode: " + app.get('env'))
  })

}
