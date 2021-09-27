# Angular Input and Output

## Input :

Angular component input property allows to pass a property from parent to child. We do this by
* Creating a parent component and a child component
* child component has a Input variable defined in child.component.ts
```Javascript
@Input('is-liked') public isLikedIp : boolean = true;
```
* We will pass this value for this input property from parent component like
```html
<app-child [is-liked]="liked"></app-child>
```
* The value "liked" for the child component comes from parent component

## Output :

Angular output allows to emit a property from child component. The parent receives the property value and consumes it by event binding. We do this by
* Creating an output property in child component
```Javascript
@Output('is-loggedout') public isLoggedOut : EventEmitter<boolean> = EventEmitter();
```
* We define a method in the child component to emit the property
```Javascript
onLogout() {
    this.isLoggedOut.emit()
}
```
* In Child component html we use event binding to emit this output property
```html
<button (click)="onLogout()" class="btn btn-primary">Submit</button>
```
* The parent component will receive the childs output property by using event binding from html to ts
```html
<app-child [is-loggedout]="setLogout()"></app-child>
```
```Javascript
setLogout() {
    this.isLoggedOut = true;
}
```