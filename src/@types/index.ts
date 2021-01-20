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

export {
  ChoiceOption,
  QuestionPrompt,
  UMLObject,
  PromptResponse,
  GenericObject
}