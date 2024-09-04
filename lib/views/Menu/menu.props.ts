import { CategoryProps, ContactProps, ProductProps } from "@asim-ui/interfaces";

export interface MenuProps {
    data?: CategoryProps[];
    category?: CategoryProps;
    product?: ProductProps;
    contacts?: ContactProps;
}
  