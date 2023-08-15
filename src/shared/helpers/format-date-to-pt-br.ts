export const formatDateToPtBr = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        minute: '2-digit',
        hour: '2-digit',
        second: '2-digit',
    })
}
