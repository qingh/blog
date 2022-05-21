export interface IUser {
  id: number
  username: string
}

export interface ILogin {
  username: string
  password:string
}

export interface IUserQuery {
  id: number
  username: string
}

export interface IAddUser {
  username: string
}

export interface IUserList {
  id:number
  username: string
  created_at: string
}

export interface ITableData extends ITable {
  dataSource:IUserList[]
}
