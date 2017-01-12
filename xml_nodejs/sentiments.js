// initialisation des modules utilisés
var fs        = require('fs');
var cheerio   = require('cheerio');
var stringify = require('csv-stringify');

// récupération du nom du fichier à analyser
var args        = process.argv.slice(2);
var xmlFileName = args[0];


// lecture du fichier à analyser
console.log("loading " + xmlFileName);
fs.readFile(xmlFileName, 'utf-8', function(err, data){
    if (err) throw err;   // en cas d'erreur

    // initialisation en mode xml
    $ = cheerio.load(data, {
      xmlMode: true
    });

    console.log("processing ... ");
    var sentiments = [];
    // Recherche des tags Opinion et exécution d'une fonction pour chacun des tags retrouvés
    $('Opinion').each(function(i, elem){
      // récupération des information recherchées pour chacun des tags
      var sentiment = {};
      sentiment.id        = $(this).parent().parent().attr('id');
	  sentiment.id2		= sentiment.id;
	  sentiment.from      = $(this).attr('from');
      sentiment.to        = $(this).attr('to');
	  sentiment.polarity  = $(this).attr('polarity');
      sentiment.test      = $(this).parent().parent().find('text').text();
      sentiments[i] = sentiment; // les informations recupérées sont rassemblées dans un tableau
    });

    // formattage et sauvegarde des éléments retrouvés
    console.log("saving ... ");
    // Au format json
    fs.writeFile('./sentiments.json', JSON.stringify(sentiments, null, 2) , 'utf-8');
    // Au format csv
    stringify(sentiments, {'delimiter':'\t'}, function(err, output) {
      if (err) throw err;
      fs.writeFile('./sentiments.csv', output , 'utf-8');
    });
    // Et voilà!
    console.log("done");
});
