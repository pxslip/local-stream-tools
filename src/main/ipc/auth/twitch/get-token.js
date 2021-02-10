import { ipcMain } from 'electron';
import { getToken, getClientCredentials } from '../../../auth/twitch';

ipcMain.handle('auth::twitch::get-token', async () => {
  const token = await getToken();
  console.log(token);
  return token;
});

ipcMain.handle('auth::twitch::get-client-credentials', async () => {
  try {
    return await getClientCredentials();
  } catch (exc) {
    console.error(exc);
  }
});
