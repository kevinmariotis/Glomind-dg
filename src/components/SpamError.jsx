import React from 'react';

function SpamError({mensaje=''}) {
  return (<span className="badge badge-danger">{mensaje}</span>);
}

export default SpamError;