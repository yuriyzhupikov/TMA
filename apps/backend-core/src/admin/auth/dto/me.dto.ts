export interface MeDto {
  id: string;
  email: string;
  companies: Array<{
    id: string;
    slug: string;
    role: 'owner' | 'member';
  }>;
}
