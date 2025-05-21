const articulos = ["de", "del", "la", "el", "las", "con", "los", 'y', 'e/'];
export const firstToUpperCase = (word) => {
  if (!word) {
    return undefined;
  }

  return (
    word[0].toUpperCase() + word.substring(1, word.length).toLowerCase()
  ).trim();
};

export const firstOfEachWordtoUpperCase = (word) => {
  if (!word) {
    return undefined;
  }

  const dividida = word.split(" ");

  var palabra = ``;
  let index = 0;
  dividida.map((w) => {
    if (articulos.includes(w) && index !== 0) {
      palabra += w.toLowerCase().trim() + " ";
    } else {
      if (w) {
        palabra +=
          w[0].toUpperCase() +
          w.substring(1, w.length).toLowerCase().trim() +
          " ";
      }
    }
    index++;
  });

  return palabra.trim();
};

export const generateRandomNumber = () => {
  const limSup = 9999999; //Mayor numero que se puede generar
  const limInf = 1000000; // Menor numero que se puede generar

  return Number.parseInt(Math.random() * (limSup - limInf) + limInf);
};

export const generateRandomNumberExtended = () => {
  const limSup = 98765432123456; //Mayor numero que se puede generar
  const limInf = 10000000000000; // Menor numero que se puede generar

  return Number.parseInt(Math.random() * (limSup - limInf) + limInf);
};

export const getMailUsername = (mail) => {
  const separated = mail.split("@");
  return separated[0];
};
