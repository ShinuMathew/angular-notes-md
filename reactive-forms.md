# Reactive Forms

`Reactive forms are a programatical way of converting an html form to angular form`

* Unlike the template driven form which are completely driven by directives which automatically binds `FormControl` and `FormGroup` instances to the forms, here we explicitly bind a form element to those classes.

* To achieve this, we need to bind the `formGroup` property of the form to the realtime instance of `FormGroup` in component.ts
* But we will the get the below error
```javascript
    Can't bind to 'formGroup' since it isn't a known property of 'form'
```
* This is because, to use the `FormGroup` class we need to import the `ReactiveFormsModule` in app.module.ts and add it in `imports` section
```javascript
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule
    ],
```
* To bind the form to the realtime instance of `FormGroup`
```javascript
     this.form = new FormGroup({
      username: new FormControl(),
      password: new FormControl()
    })
```
* The instance of the FormGroup accepts multiple `FormControl()` or `FormGroup()` which has `FormControl()` in it
* In our html we link this using `formControlname`
```html
    <input 
        formControlName="username"
        id="username"         
        placeholder="Enter Username"
        type="text" 
        class="form-control" 
    />
```

## Validations: 

* In template driven approach we added validations using html5 like
    * required
    * minLength
    * patterns
* With reactive form we dont use these attributes. `We assign validators when using FormControl objects`
* The `FormControl` instance takes arguments
    * `formState`, which is the initial state of the form control input
    * `validator`, which accepts a validator function or array of validator function
    ```javascript
        username: new FormControl('InitialUsername', [Validators.required, Validators.email])
        password: new FormControl('', Validators.required)
    ```
    * Validators.required is a static function. Hence we can call it using class name.
    * Since the `validator` argument requires a validator function, we are sending it as a reference(`Validators.required`) and not the function return(`Validators.required()`)
* Now for adding alerts, we do the same way as in template driven. Only that we dont have an `ngModel` referrence here.
* Instead we use the actual reference for the `form` object from component.
* To get the `form control` input username, we can access it from the `form` object using 
```javascript
    form.get('username')
```
* From this, we can use the predefined validator functions
```html
    <div *ngIf="form.get('username').touched && form.get('username').invalid" class="alert alert-danger">
        UserName is required
    </div>
```
* Since this syntax : `"form.get('username').touched && form.get('username').invalid"`is a bit long, we can use the getter setter property methods to get the `username` form control.
```javascript
    get username() {
        return this.form.get('username')
    }
```
```html
    <div *ngIf="username.touched && username.invalid" class="alert alert-danger">
        UserName is required
    </div>
```

## Custom Validators: 

* To create a custom validator we need to create a class for custom validation
* It should have static methods which are the validator functions
```typescript
    import { AbstractControl, ValidationErrors } from "@angular/forms";

    export class UsernameValidator {

        // A validator function should take an argument of  AbstractControl type and return ValidationErrors or null
        static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
            if((control.value as string).indexOf(' ') >= 0) return {
                cannotContainSpace : {
                    spaceFound: true,
                    description: 'No spaces must be found'
                }
            }        
    }
}
```
* The Custom validator function must accept an argument of type `AbstractControl` and return either null or a `ValidationErrors` object which is just a JS object like
```javascript
    {
        spaceFound: true,
        description: 'No spaces must be found'
    }
```

## Async Validators: 

* For validators which rely on an asynchronous operation like a server validation to check if the username already exists, we use `AsyncValidatorFn`
`NOTE : The FormControl object accepts the following params`
```javascript
    new FormControl(formState?: any, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[])
```
* The `AsyncValidatorFn` interface accepts an `AbstractControl` argument and return `Promise<ValidationErrors|null>` or `Observable<ValidationErrors|null>`
* Promise and Observable are used to handle async operations
* Hence we can do an async validation by returning a promise or observable which resolves with a ValidationErrors or null.
```javascript
    static shouldBeUnique(control: AbstractControl): Promise<ValidationErrors | null> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (control.value === 'ShinuMathew')
                    resolve({
                        shouldBeUnique: true,
                        description: 'Provided username already exists'
                    })
                else
                    resolve(null)
            }, 2000)
        })
    }
```
* `ValidationErrors` type is a simple JS Object
* To show a loader or loding text meanwhile the promise resolves, we can use the pending property of the FormControl.
```javascript
    <div *ngIf="username.pending" class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
    </div>
```

## Form Submission:

* Similar to the template driven form for submission we can use `ngSubmit` which an output property of the `ngform`
```html
    <form [formGroup]="form" (ngSubmit)="registerUser()">
    </form>
```
* For capturing and returning any errors at a form level, we can use `form.error` property
```html
    <div class="alert alert-danger" *ngIf="form.errors">
      The Username or Password is invalid!!
    </div>
```

## Nested FormGroup:

* We can have `FormGroup` which is just a combination of multiple `FormGroups`.
```javascript
    this.form = new FormGroup({
      account: new FormGroup({
        username: new FormControl('', [Validators.required, UsernameValidator.cannotContainSpace], UsernameValidator.shouldBeUnique),
        password: new FormControl('', [Validators.required, Validators.minLength(9), Validators.pattern('(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,13}'), Validators.maxLength(15)])
      })
    })
```
```html
     <div formGroupName="account">
        <div class="form-group">
            <label for="username">Username</label>
            <input 
                formControlName="username"
                id="username"         
                placeholder="Enter Username"
                type="text" 
                class="form-control" />
        <!-- <div *ngIf="form.get('username').touched && form.get('username').invalid" class="alert alert-danger">
          UserName is required
        </div> -->        
            <div *ngIf="username.pending" class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            <div *ngIf="username.touched && username.invalid" class="alert alert-danger">
                <div *ngIf="username.errors.required">UserName is required</div>
                <div *ngIf="username.errors.cannotContainSpace">UserName should not have space</div>
                <div *ngIf="username.errors.shouldBeUnique">UserName already exists! Please try another</div>
            </div>
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input 
                formControlName="password"
                id="password" 
                type="password" 
                placeholder="Enter Password"
                class="form-control" />
            <div *ngIf="password.touched && password.invalid" class="alert alert-danger">
                <div *ngIf="password.errors.required">Password is required</div>
                <div *ngIf="password.errors.minlength">Password should be of minimum {{password.errors.minlength.requiredLength}}</div>
                <div *ngIf="password.errors.pattern">Password should have lower and upper case with any of the !@#$ characters</div>
            </div>
        </div>
    </div>
```
* The nested form group can be linked using `formGroupName`

## FormBuilder

* To build complex forms we can use FormBuilder. Say like the below form,
```javascript
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      contact: new FormGroup({
        email: new FormControl('', Validators.required),
        phone: new FormControl('', Validators.required),
      }),
      topics: new FormArray([])
    });
```
* Using FormBuilder
```javascript
     this.form = fb.group({
      name: ['', Validators.required],
      contact: fb.group({
        email: [],
        phone: []
      }),
      topics: fb.array([])
    })
```
