declare global {
  namespace Express {
    interface Request {
      userName?: string; // Define la propiedad que estás agregando
      // Puedes agregar otras propiedades personalizadas aquí
    }
  }
}