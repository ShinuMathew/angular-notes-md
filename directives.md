# Angular directives:

There are basically two types of directives in Angular 
* Structural directives : Those that modify the DOM
* Attribute directives : Those that modify the attribute of DOM element

`Structural directives are prefixed with *. ex: *ngIf`

## ng-content:

"ng-content" can be used to pass a content from main component to child component 
- We can use it by either marking the class names:
    Consumer component : 
    ```html
        <div class="heading">Heading</div>
    ```
    Child componenet : 
    ```html
        <ng-content select=".heading"></ng-content>
    ```
- The ng-content in the child component will get replaced with the div of class "heading"
    OR
- We can use custom PROPERTY
    Consumer component : 
    ```html
        <div heading >Heading</div>
    ```
    Child componenet : 
    ```html
        <ng-content select="[heading]"></ng-content>
    ```

## ng-container:

"ng-container" is used to pass only the content from consumer instead of an html markup like div
```html
    <ng-container body >
        <h3>Body</h3>
        <p>Some content...</p>
    </ng-container>
```
Therefore the 
```html
    <ng-content select="[body]"></ng-content>
```
in the consumer component is replaced with 
```html
    <h3>Body</h3>
    <p>Some content...</p>
```

## ngIf:
- *ngIf or ng-if is used to display a component when a condition satisfies
```html
    <div *ngIf="isEmpty">
        <h2>No doctors found</h2>
    </div>
```
- ngIf is a 
- ng if else
```html
    <div *ngIf="isEmpty; else doctorList">
        <h2>No doctors found</h2>
    </div>
    <ng-template #doctorList>
        ...
    </ng-template>
```
- In the above we use ng-template is we want to show a template for a condition. Hence we can do something like this
```html
    <div *ngIf="isEmpty then nodoctor; else doctorList"></div>
    <ng-template #nodoctor>
        <h2>No doctors found</h2>
    </ng-template>
    <ng-template #doctorList>
        ...
    </ng-template>
```
- In the above example, as the condition resolves, the div is replaced with the ng-template

## hidden:

- If we want to hide a component in the DOM, then we can use hidden derivative
```html
    <div [hidden]="isEmpty" class="search">
        <h1>Searching for doctors</h1>
    </div>
```
### `hidden vs ngIf`: 
    * hidden hides the component/element which is resulting to condition false where as ngIf removes the component/element from the dom which is resulting to condition false
    * When dealing with large tree with lot of child elements, its better to use ngIf because these elements can take memory and computing resources. Hence we wont want them to be in the DOM(though hidden)
    * ngIf should not be used when building the tree is complecated and costly. As this would affect performance

### `Angular's Change detection`:    
Angular continues to check for changes even for hidden or invisible property. Change detection is a mechanism in angular that keeps your views in sync with the components thats running in the background.

## ngSwitch and ngSwitchCase:
- ngSwitch is an attribute directive since it simply modifies the attribute and we use it as an event binding.
```html
    [ngSwitch]="viewMode"
```
- ngSwitchCase is a structural directive since it modifies the DOM and we use it with an *
```html
    *ngSwitchCase="'list'"
```
```html
<div [ngSwitch]="viewMode">
    <div *ngSwitchCase="'grid'" class="row doctors doctor-grid"> 
        ...
    </div>
    <div *ngSwitchCase="'list'" class="row doctors doctor-list"> 
        ...
    </div>
</div>
```

## ngFor:
- ngFor is a structural directive since it modifies the DOM and we use it with an *
```html
    <div *ngFor="let course of courses">
        <h1>{{course}}</h1>
    </div>
```
- We can use the Local variables exposed by ngFor directive. For ex: If we want to get the index of the records, then we can use the index variable and alias it like `index as i`
```html
    <div *ngFor="let course of courses; index as i">
        <h1>{{i}} - {{course}}</h1>
    </div>
```
```html
    <div *ngFor="let doctor of doctors; index as i; odd as isOdd" [class.dark]="isOdd">
        <h1>{{i}} - {{course}}</h1>
    </div>
```
- Some of the variables are :
    * `index: number`: The index of the current item in the iterable.
    * `count: number`: The length of the iterable.
    * `first: boolean`: True when the item is the first item in the iterable.
    * `last: boolean`: True when the item is the last item in the iterable.
    * `even: boolean`: True when the item has an even index in the iterable.
    * `odd: boolean`: True when the item has an odd index in the iterable.

## ngClass:
- ngClass is an attribute derivative
- It allows to bind class properties easily
- For ex: 
```html
    <span class="fa-star" [class.fas]="isFavorite" [class.far]="!isFavorite"></span>
```
the above can be cleanly written now as,
```html
    <span 
        class="fa-star" 
        [ngClass]="{
            'fas' : isFavorite,
            'far' : !isFavorite
        }"
    >
    </span>
```

