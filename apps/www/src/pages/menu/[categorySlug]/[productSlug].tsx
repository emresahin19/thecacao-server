// apps/www/src/pages/menu/index.tsx
import { apiUrl } from "@asim-ui/constants";
import axios from "axios";
import Head from "next/head";
import { CategoryProps, ContactProps, MenuProps } from "@asim-ui/interfaces";
import Menu from "lib/views/Menu/menu.component";
// import Container from "lib/layouts/container";

export const getStaticProps = async () => {
    // const { data } = await axios.get(`${apiUrl}/menu`) ?? {};
    // const { items, contacts }: { items: CategoryProps[], contacts: ContactProps} = data;
    
    // return {
    //     props: {
    //         data: items,
    //         contacts,
    //     }
    // };
};

const MenuHome: React.FC<MenuProps> = ({ data, contacts }) => {
    return (
        <>
            <Head>
                <title>Menü - The Cacao</title>
                <link rel="canonical" href="https://thecacao.com.tr/menu" />
                {/* <style>{`:root {--header-height: 60px;--header-scrolled-height: 10vh;--header-scrolled-view-height: 4vh;--header-padding: 0 6vw;--header-background-color: #fff;--body-background-color: #fff;--modal-background-color: rgba(var(--primary-rgb), 0.7);--container-padding: 6vh 6vw;--transition: 0.2s cubic-bezier(.79,.14,.15,.86) all;--font-family: 'SF Pro Display Regular', sans-serif}img{max-width:100%;height:auto}.carousel{position:relative;width:100%;overflow:hidden}.carousel-wrapper{display:flex;touch-action:pan-y}.carousel-inner{display:flex;transition:transform 300ms ease-in-out;width:100%}.scroll-carousel-wrapper{display:flex;transition:transform 300ms ease-in-out;width:100%;overflow:scroll}.carousel-item{flex:1 0 100%;max-width:100%;box-sizing:border-box;padding:8px;position:relative;display:flex;flex-direction:column}.carousel-2-item{flex:1 0 50%;max-width:50%}.carousel-3-item{flex:1 0 33.33%;max-width:33%}.carousel-4-item{flex:1 0 25%;max-width:25%}.carousel-5-item{flex:1 0 20%;max-width:20%}.carousel-end{display:flex;align-items:center;justify-content:center;flex:1 0 20%;max-width:20%}.carousel-button{position:absolute;top:50%;transform:translateY(-50%);background:rgba(var(--black-rgb),0.5);color:white;border:none;padding:10px;cursor:pointer;z-index:1}.carousel-button.prev{left:0}.carousel-button.next{right:0}.counter{display:flex;align-items:center;justify-content:center;min-height:9px}.dot{width:9px;aspect-ratio:1;background:rgba(var(--primary-rgb),0.3);opacity:.4;display:flex;border-radius:50%;margin:0 2px;transition:all 0.3s ease;cursor:pointer;border:none;outline:none}.dot.active{background:rgba(var(--primary-rgb),0.5);opacity:1}.category-section{display:flex;flex-wrap:wrap;justify-content:space-between;flex-direction:column;gap:8px;background-color:rgba(var(--primary-rgb),0.2);padding:12px 8px}.category-section .category-header{display:flex;justify-content:space-between;padding:8px}.category-section .category-header .category-title{display:flex;align-items:center;justify-content:space-between;font-weight:400;color:var(--primary);font-size:12px;height:30px}.category-section .category-header .category-title img,.category-section .category-header .category-title svg,.category-section .category-header .category-title i{margin-right:4px;font-size:24px}#category-1{background-color:var(--primary-06)!important}#category-1 .category-header .category-title{color:#fff}#category-1 .category-header .category-title svg>*{fill:#fff!important}.card{border:1px solid #ddd;border-radius:8px;overflow:hidden;box-shadow:0px 1px 2px 0px rgba(var(--primary-rgb),0.1);text-align:center;background-color:#fff;transition:transform 0.3s ease;width:100%;height:100%;color:var(--primary);position:relative;display:flex;flex-direction:column}.card>.card-image{width:100%;height:auto;border-radius:6px;display:flex;flex-direction:column}.card .content{padding:4px 8px;display:flex;flex-direction:column;align-items:center;justify-content:space-around;margin-bottom:12px;width:auto}.card .title{font-size:14px;text-align:center;width:fit-content;margin:8px 0;font-weight:400;line-height:17px;letter-spacing:0.2px;height:34px;display:flex;align-items:center;justify-content:center;width:100%}.card .price{color:var(--primary);margin:0;width:80%;font-size:12px;font-weight:400;border:0.5px dotted #0C4C4C;border-radius:24px;background:rgba(var(--primary-rgb),0.1);padding:3px 0;letter-spacing:0.2px}.card.list{flex-direction:row;max-height:72px}.card.list .card-image{width:20%}.card.list .content{width:80%;flex-direction:row;margin-bottom:0;padding-top:0}.card.list .content .title{font-size:14px;margin:0;text-align:start;justify-content:flex-start}.card.list .content .price{font-size:14px}.detail-card{border-radius:8px;overflow:hidden;text-align:center;background-color:transparent;transition:transform 0.3s ease;height:100%;color:var(--white);position:relative;display:flex;flex-direction:column;padding:0 16px}.detail-card>.card-image{width:100%;height:auto;border-radius:6px;display:flex;flex-direction:column}.detail-card .content{padding:4px 8px;display:flex;flex-direction:column;align-items:center;margin-bottom:12px}.detail-card .content .title{text-align:center;width:fit-content;margin:0;margin-top:28px;font-weight:400;letter-spacing:0.2px;line-height:36px;font-size:34px;color:var(--white)}.detail-card .content .price{width:100%;font-weight:400;padding:3px 0;letter-spacing:0.2px;font-size:24px;color:var(--white);margin-top:8px}.detail-card .content .description{font-size:16px;font-weight:400;color:#6d8383;background:var(--white);margin-top:8px;padding:16px 8px;border-radius:10px}.menu-container{max-width:700px;margin:auto}.h-header{background-color: var(--header-background-color);height:var(--header-height);width:100%;position:fixed;transition:var(--transition);z-index:99;color:var(--text-color);background-color:var(--header-background-color)}.h-header .h-container{height:100%;display:flex;background-color:var(--header-background-color)}.h-header .h-container .h-side{flex:1;height:100%;display:flex;align-items:center;padding-right:min(6vw,24px);transition:var(--transition);justify-content:flex-end}.h-header .h-container .h-side:first-of-type{justify-content:flex-start;padding-right:0;padding-left:min(6vw,24px)}.main{width:100%;padding-top:calc(var(--header-height) + 50px)}.category-carousel{display:flex;overflow-x:auto;white-space:nowrap;-webkit-overflow-scrolling:touch;background-color:#fff;padding:4px 0 12px;position:fixed;top:60px;width:100%;z-index:99;left:0;right:0}`}</style> */}
            </Head>
            {/* <Menu 
                data={data}
                contacts={contacts}
            /> */}
        </>
    );
};

export default MenuHome;
