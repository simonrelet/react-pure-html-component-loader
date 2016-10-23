'use strict';

import React from 'react';

export default function(props) {
  return (
    <button { ...props.buttonProps }>
      Clicked { props.clicks } time(s)
    </button>
  );
}
