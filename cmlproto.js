
function trim(str, chars) {
	return ltrim(rtrim(str, chars), chars);
}

function ltrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}

function rtrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}

function ComicLProto(sourceElem) {
    var source = $(sourceElem).text();
    var lines = source.split("\n");

    var current_line = 0;

    var self = {
        characters: {},

        render: function() {
            var output = [];
            while(current_line < lines.length) {
                var parts = trim(lines[current_line]).split(' ');
                current_line++;

                if (!parts.length || parts[0] == '') continue;
                var command = parts[0];

                // stop rendering when we hit "end"
                if (command == 'end') break;

                if (self.commands[command]) {
                    output.push(self.commands[command](parts.slice(1)));
                }
                else {
                    output.push(['<div>Unrecognized command at line ', current_line+1,
                    ': "', command, '"</div>'].join(''));
                    console.log(parts);
                    break;
                }
            }
            return output.join('');
        },

        commands: {
            version: function(options) {
                if (!options.length || options[0] != 'proto') return false;
                return '';
            },

            character: function(options) {
                self.characters[options[0]] = self.render();
                return '';
            }
        }
    };
    return self;
};