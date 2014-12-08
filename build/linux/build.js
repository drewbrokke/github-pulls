#!/usr/bin/env node

var async = require('async');
var argv = require('optimist').argv;
var fs = require('fs-extra');
var path = require('path');
var exec = require('child_process').exec;


var APP_NAME = 'github-pulls';
var ARCH = 'linux64';

var BASE_PATH = __dirname;
var ROOT_PATH = path.join(BASE_PATH, '../..');

var APP_SRC_PATH = path.join(ROOT_PATH, 'app');
var BIN_PATH = path.join(ROOT_PATH, 'bin');
var BUILD_APP_DIR = path.join(BASE_PATH, APP_NAME);
var BUILD_ARCH_DIR = path.join(BUILD_APP_DIR, ARCH);
var BUILD_APP_PATH = path.join(BUILD_APP_DIR, ARCH, APP_NAME);

var NwBuilder = require('node-webkit-builder');

var nw = new NwBuilder(
	{
		files: APP_SRC_PATH + '/**/**',
		platforms: [ARCH],
		appName: APP_NAME,
		buildDir: BASE_PATH,
	}
);

nw.on('log',  console.log);

async.series(
	[
		installNpmModules,
		installBowerComponents,
		build,
		packageApp,
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
	nw.build()
	.then(
		function() {
			var files = fs.readdirSync('resources');

			files.forEach(function(file) {
				var fileSrc = path.join('resources',file);

				if ((file.indexOf('.sh') != -1)) {
					var fileDest = path.join(BUILD_ARCH_DIR, file);

					fs.copySync(fileSrc, fileDest);
					fs.chmodSync(fileDest, '0755');
				}
				else {
					fs.copySync(fileSrc, path.join(BUILD_ARCH_DIR, 'resources', file));
				}

				console.log('File ', file, ' copied successfully.');
			});

			fs.renameSync(path.join(BUILD_ARCH_DIR, 'github-pulls'), path.join(BUILD_ARCH_DIR, 'github-pulls-bin'));
			fs.renameSync(path.join(BUILD_ARCH_DIR, 'github-pulls-wrapper.sh'), path.join(BUILD_ARCH_DIR, 'github-pulls'));
		}
	)
	.then(
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

function packageApp(callback) {
	var renameBuildArchDir = path.join(BUILD_APP_DIR, "github-pulls-" + ARCH);

	fs.rename(BUILD_ARCH_DIR, renameBuildArchDir, function(err) {
		if (!err) {
			console.log('Packaging tarball...');

			exec(
				'tar -cvzf ' + APP_NAME + '-' + ARCH + '.tar.gz ' + APP_NAME + '-' + ARCH,
				{
					cwd: BUILD_APP_DIR
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
		else {
			console.log('err: ', err);
		}
	});
}