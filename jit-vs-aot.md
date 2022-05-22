# JIT vs AOT compilation

## AOT

* `Ahead Of Time compilation`
* Ahead of Time is a process of compiling higher/intermediate level language into a native machine code, which is system dependent.
* In Angular whenever we build or serve, the AOT compiler converts the code during the build time before its loaded and ran on the browser.
* From Angular 9, by default compiling option is set to true for ahead of time compiler.  
* Benefits of AOT:
    * When you are using Ahead of Time Compiler, compilation only happens once, while you build your project.
    * We need not ship the html templates and the angular compiler whenever we enter a new component.
    * It minimizes the size of the application.
    * The browser need not compile the code in run time, it can directly render the application without waiting to compile the app first. Hence provides a quick render.
    * AOT compiler detects error earlier.
    * AOT provides better security. It compiles HTML components and templates into JS files long before they are served into the client display. So there are no templates to read and no risky client side HTML or JS evaluations. This reduces the chances of injection attacks.
* How AOT works?
    * When we use ng build, it builds our source code into bundles which include JS files, index.html, style-sheets and assets files.
    * Angular uses the angular compiler to build source code and they do it in 3 phases
        * Code analysis
        * Code generation
        * Template type checking
    * At the end of this process, bundle size will be much smaller than the JIT compiler’s bundle size.
    * After AOT builds this into a war file, we deploy it to our remote servers.
    * Now, when client can access our web app, the browser downloads all necessary files like html, style sheets and JS which are needed for the default view.
    * At last, the application will get bootstrap and get rendered
`AOT is Angular 9's default compiling options`

## JIT

`Just In Time compilation`
* Provides compilation during the execution of the program at a run time before execution. In simple terms, code gets compiled when its needed and not at the build time.
* Why and when to use JIT?
    * JIT compiles individual files seperately and its mostly compiled in the browser. No need to build the project again after changing the code.
    * JIT is best when application is in local development.
* How JIT works?
    * JIT compiler compiles code at a runtime which means instead of interpreting byte code at build time, it will compile byte code when that component is called.
* JIT does not compile all the code initially. It compiles only the component which is called first. Then if other functionalities are required it will compile them.
* JIT allows to see and link to your source code in inspect mode because Just in Time, compiles the code with JIT mode and a map file.

## JIT vs AOT

* Loading in JIT is slower than AOT since it needs to compile your application at runtime.
* JIT is suitable for development environment. AOT for production
* JIT bundle size is largeer than AOT
