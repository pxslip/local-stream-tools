import { ipcMain } from 'electron';
import { getToken } from '../../../twitch/auth';

ipcMain.handle('twitch::auth::get-token', async () => {
  const token = await getToken();
  console.log(token);
  return token;
});
