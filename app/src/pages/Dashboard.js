import React from 'react';
import Layout from "../components/Layout/Layout";
import useItems from '../Hooks/useItems';

const Dashboard = () => {
    const [data, setData] = useItems([]);

    const formatPrice = (price) => {
        if (price >= 1e6) {
            return `${(price / 1e6).toFixed(2)}M€`;
        } else if (price >= 1e3) {
            return `${(price / 1e3).toFixed(2)}K€`;
        } else {
            return `${price.toFixed(2)}€`;
        }
    };

    const pgDescriptionStats = data.reduce((acc, item) => {
        const { pg_description, pd_price, part_description, bh_partNumber, pg_bg_color, pg_text_color, bh_quantity, bh_currentStatus } = item;
        if (!acc[pg_description]) {
            acc[pg_description] = { parts: [], totalPrice: 0, bgColor: pg_bg_color, textColor: pg_text_color };
        }
        let partIndex = acc[pg_description].parts.findIndex(part => part.partDescription === part_description && part.partNumber === bh_partNumber);
        if (partIndex === -1) {
            // Add part initially with zero quantity and price
            acc[pg_description].parts.push({
                partDescription: part_description,
                partNumber: bh_partNumber,
                price: 0, // Initial price set to 0
                totalQuantity: 0 // Initial quantity set to 0
            });
            partIndex = acc[pg_description].parts.length - 1; // Update partIndex to the newly added part
        }
    
        // Parse quantities and prices, ensuring fallback to 0 for invalid values
        const quantity = parseInt(bh_quantity, 10);
        const price = parseFloat(pd_price);
        const isValidInStatus = bh_currentStatus.toLowerCase() === 'in';
    
        // Update only if status is 'In'
        if (isValidInStatus) {
            acc[pg_description].parts[partIndex].totalQuantity += quantity;
            const priceToAdd = isNaN(price) ? 0 : price * quantity; // Check if price is NaN, default to 0
            acc[pg_description].parts[partIndex].price += priceToAdd;
            acc[pg_description].totalPrice += priceToAdd;
        }
    
        return acc;
    }, {});
    
    
    

    return (
        <div>
            <Layout>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.entries(pgDescriptionStats).map(([description, { parts, bgColor, textColor }]) => (
                        <div key={description} className="p-3 rounded-lg">
                            <h6 className="bg-[#a0f630] text-white p-2 mb-2 rounded" style={{width: 'fit-content'}}>
                                {description}
                            </h6>
                            {parts.map(({ partDescription, partNumber, totalQuantity, price }, index) => (
                                <div key={index} className="flex flex-wrap    ">
                                    <div className={`flex-grow flex-shrink w-3/5 p-2  `} style={{ backgroundColor: bgColor }}> 
                                        <p className="text-white">{partNumber}</p>
                                        <p className="text-white text-xs">{partDescription} </p>
                                    </div>
                                    <div className="w-1/10 p-2 bg-white w-1/5 flex items-center justify-center">
                                        <p className="text-[#333]">{totalQuantity}</p>
                                    </div>
                                    <div className="w-3/10 p-2 bg-white w-1/5 flex items-center justify-center bg-slate-300">
                                    <p className="text-[#333] ">{formatPrice(price)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </Layout>
        </div>
    );
};

export default Dashboard;
