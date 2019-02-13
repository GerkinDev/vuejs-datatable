/* globals require, module, __dirname*/
const rollup = require('rollup');
const fsWithCallbacks = require('fs');
const {
	readFile, writeFile, unlink, 
} = fsWithCallbacks.promises;
const {
	resolve, isAbsolute, dirname,
} = require('path');

module.exports.__dirname = __dirname;

const defaultLoader = require.extensions['.js'];
const loadedFileNames = new Set();
const filesCodeTransformed = {};
// temporarily override require
require.extensions['.js'] = (module, loadedFileName) => {
	if (loadedFileNames.has(loadedFileName)) {
		module._compile(filesCodeTransformed[loadedFileName], loadedFileName);
	} else {
		defaultLoader(module, loadedFileName);
	}
};
const loadMjsInJs = async filepath => {
	// See https://github.com/rollup/rollup/blob/master/bin/src/run/loadConfigFile.ts
	const confBundle = await rollup.rollup({
		input:     filepath,
		treeshake: false,
		external:  id => (id[0] !== '.' && !isAbsolute(id)) || id.slice(-5, id.length) === '.json',
		onwarn:    () => {},
	});
	const { code } = await confBundle.generate({format: 'cjs'});
	
	loadedFileNames.add(filepath);
	filesCodeTransformed[filepath] = code;

	delete require.cache[filepath];

	const fileContentOrFunction = require(filepath);

	const fileContent = typeof fileContentOrFunction === 'function' ? fileContentOrFunction() : fileContentOrFunction;
	return fileContent;
};

module.exports.rollupize = async filePath => {
	const rollupOpts = await loadMjsInJs(resolve(__dirname, '../rollup.config.js'));

	const fileContent = await readFile(filePath, 'UTF-8');
	// Wrap scripts for single execution
	const tempFile = resolve(dirname(filePath), '.tmp.js');
	await writeFile(tempFile, wrapScript(fileContent));
	const plugins = rollupOpts[0].plugins;

	try {
		// create a bundle
		const bundle = await rollup.rollup({
			input: tempFile,
			plugins,
		});
	
		// generate code
		const {code: outCode} = await bundle.generate({format: 'iife'});

		return {
			exec:    outCode,
			display: fileContent.replace(/^\s*\/\*.*?\*\/\s*/, ''),
		};
	} catch (e){
		console.error(`An error occured in the transformation of ${ filePath }:`, e);
		return {
			exec:    '',
			display: fileContent.replace(/^\s*\/\*.*?\*\/\s*/, ''),
		};
	} finally {
		await unlink(tempFile);
	}
};

const wrapScript = script => {
	const imports = script.match(/^(\s*import [^;]+)+/);
	const scriptNoImport = script.replace(imports ? imports[0] : '', '');
	return `${ imports ? imports[0] : '' }
let inited = false;
const runDemo = () => {
	if(inited){
		return;
	}
	inited = true;

	${ scriptNoImport }
}

document.addEventListener && document.addEventListener('DOMContentLoaded', runDemo, false);
window.addEventListener && window.addEventListener('load', runDemo, false );
document.attachEvent && document.attachEvent('onreadystatechange', runDemo);
window.attachEvent && window.attachEvent('onload', runDemo);
`;
};

module.exports.writeInBlock = (window, blockId, content) => {
	const block = window.document.getElementById(blockId);
	if (!blockId){
		throw new Error(`Missing block id "${ blockId }".`);
	}
	if (content instanceof window.HTMLElement){
		block.textContent = content.outerHTML;
	} else if (typeof content === 'string'){
		block.textContent = content;
	} else {
		throw new Error('Invalid content');
	}
};

/**
 * @param {Document} doc Document
 * @param {String} html representing any number of sibling elements
 * @return {NodeList} Parsed nodes 
 */
module.exports.htmlToElements = (doc, html) => {
	const template = doc.createElement('template');
	template.innerHTML = html;
	return template.content.childNodes;
};
