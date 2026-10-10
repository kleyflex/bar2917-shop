export const getContentType = () => ({
    'Content-Type': 'application/json'
})

// Сырое сообщение бэка (для внутренних проверок вроде 'jwt expired'). Пользователю не показывать
export const errorCatch = (error: any): string => {
    const message = error?.response?.data?.message

    return message
      ? typeof error.response.data.message === 'object'
        ? message[0]
        : message
      : error.message
}

export const getErrorStatus = (error: any): number | null => error?.response?.status ?? null

const NETWORK_ERROR = 'Сервер недоступен. Проверьте интернет и попробуйте ещё раз'

// Текст ошибки для пользователя: всегда по-русски, без технических деталей
export const getErrorMessage = (error: any, fallback = 'Что-то пошло не так, попробуйте ещё раз'): string => {
    if (!error?.response) return NETWORK_ERROR

    const status: number = error.response.status

    if (status === 429) return 'Слишком много попыток. Попробуйте через минуту'
    if (status >= 500) return NETWORK_ERROR

    const message = error.response.data?.message
    const text = Array.isArray(message) ? message[0] : message

    // Сообщения бэка на русском показываем как есть, английские дефолты Nest — нет
    return typeof text === 'string' && /[а-яё]/i.test(text) ? text : fallback
}
