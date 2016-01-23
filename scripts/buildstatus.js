
module.exports = function(robot) {
  return robot.respond(/(get )?(me )?build status (.*)/i, function(msg) {
    var project, url;
    project = escape(msg.match[3]);
    url = 'https://img.shields.io/badge/cms-running-green.svg' + project;
    return msg.http(url).get()(function(err, res, body) {
      var failing, passing, running, unstable;
      msg.send(res.statusCode);
      passing = body.search(/passing/);
      if (passing !== -1) {
        msg.send('https://img.shields.io/badge/' + project + '-passing-green.png');
        return;
      }
      running = body.search(/running/);
      if (running !== -1) {
        msg.send('https://img.shields.io/badge/' + project + '-running-blue.png');
        return;
      }
      unstable = body.search(/unstable/);
      if (unstable !== -1) {
        msg.send('https://img.shields.io/badge/' + project + '-unstable-orange.png');
        return;
      }
      failing = body.search(/failing/);
      if (failing !== -1) {
        msg.send('https://img.shields.io/badge/' + project + '-failing-red.png');
        return;
      }
      return msg.send('dunno bro');
    });
  });
};
