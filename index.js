var express = require('express')
var http = require('http')
var bodyParser = require('body-parser')
var app = express()
require('dotenv').config()

const createApp = require('github-app')

const githubApp = createApp({
    id: process.env.APP_ID,
    cert: process.env.APP_KEY
})

const port = process.env.PORT || 6000
http.createServer(app).listen(port, function() {
  console.log('Listening on ', port)
});

app.use(bodyParser());

app.post('/github-app', function(req, res) {
    if (req.body.action = 'created') {
        console.log("Installed app:")
        console.log(req.body)
    }

    res.sendStatus(200)
})

app.post('/', function(req, res) {
    console.dir(req.body)

    githubApp.asApp().then(github => {
        github.apps.getInstallations({}).then(installations => {
            console.log("Installations:")
            console.log(installations.data)
            var installation = installations.data.find(install => {
                return install.account.login === req.body.organization
            })
            var commentText = "This issue was moved to " + req.body.to_pipeline_name + " on ZenHub."

            githubApp.asInstallation(installation.id).issues.createComment({
                owner: req.body.organization,
                repo: req.body.repo,
                issue_number: req.body.issue_number,
                body: commentText
            }).then(({ data }) => {
                console.log(data)
            }).catch((err) => {
                console.log("ERROR:", err)
            })

        })

    })



})