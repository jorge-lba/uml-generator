#!/usr/bin/env node

import inquirer from 'inquirer'
import fs from 'fs'
import path from 'path'
import cheerio from 'cheerio'

const prompt = inquirer.prompt

type ChoiceOption = {
  key: string,
  value: string
}

type QuestionPrompt = {
  name:string,
  message:string,
  type?:string,
  choices?: string[] | ChoiceOption[]
}

type UMLObject = {
  type:string,
  name:string,
  attributes:string[],
  methods:string[]
}

type PromptResponse = {
  type:string,
  name:string,
  attributes:string,
  getters:string[],
  setters:string[],
  methods:string
}

type GenericObject<T> = { [key:string]:T }

const questions: GenericObject<QuestionPrompt> = {
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
}

const splitMessage = (separator:string) => (message:string) => message.trim().split(separator)

const addChoices = (object:QuestionPrompt) => (choices:string) => {
  object.choices = choices.split(' ')
  return object
}

const createObjectUML = (responsePrompt:PromptResponse):UMLObject => {

  const {type, name, attributes, methods, getters, setters} = responsePrompt

  const newAttributes = splitMessage(' ')(attributes)
  const newMethods = splitMessage(' ')(methods)
  const newGetters = getters.map(getter => `get ${getter}`)
  const newSetters = setters.map(setter => `set ${setter}`)

  return {
    type,
    name,
    attributes: newAttributes,
    methods: [...newGetters, ...newSetters, ...newMethods]
  }
}

const createHTML = async (path: string, umlObject:UMLObject) => {

  const html = await fs.readFileSync(path, 'utf8')

  const $ = cheerio.load(html)

  $('.header').append(`<span style=" font-weight: lighter; color: #aaa">${umlObject.type}</span><br>`)
  $('.header').append(`<span style=" font-size: 24px; color: #666">${umlObject.name}</span><br>`)

  umlObject.attributes.forEach(attribute => $('.attributes').append(`<span>${attribute}</span><br>`))
  umlObject.methods.forEach(method =>{
    method += '( )'
    $('.methods').append(`<span>${method}</span><br>`)
  })

  return $.html('.uml')

}

const PATH = path.join(__dirname,'..', 'uml')

const ensureDirectoryExistence = (filePath:string) =>  fs.existsSync(filePath) || fs.mkdirSync(filePath)

const saveUML = (PATH:string) => async (content:string, name:string, extension:string) => {
  // PATH += `/${name}`
  ensureDirectoryExistence(PATH)
  return await fs.writeFileSync(PATH + `/${name}.${extension}` , content )
}

const executionFlow = {
  'A new UML': async () => {
    const response = await prompt([questions.type, questions.name, questions.attributes])

    const gettersQuestion = addChoices(questions.getters)(response.attributes)
    const getters = await prompt([gettersQuestion])

    const settersQuestion = addChoices(questions.setters)(response.attributes)
    const setters = await prompt([settersQuestion])

    const objectUML = await prompt([questions.methods])

    return {...response, ...getters, ...setters, ...objectUML}
  },

  'Use a JSON file': () => {
    return {error: 'Role in developments, keep creating a new UML'}
  }
}

const main = async () => {
  const option = await prompt<{startOption:'A new UML'|'Use a JSON file'}>([questions.initial])
  const response = await executionFlow[option.startOption]()

  if(response.error) {
    console.log(response.error)
    return
  }

  const objectUML = createObjectUML(response)

  const umlJson = JSON.stringify(objectUML)
  await saveUML(PATH)(umlJson, objectUML.name, 'json')

  const html = await createHTML(path.join(__dirname,'..', 'index.html'), objectUML)
  await saveUML(PATH)(html, objectUML.name, 'html')

}

main()