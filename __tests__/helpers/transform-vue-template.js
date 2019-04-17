const compiler = require('vue-template-compiler');
const transpileVueTemplate = require('vue-template-es2015-compiler');

const toFunction = code => `function(){${code}}`;

module.exports = {
    process(code){
        const compiled = compiler.compile(code);
        const postProcessed = transpileVueTemplate(("module.exports={render:" + (toFunction(compiled.render)) + ",staticRenderFns:[" + (compiled.staticRenderFns.map(toFunction).join(',')) + "]}"))
        return postProcessed;
    }
}
