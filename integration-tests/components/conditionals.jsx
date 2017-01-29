'use strict';

import React from 'react';

export function ConditionalFist(props) {
  return (
    (props.user) && (
      <div>
        { props.user.name }
      </div>
    )
  );
}
ConditionalFist.displayName = 'ConditionalFist';

export default function(props) {
  return (
    <div>
      { (props.user) && (
        <div>
          { props.user.name }
        </div>
      ) }
      { props.array.map(item => (
        (item.isValid) && (
          <div>
            { item.name }
          </div>
        )
      )) }
    </div>
  );
}
