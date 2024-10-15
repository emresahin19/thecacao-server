import { axiosInstance } from "lib/utils";

interface ExportPdfParams {
    html: string;
}

export const exportAsPdf = async (params: ExportPdfParams) => {
    try {
        const response = await axiosInstance.post(`/api/utils/export-pdf`, {
            html: params.html,
        }, {
            responseType: 'blob',
        });
    
        return response;
    } catch (error) {
        console.error('Error saving category:', error);
        throw error;
    }
};
