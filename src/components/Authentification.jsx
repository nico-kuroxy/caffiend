import { useState } from "react"
import { useAuth } from "../context/AuthContext";

export default function Authentification(props) {
    const {handleCloseModal} = props
    const [isRegistration, setIsRegistration] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [error, setError] = useState(null);
    const {signup, login} = useAuth()


    async function handleAuthenticate() {
        if (!email || !email.includes('@') || !password || password.length < 6 || isAuthenticating) {
            return
        }
        try {
            setIsAuthenticating(true)
            setError(null)
            if (!isRegistration) {
                await signup(email, password)
            } else {
                await login(email, password)
            }
            handleCloseModal();
        } catch (err) {
            console.error(err.message)
            setError(err.message);
        } finally {
            setIsAuthenticating(false)
        }
    }

    return (
        <>
            <h2 className="sign-up-text">{isRegistration ? "Login": "Sign Up"}</h2>
            <p>{isRegistration ? "Sign in to your account !" : "Create an account !"}</p>
            {error && (
                <p>❌{error}</p>
            )}
            <input 
                value={email} 
                placeholder="Email"
                onChange={(e) => {
                    setEmail(e.target.value)
                }}
            >
            </input>
            <input 
                placeholder="******"
                onChange={(e) => {
                    setPassword(e.target.value)
                }}
                type="password">
            </input>
            <button onClick={handleAuthenticate}><p>{isAuthenticating ? "Authenticating" : "Submit"}</p></button>
            <hr/>
            <div className="register-content">
                <p>{isRegistration ? "Don\'t have an account?" : "Already have an account?"}</p>
                <button onClick={() => {
                    setIsRegistration(!isRegistration);
                }}>
                    <p>{isRegistration ? "Sign up" : "Log in"}</p></button>
            </div>
        </>
    )
}