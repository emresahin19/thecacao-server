import React from "react"
import { Skeleton } from "."
import { productVariantHeight, productVariantWidth } from "lib/constants"

const ProductSkeletonCard: React.FC = () => {
    return (
        <>
            <div className="card">
                <div className="card-image">
                    <Skeleton 
                        width={`calc(100% - 16px)`} 
                        style={{
                            aspectRatio: (productVariantWidth / productVariantHeight),
                            borderRadius: 6,
                            marginTop: 8,
                            marginBottom: 8
                        }}
                    />
                </div>
                <div className="counter">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>
                <div className='content'>
                    <div className="title">
                        <Skeleton width={'calc(100% - 32px)'} height={13} />
                    </div>
                    <Skeleton 
                        className="price"
                        borderRadius={28}
                        style={{
                            width: '50%',
                            height: 15,
                        }}
                    />
                </div>
            </div>
        </>
    )
}

export default ProductSkeletonCard