# Consuming Http services using angular

* Add `HttpClientModule` in imports [] of `app.module.ts`
* To use http we need to add the `HttpClient` as a dependency to our component by adding it in the constructor
```javascript
    constructor(http : HttpClient) { }
```
* If we do not import `HttpClientModule`, then we get `No provider for http`. This is because we are injectinng the `HttpClient` in our component class but not registering it a s a provider.
* Dependency injection in Angular doesnt work unless we dont regisster all these dependencies as a provider.
* So we need to add `HttpClient` in provider array in app.module.ts.
* However, there are other bunch of dependencies also to be registered which would make it repeatitive, so we import `HttpClientModule`
* `HttpClientModule` is a class like app.module and it has all the classes required for http registered as providers
* Hence by importing this module, all the dependency injection are set properly for us.

## Error handling:

* Usually, when we are making http requests, we are bound to get many types of error response for the requested resources. 404, 409, 500, 403, 401, etc.
* Throwing a generic error message to the user in the UI like `Unexpected Error occured. Please try again` is not a good idea
* Hence we need to check the error object of the http request which returns an Observable.
* The `subscribe` method of the Observable accepts 2 functions. One for `next` which is when the response to the request was success. The other is `error` when response has error.
* We should not do the checking in the component because we need to adhere to the `Separation of concerns` principle.
* So we need to do the validation in service class itself

* We can do that by using the `catch` operator method from observables. 
* `import { catchError } from 'rxjs/operators';`
* We have a bunch of such operator in rxjs and we need to import them similarly to access it upon Observables.
* We can use `catchError` to catch the error in the observable. Its return type is an observable with error `throwError`
* `import { throwError } from 'rxjs';`
OR
* We can return custom application specific errors.
* Add a new file in common for app specific errors. Use that as a base class and create child error classes
```javascript
    export class AppError {

        constructor(public error : any ) {

        }
    }
```
```javascript
    return this.http.post(`${environment.protocol}://${environment.domain}:${environment.port}${COURSE}`, course).pipe(
      catchError((error : Response) => {
        if(error.status == 404)
          return Observable.throw(new NotFoundError(error))
        return Observable.throw(new AppError(error))
      })
    )
```
* Now inside our component we can replace to below code,
```javascript
    (error: Response) => {
      this.showFailed = true;
      if (error.status === 400 && error['error']['error'] === "CourseAlreadyRegistered")
        this.failureMessage = Errors.COURSEALREADYREGISTERED.message.replace('${courseId}', courseForm.value.courseId)
      setTimeout(() => {
        this.showFailed = false
      }, 5000)
    }
```
with this,
```javascript
    (error: AppError) => {
      this.showFailed = true;
      if (error instanceof BadRequestError && error.getErrorMessage() === "CourseAlreadyRegistered")
        this.failureMessage = COURSE_ALREADY_REGISTERED.message.replace('${courseId}', courseForm.value.courseId)
    })
```
```javascript
  export class AppError {

    constructor(public error : any ) { }

    public getError() {        
        return this.error
    }

    public getErrorMessage() {
        return this.error['error']['error']
    }
}
```

## Global Error Handlers:

* In our app we often get errors like `Unexpected Error` which are basically non handled server side errors.
* We need not handle these errors explicitly in the service and component classes.
* We can use angular's `ErrorHandler` for this.
* `ErrorHandler` provides a hook for centralized exception handling.
```javascript
  class ErrorHandler {
    handleError(error: any): void
  }
```
* By default, the `handleError()` simply logs the exception
* So to implement something like an alert or toast alert for our app, we need to override the `handleError()` in a derived class.
```javascript
  export class AppErrorHandler implements ErrorHandler {
    handleError(error: any) { }
  }
```
* However, angular doesnt know about the implementation, so we need to let angular know that we want to use `AppErrorHandler` for handling global exception rather than `ErrorHandler`.
* To do that we need to add this in `app.module.ts` inside the providers but in a different way.
```javascript
  providers: [
    CoursesService,
    DoctorsService,
    CourseService,
    {
      provide: ErrorHandler,
      useClass: AppErrorHandler
    }
  ],
```
* Now instead of handling our common error in the components like by removing the below,
```javascript
    (error: AppError) => {
      if (error instanceof UnexpectedError) {
        this.courseLoadError = true
        this.errorMessage = UNEXPECTED_ERROR.message
      } 
    }
```
* And adding the handler in `handleError()`
```javascript
    handleError(error: any) {
        alert(UNEXPECTED_ERROR.message)
    }
```
* Now whenever a service call which doesnot have a native error handling or rethrows the error encounters an exception, the page with throw an alert.

## Optimistic and Pessimistic approach:

* Most of the time, our CRUD implementations are highly bound to the http response.
* Say adding a course. We add the course and hit the http post call which takes some time for responding say 0.5 seconds.
* We wait till the call is success to update the data in our frontend and show success message.
* This approach feels pessimistic because we are waiting hopelessly on the server response.
* Optimistic approach her would be to update the data immediately in the UI and only if the http response throws error, we show the error and remove the data from the UI.

## Observables vs Promises:

* We use Observables & Promises to work with asynchronous operations.
* However angular team has decided to use Observable instead of Promises to handle http.
* `Observables are lazy`. Nothing happens until we subscribe to the observable. 
* An http call without subscribe would never make a network call. Only if we subscribe, the request will be made.
* `Promises are eager`. As soon as a promis is defined, the code is executed
* Say, the below example would log a random value even though the promis was not called.
```javascript
  function promisify() {
    let p = new Promise((resolve, reject) => {
        let n = Math.floor(Math.random()*100)
        console.log(n)
    })
  }

promisify()
```
* Observable are lazy due to the operators it has.
* For example the `retry()` operator which is very powerful and help us to retry failures automatically.
```javascript
    public getAll(): Observable<any> {
        return this.http.get(this.url).pipe(
            // map((res: Response) => res.json()),
            catchError(this._handleError),
            retry(2)
        )
    }
```
* These operators allow us to implement features with far less code. This is what we call `REACTIVE PROGRAMMING`
* Rxjs allows us to write javascript in reactive style.
* `map`, `catchError`, `throwError` and `retry` are some of the key operators we use oftenly in angular.
* These operators come to effect only when we subscribe to an observable. This is why we can usse all these operators together with pipe once we subscribe.
* However we can convert observables to promises using `toPromise` operator.