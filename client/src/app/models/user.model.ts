export class User {
  constructor(    
    public username: string = '',    
    public email: string = '',
    public firstName: string = '',
    public lastName: string = '',
    public role: string = '',
    public password: string = '',
    public confirmPassword: string = ''    
  ){}
}