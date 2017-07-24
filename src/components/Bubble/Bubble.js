import React from 'react';

class Bubble extends React.Component {
  render() {
    const moveVal = Math.ceil(Math.random() * 50);
    const posVal = Math.ceil(Math.random() * 50);
    const scaleVal = Math.ceil(Math.random() * 10);
    const shakeVal = Math.ceil(Math.random() * 5);
    return (
      <div className={`move${  moveVal  } pos${  posVal}`}>
        <div className={`scale${  scaleVal}`}>
          <div className={`item shake${  shakeVal}`} />
        </div>
      </div>
    );
  }
}

export default Bubble;
