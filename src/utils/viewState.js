// Estado de vista compartido entre los pilares y la descarga (App/exportHtml):
// permite que el HTML descargado capture la selección que vive DENTRO del
// pilar (ej. el país elegido en Social) sin subir ese estado a App.
// Cada pilar lo actualiza al cambiar su selección interna.
export const viewState = {
  // 'all' = cuenta completa; id de país cuando hay segmentación activa.
  socialCountry: 'all',
};
