export class DataPool {
    static credentials = [
       {
           valid: {
              username: process.env.USERNAME,
              password: process.env.PASSWORD
           },
           invalid: {
              username: "invalid@email",
              password: "invalidPWD"
           },
           empty: {
              username: "",
              password: ""
           }
       }
    ]

}