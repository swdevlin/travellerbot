class BaseCommand {
  constructor(prefix, msg) {
    this.msg = msg;
    this.guild = msg.channel.guild;
    this.author = msg.author;
    this.prefix = prefix;
    this.commandText = this.msg.content.substring(prefix.length).toUpperCase().trim();
  }

  parseMsg() {

  }

  formatTradeClassification(code) {
    return code.charAt(0) + code.charAt(1).toLowerCase();
  }

  async do() {
    this.parseMsg();
  }
}

module.exports = BaseCommand;