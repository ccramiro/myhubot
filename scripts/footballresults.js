var footballApiKey, leagueTables, teams;

teams = {
  koln: 1,
  blv: 3,
  bvb: 4,
  bmn: 5,
  bfc: 5,
  s04: 6,
  wob: 11,
  bmg: 18,
  dus: 24,
  afc: 57,
  arsenal: 57,
  avfc: 58,
  cfc: 61,
  efc: 62,
  fulham: 63,
  liv: 64,
  lfc: 64,
  manc: 65,
  mcfc: 65,
  mufc: 66,
  manu: 66,
  thfc: 73,
  bil: 77,
  ath: 77,
  atm: 78,
  fcb: 81,
  fcg: 82,
  mal: 84,
  rma: 86,
  mad: 86,
  rss: 92,
  vcf: 94,
  val: 95
};

leagueTables = {
  primera: 399,
  bundesliga: 394,
  premier: 398,
  ligue1: 396,
  ligue: 396,
  serie: 401,
  seriea: 401
};

footballApiKey = process.env.HUBOT_FOOTBALL_ACCOUNT_KEY;

if (!footballApiKey) {
  console.log("You must enter your HUBOT_FOOTBALL_ACCOUNT_KEY in your environment variables");
}

module.exports = function(robot) {
  robot.respond(/(get )?(me )?(last )?result (.*)/i, function(msg) {
    var team, url;
    team = escape(msg.match[4]);
    url = 'http://api.football-data.org/alpha/teams/' + teams[team] + '/fixtures';
    return msg.http(url).headers({
      'X-Auth-Token': footballApiKey,
      Accept: 'application/json'
    }).get()(function(err, res, body) {
      var first, json, key, last, value;
      json = JSON.parse(body);
      first = json.fixtures;
      if (!first) {
        msg.send(team + '? Is that really a football team? Couldn\'t find it, sorry dude');
        return;
      }
      for (key in first) {
        value = first[key];
        if (value.status === 'TIMED') {
          break;
        } else {
          last = value;
        }
      }
      return msg.send(last.homeTeamName + ' ' + last.result.goalsHomeTeam + ' - ' + last.result.goalsAwayTeam + ' ' + last.awayTeamName);
    });
  });
  robot.respond(/(get )?(me )?(next )?match (.*)/i, function(msg) {
    var team, url;
    team = escape(msg.match[4]);
    url = 'http://api.football-data.org/alpha/teams/' + teams[team] + '/fixtures';
    return msg.http(url).headers({
      'X-Auth-Token': footballApiKey,
      Accept: 'application/json'
    }).get()(function(err, res, body) {
      var first, json, key, last, value;
      json = JSON.parse(body);
      first = json.fixtures;
      if (!first) {
        msg.send(team + '? No idea what that is, sorry man');
        return;
      }
      for (key in first) {
        value = first[key];
        last = value;
        if (value.status === 'TIMED') {
          break;
        }
      }
      return msg.send(last.homeTeamName + ' - ' + last.awayTeamName + ' will be on ' + last.date);
    });
  });
  return robot.respond(/(get )?(me )?(league )?table (.*)/i, function(msg) {
    var leaguetable, url;
    leaguetable = escape(msg.match[4]);
    url = 'http://api.football-data.org/alpha/soccerseasons/' + leagueTables[leaguetable.toLowerCase()] + '/leagueTable';
    return msg.http(url).headers({
      'X-Auth-Token': footballApiKey,
      Accept: 'application/json'
    }).get()(function(err, res, body) {
      var json, key, message, positions, value;
      json = JSON.parse(body);
      positions = json.standing;
      if (!positions) {
        msg.send(leaguetable + '? I can\'t find that league, I am sorry bro');
        return;
      }
      message = json.leagueCaption + ' - Match Day ' + json.matchday + '\n';
      for (key in positions) {
        value = positions[key];
        message = message + value.position + '. ' + value.teamName + '  ' + value.points + '  ( ' + value.goals + ' - ' + value.goalsAgainst + ' )\n';
      }
      return msg.send(message);
    });
  });
};
