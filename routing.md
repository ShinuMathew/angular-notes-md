## Angular Routing

* Routing has 3 steps:
    * Configuring the routes. Each route determines which component should be visible when a url is called. Route is a map of a path to the component.
    * Add router outlet
    * Add links

1. `Configuring Routes`

* Add routes in an array with 2 components.
```javascript
    const routes: Routes = [
        { path: '/', component: DoctorsComponent },
        { path: 'followers', component: GithubFollowersComponent },
        { path: 'profile/:username', component: GithubUsersComponent },
        { path: 'courses', component: CourseModuleComponent },
        { path: 'signup', component: SignUpComponent },
        { path: 'changepassword', component: ChangePasswordComponent },
        { path: '**', component: NotFoundComponent },
    ];

    @NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule]
    })
    export class AppRoutingModule { }
```
* The order of the array items is required to be proper.
* We can have wild card for matching any path to show a 404 not found component.
```javascript
    { path: '**', component: NotFoundComponent },
```

2. `Add router outlet`

* For our router to load components based on the path, we need to give `router-outlet` as a placeholder for the components to be rendered
```javascript
    <app-public-header></app-public-header>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
```

3. `Adding Router links`

* To navigate to different path and load components, we can use the normal `href` tag.
* We can provide the `routes path` in `AppRoutingModule` in href tag
```html
    <a href="">HOME</a>
```
* Issue here is that with href the browser loads the whole application and angular needs to reload the whole application.
* The whole point of angular to build SPA is lost here
* When href tag is used, the browser downloads the whole code file bundle again. Hence this is too costly on performance.
* Hence we use attribute `routerLink`.
* `routerLink` only render the component mapped to the path.
```html
    <div class="col-5 header-links">
        <a routerLink="">HOME</a>
        <a routerLink="/followers">FOLLOWERS</a>
        <a routerLink="/courses">COURSES</a>
        <a routerLink="/signup">SIGNUP</a>
        <a routerLink="/changepassword">CHANGEPASSWORD</a>        
    </div>
```
* Whenever working with route parameters like `followers/:username`, we cannot use routerLink as an attribute.
* We need to use it with a data binding syntax.
```html
    <a [routerLink]="['/followers', follower.login]" class="card-title">{{follower.login}}</a> 
```
* We need to data bind router link to an array with first argument as the route path and second as route parameter
* To fetch the params from the path in component, say we are navigating from list of user to individual user profile component, we need the user id passed in the path. We can do that using `paramMap` from `ActivatedRoute` class
* We need to add it as a dependency to the class inside the constructor.
* `paramMap` return an `Observable<ParamMap>` so we need to subscribe it to get the route parameters.
```javascript
    constructor(private route: ActivatedRoute, private githubUsersService : GithubUsersService) { 
        this.route.paramMap.subscribe(params => {
            this.username = params.get("username")
            this.githubUsersService.getSpecific(this.username).subscribe(users => this.userProfile = users);
        });
    }
```
* Why is the `paramMap` returning an observable?
    * When we navigate from a component to another, angular actually destroys the old component, removes it from the DOM, creates new component with init and render its template in the DOM.
    * This is why we have `OnInit` and `OnDestroy` component lifecycle hooks.
    * However, if we have a component where on navigation, we re render the same component, example on a page a component that renders user transactions alone.
    * Assume that on clicking next/prev button user navigates to the next/prev user's transaction.
    * In this scenario it basically just renders the same component but with a different path param.
    * Here it doesn't make sense destroy and rebuild the same component.
    * This is why route params a re observables.
    * `An observable is technically a collection of asynchronous data that arrives over time`
    * We can use observables to model streams of data.
    * Data comes in the stream and anyone who has subscribed to the observable will be notified.
    * Assume a mailing list. Once we subscribe to a mailing service, everytime there is a new post, the subscriber will be notified.
    * Same way we subscribe to the `paramMap` which is a collection of route param map which can change overtime and everytime there is a change, the subscriber is notified.
    * When we redirect to a route, a component is rendered using the `OnInit`. However if a route needs to render only specific data for a route param, then we need not recreate the same component. 
    * In such cases, angular will not call the `ngOnInit()` everytime a route is changed.
    * `Ex: refer GithubUsersComponent implementation`
    * This is only possible because the route params are not simple object but Observables which we are subscribing.

* To automatically add classes to an active route, we use `RouterLinkActive`
```html
    <a routerLinkActive="active" routerLink="" [routerLinkActiveOptions]="{ exact: true }">HOME</a>
``` 
* If we are certain that we want to navigate to a separate component with the route param, we need not subscribe the route param.
* We can use `snapshots`
```javascript
    let id = this.route.snapshot.paramMap.get('id')
```

* Sometime as a technique to improve SEO, we might need to send relevant params in the path. We can send multiple params in the path.


## Query Parameter
* To send
```html
    <a [routerLink]="['/followers', [queryParams]="{ page: 1, order: 'newest'}]" class="card-title">{{follower.login}}</a> 
```
* To read
    * We need to bind the `ActivatedRoute` dependency
    * And just like normal paramMaps, we can get the query object using `queryParamMap`
```javascript
    constructor(private route: ActivatedRoute) {
        this.route.queryParamMap.subscribe(...)
    }
```
OR
```javascript
    let page = this.route.snapshot.queryParamMap.get('page')
```

## Subscribing to multiple observables:

* When we have scenario in which a route path has to deal with param and query param, since both are observables, we need to subscribe to both the observables.
* Since observables are streams of data flowing over time, we cannot practically subscribe 2 observables(`paramMap` and `queryParamMap`) and combine the result to send the server request for resource.
* We need to combine the 2 observables as one to subscribe to the latest stream of data from both the observables.
* We do that using an operator of the Observables, `combineLatest`.
```javascript
    ngOnInit() {
        Observables.combineLatest([
            this.route.paramMap,
            this.route.queryParamMap
        ])
        .subscribe(combined => {
            let username = combined[0].get("username"); // To get the param 'username' from paramMap observable
            let page = combined[1].get("page"); // To get the param 'page' from queryParamMap observable
            this.service.getAll({username: username, page: page})
                .subscribe(followers => this.followers = followers)
        })
    }
```

## SwitchMap:

* In the above example we are ending up with a nested `subscribe` syntax. 
* We can use reactive extension to rewrite the same code in a cleaner and elegant way.
```javascript

```

## Navigating user programmatically

* We have been using the `routerLink` attribute to add link to our application.
* Sometimes we want to navigate the use programmatically. Ex: when we submit a user profile, we need to navigate to a different page.
```javascript
    this.router.navigate(["/followers", nextUser.login], {
        queryParams: {
            page:1, order: 'newest'
        }
    })
```
