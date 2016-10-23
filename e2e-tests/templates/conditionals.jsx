'use strict';

import React from 'react';

export default function(props) {
  return (
    <div>
      { (props.user) && (
        <div>
          { props.user.name }
        </div>
      ) }
    </div>
  );
}
