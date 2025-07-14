export type TUser = {
  id: string;
  name: string;
  email: string;
  designation?: string;
  linkedInUrl?: string;
  writeUp?: string;
  station?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  photo?: {
    fileId: string;
    name: string;
    url: string;
    thumbnailUrl: string;
    userId: string;
  };
};
