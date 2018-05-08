export class Assign{    [x: string]: any;

    constructor(
      public task: string = '',
      public endDate: string = '',
      public notes: string = '',
      public status: string = '',
      public firm: number = 0,
      public employee: number = 0,
      public secondEmployee: number = 0     
    ){}
  }