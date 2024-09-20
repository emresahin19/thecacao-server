import { CategoryProps, ContactProps, ModalProps, ProductProps } from "lib/interfaces";

export interface MenuProps {
    data?: CategoryProps[];
    category?: CategoryProps;
    product?: ProductProps;
    contacts?: ContactProps;
    initialModalData?: ModalProps;
}
  