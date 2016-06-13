var React = require('react');

export default React.createClass({
  render: function() {
    let moveVal = Math.ceil(Math.random() * 50);
    let posVal = Math.ceil(Math.random() * 50);
    let scaleVal = Math.ceil(Math.random() * 10);
    let shakeVal = Math.ceil(Math.random() * 5);
    return (
      <div className={"move" + moveVal + " pos" + posVal}>
        <div className={"scale" + scaleVal}>
          <div className={"item shake" + shakeVal}></div>
        </div>
      </div>
    );
  }
});
