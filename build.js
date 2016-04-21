//electron-packager . electron-cutLF --out='./bin' --platform='darwin,win32' --arch=x64 --version=0.36.1 --icon='./app.icns'

// コマンド例
// # node build.js	  <- プラットフォームに応じたビルド
// # node build.js win  <- windows指定
// # node build.js mac  <- mac指定


var packager = require('electron-packager');
var config = require('./package.json');
var zipFolder = require('zip-folder');
var rimraf = require('rimraf');

var isZip = false;

var isWin = false;
if (typeof process.argv[2] === 'undefined') {
	isWin = /^win/.test(process.platform);
} else if (/^win/.test(process.argv[2])) {
	isWin = true;
}
if (!isWin) {
	console.log('Build Target -> Mac');
} else {
	console.log('Build Target -> Windows');
}

var dir = './';
var out = './build';
var name = config.name;
var platform = 'darwin'
var icon = './resources/app.icns'; //<- アプリアイコン
if (isWin) {
	platform = 'win32';
	icon = './resources/app.ico'; //<- アプリアイコン
}


// platform: 'linux',
// var arch = 'ia32';
var arch = 'x64';
var version = '0.36.1';
var app_bundle_id = 'jp.pxt.www'; //<- 自分のドメインなどを使用してください
var helper_bundle_id = 'jp.pxt.www'; //<- 自分のドメインなどを使用してください

var zip = function (relativePath, cb) {
	zipFolder(
		__dirname + '/' + relativePath + '/',
		__dirname + '/' + relativePath + '.zip',
		function (err) {
			if (err) {
				console.log('zip ERROR!', err);
			} else {
				rimraf('./' + relativePath, function () {
					// Something
					console.log('zip SUCCESS!.');
					cb();
				});

			}
		}
	);
}
var npm_ignore = [], ignores;
for (var key in config.devDependencies) {
	npm_ignore.push(key);
}
ignores = npm_ignore.join('|');

console.time("build-time");
packager(
	{
		"dir": dir,
		"out": out,
		"name": name,
		"platform": platform,
		"arch": arch,
		"version": version,
		"icon": icon,
		'app-bundle-id': app_bundle_id,
		'app-version': config.version,
		'helper-bundle-id': helper_bundle_id,
		overwrite: true,
		// asar: false,
		asar: true, // aserに固める
		"asar-unpack-dir": "unpacked",
		prune: true,
		ignore: 'node_modules/(' + ignores + '|\.bin)|build\.js',
		'version-string': {
			CompanyName: 'tomk79',
			FileDescription: config.description,
			OriginalFilename: config.name,
			FileVersion: config.version,
			ProductVersion: config.version,
			ProductName: config.name,
			InternalName: config.name
		}
	}, function done(err, appPath) {
		if (err) {
			throw new Error(err);
		}
		console.log('appPath', appPath);
		if (isZip) {
			zip(appPath, function () {
				console.timeEnd("build-time");
				console.log('Done!!');
			});
		} else {
			console.timeEnd("build-time");
			console.log('Done!!');
		}
	}
);
