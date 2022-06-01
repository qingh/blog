import { createContext, ReactNode, useState } from 'react'
interface IProps {
  children: ReactNode
}

interface IContext {
  user: string | null
  setUser: (val: string) => void
}

export const userContext = createContext({} as IContext)
const { Provider } = userContext

export const UserContextComponent = (props: IProps) => {
  const [user, setUser] = useState(sessionStorage.getItem('user'))
  return <Provider value={{ user, setUser }}>{props.children}</Provider>
}
