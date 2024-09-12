// apps/www/src/pages/menu/index.tsx
import { apiUrl } from "@asim-ui/constants";
import axios from "axios";
import Head from "next/head";
import { CategoryProps, ContactProps, MenuProps } from "@asim-ui/interfaces";
import Menu from "lib/views/Menu/menu.component";
// import Container from "lib/layouts/container";

export const getStaticProps = async () => {
    const { data } = await axios.get(`${apiUrl}/menu`) ?? {};
    const { items, contacts }: { items: CategoryProps[], contacts: ContactProps} = data;
    
    return {
        props: {
            data: items,
            contacts,
        }
    };
};
const cdnUrl = 'https://cdn.asimthecat.com';
const MenuHome: React.FC<MenuProps> = ({ data, contacts }) => {
    return (
        <>
            <Head>
                <title>Menü - The Cacao</title>
                <link rel="canonical" href="https://demo.asimthecat.com/menu" />
                {/* <link
                    rel="preload"
                    href={`${cdnUrl}/media/css/critical.css`}
                    as="style"
                />
                <link 
                    rel="stylesheet" 
                    href={`${cdnUrl}/media/css/critical.css`} 
                /> */}

                <style>{`img{max-width:100%;height:auto}body{margin:0}.carousel{position:relative;width:100%;overflow:hidden}.carousel-wrapper{display:flex}.carousel-inner{display:flex;width:100%}.scroll-carousel-wrapper{display:flex;width:100%;overflow:scroll}.carousel-item{flex:1 0 100%;max-width:100%;box-sizing:border-box;padding:8px;position:relative;display:flex;flex-direction:column}.carousel-2-item{flex:1 0 50%;max-width:50%}.counter{display:flex;align-items:center;justify-content:center;min-height:9px}.dot{width:9px;aspect-ratio:1;background:#0000007a;opacity:.4;display:flex;border-radius:50%;margin:0 2px;cursor:pointer;border:none;outline:none}.dot.active{background:0;opacity:1}.category-section{display:flex;flex-wrap:wrap;justify-content:space-between;flex-direction:column;gap:8px;background-color:#0C4C4C;padding:12px 8px}.category-section.category-header{display:flex;justify-content:space-between;padding:8px}.category-section.category-header.category-title{display:flex;align-items:center;justify-content:space-between;font-weight:400;color:#fff;font-size:12px;height:30px}.category-section.category-header.category-title img,.category-section.category-header.category-title svg,.category-section.category-header.category-title i{margin-right:4px;font-size:24px}#category-1{background-color:#0C4C4C!important}#category-1.category-header.category-title{color:#fff}#category-1.category-header.category-title svg > *{fill:#fff!important}.card{border:1px solid #ddd;border-radius:8px;overflow:hidden;box-shadow:0 1px 2px 0 rgba(255,0,0,0.1);text-align:center;background-color:#fff;width:100%;height:100%;color:#0C4C4C;position:relative;display:flex;flex-direction:column}.card > .card-image{width:100%;height:auto;border-radius:6px;display:flex;flex-direction:column}.card.content{padding:4px 8px;display:flex;flex-direction:column;align-items:center;justify-content:space-around;margin-bottom:12px;width:auto}.card.title{font-size:14px;text-align:center;width:fit-content;margin:8px 0;font-weight:400;line-height:17px;letter-spacing:.2px;height:34px;display:flex;align-items:center;justify-content:center;width:100%}.card.price{color:#0C4C4C;margin:0;width:80%;font-size:12px;font-weight:400;border:.5px dotted #0C4C4C;border-radius:24px;background:rgba(255,0,0,0.1);padding:3px 0;letter-spacing:.2px}.card.list{flex-direction:row;max-height:72px}.card.list.card-image{width:20%}.card.list.content{width:80%;flex-direction:row;margin-bottom:0;padding-top:0}.card.list.content.title{font-size:14px;margin:0;text-align:start;justify-content:flex-start}.card.list.content.price{font-size:14px}.detail-card{border-radius:8px;overflow:hidden;text-align:center;background-color:transparent;height:100%;color:#fff;position:relative;display:flex;flex-direction:column;padding:0 16px}.detail-card > .card-image{width:100%;height:auto;border-radius:6px;display:flex;flex-direction:column}.detail-card.content{padding:4px 8px;display:flex;flex-direction:column;align-items:center;margin-bottom:12px}.detail-card.content.title{text-align:center;width:fit-content;margin:0;margin-top:28px;font-weight:400;letter-spacing:.2px;line-height:36px;font-size:34px;color:#fff}.detail-card.content.price{width:100%;font-weight:400;padding:3px 0;letter-spacing:.2px;font-size:24px;color:#fff;margin-top:8px}.detail-card.content.description{font-size:16px;font-weight:400;color:#6d8383;background:#fff;margin-top:8px;padding:16px 8px;border-radius:10px}.menu-container{max-width:700px;margin:auto}.h-header{background-color:#fff;height:60px;width:100%;position:fixed;z-index:99;color:var(--text-color)}.h-header.h-container{height:100%;display:flex;background-color:#fff}.h-header.h-container.h-side{flex:1;height:100%;display:flex;align-items:center;padding-right:24px;justify-content:flex-end}.h-header.h-container.h-side:first-of-type{justify-content:flex-start;padding-right:0;padding-left:24px}.main{width:100%;padding-top:110px}.category-carousel{display:flex;overflow-x:auto;white-space:nowrap;background-color:#fff;padding:4px 0 12px;position:fixed;top:60px;width:100%;z-index:99;left:0;right:0}`}</style>
            </Head>
            {/* <Container> */}
                <Menu 
                    data={data}
                    contacts={contacts}
                />
            {/* </Container> */}
        </>
    );
};

export default MenuHome;
