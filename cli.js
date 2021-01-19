#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cheerio_1 = __importDefault(require("cheerio"));
const prompt = inquirer_1.default.prompt;
const questions = {
    initial: {
        name: 'startOption',
        message: 'Want to start:',
        type: 'list',
        choices: ['A new UML', 'Use a JSON file']
    },
    type: {
        name: 'type',
        message: 'Select the type of your UML:',
        type: 'list',
        choices: ['class', 'interface', 'abstract class']
    },
    name: {
        name: 'name',
        message: 'Please enter a name:',
        type: 'string'
    },
    attributes: {
        name: 'attributes',
        message: 'Add attributes separated by spaces:',
        type: 'string'
    },
    getters: {
        name: 'getters',
        message: 'Add getters for:',
        type: 'checkbox'
    },
    setters: {
        name: 'setters',
        message: 'Add setters for:',
        type: 'checkbox'
    },
    methods: {
        name: 'methods',
        message: 'Add methods separated by spaces:',
        type: 'string'
    }
};
const splitMessage = (separator) => (message) => message.trim().split(separator);
const addChoices = (object) => (choices) => {
    object.choices = choices.split(' ');
    return object;
};
const createObjectUML = (responsePrompt) => {
    const { type, name, attributes, methods, getters, setters } = responsePrompt;
    const newAttributes = splitMessage(' ')(attributes);
    const newMethods = splitMessage(' ')(methods);
    const newGetters = getters.map(getter => `get ${getter}`);
    const newSetters = setters.map(setter => `set ${setter}`);
    return {
        type,
        name,
        attributes: newAttributes,
        methods: [...newGetters, ...newSetters, ...newMethods]
    };
};
const createHTML = async (path, umlObject) => {
    const html = await fs_1.default.readFileSync(path, 'utf8');
    const $ = cheerio_1.default.load(html);
    $('.header').append(`<span style=" font-weight: lighter; color: #aaa">${umlObject.type}</span><br>`);
    $('.header').append(`<span style=" font-size: 24px; color: #666">${umlObject.name}</span><br>`);
    umlObject.attributes.forEach(attribute => $('.attributes').append(`<span>${attribute}</span><br>`));
    umlObject.methods.forEach(method => {
        method += '( )';
        $('.methods').append(`<span>${method}</span><br>`);
    });
    return $.html('.uml');
};
const PATH = path_1.default.join(__dirname, '..', '..', 'uml');
const ensureDirectoryExistence = (filePath) => fs_1.default.existsSync(filePath) || fs_1.default.mkdirSync(filePath);
const saveUML = (PATH) => async (content, name, extension) => {
    // PATH += `/${name}`
    ensureDirectoryExistence(PATH);
    return await fs_1.default.writeFileSync(PATH + `/${name}.${extension}`, content);
};
const executionFlow = {
    'A new UML': async () => {
        const response = await prompt([questions.type, questions.name, questions.attributes]);
        const gettersQuestion = addChoices(questions.getters)(response.attributes);
        const getters = await prompt([gettersQuestion]);
        const settersQuestion = addChoices(questions.setters)(response.attributes);
        const setters = await prompt([settersQuestion]);
        const objectUML = await prompt([questions.methods]);
        return Object.assign(Object.assign(Object.assign(Object.assign({}, response), getters), setters), objectUML);
    },
    'Use a JSON file': () => {
        return { error: 'Role in developments, keep creating a new UML' };
    }
};
const main = async () => {
    const option = await prompt([questions.initial]);
    const response = await executionFlow[option.startOption]();
    if (response.error) {
        console.log(response.error);
        return;
    }
    const objectUML = createObjectUML(response);
    const umlJson = JSON.stringify(objectUML);
    await saveUML(PATH)(umlJson, objectUML.name, 'json');
    const html = await createHTML(path_1.default.join(__dirname, 'index.html'), objectUML);
    await saveUML(PATH)(html, objectUML.name, 'html');
};
main();
