const chai = require('chai');
chai.should();
const expect = chai.expect;
const sinon = require('sinon');

const UWP = require("../../commands/uwp");

describe('TestUWP', function () {
  it('validates the UWP string', function() {
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
      content: 'tb A123456-9'
    };
    const command = new UWP('tb', msg)
  });

  it('check for bad law', function() {
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
      content: 'tb A1234ab-9'
    };
    const command = new UWP('tb', msg)
    command.parseMsg();
    const isOk = command.validateUWP();
    expect(isOk).to.be.false;
  });

  it('Handle no starport', function() {
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
      content: 'tb X123456-9'
    };
    const command = new UWP('tb', msg)
    command.parseMsg();
    const response = command.starportText();
    expected = '\tThere is **no starport** on this planet\n\tThis port has **No fuel**';
    response.should.equal(expected);
  });

  it('Handle standard starport', function() {
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
      content: 'tb B123456-9'
    };
    const command = new UWP('tb', msg)
    command.parseMsg();
    const response = command.starportText();
    const expected = '\tThis port is Good\n\tBerthing costs are 1DxCR500 per day\n\tThis port has Refined fuel';
    response.should.equal(expected);
  });

  it('Handle planet size', function() {
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
      content: 'tb B123456-9'
    };
    const command = new UWP('tb', msg)
    command.parseMsg();
    const response = command.planetSizeText();
    const expected = '\t1,600km in diameter\n\tGravity is 0.05G';

    response.should.equal(expected);
  });

  it('Handle standard atmosphere', function() {
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
      content: 'tb B123456-9'
    };
    const command = new UWP('tb', msg)
    command.parseMsg();
    const response = command.atmosphereText();
    const expected = '\tVery Thin, Tainted atmosphere\n\tThis atmosphere requires Respirator & Filter';
    response.should.equal(expected);
  });

  it('Handle no special gear', function() {
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
      content: 'tb B153456-9'
    };
    const command = new UWP('tb', msg)
    command.parseMsg();
    const response = command.atmosphereText();
    const expected = '\tThin atmosphere\n\tNo special gear is required';
    response.should.equal(expected);
  });

  it('Handle hydrographics', function() {
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
      content: 'tb B123456-9'
    };
    const command = new UWP('tb', msg)
    command.parseMsg();
    const response = command.hydrosphereText();
    const expected = '\tSmall seas and Oceans';

    response.should.equal(expected);
  });

  it('population is expanded and nicely formatted', function() {
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
      content: 'tb B123456-9'
    };
    const command = new UWP('tb', msg)
    command.parseMsg();
    const response = command.populationText();
    const expected = '\t10,000';

    response.should.equal(expected);
  });

  it('government has all the details', function() {
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
      content: 'tb B123456-9'
    };
    const command = new UWP('tb', msg)
    command.parseMsg();
    const response = command.governmentText();
    const expected = '\tFeudal Technocracy';

    response.should.equal(expected);
  });

  it('law shows bans', function() {
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
      content: 'tb B123456-9'
    };
    const command = new UWP('tb', msg)
    command.parseMsg();
    const response = command.lawText();
    const expected = '\t*Bans*:\n\t\tAll Firearms, except shotguns and stunners;\n\t\tCloth, Flak, Combat Armour, Battle Dress';

    response.should.equal(expected);
  });

  it('tech description', function() {
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
      content: 'tb B123456-9'
    };
    const command = new UWP('tb', msg)
    command.parseMsg();
    const response = command.techText();
    const expected = '\tTL 9\n\tPre-Stellar';

    response.should.equal(expected);
  });

  it('should put all the pieces together', async function() {
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
      content: 'tb B123456-9'
    };
    const command = new UWP('tb', msg)
    await command.do();
    expect(msg.reply.called).to.be.ok;
    let expected = `\n`;
    expected += `**Starport (B)**\n${command.starportText()}\n`;
    expected += `**Size (1)**\n${command.planetSizeText()}\n`;
    expected += `**Atmosphere (2)**\n${command.atmosphereText()} \n`;
    expected += `**Hydrosphere (3)**\n${command.hydrosphereText()}\n`;
    expected += `**Population: (4)**\n${command.populationText()}\n`;
    expected += `**Government (5)**\n${command.governmentText()} \n`;
    expected += `**Law (6)**\n${command.lawText()}  \n`;
    expected += `**Tech (9)**\n ${command.techText()}  \n`;
    expect(msg.reply.calledWith(expected)).to.be.ok;
  });


});