import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const STAFF_PIN = '208850'
const AUTH_KEY = 'miamor_staff_auth'

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem(AUTH_KEY) === 'true'
    })

    const login = (pin) => {
        if (pin === STAFF_PIN) {
            setIsAuthenticated(true)
            sessionStorage.setItem(AUTH_KEY, 'true')
            return true
        }
        return false
    }

    const logout = () => {
        setIsAuthenticated(false)
        sessionStorage.removeItem(AUTH_KEY)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
