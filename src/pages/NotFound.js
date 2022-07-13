import { useNavigate } from "react-router-dom"

export default function NotFound() {
    const navigate = useNavigate()
    return (
        <header className="App-header">
            <p className="pointer" onClick={() => navigate('/')}>
                404 - Page not found
            </p>
        </header>
    )
}