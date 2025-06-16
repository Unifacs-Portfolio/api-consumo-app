export function tryParseJson<T>(jsonString: string): T | null {
    try {
        return JSON.parse(jsonString) as T
    } catch (error) {
        console.error('Failed to parse JSON:', error)
        return null
    }
}
