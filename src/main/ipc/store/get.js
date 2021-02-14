import { ipcMain } from 'electron';
import {get} from '../../store';

ipcMain.handle('store::get', (event, key, defaultValue) => {
  return get(key, defaultValue);
});