function validateCityInput(input) {
  if (typeof input !== "string") {
    throw new Error("La ciudad debe ser un texto");
  }

  const cleaned = input.trim();

  if (!cleaned) {
    throw new Error("Debes ingresar un nombre de ciudad válido");
  }

  if (/^\d+$/.test(cleaned)) {
    throw new Error("La ciudad no puede ser solo números");
  }

  if (!/[a-zA-ZÀ-ÿ]/.test(cleaned)) {
    throw new Error("La ciudad debe contener letras");
  }

  return cleaned;
}

module.exports = validateCityInput;