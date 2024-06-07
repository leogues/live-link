const optionsData: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};

const optionsHora: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "numeric",
  hour12: true,
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const dateFormatada = date.toLocaleDateString("pt-BR", optionsData);
  const hoursFormatada = date.toLocaleTimeString("pt-BR", optionsHora);

  return `${dateFormatada} | ${hoursFormatada}`;
};
