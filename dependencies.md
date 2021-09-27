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