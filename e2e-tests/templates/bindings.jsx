'use strict';

import React from 'react';

export default function(props) {
  return (
    <div>
      <span value={ props.value } />
      <span value={ props.value } />
      <span value={ props.value } />
      <span value={ props.value + ' ' + otherValue } />
      <span value={ `${props.value} ${otherValue}` } />
      <span value={ `Hello ${ props.person }` } />
      <span>
        { props.value }
      </span>
      <span>
        { props.value }
      </span>
      <span>
        { props.value }
      </span>
      <span>
        { props.value }
      </span>
      <span>
        { props.value + ' ' + otherValue }
      </span>
      <span>
        Hello { props.person }
      </span>
      <span { ...props.value } />
      <span { ...props.value } />
      <span { ...props.value } />
      <span value={ true } />
      <span value={ true } />
      <span value={ true } />
      <span value={ false } />
      <span value={ false } />
      <span value={ true } />
      <span value={ true } />
      <span value={ false } />
      <span value={ true } />
    </div>
  );
}
