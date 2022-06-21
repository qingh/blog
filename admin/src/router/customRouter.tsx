import { useState, useLayoutEffect, ReactNode } from 'react'
import { BrowserHistory } from 'history'
import { Router } from 'react-router-dom'

interface IProps {
  history: BrowserHistory
  children: ReactNode
}

export const CustomRouter = ({ history, ...props }: IProps) => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location
  })

  useLayoutEffect(() => history.listen(setState), [history])

  return (
    <Router
      {...props}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  )
}
