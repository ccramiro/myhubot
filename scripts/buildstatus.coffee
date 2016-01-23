module.exports = (robot) ->
  robot.respond /(get )?(me )?build status (.*)/i, (msg) ->
    project = escape( msg.match[3] )
    url = 'https://img.shields.io/badge/cms-running-green.svg' + project
    msg.http( url ).get() (err, res, body) ->
      msg.send(res.statusCode)
      passing = body.search /passing/
      if passing != -1
         msg.send 'https://img.shields.io/badge/' + project + '-passing-green.png'
         return
      running = body.search /running/
      if running != -1
         msg.send 'https://img.shields.io/badge/' + project + '-running-blue.png'
         return
      unstable = body.search /unstable/
      if unstable != -1
         msg.send 'https://img.shields.io/badge/' + project + '-unstable-orange.png'
         return
      failing = body.search /failing/
      if failing != -1
         msg.send 'https://img.shields.io/badge/' + project + '-failing-red.png'
         return
      msg.send('dunno bro')
