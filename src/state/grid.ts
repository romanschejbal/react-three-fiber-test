import { atom } from 'recoil';
import * as PF from 'pathfinding';

export default atom({ key: 'grid', default: new PF.Grid(30, 30) });
