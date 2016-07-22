# mementoJq

This project is generated with [yo generator-jquery-bootstrap-simple](https://www.npmjs.com/package/generator-jquery-bootstrap-simple)
version 1.0.3, license: [MIT](www.mit-license.org/)

## generator-jquery-bootstrap-simple

*Simple jQuery &amp; Bootstrap generator ready to develop/test js/html code.*

### Simple jQuery & Bootstrap Yeoman generator with SASS

> This simple Yeoman generator gives you .html site organized with nice directory tree, ready to write/test your code snippets using jQuery and Bootstrap.
#
> You don't need to reaload page every time you change something because `grunt serverLive` task serves you efficient node sever with livereload (html/js/css) and it observes your .scss files with `compass watch` !

1. ####Features
 	- live realoading of all .html .js .css files with node server - `grunt serverLive`
 	- minifying and concatenating .js and .css files - `grunt dist`
 	- write your CSS with SASS
 	- get benefits from: `Bower`, `Grunt` and `Copmass`
 
	Autor: [Julian Sadowski](https://github.com/jsadowski)

2. ####Installation
	
	Firstly you must have installed `NodeJS` which comes with `NPM` installed (you can download it from its official site: [nodejs.org](https://nodejs.org/en/))

	Secondly its good to update npm with command below:

		sudo npm install npm -g

	Then install `Yeoman`, `Bower` and `Grunt` npm packages typying:
	
		npm install -g yo bower grunt-cli

	To write your CSS you will be using SASS so to compile it you need to get Compass framework. Type in your console:

		gem update --system
		gem install compass
		 
		#or if you are using Mac with El Captain, correct commands will be:
		 
		sudo gem update --system
		sudo gem install -n /usr/local/bin compass

	Last thing you must do is install the generator:

		npm install -g generator-jquery-bootstrap-simple

3. ####How to use ?

	Create an empty directory and enter it by:

		mkdir mySite && cd mySite

	Write command:

		yo jquery-bootstrap-simple

	... enter your project name in the console and ... that's it :) you can run command below to see your newly created page:

		grunt serverLive

4. ####Grunt tasks

	Runs a node server (http://localhost:8000) with livereload (html/js/css) with `compass watch`

		grunt serverLive

	Runs a node server (http://localhost:8000) with `compass watch`

		grunt server

	Collects, concatenates, minificates and stores in public/dist directory .js and .css files with .min extension

		grunt dist
	
	Compiles css with `Compass`:

		grunt compassCompile

5. ####License

	[BSD license](http://opensource.org/licenses/bsd-license.php)


##### *You should init: `npm install`*  

> Powerby [*Yeoman*](http://yeoman.io/)
