/**
 * Collection ID: Categories
 * Interface for Categories
 */
export interface Categories {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  categoryName: string;
  /** @wixFieldType text */
  description: string;
  /** @wixFieldType image */
  categoryImage: string;
  /** @wixFieldType boolean */
  isActive: boolean;
  /** @wixFieldType number */
  sortOrder: number;
}
