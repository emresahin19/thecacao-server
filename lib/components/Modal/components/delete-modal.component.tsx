import React from 'react';
import { DeleteModalProps } from '../modal.props';
import Button from "../../Button/components/button.component";
import DashDivider from "../../Layout/components/dash/divider.component";
import { axiosInstance } from 'lib/utils';
import { useToast } from 'lib/contexts';

const DeleteModal: React.FC<DeleteModalProps> = ({ onSave, onCancel, itemName = 'Ürünü', route, action }) => {

    const { showToast, handleRequestError } = useToast();

    const handleConfirm = () => {
        if(route) {
            axiosInstance.delete(route)
            .then(({data}) => {
                const { status } = data;
                if(status) {
                    showToast({message: `${itemName} başarıyla silindi.`, type: 'success'});
                    onSave();
                } else {
                    handleRequestError(data);
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
                    color2="secondary"
                >
                    İptal
                </Button>
                <Button 
                    onClick={handleConfirm}
                    color2="danger"
                >
                    Sil
                </Button>
            </div>
        </div>
    );
};

export default DeleteModal;
