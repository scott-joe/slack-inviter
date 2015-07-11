
// es6 runtime requirements
require('babel/polyfill');

// their code
import express from 'express';
import sockets from 'socket.io';
import { json } from 'body-parser';
import { Server as http } from 'http';
import remail from 'email-regex';
import dom from 'vd';
import _ from 'underscore';

// our code
import Slack from './slack';
import invite from './slack-invite';
import badge from './badge';
import splash from './splash';
import iframe from './iframe';
import log from './log';
// import groupList from './groupList';

var  groupList = [
  {
    'groupId': 'wag8map1cyalk2ob2un5',
    'name': 'Dev Workshop',
    'defaultChannel': 'dev-workshop',
    'logo': '/assets/dev-workshop.svg',
    'css': '/assets/dev-workshop.css',
  },
  {
    'groupId': 'fluf3ju5glad1nap3ec6',
    'name': 'Open Indy Brigade',
    'defaultChannel': 'open-indy-brigade',
    'logo': '/assets/open-indy-brigade.svg',
    'css': '/assets/open-indy-brigade.css'
  },
  {
    'groupId': 'teds6oz7cek6hoy5ghak',
    'name': 'CreativeMornings Indianapolis',
    'defaultChannel': 'cm-indy',
    'logo': '/assets/cm-indy.svg',
    'css': '/assets/cm-indy.css'
  },
  {
    'groupId': 'fraw9ap9doch6goc0ad7',
    'name': 'Ansible',
    'defaultChannel': 'playpen',
    'logo': '/assets/ansible.svg',
    'css': '/assets/ansible.css'
  },
  {
    'groupId': 'nigh4ab3an6erj3ai7hi',
    'name': 'Iowa',
    'defaultChannel': 'iowa',
    'logo': '/assets/iowa.svg',
    'css': '/assets/iowa.css'
  }
];

export default function slackin({
  token,
  interval = 1000, // jshint ignore:line
  org,
  css,
  channels,
  silent = false // jshint ignore:line
}){
  // must haves
  if (!token) throw new Error('Must provide a `token`.');
  if (!org) throw new Error('Must provide an `org`.');

  if (channels) {
    // convert to an array
    channels = channels.split(',').map((channel) => {
      // sanitize channel name
      if ('#' == channel[0]) return channel.substr(1);
      return channel;
    });
  }

  // setup app
  let app = express();
  let srv = http(app);
  let assets = __dirname + '/assets';

  // fetch data
  let slack = new Slack({ token, interval, org });

  // capture stats
  log(slack, silent);

  // middleware for waiting for slack
  app.use((req, res, next) => {
    if (slack.ready) return next();
    slack.once('ready', next);
  });

  // splash page
  app.get('/:groupId?', (req, res) => {
    let { name, logo } = slack.org;
    let { active, total } = slack.users;
    var groupId = req.params.groupId;

    console.log('groupId', req.params.groupId);
    console.log('groupList', groupList);

    group = _.find(groupList, function(group, groupId) { return group.id == groupId })
    console.log('group', group);

    if (!name) return res.send(404);
    let page = dom('html',
      dom('head',
        dom('title',
          'Join ', name, group, ' on Slack!'
        ),
        dom('meta name=viewport content="width=device-width,initial-scale=1.0,minimum-scale=1.0,user-scalable=no"'),
        dom('link rel="shortcut icon" href="${logo}"'),
        dom('link rel=stylesheet', { href: '/assets/css/base.css' }),
        group.css && dom('link rel=stylesheet', { href: group.css })
      ),
      splash({ name, group, logo, channels, active, total })
    );

    res.type('html');
    res.send(page.toHTML());
  });

  // static files
  app.use('/assets', express.static(assets));

  // invite endpoint
  app.post('/invite', json(), (req, res, next) => {
    let chanId;
    if (channels) {
      let channel = req.body.channel;
      if (!channels.includes(channel)) {
        return res
        .status(400)
        .json({ msg: 'Not a permitted channel' });
      }
      chanId = slack.getChannelId(channel);
      if (!chanId) {
        return res
        .status(400)
        .json({ msg: `Channel not found "${channel}"` });
      }
    }

    let email = req.body.email;

    if (!email) {
      return res
      .status(400)
      .json({ msg: 'No email provided' });
    }

    if (!remail().test(email)) {
      return res
      .status(400)
      .json({ msg: 'Invalid email' });
    }

    invite({ token, org, email, channel: chanId }, function(err){
      if (err) {
        return res
        .status(400)
        .json({ msg: err.message });
      }

      res
      .status(200)
      .json({ msg: 'success' });
    });
  });

  // iframe
  app.get('/iframe', (req, res) => {
    let large = 'large' in req.query;
    let { active, total } = slack.users;
    res.type('html');
    res.send(iframe({ active, total, large }).toHTML());
  });

  app.get('/iframe/dialog', (req, res) => {
    let { name } = slack.org;
    let { active, total } = slack.users;
    if (!name) return res.send(404);
    let dom = splash({ name, channels, active, total, iframe: true });
    res.type('html');
    res.send(dom.toHTML());
  });

  // badge js
  app.use('/slackin.js', express.static(assets + '/badge.js'));

  // badge rendering
  app.get('/badge.svg', (req, res) => {
    res.type('svg');
    res.set('Cache-Control', 'max-age=0, no-cache');
    res.set('Pragma', 'no-cache');
    res.send(badge(slack.users).toHTML());
  });

  // realtime
  sockets(srv).on('connection', socket => {
    socket.emit('data', slack.users);
    let change = (key, val) => socket.emit(key, val);
    slack.on('change', change);
    socket.on('disconnect', () => {
      slack.removeListener('change', change);
    });
  });

  return srv;
}
