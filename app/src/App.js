import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { NextUIProvider } from '@nextui-org/react'
import './App.css'
import Content from './components/Content'
import Error404 from './components/Error404'

export default function App() {
    return (
        <Router>
            <NextUIProvider>
                <Switch>
                    <Route exact path="/" component={Content} />
                    <Route component={Error404} />
                </Switch>
            </NextUIProvider>
        </Router>
    )
}