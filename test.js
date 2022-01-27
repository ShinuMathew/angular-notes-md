function promisify() {
   return new Promise((resolve, reject) => {
        let n = Math.floor(Math.random()*100)
        console.log(n)
        if(n>20)
            resolve()
        else
            reject()
    })
}

promisify()
    .then(() => console.log("Number is greater than 20"))
    .catch(() => console.log(`Number is less than 20`))