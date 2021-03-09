import * as React from 'react';

interface ICenter {
  children: JSX.Element
}

const Center = ({ children }: ICenter) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {children}
    </div>
  )
}

export default Center