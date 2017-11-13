'use strict'

const cmd = require('node-cmd')

const runcmd = function(cmdstring) {
  return new Promise((resolve, reject) => {
    cmd.get(
      cmdstring,
      function(err, data, stderr){
        if (!err) {
          resolve(data)
        } else {
          reject(err)
        }
      }
    );
  })
}

console.log("\n\n+ Building Project");

runcmd('mkdir -p build')
.then(data => {
  const text = fs.readFileSync('.buildNumber.txt', 'utf8')
  const buildNumber = parseInt(text.slice(0,data.indexOf("\n"))) + 1
  const status = fs.writeFileSync('.buildNumber.txt', buildNumber + '\n', 'utf8')
  return buildNumber
})
.then(data => {
  const fileName = 'build/build_'+ data +'.zip'
  return runcmd('zip '+ fileName +' -r * .[^.]*  -x node_modules/\\* \\*.git\\* build/\\* \\*.DS_Store\\* \\*.md .buildNumber.txt -Z store')
})
.then(data => console.log("\n+ Successful build" + process.argv[2]))
.catch(error => {
  console.log("+ FAILED: Build failed, reason: ", error)
})
