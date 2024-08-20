export function loadState<T>(key: string): T | undefined {
  try {
    const jsonState = localStorage.getItem(key);
    if (!jsonState) {
      return undefined;
    }
    return JSON.parse(jsonState) as T;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export function saveState<T>(key: string, state: T) {
  // Получаем текущее состояние из localStorage
  const currentState = loadState<T>(key) || {};

  // Объединяем текущее состояние с новыми данными
  const newState = { ...currentState, ...state };

  // Сохраняем обновленное состояние в localStorage
  const stringState = JSON.stringify(newState);
  localStorage.setItem(key, stringState);
}

export function loadJwtToken(key: string): string | null {
  try {
    // Получаем значение из localStorage по ключу
    const token = localStorage.getItem(key);

    // Если значение найдено, возвращаем его, иначе возвращаем null
    return token ? token : null;
  } catch (error) {
    console.error("Ошибка при загрузке JWT токена из localStorage:", error);
    return null;
  }
}
