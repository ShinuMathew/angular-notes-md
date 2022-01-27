# How to add dependencies in angular

## Font awesome:

* `npm install font-awesome --save`
* Add the below in angular.json
```javascript
    "styles": [
        "node_modules/font-awesome/css/font-awesome.min.css",
        "src/styles.css"
    ]
```

## Font awesome Free:

* `npm i @fortawesome/fontawesome-free`
* Add the below in angular.json
```javascript
     "styles": [              
        "./node_modules/@fortawesome/fontawesome-free/css/all.min.css"
    ],
    "scripts": [
        "./node_modules/@fortawesome/fontawesome-free/js/all.min.js"
    ]
```

## Bootstrap:

* `npm install bootstrap --save`
*  Add the below in angular.json
```javascript
     "styles": [
        "./node_modules/bootstrap/dist/css/bootstrap.min.css",
        "src/styles.css"
    ],
    "scripts": [
        "./node_modules/bootstrap/dist/js/bootstrap.min.js"
    ]
```

## Tailwind CSS:

* `ng add @ngneat/tailwind`
* enable Tailwind JIT
* enable dark mode : class
* @tailwindcss plugins : all plugins
