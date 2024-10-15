import React, { useEffect, useState, useMemo, useRef } from "react";
import DashDivider from "../../Layout/components/dash/divider.component";
import { ExportProps } from "../card.props";
import { exportAsPdf, exportItems } from "lib/services";
import { ProductProps } from "lib/interfaces";
import Spinner from "lib/components/Loading/components/spinner.component";
import ProductExportCard from "./product-export-card.component";
import Pagination from "lib/components/Table/components/pagination.component";
import MdDownloading from 'lib/assets/icon/svg/MdDownloading.svg'
import IconButton from "lib/components/Button/components/icon-button.component";

const ITEMS_PER_PAGE = 10;

const ExportCard: React.FC<ExportProps<ProductProps>> = ({ items, route, onSave, onCancel }) => {
    const [data, setData] = useState<ProductProps[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [downloading, setDownloading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const a4PageRef = useRef<HTMLDivElement>(null); 

    const handleSave = async () => {
        if (!a4PageRef.current) {
            console.error("A4 Page ref is not available");
            return;
        }
    
        const htmlContent = a4PageRef.current.innerHTML;
    
        setDownloading(true);
        try {
            const response = await exportAsPdf({ html: htmlContent });
    
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'export.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
    
            onSave && onSave(true);
        } catch (error) {
            console.error("PDF oluşturma sırasında bir hata oluştu:", error);
        } finally {
            setDownloading(false);
        }
    };
    
    const handleReset = () => {
        onCancel && onCancel();
    };

    const fetchItemData = async () => {
        setLoading(true);
        try {
            const ids = Object.keys(items).map(key => items[key].id);
            const response = await exportItems({ ids, route });
            setData(response.data.items as ProductProps[] || []);
        } catch (error) {
            console.error("Export işlemi sırasında bir hata oluştu:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if(items && Object.keys(items).length > 0) {
            fetchItemData();
        }
    }, [items]);

    const pages = useMemo(() => {
        const paginated = [];
        for(let i = 0; i < data.length; i += ITEMS_PER_PAGE) {
            paginated.push(data.slice(i, i + ITEMS_PER_PAGE));
        }
        return paginated;
    }, [data]);

    const totalPages = pages.length;

    const currentPageData = pages[currentPage] || [];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if(loading) {
        return (
            <div className="export-section">
                <div className="export-loading">
                    <Spinner absolute={true} />
                </div>
            </div>
        )
    }

    return (
        <div className="export-section">
            <div className="modal-custom-header">
                <h3>Export</h3>
                <button
                    className="close"
                    onClick={handleReset}
                    role="button"
                    aria-label="Pencereyi Kapat"
                >
                    Kapat
                </button>
            </div>

            <DashDivider />

            <div className="export-area interactive">
                <div className="a4-page" ref={a4PageRef}>
                    <div className="export-items">
                        {currentPageData.map((item, index) => (
                            <ProductExportCard key={index} {...item} listView={true} />  
                        ))}
                    </div>
                </div>
            </div>
            
            <IconButton 
                onClick={handleSave}
                className="export-button"
                width={36}
            >
                {downloading 
                    && <Spinner size={24} color1="#fff" color2="#fff" color3="#fff" />
                    || <MdDownloading />
                }
            </IconButton>

            {totalPages > 1 && (
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default ExportCard;
