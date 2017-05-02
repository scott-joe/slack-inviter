import dom from 'vd';

export default function splash({ name, logo, active, total, channels, iframe }){
	let div = dom('.splash.preload',
		dom('.greeting',
			dom('span.group-name.small', 'The Society for'),
			dom('span.group-name', 'Excellence in Software and Design')
		),
		dom('form',
			dom('input type=email placeholder=jane@gmail.com'),
			dom('button.loading', 'Join')
		),
		!iframe && dom('footer',
			dom('div.logo.org'),
			dom('div.org-name', 'A member of the ', dom('a href=http://ansiblenetwork.org/ target=_blank', 'Ansible Network'))
		),
		dom('script src=https://cdn.socket.io/socket.io-1.3.2.js'),
		dom('script src=/assets/superagent.js'),
		dom('script src=/assets/client.js')
	);
	return div;
}
