'use strict';

import React from 'react';

export default function(props) {
  return (
    <div>
      { props.users.map(user => (
        <div key={ user.id }>
          { user.name }
        </div>
      )) }
    </div>
  );
}
