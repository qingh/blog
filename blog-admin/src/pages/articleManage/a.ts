
interface User {
  name:string
  age:number
}

const user:User = {
  name: 'blue',
  age: 18
}

const json = <typeof user>{}

let key:keyof User
for (key in user) {
  json[key] = user[key]
}

export {}
