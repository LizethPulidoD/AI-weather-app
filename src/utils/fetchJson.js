async function fetchJson(url, errorMessage) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`${errorMessage} (status ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "TypeError") {
      throw new Error("Error de red o conexión");
    }
    throw error;
  }
}

module.exports = fetchJson;