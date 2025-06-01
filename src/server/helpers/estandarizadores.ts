const articulos = ["de", "del", "la", "el", "las", "con", "los", "y", "e/"];

export const firstToUpperCase = (word: string): string | undefined => {
  if (!word) return undefined;
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

export const firstOfEachWordtoUpperCase = (word: string): string => {
  if (!word)
    throw new Error("No se ha enviado ninguna palabra para estandarizar");

  return word
    .split(" ")
    .map((w, index) =>
      index > 0 && articulos.includes(w.toLowerCase())
        ? w.toLowerCase()
        : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    )
    .join(" ");
};

export const generateRandomNumber = (): number => {
  const limSup = 9999999;
  const limInf = 1000000;
  return Math.floor(Math.random() * (limSup - limInf) + limInf);
};

export const generateRandomNumberExtended = (): number => {
  const limSup = 98765432123456;
  const limInf = 10000000000000;
  return Math.floor(Math.random() * (limSup - limInf) + limInf);
};

export const getMailUsername = (mail: string): string => {
  return mail.split("@")[0];
};
