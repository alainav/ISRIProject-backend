export let online = 0;
export const usersRooms = new Map();
export const sockets = new Map();

/**
 * Incrementa o decrementa la cantidad de usuarios que se encuentran utilizando el sistema
 * @param {string} operation Operación a realizar
 * @enum {string} 'inc'
 * @enum {string} 'dec'
 */
export function modifyOnlineUsers(operation) {
  if (operation === "inc") online++;
  else if (operation === "dec" && online > 0) online--;
}
