# Dependency injection(DI) in angular

## Code without DI

* Code without DI is not flexible.
* Assume we have a class Car which uses instances of 2 other class Engine and Tire
```typescript
    class Car {
        engine;
        tire;

        constructor() {
            this.engine = new Engine();
            this.tire = new Tire();
        }
    }

    class Engine {
        constructor() {}
    }

    class Tire {
        constructor() {}
    }
```
* Problem 1 :
    * The Car class has 2 variables which are instantiated inside the constructor as Engine and Tire type as above.
    * However, imagine that the developer now introduces a new param to the Engine class constructor.
    * The code now needs to be updated everywhere the Engine class instance is created.
    ```typescript
        class Car {
            engine;
            tire;

            constructor() {
                this.engine = new Engine(); // ERROR
                this.tire = new Tire();
            }
        }

        class Engine {
            constructor(newParam) {}
        }

        class Tire {
            constructor() {}
        }
    ```
* Problem 2 :
    * Anytime we instantiate the Car class we get the same instance of the Engine and Tire type.
    * What if we wanted a different Engine like PetrolEngine or tyre type like MRFTires?
    * Even if we could write code to do this, what would we do if these class internally depend on other instances.
    * Basically we are not in control of our code.

## DI as a design pattern

* DI coding pattern in which a class receives its dependencies from external sources rather than creating them itself.
* Now with DI, we are moving the defination of the dependencies from inside the constructor to the params of the constructor.
```typescript
    class Car {
        engine;
        tire;

        constructor(engine, tire) {
            this.engine = engine;
            this.tire = tire;
        }
    }
```
* Now we can create the Car instance like this.
```typescript
    var myEngine = new Engine();
    var myTire = new Tire();
    var myCar = new Car(myEngine, myTire);
```
* Now even if the Engine class changes, we need not update the Car
```typescript
    var myEngine = new Engine(newParams);
    var myTire = new Tire();
    var myCar = new Car(myEngine, myTire);
```
* However, even here we are creating dependencies first and then injecting to the class. But what if the number of dependencies and the dependencies of dependencies grow? This will make it complecated again
* For ex,
```typescript
    var myEngine = new Engine(newParams);
    var myTire = new Tire();
    var depA = new depA();
    var depB = new depB();
    var depC = new depC();
    var depD = new depD();
    var depE = new depE();
    .
    .
    .
    var depZ = new depZ();
    var myCar = new Car(myEngine, myTire, depA, depB, depC, depD, depE, ...., depZ);
```
* Each `dep` class again might have dependencies which we might need to create first. Hence this becomes tidious.
```typescript
    var myEngine = new Engine(newParams);
    var myTire = new Tire();
    var depA = new depA();
    var depB = new depB();
    var depC = new depC();
    var depD = new depD();
    var depE = new depE();
    .
    .
    .
    var depAB = new depAB();
    var depCD = new depCD(depAB);
    var depZ = new depZ(depCD);
    var myCar = new Car(myEngine, myTire, depA, depB, depC, depD, depE, ...., depZ);
```
* Hence in DI, this part is taken care by an external framework.

## DI as a framework

* The DI framework has something called as an injector where we register all our dependencies.
* Its a container of all dependencies.
* The framework manages all the depenendencies so that the developer does not need to maintain it.
* We just need to ask for the dependency and it will return the required dependencies.
 
## Angular's DI framework

* In angular, to create a service, we create a service class.
* This service class is a dependency for the component class.
* First we create a service class say `UserService`.
* Next we register this class with the angulars built in injector.
* Now we can declare the UserService class as a dependency to the class that needs it. Could be other service class or a component or a directive class, etc.

* Step 1 : Create a service class with `ng g service services/user`. It generates a template class. Let's add a simple method here.
```typescript
    import { Injectable } from '@angular/core';

    @Injectable()
    export class UserService {

        constructor() { }

        getUser() {
            return "TempUser";
        }
    }
```
* Step 2 : Register the service in the providers array. We can add it in the specific class which wants to use this dependency. But this makes the dependency available only for that particular class. We can also add it in the app component and all its children can access it but each module is a feature and it might grow. Hence we add it in the app module.
```typescript
    providers: [ UserService ]
```

* Step 3 : Mention dependency in the component that needs it. Dependencies in angular are added in the constructor. We can use a typescript's short hand syntax.
```typescript
    @Component({
        selector: 'app-users',
        templateUrl: './users.component.html',
        styleUrls: ['./users.component.css']
    })
    export class UsersComponent implements OnInit {
        constructor(private userService : UserService) { }
    };

```
* The `@Injectable()` decorator tells angular that this service class might have one or more injected dependency in itself.
* However, `@Component()` decorator over a component that lets angular know that it might have dependencies and might use the DI system.
* But we need `@Injectable()` decorator over a service class. If we remove the decorator, angular treats it like a normal class. Hence the provider array would have an error like below.
```typescript
    Error: src/app/app.module.ts:161:5 - error NG2005: The class 'UserService' cannot be created via dependency injection, as it does not have an Angular decorator. This will result in an error at runtime.

    Either add the @Injectable() decorator to 'UserService', or configure a different provider (such as a provider with 'useFactory').
```

## `@Injectable()` decorator

* `@Injectable()` is a way to tell angular that dependency injection is possible with the class.
* When to use the Injectable decorator?
    * When a class does not have any other decorator but has dependencies like `HttpClient`, we will have to use the Injectable decorator.
* How does this help angular?
    * Angular emits some meta data only for classes that have a decorator. 
    * This metadata tells angular what type of instance should injector provide as dependency to that class.
    * If the decorator which provides metadata is not provided, there wont be a metadata emitted and angular would not know which instance needs to be provided to this particular class.
* Basically whenever there is a dependency, we need to make sure that the class has a valid decorator to it. It could be a `@Component` or `@Injectable()`. But for services, we use `@Injectable()`.