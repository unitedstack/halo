'use strict';

module.exports = () => {
  return async function() {
    this.socket.emit('res', 'hello');
  };
};
