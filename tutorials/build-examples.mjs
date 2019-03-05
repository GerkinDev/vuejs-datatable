/* globals process */
import {
	readdirSync, statSync, default as fsWithCallbacks, mkdirSync,
} from 'fs';
const {
	readFile, writeFile, copyFile,
} = fsWithCallbacks.promises;
import {
	join, resolve,
} from 'path';
import jsdom from 'jsdom';
import utils from './build-utils.js';
const {
	__dirname, writeInBlock, rollupize,
} = utils;
process.env.BUILD = 'production';

const tutorialSourcesDir = join(__dirname, 'sources');
const tutorialOutDir = join(__dirname, 'builds');

mkdirSync(tutorialOutDir);
const dirs = readdirSync(tutorialSourcesDir)
// Only dirs
	.filter(file => {
		const stat = statSync(join(tutorialSourcesDir, file));
		return stat.isDirectory();
	});

const allOperations = dirs.map(async dir => {
	const absDir = resolve(tutorialSourcesDir, dir);
	const jsFile = join(absDir, 'demo.js');
	const htmlFile = join(absDir, 'index.html');
	const [ scripts, htmlDom ] = await Promise.all([
		rollupize(jsFile),
		(async() => new jsdom.JSDOM(await readFile(htmlFile, 'UTF-8')))(),
	]);
	
	try {
		writeInBlock(htmlDom.window, 'code-area', scripts.display);
	} catch (e){
		console.warn(`For demo "${ dir }":`, e);
	}
	try {
		writeInBlock(htmlDom.window, 'template-area', htmlDom.window.document.getElementById('demo-app'));
	} catch (e){
		console.warn(`For demo "${ dir }":`, e);
	}
	try {
		writeInBlock(htmlDom.window, 'demo-script', scripts.exec);
	} catch (e){
		console.warn(`For demo "${ dir }":`, e);
	}
	
	const scriptDeps = htmlDom.window.document.getElementById('deps');
	if (scriptDeps){
		scriptDeps.parentNode.removeChild(scriptDeps);
	} else {
		console.warn(`For demo "${ dir }": missing script with id "deps"`);
	}
	
	await writeFile(resolve(tutorialOutDir, `${ dir }.html`), htmlDom.window.document.body.innerHTML, 'UTF-8');
}).concat([ copyFile(join(tutorialSourcesDir, 'tutorials.json'), join(tutorialOutDir, 'tutorials.json')) ]);

Promise.all(allOperations).then(() => {
	console.info('Tutorials transformed !');
	process.exit(0);
}).catch(e => {
	console.error('An error occured while building the docs:', e);
	process.exit(1);
});
