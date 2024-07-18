import { useCallback } from "react"

const useLocalStorage = () => {

    const createOrUpdateLocalStorage = useCallback(<T>(key: string, data: T) => {
        localStorage.setItem(key, JSON.stringify(data))
    }, [])

    const deleteLocalStorage = useCallback((key: string) => {
        localStorage.deleteItem(key)
    }, [])

    const getLocalStorage = useCallback((key: string) => {
        const data = localStorage.getItem(key)
        if (data) {
            return JSON.parse(data)
        } else {
            return null
        }
    }, [])

    return {
        createOrUpdateLocalStorage,
        deleteLocalStorage,
        getLocalStorage

    }

}

export default useLocalStorage