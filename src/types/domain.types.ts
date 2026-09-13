export interface Professional {
  id: number;
  userId: number;
  user: User;
  categories: Category[];
  governorate: Governorate;
  bio: string;
  phone: string;
  professionalPhone: string;
  yearsOfExp: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  parentCategoryId: number;
  subCategoryId: number | null;
}

export interface Candidate {
  id: number;
  userId: number;
  user: User;
  categories: Category[];
  governorate: Governorate;
  bio: string;
  phone: string;
  candidatePhone: string;
  yearsOfExp: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  parentCategoryId: number;
  subCategoryId: number | null;
}

export interface Category {
  id: number;
  name: string;
  nameEn?: string;
  nameAr?: string;
}

export interface Governorate {
  id: number;
  name: string;
  nameAr?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface MainCategory {
  id: number;
  name: string;
  nameEn: string;
  nameAr: string;
  type: "SERVICE" | "JOB";
  isActive: boolean;
  level: number;
  createdAt: string;
  updatedAt: string;
  _count: {
    professionals: number;
    candidates: number;
  };
}

export interface User {
  id: number;
  email: string;
  phone: string;
  provider: string;
  socialId: string;
  firstName: string;
  lastName: string;
  photo: {
    id: string;
    path: string;
  };
  role: {
    id: number;
    name: string;
  };
  status: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface Photo {
  id: string;
  path: string;
}

export interface Status {
  id: number;
  name: string;
}