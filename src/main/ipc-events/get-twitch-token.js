import { ipcMain } from 'electron';
import { getToken } from '../twitch/auth';

ipcMain.handle('twitch::auth::get-token', () => {
  const token = getToken();
});
