# UML Generator

A simple UML Object Notation generator in HTML, to use in posts, readme and other platforms.

## Objective

Create your UML in a simple, reusable and editable way, to use in your tutorials.

The use of images makes modifications difficult, with an UML in HTML any update is simple.

# Documentation

## Installation

```bash
npm install uml-generator
```

## Run

```bash
npx uml-generator
```

## Tutorial

- Choose between creating a new UML or using an existing JSON.
  ```bash
  ? Want to start: (Use arrow keys)
  ❯ A new UML 
    Use a JSON file
  ```

- Select the type that your UML will represent.
  ```bash
  ? Select the type of your UML: (Use arrow keys)
  ❯ class 
    interface 
    abstract class 
  ```
- Insira um nome para seu UML.
  ```bash
  ? Please enter a name: 
  ```

- Enter your UML attributes separated by 'space'.
  ```bash
  ? Add attributes separated by spaces: 
  ```

- Select which attributes will have get methods.
  ```bash
  ? Add getters for: (Press <space> to select, <a> to toggle all, <i> to invert selection)
  ```

- Select which attributes will have set methods.
  ```bash
  ? Add setters for: (Press <space> to select, <a> to toggle all, <i> to invert selection)
  ```
- Enter your UML methods separated by 'space'.
  ```bash
  ? Add methods separated by spaces:
  ```

If the answers are those in this same sequence:
  - A new UML
  - class
  - Person
  - name age
  - name age (select all)
  - name age (select all)
  - speak

An uml folder must be created in your project, with an HTML file and a Json file. The HTML should look like this:

<div class="uml" style=" width: 256px; border: 2px solid #ccc ;border-radius: 12px 6px 12px 6px; letter-spacing: 1px; "><div class="header" style=" font-weight: bold; font-size: 14px; line-height: 15px; padding: 10px; text-align: center;"><span style=" font-weight: lighter; color: #aaa">class</span><br><span style=" font-size: 24px; color: #666">Person</span><br></div><div class="attributes" style="font-weight: 400; font-size: 16px; line-height: 26px; text-align: left; border-top: 3px solid #ccc; border-radius:12px; padding: 5px 10px 5px 30px "><span>name</span><br><span>age</span><br></div><div class="methods" style="font-weight: 400; font-size: 16px; line-height: 26px; text-align: left; border-top: 3px solid #ccc; border-radius:12px; padding: 5px 10px 5px 30px"><span>get name( )</span><br><span>get age( )</span><br><span>set name( )</span><br><span>set age( )</span><br><span>speak( )</span><br></div></div>
