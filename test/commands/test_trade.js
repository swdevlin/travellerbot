const chai = require('chai');
chai.should();
const expect = chai.expect;
const sinon = require('sinon');

const Trade = require("../../commands/trade");

describe('TestTrade', function () {

  it('constructor should set codes to empty array', function() {
    let msg = {
      author: {
        id: 'user1',
        send: sinon.stub().resolves('ok'),
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      reply: sinon.stub().resolves('ok'),
      content: 'tb trade ag'
    };
    const command = new Trade('tb', msg)
    expect(command.codes).to.be.empty;
  });

  it('should extract codes based on spaces', function() {
    let msg = {
      author: {
        id: 'user1',
        send: sinon.stub().resolves('ok'),
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      reply: sinon.stub().resolves('ok'),
      content: 'tb trade ag be in'
    };
    const command = new Trade('tb', msg)
    command.parseMsg();
    command.codes.should.eql(['AG', 'BE', 'IN']);
  });

  it('should convert codes to upper case', function() {
    let msg = {
      author: {
        id: 'user1',
        send: sinon.stub().resolves('ok'),
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      reply: sinon.stub().resolves('ok'),
      content: 'tb trade ag'
    };
    const command = new Trade('tb', msg)
    command.parseMsg();
    command.codes.should.eql(['AG']);
  });

  it('should have a purchase entry for Ag trade code', function() {
    let msg = {
      author: {
        id: 'user1',
        send: sinon.stub().resolves('ok'),
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      reply: sinon.stub().resolves('ok'),
      content: 'tb trade Ag'
    };
    const command = new Trade('tb', msg)
    command.parseMsg();
    const response = command.purchase('AG');
    response.should.equal('\t*Buy these:*\n\t\tCommon Raw Materials (DM +3)\n\t\tCommon Consumables (DM +3)\n\t\tBiochemicals (DM +1)\n\t\tLive Animals (DM +2)\n\t\tLuxury Consumables (DM +2)\n\t\tTextiles (DM +7)\n\t\tUncommon Raw Materials (DM +2)\n\t\tWood (DM +6)\n\t\tLuxuries (Illegal) (DM +2)\n');
  });

  it('should have a sell entry for Ag trade code', function() {
    let msg = {
      author: {
        id: 'user1',
        send: sinon.stub().resolves('ok'),
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      reply: sinon.stub().resolves('ok'),
      content: 'tb trade Ag'
    };
    const command = new Trade('tb', msg)
    command.parseMsg();
    const response = command.sell('AG');
    response.should.equal('\t*Sell these:*\n\t\tCommon Industrial Goods (DM +2)\n\t\tPetrochemicals (DM +1)\n\t\tRobots (DM +2)\n');
  });

  it('should have a response with purchase and sell for ag', async function() {
    let msg = {
      author: {
        id: 'user1',
        send: sinon.stub().resolves('ok'),
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      reply: sinon.stub().resolves('ok'),
      content: 'tb trade Ag'
    };
    const command = new Trade('tb', msg)
    await command.do();
    expect(msg.reply.called).to.be.ok;
    let expected = `\nCodes are AG\n`;
    expected += `\n\t**AG: Agricultural**\n`;
    expected += command.purchase('AG');

    expected += command.sell('AG');

    expect(msg.reply.calledWith(expected)).to.be.ok;
  });

});

