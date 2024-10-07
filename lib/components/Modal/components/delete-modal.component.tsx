import React from 'react';
import { DeleteModalProps } from '../modal.props';
import Button from "../../Button/components/button.component";
import DashDivider from "../../Layout/components/dash/divider.component";
import { axiosInstance } from 'lib/utils';
import { useToast } from 'lib/contexts';
import { deleteProduct } from 'lib/services';

const DeleteModal: React.FC<DeleteModalProps> = ({ id, onSave, onCancel, itemName = 'Ürün', route, action }) => {

    const { showToast, handleRequestError } = useToast();
    const handleConfirm = () => {
        if(id) {
            axiosInstance.delete(`api/${route}/${id}`)
            .then((response) => {
                const { status } = response;
                if(status === 204) {
                    showToast({message: `${itemName} başarıyla silindi.`, type: 'success'});
                    onSave();
                } else {
                    handleRequestError(response);
                }
            }).catch(handleRequestError)
        } else {
            showToast({message: `Hay aksi!`, type: 'danger'});
        }
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        <div className="delete-modal-content">
            <h3>Emin misin?</h3>
            <DashDivider />
            <p>
                {`${itemName} silmek istediğinize emin misiniz?`}
            </p>
            <div className="modal-footer">
                <Button 
                    onClick={handleCancel}
                    color1="light"
                    color2="white"
                >
                    İptal
                </Button>
                <Button 
                    onClick={handleConfirm}
                    color1="danger"
                    color2="white"
                >
                    Sil
                </Button>
            </div>
        </div>
    );
};

export default DeleteModal;
