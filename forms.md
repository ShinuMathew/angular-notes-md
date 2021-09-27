# Forms:

## Validations:
- Form validations in angular is done using a class called `FormControl`
- For every input field in our form we need to create an instance of the `FormControl` class.
- With these instance, we can check the,
    * value
    * touched
    * untouched
    * dirty
    * pristine
    * valid
    * errors
- `FormGroup` is used to handle multiple control groups
- All the properties of `FormControl` is present in `FormGroup`
`So to add validations to a form, we need to create a FormGroup object for a form and FormControl object for each input`
- In angular we can do this by using directives which will tell angular to create the attributes behind the scenes. These are `Template driven forms`
- Forms created explicitly by code are `Reactive Forms`

| Reactive Forms      | Template Driven Forms |
| ----------- | ----------- |
| Gives more control over validation logics      | Good for simple forms       |
| Good for complex form   | Simple Validations        |
| Unit Testing is easy   | Easier to create but less control        |

## Template Driven Approach

## FormControl(ngModel):

- Template Driven is done using a derivative `ngModel`. We are not using `ngModel` here for 2 way binding
- We are using this to associate control object to the input field to which ngModel directive was applied.
```html
    <input ngModel id="firstName" type="text" class="form-control">
```
However the above will throw the below error
```javascript
    ERROR Error: If ngModel is used within a form tag, either the name attribute must be set or the form
      control must be defined as 'standalone' in ngModelOptions.
```
- This because we need to set a name attribute which is mandated by angular.
```html
    <input ngModel name="firstName" id="firstName" type="text" class="form-control">
```
- To check the under the hood working on ngModel lets log it.
    * Add a template variable and set it to ngModel referrence `#firstName="ngModel"`
    * Add a (change)="log(firstName)"
```html
    <input ngModel name="firstName" #firstName="ngModel" (change)="log(firstName)" id="firstName" type="text" class="form-control">
```
- `NgModel` class referrence is bound to the input when `ngModel` directive is added
- `NgModel` class has an instance of `FormControl` hence we get all its properties 
- We use this `FormControl` class to track state changes and validity of the input fields
`Therefore, when we add ngModel name="firstName" to an input field, angular adds the FormControl class to that element`

### Validations :

In angular we have few built in validators which are based out of the html5 validation attributes
 * required
 * minlength
 * maxlength
 and so on...
 - To add these validations to our form element, we need to first add the htmls5 validation attributes like `required` and `ngModel` with the name attribute `name="firstName"` and a template variable for referrence `#firstName` with value of ngModel
 ```html
    <input required ngModel name="firstName" #firstName="ngModel" id="firstName" type="text" class="form-control">
 ```
 - Now for the handler, lets create a div with bootstrap alert and use the `firstName` variable to access the FormControl properties which ngModel applies to the input.
 - Now using the `*ngIf` directive, we can check for errors and enable the alerts.
 ```html
    <input required ngModel name="firstName" #firstName="ngModel" id="firstName" type="text" class="form-control">
    <div class="alert alert-danger" *ngIf="firstName.touched && !firstName.valid">FirstName is required</div>
 ```
 - To add multiple validations, we can change the above code as,
  ```html
   <input required minlength="5" maxlength="25" pattern="[\w\d_-]{5,25}@[\w\d]{1,10}.[\w\d]{1,10}" ngModel name="email" #email="ngModel" (change)="log(email)" id="email" type="text" class="form-control">
    <div class="alert alert-danger" *ngIf="email.touched && !email.valid">
        <div *ngIf="email.errors.required">Email field is required</div>
        <div *ngIf="email.errors.minlength">Email provided should be more than {{email.errors.minlength.requiredLength}} characters</div>
        <div *ngIf="email.errors.pattern">Email provided doesnot fulfill the pattern {{email.errors.pattern.requiredPattern}}</div>
    </div>
 ```
