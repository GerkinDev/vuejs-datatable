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
const loadedFiles = new Map();
// temporarily override require
require.extensions['.js'] = (module, loadedFileName) => {
	if (loadedFiles.has(loadedFileName)) {
		module._compile(loadedFiles.get(loadedFileName), loadedFileName);
	} else {
		defaultLoader(module, loadedFileName);
	}
};
const buildRollup = async(input, output) => {
	const confBundle = await rollup.rollup(input);
	const outBundle = await confBundle.generate(output);
	const {output: [{ code }]} = outBundle;
	return {
		code,
		outBundle,
	};
};
const loadMjsInJs = async filepath => {
	// See https://github.com/rollup/rollup/blob/master/bin/src/run/loadConfigFile.ts
	const { code } = await buildRollup({
		input:     filepath,
		treeshake: false,
		external:  id => (id[0] !== '.' && !isAbsolute(id)) || id.slice(-5, id.length) === '.json',
		onwarn:    () => {},
	}, {format: 'cjs'});
	
	loadedFiles.set(filepath, code);
	
	delete require.cache[filepath];
	
	const fileContentOrFunction = require(filepath);
	
	try {
		const fileContent = typeof fileContentOrFunction === 'function' ? fileContentOrFunction() : fileContentOrFunction;
		return fileContent;
	} catch (e){
		console.error('An error occured while loading mjs file:', e);
		throw e;
	}
};

module.exports.rollupize = async filePath => {
	const rollupOpts = await loadMjsInJs(resolve(__dirname, '../rollup.config.js'));
	
	const fileContent = await readFile(filePath, 'UTF-8');
	// Wrap scripts for single execution
	const tempFile = resolve(dirname(filePath), '.tmp.js');
	await writeFile(tempFile, wrapScript(fileContent));
	const plugins = rollupOpts[0].plugins;
	
	try {
		// generate code
		const {code: outCode} = await buildRollup({
			input: tempFile,
			plugins,
		}, {format: 'iife'});
		
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
		throw new Error(`Invalid content for block ${ blockId }`);
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
