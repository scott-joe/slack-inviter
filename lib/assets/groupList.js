export default function groupList(){
	var  data = [
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

	var findGroup = function(groupId){
		var group = _.find(data, function(cur, groupId) {
			return cur.groupId == groupId;
		});

		return group;
	}
	this.findGroup = findGroup;

	return groupList
}
