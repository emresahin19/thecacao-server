import React from 'react';
import { DeleteModalProps } from '../modal.props';
import Button from "../../Button/components/button.component";
import DashDivider from "../../Layout/components/dash/divider.component";

const DeleteModal: React.FC<DeleteModalProps> = ({ onConfirm, onCancel, itemName = 'Ürünü' }) => {
    return (
        <div className="delete-modal-content">
            <h3>Emin misin?</h3>
            <DashDivider />
            <p>
                {`${itemName} silmek istediğinize emin misiniz?`}
            </p>
            <div className="modal-footer">
                <Button 
                    onClick={onCancel}
                    color2="secondary"
                >
                    İptal
                </Button>
                <Button 
                    onClick={onConfirm}
                    color2="danger"
                >
                    Sil
                </Button>
            </div>
        </div>
    );
};

export default DeleteModal;
