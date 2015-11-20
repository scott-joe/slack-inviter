import dom from 'vd';

export default function splash({ name, group, logo, active, total, channels, iframe }){
	let div = dom('.splash.preload',
		!iframe && dom('.logos',
			dom('div.logo.org'),
			dom('.logo.group')
		),
		dom('.greeting',
			dom('span.group-name', 'Join ', group.name),
			dom('span.channelWrapper', ' in the',
				dom('span.defaultChannel', ' #', group.defaultChannel),
				' channel on Slack'
			)
		),
		dom('form',
			dom('input type=email placeholder=ewiggin@dragon.army'),
			dom('button.loading', 'Request')
		),
		// !iframe && dom('footer',
			// dom('div.logo.org'),
			// dom('div.org-name', 'A member of the ', dom('a href=http://ansiblenetwork.org/ target=_blank', 'Ansible Network')),
			// dom('div', 'Portal forked from ', dom('a href=http://rauchg.com/slackin target=_blank', 'slackin'))
		// ),
		dom('script src=https://cdn.socket.io/socket.io-1.3.2.js'),
		dom('script src=/assets/superagent.js'),
		dom('script src=/assets/client.js')
	);
	return div;
}
