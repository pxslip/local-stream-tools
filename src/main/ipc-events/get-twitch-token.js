import { ipcMain } from 'electron';
import { beginAuthCodeFlow } from '../twitch/auth';

ipcMain.handle('twitch::auth::get-token', async () => {
  const token = await beginAuthCodeFlow();
});
