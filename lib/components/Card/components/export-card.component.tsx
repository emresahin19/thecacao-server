import React, { useEffect, useState, useMemo, useRef } from "react";
import DashDivider from "../../Layout/components/dash/divider.component";
import { ExportCardProps, ExportProps } from "../card.props";
import { exportAsPdf, exportItems } from "lib/services";
import { ProductProps } from "lib/interfaces";
import Spinner from "lib/components/Loading/components/spinner.component";
import ProductExportCard from "./product-export-card.component";
import Pagination from "lib/components/Table/components/pagination.component";
import MdDownloading from 'lib/assets/icon/svg/MdDownloading.svg'
import IconButton from "lib/components/Button/components/icon-button.component";
import { convertImageToBase64, imageToCdnUrl } from "lib/utils";
import { cdnUrl } from "lib/constants";
import Head from "next/head";

const ITEMS_PER_PAGE = 10;
const style = `
    .a4-page {
        width: 210mm;
        height: 297mm;
        background-color: white;
        margin: auto;
        display: none;
    }
    .a4-page.show {
        display: block;
    }
    .prod .a4-page {
        display: block !important;
    }
    .export-items {
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow: hidden;
        padding: 16px;
        height: calc(100% - 32px);
        width: calc(100% - 32px);
    }
    .export-card {
        flex-direction: row;
        display: flex;
        align-items: center;
        max-height: calc(10% - 16px);
        height: fit-content;
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0px 1px 2px 0px rgba(var(--primary-rgb), 0.1);
        width: 100%;
        gap: 8px;
        color: var(--black);

    }
    .export-card .card-image {
        width: 20%;
        height: auto;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        max-height: 100%;
    }
    .export-card .card-image img {
        width: 100%;
        height: auto;
        max-height: 100%;
    }
    .export-card .title {
        font-weight: 400;
        display: flex;
        align-items: center;
        margin: 0;
        font-size: 16px;
        width: 20%;
        color: var(--black);
    }
    .export-card p {
        width: 60%;
        margin: 0;
        color: var(--black);
        text-align: start;
        padding-left: 16px;
    }
`;

const ExportCard: React.FC<ExportProps<ExportCardProps>> = ({ items, route, onSave, onCancel }) => {
    const [data, setData] = useState<ExportCardProps[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [downloading, setDownloading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const a4PageRef = useRef<HTMLDivElement>(null); 

    const handleSave = async () => {
        if (!a4PageRef.current) {
            console.error("A4 Page ref is not available");
            return;
        }
    
        const htmlContent = await generateHtmlContent()
    
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
            const data = await Promise.all(response.data.items.map(async (item: ProductProps) => {
                const src = item.images?.length && item.images[0].filename 
                    ? imageToCdnUrl({ image: item.images[0].filename, type: 'product' }) 
                    : `${cdnUrl}/images/product/the-cacao-logo-bg.png`;

                const image = await new Promise<string>(async (resolve) => await convertImageToBase64(src).then(resolve).catch(() => resolve(src)));
                const itemData: ExportCardProps = {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    image: image
                };
                return itemData;
            }));
            setData(data);
        } catch (error) {
            console.error("Error fetching item data", error);
        } finally {
            setLoading(false);
        }
    };
    
    const generateHtmlContent = async () => {
        if(!a4PageRef.current) return '';

        return `
            <html>
                <head>
                    <style>${style}</style>
                </head>
                <body class="prod">
                    ${a4PageRef.current.innerHTML}
                </body>
            </html>
        `;
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
        <>
            <Head>
                <style>{style}</style>
            </Head>
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
                    <div className="export-root" ref={a4PageRef}>
                        {pages.map((pageData, pageIndex) => (
                            <div key={pageIndex} className={`a4-page ${(pageIndex === currentPage) ? 'show' : ''}`}>
                                <div className="export-items">
                                    {pageData.map((item, index) => (
                                        <ProductExportCard key={index} {...item} />
                                    ))}
                                </div>
                            </div>
                        ))}
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

                {pages.length > 1 && (
                    <Pagination
                        totalPages={pages.length}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </>
    );
};

export default ExportCard;
