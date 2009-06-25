
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

var ComicMLProto = function() {
    var self = {
        characters: [],

        render: function(sourceElem) {
            var source = $(sourceElem).text();
            self.output = $('<div></div>');
            $(sourceElem).after(self.output);
            var lines = source.split("\n");
            $.each(lines, function(i) {
                       var parts = trim(this).split(' ');
                       if (!parts.length || parts[0] == '') return;
                       var command = parts[0];

                       if (command == 'end') return;

                       if (self.commands[command]) {
                           self.commands[command](parts.slice(1));
                       }
                       else {
                           self.output.append(['<div>Unrecognized command at line ', i+1,
                                               ': "', command, '"</div>'].join(''));
                           console.log(parts);
                           return false;
                       }
                   });
        },

        commands: {
            version: function(options) {
                if (!options.length || options[0] != 'proto') return false;
                return '';
            }
        }
    };
    return self;
};