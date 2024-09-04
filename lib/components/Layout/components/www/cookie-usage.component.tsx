import React from "react"
import { getLocalStorageItem, setLocalStorageItem } from "@asim-ui/utils"
import { useEffect, useState } from "react"
import { CloseButton } from "@asim-ui/components";

const CookieUsage = () => {
    const [allowed, setAllowed] = useState(true);

    useEffect(() => {
        const isCookieAllowed = () => {
            const isAllowed = getLocalStorageItem('cookieAllowed') === 'true'
            setAllowed(isAllowed);
        }
        isCookieAllowed()
    }, [])

    const onCancel = () => {
        setAllowed(true)
    }
    
    const onAccept = () => {
        setAllowed(true)
        setLocalStorageItem('cookieAllowed', true)
    }
    
    return (
        <>
            {!allowed && (
                <div className="cookie-usage">
                    <CloseButton
                        onClick={onCancel} 
                        ariaLabel="Çerez Yönetimi İznini Kapat"
                    />
                    <p>
                        QR menümüzü kullanarak lezzetli yemeklerimizi keşfetmenizi çok önemsiyoruz. Deneyiminizi daha da güzelleştirmek için bazı çerezlere (cookie) ihtiyacımız var. Bu çerezler menümüzü sizin için özelleştirebilmemizi sağlar.
                    </p>
                    <div className="button-area">
                        <button
                            onClick={onCancel} 
                            role="button"
                            aria-label="Çerez Yönetimi İznini Kapat"
                        >
                            ❌ Reddet
                        </button>
                        <button
                            onClick={onAccept} 
                            role="button"
                            aria-label="Çerez Yönetimi Kabul Et"
                        >
                            💬 Kabul ediyorum
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default CookieUsage