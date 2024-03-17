import express from 'express';
import { AlbumRoutes } from '../modules/album/album.routes';
import { ArtistsRoutes } from '../modules/artists/artists.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { SongRoutes } from '../modules/songs/song.routes';
import { UserRoutes } from '../modules/user/user.routes';

const router = express.Router();

const moduleRoutes = [
  { path: '/users', route: UserRoutes },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/album',
    route: AlbumRoutes,
  },
  {
    path: '/artists',
    route: ArtistsRoutes,
  },
  {
    path: '/songs',
    route: SongRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
