const BaseCommand = require("./base");

const { tradeCodes, purchase, sell } = require("../trade_codes");

const baseCodes = {
    "C": { allegiance: "Vargr", type: "Corsair Base" },
    "D": { allegiance: "Any", type: "Naval Depot" },
    "E": { allegiance: "Hiver", type: "Embassy" },
    "K": { allegiance: "Any", type: "Naval Base" },
    "M": { allegiance: "Any", type: "Military Base" },
    "N": { allegiance: "Imperial", type: "Naval Base" },
    "R": { allegiance: "Aslan", type: "Clan Base" },
    "S": { allegiance: "Imperial", type: "Scout Base" },
    "T": { allegiance: "Aslan", type: "Tlaukhu Base" },
    "V": { allegiance: "Any", type: "Exploration Base" },
    "W": { allegiance: "Any", type: "Way Station" }
}

class System extends BaseCommand {
    constructor(prefix, msg) {
        super(prefix, msg);
        this.codes = [];
        this.goodName = "";
    }

    parseMsg() {
        let tokens = this.commandText.split(' ');
        // get rid of the trade
        tokens.shift();
        this.codes = tokens.map(a => a.toUpperCase());
    }

    makeHexCode(hexX, hexY) {
        let hexXOut = hexX.toString();
        let hexYOut = hexY.toString();
        if (hexXOut.length < 2) {
            hexXOut = "0" + hexXOut;
        }
        if (hexYOut.length < 2) {
            hexYOut = "0" + hexYOut;
        }
        return hexXOut + hexYOut;
    }

    parseRemarks (stringRemarks) {
        const remarksRegex = /(.*)[\(\[](.*)/g;
        let rem = remarksRegex.exec(stringRemarks);
        // first item is the string searched
        rem.shift();
        let tcList = [];
        let sopList = [];
        let sophString = "";
        if (rem) {
            tcList = rem[0].split(" ");
            sophString = rem[1];
        }
        // remove last item in tc list - it is empty
        tcList.pop();
        //discard the list of sophonts for now
        //TODO parse sophonts into population splits
        return tcList; 
    }

    getSystemInformation(name) {
        let response = "";
        const urlTravellerMap = "https://travellermap.com/";
        const urlTravellerMapSearch = urlTravellerMap + `api/search?q=${name}`;

        // Call the travellermap api using name in the search api

        // extract the json response
        const systemDetails = { "Results": { "Count": 1, "Items": [{ "World": { "HexX": 27, "HexY": 4, "Sector": "Deneb", "Uwp": "C543976-A", "SectorX": -3, "SectorY": -1, "Name": "Talon", "SectorTags": "Official OTU" } }] } };
        const worldDetails = systemDetails.Results.Items[0].World;

        // make the hexcdoe to use inthe data call
        const hexCode = this.makeHexCode(worldDetails.HexX, worldDetails.HexY)
        // call the data api using the hexcode
        const urlTravellerMapData = urlTravellerMap + `data/${worldDetails.Sector}/${hexCode}`

        const moreDetails = { "Worlds": [{ "Name": "Talon", "Hex": "2704", "UWP": "C543976-A", "PBG": "224", "Zone": "", "Bases": "CK", "Allegiance": "VAug", "Stellar": "K4 V", "SS": "D", "Ix": "{ 4 }", "CalculatedImportance": 4, "Ex": "(H8E+3)", "Cx": "[8D49]", "Nobility": "", "Worlds": 18, "ResourceUnits": 5712, "Subsector": 3, "Quadrant": 1, "WorldX": -70, "WorldY": -76, "Remarks": "Hi In Po (Souggvuez)8 Varg2", "LegacyBaseCode": "H", "Sector": "Deneb", "SubsectorName": "Million", "SectorAbbreviation": "Dene", "AllegianceName": "United Followers of Augurgh" }] };
        const world = moreDetails.Worlds[0];

        // do something with system details
        response += `The search url was <${urlTravellerMapSearch}>\n`;
        response += `The data url was <${urlTravellerMapData}>\n`

        response += `The ${world.Name} system is in the ${worldDetails.Sector} sector\n`;
        response += `It has a UWP of ${worldDetails.Uwp}\n`;
        response += `The Hex Code for this system is ${hexCode}\n`;

        if (world.Zone == "A") {
            response += "This world is an **Amber** zone\n";
        } else {
            if (world.Zone == "R") {
                response += `This world is a **RED** zone\n`;
            } else {
                response += "This world in **not** an Amber or Red Zone world\n";
            }
        }
        if (world.PBG.slice(world.PBG.length - 1) == "0") {
            response += "There is **no** Gas Giant suitable for refueling in this system\n";
        } else {
            response += "There is at least one **Gas Giant** suitable for refueling in this system\n";
        }
        response += `This world owes allegiance to the ${world.AllegianceName}\n`;
        response += `It has the following bases:\n`;
        for (const b of world.Bases) {
            response += `\t${baseCodes[b].type}\n`;
        }
        //parse remarks - this field is overloaded with items and needs to be unpacked. No I'm not bitter, why do you ask?
        const tradeCodes = this.parseRemarks(world.Remarks);
        response += `It has the trade codes of **${tradeCodes}**\n`;
        return response;
    }

    toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    async do() {
        await super.do();
        const commandText = this.msg.content.substring(this.prefix.length).trim();
        const tokens = commandText.toUpperCase().split(' ');

        let response = '\n';
        for (const name of tokens) {
            response += `System Information: **${this.toTitleCase(name)}**\n`;
            response += this.getSystemInformation(name);
        }
        await this.msg.reply(response);
    }

}

System.command = '';

module.exports = System;
