var fs = require('fs');
var async = require('async');

var DOCUMENTATION_TOP =`
# sublime-baobab-react-es6
This is a fork of
[mbopreator's React ES6 Sublime Package](https://github.com/mboperator/sublime-react-es6).
It intends to bring snippets for [Baobab](https://github.com/Yomguithereal/baobab) users along with React,
thanks to the [higher-order components integration](https://github.com/Yomguithereal/baobab-react/blob/master/docs/higher-order.md)


This fork keeps the following main features:
- Converting function declarations to the new ES6 shorthand.
- Static class variables (defaultProps, propTypes) are declared using ES7 property intializers.
- ES6 style exports and imports for component creating snippets.


This fork brings these main changes:
- Removing \`rrc\` for Redux connected components. (not used with Baobab simultaneously)
- Adding a snippet to create a rooted component using the Baobab higher-order components
- Adding a snippet to create a branched component using the Baobab higher-order components

**/!\\ New snippets brought by this fork are not supported for Coffeescript,
feel free to contribute to it /!\\**

![alt tag](https://raw.githubusercontent.com/luccitan/sublime-baobab-react-es6/master/docs/img/sr-baorc-out.gif)

## Installation
Install the React package via Sublime's Package Manager

You will need the Sublime [Package Manager](https://sublime.wbond.net/installation).
- Open the command palette: \`⌘+shift+p\` on MacOS/Linux, \`ctrl+shift+p\` on Windows
- type \`install\`, select \`Package Control: Install Package\`
- type \`Baobab\`, select \`Baobab React ES6 Snippets\`

## Usage
### Syntax highlighting
*Syntax highlighting is not provided by this package.* Using
[babel-sublime](https://github.com/babel/babel-sublime) instead is recommanded.
### Snippets
It's easy! Simply activate snippets by typing a mnemonic followed by TAB
![alt tag](https://raw.githubusercontent.com/mboperator/sublime-react/master/docs/img/sr-snippets-out.gif)
#### Documentation of available snippets (JSX):`;

var DOCUMENTATION_BOTTOM =
  `
## Contributing

### Rebuilding the docs

After making changes to snippet files, run \`npm install && npm run build-docs\` to automatically
generate this document from source. **Do not** make changes to README.md directly.
`;

fs.readdir('./snippets/js', function(err, files) {

  var snippets = files.filter(function(file) {
    return file.substr(-16) === '.sublime-snippet';
  }).map(function(file) {
    return './snippets/js/' + file;
  });

  async.map(snippets, readAndInspect, function(err, results) {
    if (err) {
      console.error('error mapping snippets', err);
    }

    const DOCUMENTATION_MIDDLE = results.map(snippet => inspectFile(snippet))
      .sort(function(a, b) {
        return a.abbreviation > b.abbreviation ? 1
          : a.abbreviation === b.abbreviation ? 0 : -1;
      })
      .map(snippet => snippet.docBlock)
      .join('');

    var snippetDocs =
      `${DOCUMENTATION_TOP}\n\`\`\`\n`
      + results
        .map(snippet => inspectFile(snippet))
        .sort((a,b) => a.abbreviation > b.abbreviation
          ? 1
          : a.abbreviation === b.abbreviation
            ? 0
            : -1
          )
        .map(snippet => snippet.docBlock)
        .join('')
      + `\`\`\`\n${DOCUMENTATION_BOTTOM}`

    fs.writeFile('README.md', snippetDocs, function (err) {
      if (err) {
        console.error('error appending README:', err);
      }
    });
  });
});

function readAndInspect(fileName, cb) {
  fs.readFile(fileName, 'utf-8', function(err, contents) {
    if (!err) {
      cb(null, contents);
    }
  });
}

function inspectFile(contents) {
  var match = contents.match(
    /[\s\S]*<tabTrigger>(.*?)<\/tabTrigger>[\s\S]*?<description>(React: )?(.*?)<\/description>[\s\S]*/i
  );
  var docBlock = '';
  var abbreviation = '';
  var description = '';
  if (match !== null) {
    abbreviation = match[1];
    description = match[3];
    var shortCut = '     '.substring(0, 5 - abbreviation.length) + abbreviation;
    docBlock = '  ' + shortCut + '→  ' + description + '\n\n';
  }
  return {
    docBlock: docBlock,
    abbreviation: abbreviation,
    description: description
  };
}