## ngStyle:
- ngStyle is an attribute derivative
- It allows to bind style properties easily
- For ex: 
```html
    <button 
        [style.background-color]="canSave ? 'blue' : 'grey'"
        [style.color]="canSave ? 'white' : 'black'"
        [style.fontWeight]="canSave ? 'bold' : 'normal'"
    ></button>
```
the above can be cleanly written now as,
```html
    <button 
        [ngStyle]="{
            'background-color' : canSave ? 'blue' : 'grey',
            'color' : canSave ? 'white' : 'black',
            'fontWeight' : canSave ? 'bold' : 'normal'
        }"
    ></button>
```

## Safe traversal operaator:
- Assume when string interpolating from an nested object with indefinite properties, then there are chances for the browser to throw error if the object is not valid like `Cannot read property 'bachelors' of undefined`
- So we use `?` to safely traverse `{{doctor.degree?.bachelors}}`

## Custom directives: 

`ng generate directive <directive_name> / ng g d <directive_name>`

- Directive, Pipes and Components should be added inside the `declarations` array in app.module.ts
- `HostListener` : Used to subscribe the DOM events raised from the element with the directive.
- `ElementRef` : A service in angular which gives us access to the DOM object
- Hostlistener directive gives us access to events like `on focus`, `on blur`, etc.
- ElementRef helps us to access the DOM element. Import the ElementRef as a service dependency to the directive by adding it to constructor.
```javascript
    constructor(private element : ElementRef) { }
```
And now we can use the `ElementRef` to get the value
```javascript
    @HostListener('blur') onBlur() {
        let value = this.element.nativeElement.value;
        this.element.nativeElement.value = value.toUpperCase();
    }
```
- Now we can use the directive simply as a an attribute
```html
    <input type="text" appInputFormat placeholder="Enter Text... "/>
```
- If we want to pass any parameter to the directive we can do that by making that parameter ass an input field to the directive and using property binding
```javascript
     @Input('format') format: string;
```
```html
    <input type="text" appInputFormat [format]="'phone'" placeholder="Enter Text... "/>
```
- This syntax `appInputFormat [format]="'phone'"` looks complecated. We can turn it into `[appInputFormat]="'phone'"` by changing the Input variable alias name to the directive name.
```javascript
    @Input('appInputFormat') format: string;
```
---
# Angular Change detection
- Angular change detection automatically detects changes to the component property or data.
- Lets say we have a list of courses which we are fetching from the server at regular intervals and there are chance for the array to be updated, angular's change detection identifies the change immediately and updated the view that is rendering the array.
- However for the above example itself, whenever angular is fetching the data from the server, it actually creates a separate memory location for the newly received data though there is no actual change in the data. Hence angular reconstructs the DOM for every fetch. This affects the performance of the application.
- This is happening because angular by default tracks object using its identity.
- Ex:
```html
    <button type="button" (click)="loadCourses()">LoadCourse</button>
    <ul>
        <li *ngFor="let course of courses">
            {{ course.name }}
        </li>
    </ul>
```
```javascript
    export class AppComponent {
        courses;

        loadCourses() {
            this.course = [
                {id: 1, name: 'course1'},
                {id: 2, name: 'course2'},
                {id: 3, name: 'course3'},
            ]
        }
    }    
```
- Everytime the `LoadCourse` button is pressed, angular is updated by a new copy of the courses array. THough the content is same, the object referrence id is different. Hence angular keeps updating the DOM.

To avoid the above issue, we need to tell angular to track the course explicitly with another propery
```html
    <button type="button" (click)="loadCourses()">LoadCourse</button>
    <ul>
        <li *ngFor="let course of courses; trackBy: trackCourse">
            {{ course.name }}
        </li>
    </ul>
```
```javascript
    export class AppComponent {
        courses;

        trackCourse(index, course) {
            return course ? course.id : undefined;
        }
    }    
```
- If you face performance problems, use trackBy to solve it
---
`What is the meaning of an '*' in structural derivative?`
- * in front of structural derivatives means that we are telling angular to rewrite the markup/block using `ng-template`
- Therfore a code which looks like this,
```html
    <div *ngIf="isEmpty; else doctordetails" class="nodocs">
        
    </div>

    <ng-template #nodoctor>
        <div class="loader">
            <div class="loading"></div>
        </div>
    </ng-template>     
```
will be now transformed as, 
```html
    <ng-template [ngIf]="isEmpty">
        <div class="nodocs">
            <h1>No Doctors found..</h1>
        </div>
    </ng-template> 

    <ng-template [ngIf]="!isEmpty">
        <div class="loader">
            <div class="loading"></div>
        </div>
    </ng-template> 
```

