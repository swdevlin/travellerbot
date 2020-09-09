const chai = require('chai');
chai.should();
const expect = chai.expect;

const {
  getCommandObject
} = require('../commandparser');

describe('getCommandObject', function () {
  it('finds trade', function () {
    let msg = {
      author: {
        id: 'user1',
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      content: 'tb trade Ag'
    };

    let obj = getCommandObject('tb', msg);
    obj.constructor.name.should.equal('Trade');
  });

  it('finds uwp', function () {
    let msg = {
      author: {
        id: 'user1',
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      content: 'tb C123456-7'
    };

    let obj = getCommandObject('tb', msg);
    obj.constructor.name.should.equal('UWP');
  });

});
