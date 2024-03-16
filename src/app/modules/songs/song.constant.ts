export const songsFilterableFields = [
  'searchTerm',
  'id',
  'name',
  'album_id',
  'duration',
  'created_at',
  'updated_at',
];

export const songsSearchableFields = ['name', 'album_id', 'duration'] as const;

export const songsUpdateAbleFields = [
  'name',
  'album_id',
  'duration',
  'updated_at',
];
