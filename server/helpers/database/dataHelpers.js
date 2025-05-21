export const safeData = (entity) => entity?.dataValues || {};
export const optionalMap = (arr, fn) => (arr?.length ? arr.map(fn) : []);
