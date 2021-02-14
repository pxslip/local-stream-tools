import { ipcMain } from 'electron';
import {get, set} from '../../store';

ipcMain.handle('store::set', (event, key, value) => {
  return set(key, value);
});

ipcMain.handle('store::set-array-by-index', (event, key, index, value) => {
  const array = get(key, []);
  if (!Array.isArray(array)) {
    throw 'Trying to set a value on a non-array like object';
  }
  array[index] = value;
  set(key, array);
});

ipcMain.handle('store::set-array-push', (event, key, value) => {
  const array = get(key, []);
  if (!Array.isArray(array)) {
    throw 'Trying to set a value on a non-array like object';
  }
  array.push(value);
  set(key, array);
});