- Similar to the FormControl of form-control class, we have other classes from ngModel as well which gets applied to the component. Like : form-control ng-touched ng-invalid. We can use these classes to style properties like adding red border when validation fails

## FormGroup(ngForm):

### We have learned that when we apply an ngModel directive on an input field angular creates a `FormControl` object under the hood and associates that with the input field. Like wise we have another class called `FormGroup`.
- So a `FormControl` represents one input field and `FormGroup` represents a group of `FormControl`
- Each `form` is a FormGroup because it has atleast one `FormControl`
- Angular by default adds `ngForm` directive on a form when it doesnot have `[ngNoForm]` or `[formGroup]` attributes.
```html
    <form #mainForm="ngForm" >
    </form>
```
- This `ngForm` has an output property `ngSubmit` which like any other output property is used to raise custom events. Which we can use in our event binding expressions.
```html
    <form #mainForm="ngForm" (ngSubmit)="submit(mainForm)">
```
- With `FormGroup` we have most of the same properties we have for `FormControl` like 
    * valid : Which says if a form as a whole is valid
    * dirty
    * touched
    etc
All these are on a Form level not input level
- We have a property `value` here which gives us the FormControls in the form and their values. It is a json representation of our form.
```javascript
    {
        firstName: "Shinu Mathew",
        email: "mathewshinu9474@gmail.com",
        comment: "A vibrant individual with 6+ years of experience"
    }
```
- Now we can get this value using `value` property and send it to api.
```javascript
    submit(forms) {
        postContactInformation(forms.value)
    }
```

## ngModelGroup:

- Sometimes we may have more than one FormGroup in our form. In that case we use `[ngModelGroup]`
```html
   <form #forms="ngForm" (ngSubmit)="submit(forms)>
        <div ngModelGroup="contact" #contact="ngModelGroup">
            <div *ngIf="!contact.valid">
            <!-- Validations -->
            </div>
        <!-- FormControls -->
        </div>
   </form>
```
## Summary : FormControl, FormGroup and relative directives

- In angular we have 2 classes to keep track of the state of the input fields and their validity.
    * One is `FormControl` which represents only one input field. Like a FirstName or Email field
    * The other is `FormGroup` which represents a group of input fields. Like a group of input fields for Shipping address.
- When we apply `ngModel` directive on an input field, angular automatically creates a `FormControl` object and associates it with that input field.
- `FormGroup` class is used to represent an entire form and optionally groups within a form.
- We have a directive called `ngForm` which is automatically applied to all form elements.
- Angular automatically apply `ngForm` directive to your form which internally creates a `FormGroup` object and associates it with your form.
- With this `FormGroup` object we can track the status of the form and its validity.
- If we have a complex form with multiple subgroups, we can optionally apply `ngModelGroup` directive on a subgroup. This directive similar to the `ngForm` will also create a `FormGroup` object for that group.
- What is the difference between `ngModelGroup` and `ngForm`?
    - The `ngForm` exposes an output property `ngSubmit` which is used to handle the submit events of the form.
    - `ngModelGroup` does not have such a property because it does not make sense to have a submit for a part of the form.
---

### Disabling and enabling submit with form validation

We can use the `ngForm` property `value` to do this.
```html
    <form action="" class="w-50" #forms="ngForm" (ngSubmit)="submit(forms)">
        .
        .
        .
        <button [disabled]="!forms.valid" type="submit" class="btn btn-primary">Submit</button>
    </form>
```

## ngValue: 

- If we want to set the value of a property to a complex object we can use `ngValue` directive
- Say for example a dropdown to select contact method
```html
     <select ngModel name="contact-method" id="contact-method" class="form-select">        
        <option *ngFor="let ops of contactMethod" [value]="ops.id">{{ops.name}}</option>
    </select>
```
- Here the value is binded to a property 'id' of the `contactMethod`.
- If we want to send more information about the selected dropdown as json, we can use `ngValue`
```html
    <option *ngFor="let ops of contactMethod" [ngValue]="ops">{{ops.name}}</option>
```