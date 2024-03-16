export const userFilterableFields = [
  'searchTerm',
  'id',
  'username',
  'email',
  'created_at',
  'updated_at',
];
export const userSearchableFields = [
  'username',
  'email',
  // 'created_at',
  // 'updated_at',
] as const;

export const userUpdateAbleFields = [
  'username',
  'email',
  'password',
  'updated_at',
];
