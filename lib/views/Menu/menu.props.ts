import { CategoryProps, ContactProps, ProductProps } from "lib/interfaces";

export interface MenuProps {
    data?: CategoryProps[];
    category?: CategoryProps;
    product?: ProductProps;
    contacts?: ContactProps;
}
  