/**
 * 
 * @param {Electron.Request} request 
 * @param {Electron.Response} respond 
 */
export default async function (request, respond) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
};