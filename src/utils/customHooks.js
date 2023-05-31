import { useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../firebase/firebase"

export const useModal = () => {
    const [isOpen, setIsOpen] = useState(false)
    const openModal = () => {
        setIsOpen(true)
    }
    const closeModal = () => {
        setIsOpen(false)
    }

    return { isOpen, openModal, closeModal }
}

export const useLoggedInUser = () => {
    const [user] = useAuthState(auth)

    return [user]
}