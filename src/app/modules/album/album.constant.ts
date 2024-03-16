export const albumFilterableFields = [
  'searchTerm',
  'id',
  'title',
  'genre',
  'release_year',
  'created_at',
  'updated_at',
];
export const albumSearchableFields = [
  'title',
  'genre',
  'release_year',
] as const;

export const albumUpdateAbleFields = [
  'title',
  'genre',
  'release_year',
  'updated_at',
];
