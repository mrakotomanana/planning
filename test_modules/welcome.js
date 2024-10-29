const words = {
	"fr": "Bonjour",
	"en": "Hello",
	"es": "Hola"
};

module.exports = {
	version: 1.2,
	welcoming: function(lang = 'en') {
		return words[lang];
	},
	availableLanguages: function() {
		return Object.keys(words);
	}
};
