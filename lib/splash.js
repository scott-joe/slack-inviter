
import dom from 'vd';

export default function splash({ name, group, logo, active, total, channels, iframe }){
  let div = dom('.splash',
    !iframe && dom('.logos',
      dom('.logo.group')
    ),
    dom('p',
        'Join ',
        dom('.group-name', group.name),
        group.defaultChannel && dom('span', 'in the #', group.defaultChannel, ' channel'),
        name && dom('span', ' on the ', name, ' Slack org')
    ),
    // dom('p.status',
    //   active
    //     ? [
    //       dom('b.active', active), ' users online now of ',
    //       dom('b.total', total), ' registered.'
    //     ]
    //     : [dom('b.total', total), ' users are registered so far.']
    // ),
    dom('form',
      dom('input.form-item type=email placeholder=ewiggin@dragon.army '
        + (!iframe ? 'autofocus' : '')),
      dom('button.loading', 'Get Invited')
    ),
    !iframe && dom('footer',
      logo && dom('.logo.org'),
      'forked from ',
      dom('a href=http://rauchg.com/slackin target=_blank', 'slackin')
    ),
    dom('script src=https://cdn.socket.io/socket.io-1.3.2.js'),
    dom('script src=/assets/superagent.js'),
    dom('script src=/assets/client.js')
  );
  return div;
}
