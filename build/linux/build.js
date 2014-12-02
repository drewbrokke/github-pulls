#!/usr/bin/env node

var async = require('async');
var argv = require('optimist').argv;
var fs = require('fs-extra');
var path = require('path');
var exec = require('child_process').exec;


var APP_NAME = 'Github Pulls';
var APP_NAME_BIN = APP_NAME + "-bin"

var BASE_PATH = __dirname;
var ROOT_PATH = path.join(BASE_PATH, '../..');

var APP_SRC_PATH = path.join(ROOT_PATH, 'app');
var BIN_PATH = path.join(ROOT_PATH, 'bin');
var BUILD_APP_DIR = path.join(BASE_PATH, APP_NAME);
var BUILD_APP_PATH = path.join(BUILD_APP_DIR, 'linux', APP_NAME);

var NwBuilder = require('node-webkit-builder');

var nw = new NwBuilder(
	{
		files: APP_SRC_PATH + '/**/**',
		platforms: ['linux64'],
		appName: APP_NAME_BIN,
		buildDir: BASE_PATH,
	}
);

nw.on('log',  console.log);

async.series(
	[
		installNpmModules,
		installBowerComponents,
		build,
		install
	],
	function(err) {
		if (err) {
			console.log('err: ', err);
		}
		else {
			console.log('done');
		}
	}
);

function build(callback) {
	nw.build().then(
		function() {
			console.log('build success');
			callback();
		}
	).catch(
		function (error) {
			console.error(error);
			callback(error);
		}
	);
}

function installNpmModules(callback) {
	exec(
		'sudo npm install --loglevel error',
		{
			cwd: APP_SRC_PATH
		},
		function(err, stdout, stderr) {
			if (err) {
				callback(err);
			}
			else {
				console.log(stdout || stderr);

				callback();
			}
		}
	);
}

function installBowerComponents(callback) {
	exec(
		'bower install --loglevel=error',
		{
			cwd: APP_SRC_PATH
		},
		function(err, stdout, stderr) {
			if (err) {
				callback(err);
			}
			else {
				console.log(stdout || stderr);

				callback();
			}
		}
	);
}

function install(callback) {
	if (argv.install) {
		async.detectSeries(
			[USER_APPLICATIONS_PATH, ROOT_APPLICATIONS_PATH],
			fs.exists,
			function(result) {
				var destination = path.join(result, APP_NAME);

				async.series(
					[
						fs.remove.bind(fs, destination),
						fs.rename.bind(fs, BUILD_APP_PATH, destination),
						fs.remove.bind(fs, BUILD_APP_DIR)
					],
					function(err, results) {
						if (err) {
							console.log('Could not copy %s to %s', BUILD_APP_PATH, destination);
							return callback(err);
						}
						callback(err, results);
					}
				);
			}
		);
	}
	else {
		callback();
	}
}